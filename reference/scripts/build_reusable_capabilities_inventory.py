"""Generate Reusable_Capabilities_Inventory_Reference.xlsx.

Regenerate with: python3 reference/scripts/build_reusable_capabilities_inventory.py
(run from anywhere - paths resolve relative to this script's location.)

The inventory of what the app shares: every reusable UI component and every
shared engine/store/hook/helper, WHERE it lives (its home layer), and WHICH
JOURNEYS consume it. It is GENERATED, never hand-edited - edit this script and
re-run, otherwise the next run silently discards manual changes.

Everything is read from the app's own source:

  src/components/{primitives,domain,patterns,patterns/wizard}   the UI components
  src/{engines,stores,hooks,lib}                                shared non-UI code
  every import in src/                                          the dependency graph
  git log                                                       last-changed date

"Consumer journeys" is resolved TRANSITIVELY. A pattern used only by other
shared components is traced through them to the journeys at the end of the chain
(src/modules/<x>, src/workspace/<x>, src/navigation), so a deeply nested part is
credited to the journeys that really reach it, not to the component next to it.
The app shell (App, router, main) is not a journey and is left out of the lists.

The one thing that is declared here rather than derived is the short list of
CROSS-JOURNEY CAPABILITIES (CAPABILITIES below): which components make up a named
capability such as Customer Verification. Their consumers are still computed,
and the script ABORTS if an anchor file no longer exists, so the list cannot
silently point at nothing.

Not recorded in the repo, so not in this workbook: a named human owner per
component (there is no CODEOWNERS) and persona reach. "Home" is the owning layer.
"""

import glob
import os
import re
import subprocess
import sys
from collections import defaultdict

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(APP_ROOT, 'src')
OUT = os.path.join(APP_ROOT, 'reference', 'outputs', 'Reusable_Capabilities_Inventory_Reference.xlsx')

UI_LAYERS = [
    ('Primitive', 'components/primitives', 'Design-system controls, no business logic'),
    ('Domain', 'components/domain', 'Controls that know VFQ data'),
    ('Pattern', 'components/patterns', 'Multi-step building blocks'),
    ('Wizard', 'components/patterns/wizard', 'Guided-journey shell and shared steps'),
]
NON_UI_DIRS = [('Engine', 'engines'), ('Store', 'stores'), ('Hook', 'hooks'), ('Helper', 'lib')]

# The Capability Library registry (src/capabilities/registry.json) is the ONE list of capabilities; this script
# reads it, it does not restate it. Anchors are the capability's own files (everything under its folder when it
# is consolidated, or its entry file when registered in place) plus its listed parts. Consumers are computed from
# the import graph, never typed in.
import json as _json

with open(os.path.join(SRC, 'capabilities', 'registry.json'), encoding='utf-8') as _f:
    REGISTRY = _json.load(_f)

# ------------------------------------------------------------------ source graph


def rel(path):
    return os.path.relpath(path, SRC).replace(os.sep, '/')


ALL = [p for p in glob.glob(os.path.join(SRC, '**', '*'), recursive=True) if p.endswith(('.ts', '.tsx')) and os.path.isfile(p)]
TEXT = {rel(p): open(p, encoding='utf-8').read() for p in ALL}
IMPORT_RE = re.compile(r"""(?:from|import)\s*\(?\s*['"](\.{1,2}/[^'"]*)['"]""")


def resolve(importer, spec):
    base = os.path.normpath(os.path.join(os.path.dirname(importer), spec)).replace(os.sep, '/')
    for cand in (base, base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx'):
        if cand in TEXT:
            return cand
    return None


IMPORTERS = defaultdict(set)  # file -> files that import it
for f, t in TEXT.items():
    for spec in IMPORT_RE.findall(t):
        target = resolve(f, spec)
        if target and target != f:
            IMPORTERS[target].add(f)


def is_shared_code(path):
    return path.startswith(('components/', 'engines/', 'stores/', 'hooks/', 'lib/', 'data/', 'types/'))


def area_of(path):
    """The journey / workspace area a leaf consumer belongs to, or None for the app shell and shared code."""
    parts = path.split('/')
    if parts[0] in ('modules', 'workspace') and len(parts) > 2:
        return f'{parts[0]}/{parts[1]}'
    if parts[0] == 'navigation':
        return 'navigation'
    return None


SHELL = ('App.tsx', 'router.tsx', 'main.tsx')
SHELL_REACH = {}


HUB = 'capabilities/index.ts'  # the Capability Library barrel


def _names_in(path):
    return set(re.findall(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|type|interface|enum)\s+([A-Za-z_]\w*)', TEXT.get(path, '')))


def _imported_names(importer, target):
    out = set()
    for m in re.finditer(r"import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'", TEXT[importer]):
        if resolve(importer, m.group(2)) == target:
            out |= {x.strip().split(' as ')[0].replace('type ', '').strip() for x in m.group(1).split(',') if x.strip()}
    return out


def consumers(path):
    """(journey areas that reach `path`, shared files that directly import it).

    Transitive through shared code AND through journeys that reuse another journey's files. One precision rule: the
    Capability Library barrel (capabilities/index.ts) re-exports every capability, so importing the barrel is not
    importing every capability - a journey is credited through it only if it imports a name this capability exports.
    """
    seen, areas = {path}, set()
    SHELL_REACH[path] = False
    frontier = [path]
    hub_pending = False

    def expand(cur):
        nonlocal hub_pending
        for imp in IMPORTERS.get(cur, ()):
            if imp == HUB:
                hub_pending = True
                seen.add(imp)
                continue
            if imp in seen:
                continue
            seen.add(imp)
            frontier.append(imp)
            if not is_shared_code(imp):
                a = area_of(imp)
                if a:
                    areas.add(a)
                elif imp in SHELL:
                    SHELL_REACH[path] = True

    while True:
        while frontier:
            expand(frontier.pop())
        if not hub_pending:
            break
        hub_pending = False
        # Everything the capability exports through the barrel: names declared in the capability files reached so far.
        live = set()
        for f in seen:
            if f.startswith('capabilities/') and f != HUB:
                live |= _names_in(f)
        for imp in IMPORTERS.get(HUB, ()):
            if imp in seen and imp != HUB:
                continue
            if _imported_names(imp, HUB) & live:
                seen.add(imp)
                frontier.append(imp)
                if not is_shared_code(imp):
                    a = area_of(imp)
                    if a:
                        areas.add(a)
                    elif imp in SHELL:
                        SHELL_REACH[path] = True
        # the hub itself is shared code consumed by those journeys; nothing further to expand from it
    direct_shared = sorted(i for i in IMPORTERS.get(path, ()) if is_shared_code(i))
    return sorted(areas), direct_shared


def last_changed(path):
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', os.path.join('src', path)],
                             cwd=APP_ROOT, capture_output=True, text=True, timeout=20).stdout.strip()
        return out or 'uncommitted'
    except Exception:
        return ''


EXPORT_COMPONENT = re.compile(r'export\s+(?:default\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)')
EXPORT_ANY = re.compile(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Za-z_][A-Za-z0-9_]*)')

# ------------------------------------------------------------------ integrity

CAPABILITIES = []
for _c in REGISTRY:
    _anchors = []
    if _c['status'] == 'consolidated':
        _anchors += sorted(f for f in TEXT if f.startswith(_c['home'] + '/'))
        if not _anchors:
            sys.exit(f'ABORT: capability "{_c["name"]}" has no files under {_c["home"]}/. Fix src/capabilities/registry.json.')
    else:
        _anchors.append(_c['home'])
    _anchors += _c['parts'] + _c.get('publicApi', [])
    for a in _anchors:
        if a not in TEXT:
            sys.exit(f'ABORT: capability "{_c["name"]}" lists {a}, which no longer exists. Fix src/capabilities/registry.json.')
    CAPABILITIES.append((_c['name'], _c['summary'], _anchors))

# ------------------------------------------------------------------ rows

ui_rows = []
seen_files = set()
# deepest folder first so patterns/wizard files are not claimed by patterns
for layer, folder, _ in sorted(UI_LAYERS, key=lambda x: -len(x[1])):
    for f in sorted(TEXT):
        if f in seen_files or not f.endswith('.tsx'):
            continue
        parent = os.path.dirname(f)
        if parent != folder:
            continue
        m = EXPORT_COMPONENT.search(TEXT[f])
        if not m:
            continue
        seen_files.add(f)
        areas, direct = consumers(f)
        ui_rows.append({'layer': layer, 'name': m.group(1), 'file': f, 'areas': areas, 'direct': direct, 'changed': last_changed(f)})
ui_rows.sort(key=lambda r: (['Primitive', 'Domain', 'Pattern', 'Wizard'].index(r['layer']), -len(r['areas']), r['name']))

code_rows = []
for kind, folder in NON_UI_DIRS:
    for f in sorted(TEXT):
        if os.path.dirname(f) != folder:
            continue
        names = EXPORT_ANY.findall(TEXT[f])
        areas, direct = consumers(f)
        code_rows.append({'layer': kind, 'name': os.path.basename(f).rsplit('.', 1)[0], 'file': f, 'exports': len(names),
                          'areas': areas, 'direct': direct, 'changed': last_changed(f)})
code_rows.sort(key=lambda r: (['Engine', 'Store', 'Hook', 'Helper'].index(r['layer']), -len(r['areas']), r['name']))


def reach(n, path=None):
    if n >= 2:
        return 'Shared (2+ areas)'
    if n == 1:
        return 'Single area'
    return 'App shell only' if path and SHELL_REACH.get(path) else 'No consumer'


cap_rows = []
for name, desc, anchors in CAPABILITIES:
    areas = set()
    for a in anchors:
        areas |= set(consumers(a)[0])
    cap_rows.append({'name': name, 'desc': desc, 'anchors': anchors, 'areas': sorted(areas)})
cap_rows.sort(key=lambda r: -len(r['areas']))

# ------------------------------------------------------------------ bypass imports
# A consolidated capability is meant to be used through src/capabilities (its barrel). A journey that value-imports one
# of its PARTS directly has bypassed it, so a change to the capability would not reach that journey. Type-only imports
# are fine, and so are a capability's `publicApi` files (e.g. the notification store journeys call to raise a toast).
# Parts of other capabilities are exempt (capabilities may compose each other's parts).
ALL_PARTS = {pt for c in REGISTRY if c['status'] == 'consolidated' for pt in c['parts']}
bypass = {}
for c in REGISTRY:
    if c['status'] != 'consolidated':
        continue
    found = []
    for part in c['parts']:
        for imp in sorted(IMPORTERS.get(part, ())):
            if imp.startswith('capabilities/') or imp in ALL_PARTS or imp == part:
                continue
            for m in re.finditer(r"import\s+(type\s+)?(?:\{[^}]*\}|\w+)\s+from\s+'([^']+)'", TEXT[imp]):
                if not m.group(1) and resolve(imp, m.group(2)) == part:
                    found.append(f'{imp}  ->  {part}')
    bypass[c['id']] = sorted(set(found))

# ------------------------------------------------------------------ generated data for the in-app Capability Library
import json as _j2

_by_name = {c['name']: c for c in cap_rows}
GENERATED = {
    'root': APP_ROOT,
    'capabilities': {c['id']: {'areas': _by_name[c['name']]['areas'], 'bypass': bypass.get(c['id'], [])} for c in REGISTRY},
}
with open(os.path.join(SRC, 'capabilities', 'consumers.generated.json'), 'w', encoding='utf-8') as _g:
    _j2.dump(GENERATED, _g, indent=2)
    _g.write('\n')

# ------------------------------------------------------------------ styling

VF_RED = 'E60000'
HEADER_FILL = PatternFill('solid', fgColor=VF_RED)
HEADER_FONT = Font(color='FFFFFF', bold=True, size=10)
TITLE_FONT = Font(bold=True, size=18, color=VF_RED)
SUB_FONT = Font(size=10, color='555555', italic=True)
WRAP = Alignment(wrap_text=True, vertical='top')
THIN = Side(style='thin', color='DDDDDD')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
REACH_FILL = {
    'Shared (2+ areas)': PatternFill('solid', fgColor='E8F5E9'),
    'Single area': PatternFill('solid', fgColor='FFF3E0'),
    'App shell only': PatternFill('solid', fgColor='E3F2FD'),
    'No consumer': PatternFill('solid', fgColor='FDECEA'),
}


def header_row(ws, labels, widths, row=1):
    for i, (label, width) in enumerate(zip(labels, widths), start=1):
        c = ws.cell(row=row, column=i, value=label)
        c.fill, c.font, c.border = HEADER_FILL, HEADER_FONT, BORDER
        c.alignment = Alignment(wrap_text=True, vertical='center')
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.row_dimensions[row].height = 30


def put(ws, r, values, fill=None):
    for i, v in enumerate(values, start=1):
        c = ws.cell(row=r, column=i, value=v)
        c.alignment, c.border, c.font = WRAP, BORDER, Font(size=10)
        if fill is not None and i == fill[0]:
            c.fill = fill[1]


def short(areas):
    return ', '.join(a.split('/', 1)[1] if '/' in a else a for a in areas)


wb = Workbook()

# ---- Sheet 1: Summary
ws = wb.active
ws.title = 'Summary'
ws['A1'] = 'VFQ DXP - Reusable Capabilities Inventory'
ws['A1'].font = TITLE_FONT
ws['A2'] = 'Generated from src/ by reference/scripts/build_reusable_capabilities_inventory.py - never hand-edit.'
ws['A2'].font = SUB_FONT
header_row(ws, ['Layer', 'What it holds', 'Items', 'Shared (2+ areas)', 'Single area', 'No journey consumer'], [16, 52, 10, 18, 14, 14], row=4)
r = 5
for layer, folder, desc in UI_LAYERS:
    rows = [x for x in ui_rows if x['layer'] == layer]
    put(ws, r, [layer, f'{desc} ({folder}/)', len(rows), sum(1 for x in rows if len(x['areas']) >= 2),
                sum(1 for x in rows if len(x['areas']) == 1), sum(1 for x in rows if reach(len(x['areas']), x['file']) in ('No consumer', 'App shell only'))])
    r += 1
for kind, folder in NON_UI_DIRS:
    rows = [x for x in code_rows if x['layer'] == kind]
    put(ws, r, [kind, f'Shared non-UI code ({folder}/)', len(rows), sum(1 for x in rows if len(x['areas']) >= 2),
                sum(1 for x in rows if len(x['areas']) == 1), sum(1 for x in rows if reach(len(x['areas']), x['file']) in ('No consumer', 'App shell only'))])
    r += 1
tot_ui, tot_code = len(ui_rows), len(code_rows)
put(ws, r, ['TOTAL', f'{tot_ui} UI components + {tot_code} non-UI files', tot_ui + tot_code,
            sum(1 for x in ui_rows + code_rows if len(x['areas']) >= 2),
            sum(1 for x in ui_rows + code_rows if len(x['areas']) == 1),
            sum(1 for x in ui_rows + code_rows if reach(len(x['areas']), x['file']) in ('No consumer', 'App shell only'))])
for c in ws[r]:
    c.font = Font(size=10, bold=True)
put(ws, r + 2, ['Cross-journey capabilities', f'{len(cap_rows)} named - see the Capabilities sheet', len(cap_rows), '', '', ''])

# ---- Sheet 2: Capabilities
cs = wb.create_sheet('Capabilities')
header_row(cs, ['Capability', 'What it does', 'Made of (anchor files)', 'Consumer areas', 'Consumer journeys / areas'], [28, 52, 52, 12, 70])
for i, c in enumerate(cap_rows, start=2):
    put(cs, i, [c['name'], c['desc'], '\n'.join(c['anchors']), len(c['areas']), short(c['areas'])])

# ---- Sheet 3: UI Components
us = wb.create_sheet('UI Components')
header_row(us, ['Layer', 'Component', 'File (under src/)', 'Reach', 'Consumer areas', 'Consumer journeys / areas', 'Used directly by shared files', 'Last changed'],
           [11, 30, 52, 17, 12, 60, 44, 13])
for i, x in enumerate(ui_rows, start=2):
    rc = reach(len(x['areas']), x['file'])
    put(us, i, [x['layer'], x['name'], x['file'], rc, len(x['areas']), short(x['areas']),
                ', '.join(os.path.basename(d).rsplit('.', 1)[0] for d in x['direct']), x['changed']], fill=(4, REACH_FILL[rc]))
us.auto_filter.ref = f'A1:H{len(ui_rows) + 1}'

# ---- Sheet 4: Shared Code
ns = wb.create_sheet('Shared Code')
header_row(ns, ['Kind', 'Name', 'File (under src/)', 'Reach', 'Consumer areas', 'Consumer journeys / areas', 'Used directly by shared files', 'Last changed'],
           [10, 30, 40, 17, 12, 60, 44, 13])
for i, x in enumerate(code_rows, start=2):
    rc = reach(len(x['areas']), x['file'])
    put(ns, i, [x['layer'], x['name'], x['file'], rc, len(x['areas']), short(x['areas']),
                ', '.join(os.path.basename(d).rsplit('.', 1)[0] for d in x['direct']), x['changed']], fill=(4, REACH_FILL[rc]))
ns.auto_filter.ref = f'A1:H{len(code_rows) + 1}'

# ---- Sheet 5: Legend & Method
ls = wb.create_sheet('Legend & Method')
ls.column_dimensions['A'].width = 28
ls.column_dimensions['B'].width = 110
notes = [
    ('Source', 'Read from src/ on every run: components/{primitives,domain,patterns,patterns/wizard}, engines/, stores/, hooks/, lib/, and every relative import.'),
    ('Item', 'A UI component is a .tsx file in a components layer that exports a capitalised function/const. A shared non-UI item is any .ts/.tsx file in engines/, stores/, hooks/ or lib/.'),
    ('Consumer area', 'A journey or workspace folder: src/modules/<x>, src/workspace/<x>, or src/navigation. Resolved transitively - through other shared components AND through journey files that another journey reuses (Fixed Line reusing New Connection\'s contact step reaches Customer Verification that way).'),
    ('Not a consumer', 'The app shell (App, router, main). Tests and files outside the folders above.'),
    ('Reach', 'Shared = reached by 2+ consumer areas. Single area = extracted from one area but not yet reused. App shell only = used by App/router/main alone (global furniture such as the toast host). No consumer = nothing imports it.'),
    ('Used directly by shared files', 'The shared components that import this one directly - the composition parents.'),
    ('Home', 'The owning layer. The repo records no named human owner (no CODEOWNERS), so none is invented here.'),
    ('Capabilities', 'The only declared list. Anchors are named in CAPABILITIES in the script; consumers are still computed, and the script aborts if an anchor file disappears.'),
    ('Persona reach', 'Not included: it would need a persona -> screen -> component map. See the Persona Feature Applicability Matrix for persona grants.'),
    ('Regenerate', 'python3 reference/scripts/build_reusable_capabilities_inventory.py - whenever a shared component, engine, store or capability is added, removed or moved.'),
]
for i, (k, v) in enumerate(notes, start=1):
    a, b = ls.cell(row=i, column=1, value=k), ls.cell(row=i, column=2, value=v)
    a.font, b.alignment = Font(bold=True, size=10), WRAP
    a.alignment = WRAP

wb.save(OUT)

from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines

format_file(OUT)
print(f'Wrote {OUT}')
print(f'  UI components: {tot_ui} ({sum(1 for x in ui_rows if len(x["areas"]) >= 2)} shared, '
      f'{sum(1 for x in ui_rows if len(x["areas"]) == 1)} single-area, {sum(1 for x in ui_rows if not x["areas"])} none)')
print(f'  shared code:   {tot_code} ({sum(1 for x in code_rows if len(x["areas"]) >= 2)} shared, '
      f'{sum(1 for x in code_rows if len(x["areas"]) == 1)} single-area, {sum(1 for x in code_rows if not x["areas"])} none)')
print(f'  capabilities:  {len(cap_rows)}')
print(f'  bypass imports: {sum(len(v) for v in bypass.values())}')
for _k, _v in bypass.items():
    for _line in _v:
        print(f'    [{_k}] {_line}')
for c in cap_rows:
    print(f'    {c["name"]}: {len(c["areas"])} areas')
