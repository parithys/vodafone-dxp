"""Generate UI_Component_Route_Inventory_Reference.xlsx.

Regenerate with: python3 reference/scripts/build_ui_component_route_inventory.py

An application-wide inventory of every shared UI component and reusable capability - tables, tabs and filter tabs,
search fields, forms, modals and drawers, buttons, cards, badges and the rest - and WHERE each one appears: one row per
(component, route). It is GENERATED from the source, never hand-edited.

How it is built (all read from src/, nothing typed in):

  components   every exported PascalCase component in components/, capabilities/, navigation/, workspace/ and modules/
               that is used as <Name .../> in at least two files, plus hand-rolled equivalents found by pattern
               (raw <table>, <button>, <input>, <select>, <textarea>, search inputs, inline card surfaces, inline tab
               strips) and each Capability Library capability (capabilities/registry.json) as a whole
  routes       the <Route> table in router.tsx (expanded for the product-line categories and module slugs), the 213
               catalogue screens in public/config/routes.json (with the component each one registers through
               registerScreen(), or the not-yet-built placeholder), and the app shell and sign-in page
  placement    the import graph from each route's entry component (name-level through the capabilities barrel, so
               importing the barrel is not importing every capability). A component appears on a route when a file
               reachable from that route's entry uses it
  sub-screens  Customer 360 and Administration render their tabs from section files; each section file is listed as its
               own screen on the parent's route

Counts are CODE SITES (a <Name> in the source), not rendered DOM nodes: a component used once inside a table row template
renders many times at runtime. A shared file reached by several tabs or routes is credited to each of them.
"""
import glob
import json
import os
import re
import sys
from collections import defaultdict

from openpyxl import Workbook
from openpyxl.styles import Alignment
from openpyxl.utils import get_column_letter

APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(APP_ROOT, 'src')
OUT = os.path.join(APP_ROOT, 'reference', 'outputs', 'UI_Component_Route_Inventory_Reference.xlsx')

# ------------------------------------------------------------------ source graph


def rel(p):
    return os.path.relpath(p, SRC).replace(os.sep, '/')


FILES = [p for p in glob.glob(os.path.join(SRC, '**', '*'), recursive=True) if p.endswith(('.ts', '.tsx')) and os.path.isfile(p)]
TEXT = {rel(p): open(p, encoding='utf-8').read() for p in FILES}


def resolve(importer, spec):
    base = os.path.normpath(os.path.join(os.path.dirname(importer), spec)).replace(os.sep, '/')
    for cand in (base, base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx'):
        if cand in TEXT:
            return cand
    return None


DEF_RE = re.compile(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|type|interface|enum)\s+([A-Za-z_]\w*)')
STAR_RE = re.compile(r"export\s+\*\s+from\s+'(\.[^']*)'")
NAMED_RE = re.compile(r"export\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'(\.[^']*)'")
DEFS = {f: set(DEF_RE.findall(t)) for f, t in TEXT.items()}
REEXPORTS = defaultdict(list)  # file -> [(names|None for *, target)]
for f, t in TEXT.items():
    for spec in STAR_RE.findall(t):
        tgt = resolve(f, spec)
        if tgt:
            REEXPORTS[f].append((None, tgt))
    for names, spec in NAMED_RE.findall(t):
        tgt = resolve(f, spec)
        if tgt:
            REEXPORTS[f].append(({n.strip().split(' as ')[-1].replace('type ', '').strip() for n in names.split(',') if n.strip()}, tgt))


def defining_files(f, name, seen=None):
    seen = seen or set()
    if (f, name) in seen:
        return []
    seen.add((f, name))
    if name in DEFS[f]:
        return [f]
    out = []
    for names, tgt in REEXPORTS.get(f, []):
        if names is None or name in names:
            out += defining_files(tgt, name, seen)
    return out


IMPORT_RE = re.compile(r"import\s+(type\s+)?([^;]*?)\s+from\s+'(\.{1,2}/[^']*)'|import\s+'(\.{1,2}/[^']*)'|import\(\s*'(\.{1,2}/[^']*)'\s*\)")
EDGES = defaultdict(set)
IMPORT_NAMES = defaultdict(dict)  # file -> local name -> defining file
for f, t in TEXT.items():
    for m in IMPORT_RE.finditer(t):
        if m.group(1) is not None or m.group(3):
            clause, spec = m.group(2), m.group(3)
            tgt = resolve(f, spec)
            if not tgt or tgt == f:
                continue
            named = re.search(r'\{([^}]*)\}', clause)
            is_barrel = bool(REEXPORTS.get(tgt)) and len(DEFS[tgt]) < 3
            if named:
                for part in named.group(1).split(','):
                    part = part.strip().replace('type ', '')
                    if not part:
                        continue
                    orig, _, alias = part.partition(' as ')
                    orig, alias = orig.strip(), (alias.strip() or orig.strip())
                    dfs = defining_files(tgt, orig) if is_barrel else [tgt]
                    for d in dfs or [tgt]:
                        EDGES[f].add(d)
                        IMPORT_NAMES[f][alias] = d
            rest = re.sub(r'\{[^}]*\}', '', clause).strip(' ,')
            if rest:  # default or namespace import
                EDGES[f].add(tgt)
                IMPORT_NAMES[f][rest.replace('* as ', '').strip()] = tgt
        else:
            spec = m.group(4) or m.group(5)
            tgt = resolve(f, spec)
            if tgt and tgt != f and 'screens' not in tgt:
                EDGES[f].add(tgt)
# lazy(() => import('./x').then((m) => ({ default: m.Name }))) - name-level
for f, t in TEXT.items():
    for m in re.finditer(r"const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\('(\.[^']*)'\)", t):
        tgt = resolve(f, m.group(2))
        if tgt:
            EDGES[f].add(tgt)
            IMPORT_NAMES[f][m.group(1)] = tgt


def closure(entries, stop=frozenset()):
    seen, frontier = set(entries), list(entries)
    while frontier:
        cur = frontier.pop()
        for nxt in EDGES.get(cur, ()):
            if nxt in seen or nxt in stop:
                continue
            seen.add(nxt)
            frontier.append(nxt)
    return seen


# ------------------------------------------------------------------ routes


def humanize(s):
    s = re.sub(r'^(C360|Telesales)', '', s)
    s = re.sub(r'Section$|Workspace$|View$|Page$', '', s)
    s = re.sub(r'(?<=[a-z0-9])(?=[A-Z])', ' ', s).replace('-', ' ').strip()
    return s[:1].upper() + s[1:] if s else s


NAV = {}  # route -> label from navManifest
for m in re.finditer(r"label:\s*'([^']+)',\s*to:\s*'([^']+)'", TEXT['navigation/navManifest.ts']):
    NAV.setdefault(m.group(2), m.group(1))

DIR_MODULE = {
    'customer360': 'Customer 360', 'customer-search': 'Customer Search', 'sales': 'Sales', 'support': 'Support', 'orders': 'Orders',
    'administration': 'Administration', 'profile': 'Agent Profile', 'tasks': 'Tasks', 'tickets': 'Ticket History',
    'lead-management': 'Lead Management', 'new-connection': 'Mobile - New Connection', 'product-lines': 'Product lines',
    'trouble-ticketing-complaints': 'Trouble Ticketing & Complaints', 'order-management': 'Order Management',
}


def module_of(entry_file, route):
    parts = entry_file.split('/')
    if len(parts) > 1 and parts[0] in ('workspace', 'modules'):
        return DIR_MODULE.get(parts[1], humanize(parts[1]))
    if route == '/':
        return 'Dashboard'
    return humanize(route.strip('/').split('/')[0] or 'Dashboard')


ROUTER = TEXT['router.tsx']
CATALOGUE = json.load(open(os.path.join(APP_ROOT, 'public', 'config', 'routes.json'), encoding='utf-8'))
MODULES = sorted({(r['module'], r['path'].split('/')[1]) for r in CATALOGUE})

# product-line categories (nav children of Mobile / Fibre & Home)
LINE_ROUTES = defaultdict(list)
for to in NAV:
    mm = re.match(r'^/(mobile|fibre-home)/([a-z-]+)$', to)
    if mm and mm.group(2) != 'new-connection':
        LINE_ROUTES[mm.group(1)].append(to)
for to in ('/mobile/start-connection',):
    NAV.setdefault(to, 'New Connection')


def local_component_entries(name):
    """Entry files for a component written inside router.tsx itself: the imported components its body references."""
    m = re.search(r'\nfunction\s+' + name + r'\b.*?(?=\n(?:export\s+)?function\s|\Z)', ROUTER, re.S)
    if not m:
        return []
    refs = set(re.findall(r'<([A-Z]\w*)', m.group(0)))
    return sorted({IMPORT_NAMES['router.tsx'][r] for r in refs if r in IMPORT_NAMES['router.tsx']})


ROUTE_ROWS = []  # dicts: route, module, screen, entries, kind


def add_route(route, module, screen, entries, stop=frozenset(), sub=None):
    ROUTE_ROWS.append({'route': route, 'module': module, 'screen': screen, 'entries': sorted(set(entries)), 'stop': stop, 'sub': sub or []})


SUB_RE = re.compile(r'(?:/sections/|/telesales/|Section\.tsx$)')


def static_route(path, comp_name, props=''):
    imp = IMPORT_NAMES['router.tsx']
    entries = [imp[comp_name]] if comp_name in imp else local_component_entries(comp_name)
    if not entries:
        return
    main = entries[0]
    module = module_of(main, path)
    screen = NAV.get(path) or humanize(comp_name)
    # sub-screens: section files a workspace entry renders as tabs
    subs = []
    for e in entries:
        if e.startswith('workspace/') and (e.endswith(('Layout.tsx', 'Workspace.tsx'))):
            wsdir = '/'.join(e.split('/')[:2])
            subs += [x for x in EDGES[e] if x.startswith(wsdir + '/') and x != e and SUB_RE.search(x)]
    subs = sorted(set(subs))
    for e in list(subs):  # section files in turn pull in their own sections? keep one level
        pass
    add_route(path, module, screen, entries, stop=frozenset(subs), sub=subs)
    for s in subs:
        base = os.path.basename(s)[:-4]
        label = humanize(base)
        prefix = {'Customer 360': 'Customer 360 > ', 'Administration': 'Administration > '}.get(module, f'{module} > ')
        if '/telesales/' in s:
            prefix = 'Customer 360 (telesales view) > '
        add_route(path, module, prefix + label, [s], stop=frozenset(x for x in subs if x != s))


for m in re.finditer(r'<Route\s+path="([^"]+)"\s+element=\{<(\w+)', ROUTER):
    path, comp = m.group(1), m.group(2)
    if path in ('/:moduleSlug', '/:moduleSlug/:screenSlug', '*'):
        continue
    if path in ('/mobile/:category', '/fibre-home/:category'):
        line = path.split('/')[1]
        for to in sorted(LINE_ROUTES[line]):
            static_route(to, comp)
        continue
    static_route(path, comp)
for line in ('mobile', 'fibre-home'):  # the line roots are listed above via their own <Route>
    pass

# module catalogue lists (/:moduleSlug) and the 213 catalogue screens (/:moduleSlug/:screenSlug)
msl = IMPORT_NAMES['router.tsx'].get('ModuleScreenList')
for module, slug in MODULES:
    if msl:
        add_route(f'/{slug}', 'Module catalogue', f'{module} - screen list', [msl])
resolver = IMPORT_NAMES['router.tsx'].get('ScreenRouteResolver')
placeholder = resolve('modules/ScreenRouteResolver.tsx', './ScreenNotYetBuilt')
REGISTERED = {}
for f, t in TEXT.items():
    if '/screens/' in f or f.startswith('modules/') and f.endswith('screens/index.tsx'):
        for m in re.finditer(r"registerScreen\('(SCR-\d+)',\s*(\w+)", t):
            REGISTERED[m.group(1)] = IMPORT_NAMES[f].get(m.group(2))
for r in CATALOGUE:
    comp = REGISTERED.get(r['screenId'])
    entries = [e for e in (resolver, comp or placeholder) if e]
    add_route(r['path'], r['module'], r['screenName'] + ('' if comp else ' (not yet built)'), entries)

# app shell and sign-in
shell = TEXT['App.tsx']
imp_app = IMPORT_NAMES['App.tsx']
add_route('(every signed-in page)', 'App shell', 'Navigation, header, breadcrumbs and toasts', ['App.tsx'] + [imp_app[n] for n in ('Sidebar', 'Breadcrumbs', 'PersonaSwitcher', 'ToastContainer') if n in imp_app], stop=frozenset({'router.tsx'}))
if 'LoginPage' in imp_app:
    add_route('/ (signed out)', 'Sign-in', 'Login', [imp_app['LoginPage']])
nf = IMPORT_NAMES['router.tsx'].get('NotFound')
if nf:
    add_route('* (no match)', 'Errors', 'Not found', [nf])

for row in ROUTE_ROWS:
    row['files'] = closure(row['entries'], row['stop'])

# ------------------------------------------------------------------ component catalogue

COMP_DEF_RE = re.compile(r'export\s+(?:default\s+)?(?:function|const)\s+([A-Z]\w*)\s*(?:=\s*(?:forwardRef|memo|\(|<|\w+\s*=>)|\(|<)')
QUAL = ('components/', 'capabilities/', 'navigation/', 'workspace/', 'modules/')
used_in = defaultdict(set)
COUNT = defaultdict(lambda: defaultdict(int))  # component -> file -> sites
candidates = {}
for f, t in TEXT.items():
    if not f.endswith('.tsx') or not f.startswith(QUAL):
        continue
    for name in COMP_DEF_RE.findall(t):
        candidates.setdefault(name, f)
JSX_USE = {}
for name in candidates:
    pat = re.compile(r'<' + name + r'[\s/>]')
    for f, t in TEXT.items():
        n = len(pat.findall(t))
        if n:
            COUNT[name][f] += n
            used_in[name].add(f)
ROUTE_ENTRY_FILES = {e for r in ROUTE_ROWS for e in r['entries']}
# Shared = used in two or more files, or defined in the shared layers (so a single-use pattern such as PlanTabStrip is
# still listed). A route's own entry component is the screen, not a reusable component.
SHARED = {n: f for n, f in candidates.items()
          if used_in[n] and f not in ROUTE_ENTRY_FILES and (len(used_in[n]) >= 2 or f.startswith(('components/', 'capabilities/')))}

CATS = [
    ('Button', r'^(Button|ActionButton|HeaderButton|CloseButton|ViewPill|NavCollapseButton|NavLogoToggle|HeaderLink|LinkAction|BackButton)$|Button$'),
    ('Table', r'Table$|^(DataTable|GridTable)$|Grid$'),
    ('Tabs / filter tabs', r'Tabs?$|TabStrip|PillTabs|IconRail|TabPage|Chips$|ChipToggle|Pager'),
    ('Search field', r'Search(Field|Box|Input|Results)|^SearchBox$'),
    ('Form control', r'^(Input|Select|Textarea|Checkbox|Radio|Toggle|Switch|PhoneNumberInput|ContactPhoneInput|QidInput|QidTypeSelector|LocationInput|CompanySearchInput|FilterSelect|DatePicker|Slider)$|Upload$|Input$|Selector$|Picker$|Editor$|Field$'),
    ('Modal / drawer / overlay', r'Modal|Drawer|Dialog|Tooltip|Toast|Popover|Menu'),
    ('Badge / pill / status', r'Badge|Pill|Status|Tag$'),
    ('Card / panel', r'Card|Panel|Tile|Group$|Section$|Summary'),
    ('Navigation / page chrome', r'Sidebar|Breadcrumb|PageHeader|Header|Persona|Nav|Banner$'),
    ('Feedback / state', r'Spinner|ErrorBanner|Progress|Empty|Skeleton|Notice|Alert|Loading'),
]


def category_of(name, path):
    for cat, rx in CATS:
        if re.search(rx, name):
            return cat
    if path.startswith('capabilities/'):
        return 'Reusable capability (journey step)'
    if path.startswith('components/patterns/wizard/'):
        return 'Wizard / journey pattern'
    if path.startswith('components/domain/'):
        return 'Domain control'
    if path.startswith('components/patterns/'):
        return 'Pattern'
    return 'Shared component'


def layer_of(path):
    for pre, lab in (('components/primitives/', 'Primitive'), ('components/domain/', 'Domain'), ('components/patterns/', 'Pattern'), ('capabilities/', 'Capability Library'), ('navigation/', 'Navigation'), ('workspace/', 'Workspace'), ('modules/', 'Journey module')):
        if path.startswith(pre):
            return lab
    return 'Shared'


FAMILY = {
    'Button': 'Buttons', 'ActionButton': 'Buttons', 'HeaderButton': 'Buttons', 'CloseButton': 'Buttons', 'ViewPill': 'Buttons',
    'DataTable': 'Tables', 'GridTable': 'Tables',
    'Tabs': 'Tabs / filter tabs', 'UnderlineTabs': 'Tabs / filter tabs', 'PillTabs': 'Tabs / filter tabs', 'PlanTabStrip': 'Tabs / filter tabs',
    'SearchField': 'Search fields', 'SearchBox': 'Search fields', 'PlanSearchBox': 'Search fields',
    'Badge': 'Badges / pills', 'Pill': 'Badges / pills', 'StatusPill': 'Badges / pills',
    'Modal': 'Modals / drawers', 'Drawer': 'Modals / drawers',
    'Input': 'Form fields', 'Select': 'Form fields', 'Textarea': 'Form fields', 'PhoneNumberInput': 'Form fields', 'FilterSelect': 'Form fields',
}

COMPONENTS = {}  # name -> dict
for name, path in SHARED.items():
    COMPONENTS[name] = {'name': name, 'category': category_of(name, path), 'layer': layer_of(path), 'defined': path, 'kind': 'Component', 'family': FAMILY.get(name)}

# hand-rolled equivalents, counted by pattern outside the primitives that define them
RAW = [
    ('Raw <button> (hand-rolled)', 'Button', r'<button[\s>]', 'Buttons'),
    ('Raw <table>', 'Table', r'<table[\s>]', 'Tables'),
    ('Raw <input> (hand-rolled)', 'Form control', r'<input[\s>]', 'Form fields'),
    ('Raw <select> (hand-rolled)', 'Form control', r'<select[\s>]', 'Form fields'),
    ('Raw <textarea> (hand-rolled)', 'Form control', r'<textarea[\s>]', 'Form fields'),
    ('Raw search input (hand-rolled)', 'Search field', r'<input[^>]*(?:type="search"|placeholder="[^"]*[Ss]earch)', 'Search fields'),
    ('Inline card surface (rounded card + border)', 'Card / panel', r'rounded-\[var\(--radius-card(?:-lg)?\)\]', 'Cards'),
    ('Inline tab strip (role=tablist / underline tabs)', 'Tabs / filter tabs', r'role="tablist"|border-b-2 -mb-px', 'Tabs / filter tabs'),
]
for label, cat, rx, fam in RAW:
    pat = re.compile(rx)
    for f, t in TEXT.items():
        if not f.endswith('.tsx') or f.startswith('components/primitives/'):
            continue
        n = len(pat.findall(t))
        if n:
            COUNT[label][f] += n
    if COUNT[label]:
        COMPONENTS[label] = {'name': label, 'category': cat, 'layer': 'Inline markup', 'defined': '(written inline in each file)', 'kind': 'Hand-rolled', 'family': fam}

# Capability Library capabilities as a whole
REGISTRY = json.load(open(os.path.join(SRC, 'capabilities', 'registry.json'), encoding='utf-8'))
for cap in REGISTRY:
    name = cap['name']
    entry = cap.get('entry')
    builders = cap.get('stepBuilders') or []
    pats = []
    if entry:
        pats.append(re.compile(r'<' + re.escape(entry) + r'[\s/>]'))
    for b in builders:
        pats.append(re.compile(r'\b' + re.escape(b) + r'\s*\('))
    label = f'{name} (capability)'
    for f, t in TEXT.items():
        if f.startswith('capabilities/' + (cap['home'].split('/')[-1] + '/')):
            continue  # the capability's own files do not count as a use of it
        n = sum(len(p.findall(t)) for p in pats)
        if n:
            COUNT[label][f] += n
    if COUNT[label]:
        COMPONENTS[label] = {'name': label, 'category': 'Reusable capability (Capability Library)', 'layer': 'Capability Library', 'defined': cap['home'], 'kind': 'Capability', 'family': 'Reusable capabilities'}

for c in COMPONENTS.values():
    c['family'] = c['family'] or c['name']
    c['total'] = sum(COUNT[c['name']].values())
    c['files'] = len(COUNT[c['name']])

# ------------------------------------------------------------------ rows

HEAD = ['Component or capability name', 'Component type / category', 'Component family (duplicate group)', 'Layer', 'Kind',
        'Total instances in application (code sites)', 'Journey / module', 'Screen / page', 'Exact route',
        'Instances on this route (code sites)', 'Usage location / context (file x sites)', 'Defined in']


def fmt_files(counts, files):
    items = sorted(((f, n) for f, n in counts.items() if f in files), key=lambda x: (-x[1], x[0]))
    shown = [f'{f} x{n}' for f, n in items[:6]]
    if len(items) > 6:
        shown.append(f'+{len(items) - 6} more file(s)')
    return '; '.join(shown)


rows = []
unrouted = []
for c in COMPONENTS.values():
    counts = COUNT[c['name']]
    reached = set()
    for r in ROUTE_ROWS:
        hit = {f: n for f, n in counts.items() if f in r['files']}
        if not hit:
            continue
        reached.add(r['route'])
        rows.append([c['name'], c['category'], c['family'], c['layer'], c['kind'], c['total'], r['module'], r['screen'], r['route'],
                     sum(hit.values()), fmt_files(counts, r['files']), c['defined']])
    c['routes'] = len(reached)
    if not reached:
        unrouted.append(c)

order = {n: i for i, n in enumerate(sorted({c['family'] for c in COMPONENTS.values()}))}
rows.sort(key=lambda r: (r[2], r[0], r[6], r[7], r[8]))

# ------------------------------------------------------------------ workbook

wb = Workbook()
ws = wb.active
ws.title = 'Inventory'
ws.append(HEAD)
for r in rows:
    ws.append(r)
ws.auto_filter.ref = f'A1:{get_column_letter(len(HEAD))}{ws.max_row}'

summary = wb.create_sheet('Components')
summary.append(['Component or capability name', 'Component type / category', 'Component family (duplicate group)', 'Layer', 'Kind',
                'Total instances in application (code sites)', 'Files using it', 'Routes it appears on', 'Defined in'])
for c in sorted(COMPONENTS.values(), key=lambda c: (c['family'], -c['total'], c['name'])):
    summary.append([c['name'], c['category'], c['family'], c['layer'], c['kind'], c['total'], c['files'], c['routes'], c['defined']])

groups = wb.create_sheet('Duplicate groups')
groups.append(['Component family', 'Members', 'Total instances (code sites)', 'Member list (instances)'])
fam = defaultdict(list)
for c in COMPONENTS.values():
    fam[c['family']].append(c)
for f, members in sorted(fam.items(), key=lambda kv: -sum(m['total'] for m in kv[1])):
    if len(members) > 1:
        groups.append([f, len(members), sum(m['total'] for m in members), '; '.join(f"{m['name']} ({m['total']})" for m in sorted(members, key=lambda m: -m['total']))])

notes = wb.create_sheet('Method & notes')
notes.append(['Topic', 'Detail'])
for k, v in [
    ('What a row is', 'One row per component (or capability) per route where it appears. The component\'s application-wide total repeats on every one of its rows.'),
    ('Instances', 'Code sites: a <Name> in the source, or a match of the hand-rolled pattern. Not rendered DOM nodes - a component inside a repeated row renders many times.'),
    ('Placement', 'A component is on a route when a file reachable from the route\'s entry component, through imports, uses it. Imports through the capabilities barrel are resolved name by name.'),
    ('Shared files', 'A shared file (for example a section kit) is credited to every route and tab that reaches it, so per-route counts can add up to more than the total.'),
    ('Sub-screens', 'Customer 360 and Administration render their tabs from section files. Each section file is its own screen on the parent route (the URL does not change between tabs).'),
    ('Routes', 'Static routes come from router.tsx (product-line categories and module slugs expanded). The 213 catalogue screens come from public/config/routes.json; ones with no registerScreen() entry are marked (not yet built) and use the placeholder. Route parameters are shown as :name.'),
    ('Hand-rolled equivalents', 'Raw <button>, <table>, <input>, <select>, <textarea>, search inputs, inline card surfaces and inline tab strips are listed as their own components, grouped with the shared component they duplicate. The primitives folder itself is excluded.'),
    ('Duplicate groups', 'The Component family column groups components that do the same job (for example Tabs / UnderlineTabs / PillTabs / PlanTabStrip). The Duplicate groups sheet totals each group.'),
    ('Not on any route', f'{len(unrouted)} component(s) are used but not reachable from any route: ' + ', '.join(sorted(c["name"] for c in unrouted)[:30]) + ('...' if len(unrouted) > 30 else '')),
    ('Counts', f'{len(COMPONENTS)} components/capabilities, {len(ROUTE_ROWS)} route/screen entries, {len(rows)} inventory rows.'),
]:
    notes.append([k, v])

for sheet in wb.worksheets:
    for col in range(1, sheet.max_column + 1):
        width = max(len(str(sheet.cell(r, col).value or '')) for r in range(1, min(sheet.max_row, 200) + 1))
        sheet.column_dimensions[get_column_letter(col)].width = min(max(14, width + 2), 70)
    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical='top', wrap_text=(sheet.title in ('Method & notes',) or cell.column_letter in ('K',)))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)

sys.path.insert(0, os.path.dirname(__file__))
import format_xlsx  # noqa: E402

format_xlsx.format_file(OUT)
print(f'wrote {OUT}')
print(f'  components: {len(COMPONENTS)}  routes: {len(ROUTE_ROWS)}  rows: {len(rows)}  unrouted: {len(unrouted)}')
