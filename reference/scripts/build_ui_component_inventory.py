"""Generate UI_Component_Inventory_Reference.xlsx - one row per UNIQUE UI component in src/.

Regenerate with: python3 reference/scripts/build_ui_component_inventory.py

Everything is read from the source: component definitions (export function/const and file-local PascalCase components),
where each is used (<Name .../> in other files, grouped by area), variants and states (union-typed and boolean props), the
styling approach (share of its className attributes that use a semantic class from src/ui-components.css or index.css),
and near-duplicates (same name or file name in several places, or the same long className strings repeated across files).
Category is assigned by name/path rules (ordered, first match wins) - see CATEGORY_RULES.

Counts are CODE SITES, not rendered nodes. This is a descriptive audit, not a spec: it changes nothing.
"""
import json
import os
import re
from collections import Counter, defaultdict

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'reference', 'outputs', 'UI_Component_Inventory_Reference.xlsx')

CLS = re.compile(r'className=(?:"([^"]*)"|\{`([^`]*)`\})')
EXPORTED = re.compile(r'^export (?:default )?(?:function|const) ([A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*)', re.M)
LOCAL = re.compile(r'^(?:function|const) ([A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*)\s*(?:=|\(|:)', re.M)
SKIP_FILES = ('src/router.tsx', 'src/next/routes.tsx', 'src/next/routerCompat.tsx')   # lazy route wrappers, not UI components
UNION = re.compile(r"\b(variant|size|tone|kind|status|state|intent|align|mode|level|orientation|layout|appearance|type)\??:\s*((?:'[^']+'\s*\|?\s*){2,})")
BOOLS = ['disabled', 'loading', 'selected', 'checked', 'error', 'open', 'readOnly', 'compact', 'dense', 'collapsed', 'expanded', 'active',
         'required', 'invalid', 'pending', 'highlighted', 'recommended', 'popular', 'inline', 'bleed', 'plain', 'dark', 'primary', 'busy', 'locked']

def read(p):
    with open(p, encoding='utf8') as f:
        return f.read()

files = {}
for d, _, fs in os.walk(SRC):
    for f in fs:
        if f.endswith('.tsx'):
            p = os.path.join(d, f)
            files[os.path.relpath(p, ROOT).replace(os.sep, '/')] = read(p)

# ---- semantic vocabulary: classes defined in the component stylesheet plus the shared ones from index.css
sem = set(re.findall(r'^\s*\.([a-z][a-z0-9-]*)', read(os.path.join(SRC, 'ui-components.css')), re.M))
sem |= {'card', 'card-surface', 'btn', 'badge', 'login-field', 'no-print', 'agent-only', 'card-inherit-fill'}
sem.discard('flex')
extra = os.path.join(ROOT, 'reference', 'scripts', '_semantic_extra.txt')
if os.path.exists(extra):
    sem |= set(read(extra).split())

def area(path):
    parts = path.split('/')
    if parts[1] in ('modules', 'workspace', 'capabilities') and len(parts) > 3:
        return f'{parts[1]}/{parts[2]}'
    if parts[1] == 'components' and len(parts) > 3:
        return f'components/{parts[2]}'
    return parts[1] if len(parts) > 2 else parts[1]

def layer(path):
    p = path.split('/')
    if p[1] == 'components' and len(p) > 2:
        return {'primitives': 'Primitive', 'patterns': 'Pattern', 'domain': 'Domain component'}.get(p[2], 'Component')
    if p[1] == 'capabilities':
        return 'Capability'
    if p[1] == 'navigation' or p[1] == 'auth':
        return 'App shell'
    if p[1] == 'modules':
        return 'Journey / module'
    if p[1] == 'workspace':
        return 'Workspace'
    return 'App'

# ---- definitions
defs = defaultdict(list)
for path, s in files.items():
    if path in SKIP_FILES:
        continue
    seen = set()
    for m in EXPORTED.finditer(s):
        defs[m.group(1)].append((path, True)); seen.add(m.group(1))
    for m in LOCAL.finditer(s):
        if m.group(1) not in seen:
            defs[m.group(1)].append((path, False))

def tokens(c):
    return re.sub(r'\$\{[^}]*\}', ' ', c).split()

def class_strings(s):
    out = []
    for m in CLS.finditer(s):
        raw = m.group(1) if m.group(1) is not None else m.group(2)
        out.append(' '.join((raw or '').split()))
    return out

per_file = {}
for path, s in files.items():
    cs = class_strings(s)
    with_sem = sum(1 for c in cs if any(t in sem for t in tokens(c)))
    long_ = sum(1 for c in cs if len([t for t in tokens(c) if t not in sem]) >= 8)
    prim = bool(re.search(r"from '(\.\./)+components/primitives|from '\.\./primitives|from '\./primitives", s))
    per_file[path] = dict(n=len(cs), sem=with_sem, long=long_, prim=prim,
                          strings={' '.join(sorted(tokens(c))) for c in cs if len(tokens(c)) >= 5})

# ---- category rules (ordered; first match wins). Matched against the component name.
CATEGORY_RULES = [
    ('Pagination', r'Pager|Pagination'),
    ('Tabs', r'Tabs?$|TabStrip|SegmentedTabs|TabLevel|SubTab|TabBar|TabPanel|^Tab[A-Z]'),
    ('Modals, dialogs and drawers', r'Modal|Drawer|Dialog|Sheet$|OverlayPortal|Overlay'),
    ('Tooltips and popovers', r'Tooltip|Popover|Popup|Menu$|ActionsMenu|Dropdown'),
    ('Loading, empty, error and success states', r'Spinner|Loading|Skeleton|Empty|ErrorBoundary|ErrorBanner|NotYetBuilt|NotFound|Success|Complete|Confirmation|Outcome|Result(s)?Screen|Missing|Unavailable'),
    ('Alerts, notifications, badges and tags', r'Badge|Tag$|Tag[A-Z]|Chip|Pill|Alert|Banner|Notice|Notification|Toast|Status|Marker|Indicator|Callout|Warning|Flag|Reference|Counter|Count$'),
    ('Buttons and actions', r'Button|Btn|Cta|ActionBar|Actions$|ActionGroup|^Action|Link$|Close'),
    ('Forms and form controls', r'Input|Select$|Select[A-Z]|Checkbox|Radio|Textarea|Field|Picker|Search|Form|Upload|Signature|Scanner|Toggle|Switch|Slider|Capture|Otp|Combobox|Lookup|Dropzone|Checks?List|Waive|Qid|Msisdn|Phone|Calendar|Date|Reason|Notes?Editor|Composer'),
    ('Cards', r'Card|Tile|Offer|Plan(?!Search)|Discount|Bundle|Product(?!Line)|Addon|Add-?on|ChoiceCards|Selectable'),
    ('Navigation elements', r'Sidebar|Breadcrumb|Nav|Header|Persona|GlobalSearch|Stepper|Wizard(Step|Title|Nav|Progress)|Rail|Topbar|Logo|Mark$|Wordmark|Switcher|StartCards|Hub'),
    ('Tables and lists', r'Table|List$|List[A-Z]|Row(s)?$|Grid|Timeline|Feed|Queue|History|Log$|Ledger|Inbox|Directory|Index$|Rows'),
    ('Layout components', r'Layout|Shell|Page$|Workspace|Screen|Zone|Route|Provider|Boundary|Gate|Frame|Outlet|App$|Router'),
    ('Containers, panels and sections', r'Panel|Section|Summary|Group|Accordion|Collapsible|Container|Band|Block|Detail|Overview|Tab[A-Z]|Step$|Step[A-Z]|Review|Console|Board|Hero|Strip|Wrapper|Body|Content'),
]

OVERRIDES = {'PageHeader': 'Layout components', 'WizardTitleBand': 'Layout components', 'PersonaSwitcher': 'Navigation elements', 'StartCards': 'Cards',
             'ErrorBoundary': 'Loading, empty, error and success states', 'Icon': 'Other reusable UI elements', 'PanelIcon': 'Other reusable UI elements',
             'VodafoneMark': 'Other reusable UI elements', 'VodafoneWordmark': 'Other reusable UI elements', 'SignaturePad': 'Forms and form controls'}

def categorise(name, path):
    if name in OVERRIDES:
        return OVERRIDES[name]
    for cat, rx in CATEGORY_RULES:
        if re.search(rx, name):
            return cat
    if '/primitives/' in path:
        return 'Other reusable UI elements'
    if '/modules/' in path or '/workspace/' in path:
        return 'Layout components'
    return 'Other reusable UI elements'

ALIAS = re.compile(r"type (\w*(?:Variant|Size|Tone|Kind|Status|Intent|Mode|Level|Appearance|Placement|Align)\w*) = ((?:'[^']+'\s*\|?\s*)+)")

def variants_states(s):
    out = []
    for m in ALIAS.finditer(s):
        out.append(f"{m.group(1)}: {' | '.join(re.findall(r"'([^']+)'", m.group(2)))}")
    for m in UNION.finditer(s):
        out.append(f"{m.group(1)}: {' | '.join(re.findall(r"'([^']+)'", m.group(2)))}")
    flags = [b for b in BOOLS if re.search(rf'\b{b}\??:\s*boolean|\b{b}\b\s*=\s*(false|true)|\b{b}\b[,}}]', s)]
    return '; '.join(out[:4]), ', '.join(flags[:8])

def users_of(name, own_paths):
    hits = {}
    pat = re.compile(r'<%s[\s/>]' % re.escape(name))
    for p, s in files.items():
        if p in own_paths:
            continue
        n = len(pat.findall(s))
        if n:
            hits[p] = n
    return hits

rows = []
for name, ds in sorted(defs.items()):
    paths = sorted({p for p, _ in ds})
    users = users_of(name, set(paths))
    own = sum(len(re.findall(r'<%s[\s/>]' % re.escape(name), files[p])) for p in paths)
    uses = sum(users.values()) + own
    exported = any(e for _, e in ds)
    cn = sum(per_file[p]['n'] for p in paths)
    if cn == 0 and uses == 0:
        continue                    # not a UI component (a helper that renders nothing and is never rendered)
    if not exported and uses == 0:
        continue
    sm = sum(per_file[p]['sem'] for p in paths)
    ln = sum(per_file[p]['long'] for p in paths)
    prim = any(per_file[p]['prim'] for p in paths)
    ar = Counter(area(p) for p in users)
    top = ', '.join(f'{a} ({n})' for a, n in ar.most_common(6))
    if len(ar) > 6:
        top += f' +{len(ar) - 6} more'
    lay = layer(paths[0])
    if lay in ('Primitive', 'Pattern', 'Domain component', 'Capability', 'App shell') or len(ar) >= 3:
        scope = 'Shared'
    elif users or exported and len(ar) >= 2:
        scope = 'Shared (limited)'
    else:
        scope = 'Page-specific'
    if cn == 0:
        style = 'Delegates (no className of its own)'
    else:
        r = sm / cn
        style = 'Semantic' if r >= 0.7 else 'Mixed' if r >= 0.25 else 'Utility-only' if cn >= 3 else 'Utility (few classes)'
        if prim and style.startswith('Utility'):
            style += ' + primitives'
    v, st = variants_states(files[paths[0]])
    rows.append(dict(name=name, cat=categorise(name, paths[0]), paths=paths, layer=lay, scope=scope, area=top or ('(file-local)' if not exported else '(unused)'),
                     files=len(users), uses=uses, variants=v, states=st, style=style, cn=cn, sem=sm, long=ln, exported=exported))

# ---- near-duplicates
dups = []
by_base = defaultdict(list)
for r in rows:
    for p in r['paths']:
        by_base[os.path.basename(p)].append((r['name'], p))
for b, lst in by_base.items():
    ps = sorted({p for _, p in lst})
    if len(ps) > 1 and b.endswith('.tsx'):
        dups.append(('Same file name in several folders', b, '; '.join(ps)))
dupnames = {n for n, ds in defs.items() if len({p for p, _ in ds}) > 1 and any(e for _, e in ds)}
for n in sorted(dupnames):
    dups.append(('Same component name defined in several files', n, '; '.join(sorted({p for p, _ in defs[n]}))))
fl = [p for p in per_file if per_file[p]['strings']]
pairs = []
for i, a in enumerate(fl):
    for b in fl[i + 1:]:
        if os.path.basename(a) == os.path.basename(b):
            continue
        common = per_file[a]['strings'] & per_file[b]['strings']
        if len(common) >= 2 or (common and any(len(c.split()) >= 9 for c in common)):
            pairs.append((a, b, common))
pairs.sort(key=lambda x: -len(x[2]))
for a, b, common in pairs[:80]:
    dups.append(('Same className strings repeated across files', f'{len(common)} shared', f'{a}  <->  {b}'))

# ---- hand-rolled native elements outside the primitives
raw_rows = []
for p, s in sorted(files.items()):
    if '/primitives/' in p:
        continue
    c = {t: len(re.findall(r'<%s[\s>]' % t, s)) for t in ('button', 'input', 'select', 'textarea', 'table')}
    if any(c.values()):
        raw_rows.append((p, c['button'], c['input'], c['select'], c['textarea'], c['table']))

# ---- workbook
wb = Workbook()
HEAD = PatternFill('solid', fgColor='E60000')
def sheet(ws, headers, data, widths):
    ws.append(headers)
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF'); c.fill = HEAD; c.alignment = Alignment(wrap_text=True, vertical='top')
    for r in data:
        ws.append(list(r))
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'B2'
    ws.auto_filter.ref = ws.dimensions

dupe_by_name = defaultdict(list)
for kind, key, detail in dups:
    for r in rows:
        if r['name'] == key or any(p in detail for p in r['paths']):
            dupe_by_name[r['name']].append(kind)
ws = wb.active; ws.title = 'Component Inventory'
data = []
for r in sorted(rows, key=lambda r: (r['cat'], r['name'])):
    d = sorted(set(dupe_by_name.get(r['name'], [])))
    data.append((r['name'], r['cat'], '\n'.join(r['paths']), r['layer'], r['scope'], r['area'], r['files'], r['uses'], r['variants'], r['states'],
                 'Yes: ' + '; '.join(d) if d else 'No', r['style'], f"{r['sem']}/{r['cn']}", r['long']))
sheet(ws, ['Component', 'Category', 'Source file(s)', 'Layer', 'Shared / page-specific', 'Used in (area, sites)', 'Files using it', 'Code sites', 'Variants (union props)',
           'States (boolean props)', 'Duplicate / similar implementation', 'Styling approach', 'className attrs with a semantic class', 'className attrs with 8+ utilities'],
      data, [28, 30, 56, 16, 16, 48, 9, 9, 40, 30, 44, 26, 14, 12])

ws2 = wb.create_sheet('Near-Duplicates')
sheet(ws2, ['Kind', 'Subject', 'Files'], dups, [44, 34, 120])
ws3 = wb.create_sheet('Hand-rolled Elements')
sheet(ws3, ['File', '<button>', '<input>', '<select>', '<textarea>', '<table>'], raw_rows, [80, 10, 10, 10, 10, 10])

ws4 = wb.create_sheet('Summary')
cats = Counter(r['cat'] for r in rows)
sty = Counter(r['style'].split(' +')[0] for r in rows)
scp = Counter(r['scope'] for r in rows)
summary = [('Unique components', len(rows)), ('', '')] + [(f'Category: {k}', v) for k, v in sorted(cats.items())] + [('', '')] + \
          [(f'Scope: {k}', v) for k, v in sorted(scp.items())] + [('', '')] + [(f'Styling: {k}', v) for k, v in sorted(sty.items())] + [('', '')] + \
          [('Near-duplicate findings', len(dups)), ('Files with raw <button>/<input>/<select>/<textarea>/<table> outside primitives', len(raw_rows))]
sheet(ws4, ['Measure', 'Count'], summary, [90, 12])

# ---- semantic class usage: how many files / sites use each class from the component stylesheet
css_classes = sorted(set(re.findall(r'^\s*\.([a-z][a-z0-9-]*)', read(os.path.join(SRC, 'ui-components.css')), re.M)))
usage = []
for c in css_classes:
    pat = re.compile(r'(?<![\w-])%s(?![\w-])' % re.escape(c))
    fs_ = {p: len(pat.findall(' '.join(class_strings(s)))) for p, s in files.items()}
    fs_ = {p: n for p, n in fs_.items() if n}
    usage.append((c, len(fs_), sum(fs_.values()), '; '.join(sorted(fs_)[:4]) + (' ...' if len(fs_) > 4 else '')))
usage.sort(key=lambda r: (-r[1], r[0]))
ws5 = wb.create_sheet('Semantic Class Usage')
sheet(ws5, ['Semantic class (src/ui-components.css)', 'Files using it', 'className sites', 'Examples'], usage, [40, 12, 12, 110])

# ---- generic local helper names defined more than once (the same idea re-implemented per file)
GENERIC = defaultdict(list)
for n, ds in defs.items():
    ps = sorted({p for p, e in ds if not e and p not in SKIP_FILES})
    if len(ps) >= 2:
        GENERIC[n] = ps
ws6 = wb.create_sheet('Repeated Local Helpers')
sheet(ws6, ['Helper name', 'Defined in (files)', 'Copies'], [(n, '\n'.join(ps), len(ps)) for n, ps in sorted(GENERIC.items(), key=lambda x: -len(x[1]))], [28, 110, 8])

wb.move_sheet('Summary', offset=-wb.sheetnames.index('Summary'))
wsm = wb.create_sheet('Method')
for line in __doc__.strip().split('\n'):
    wsm.append([line])
wsm.column_dimensions['A'].width = 140
wb.save(OUT)
print('wrote', OUT, '-', len(rows), 'components,', len(dups), 'duplicate findings')
