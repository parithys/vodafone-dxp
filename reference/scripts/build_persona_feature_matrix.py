"""Generate Persona_Feature_Applicability_Matrix_Reference.xlsx.

Regenerate with: python3 reference/scripts/build_persona_feature_matrix.py
(run from anywhere — paths resolve relative to this script's location.)

This workbook is the SINGLE SOURCE OF TRUTH for the VFQ DXP operational roles:
who they are, how they sign in, what they may reach, and which action gates
they hold. It is GENERATED, never hand-edited — edit this script instead and
re-run, otherwise the next run silently discards manual changes.

Everything is read from the app's own source, so the workbook cannot drift:

  personas.json          the 26 roles: staff id, group, business unit,
                         approach, channel, context card, capabilities, grants
  feature-catalogue.json feature key -> screen ids (the shared vocabulary)
  users-agents.json      the identity each role resolves to at login
  staffIdRoleMap.ts      the demo password (parsed, not restated)
  types/config.ts        the PersonaCapability union (drift guard)
  src/modules/*/screens/index.tsx
                         which screens are actually registered, i.e. built

Two rules keep it trustworthy:

  1. ONLY implemented features appear as applicability rows. The built set is
     discovered from registerScreen() calls — the same registry the router uses
     to decide between a real screen and <ScreenNotYetBuilt>.
  2. A tick is only ever written where personas.json actually grants the
     feature. Nothing is inferred and nothing is hand-ticked.

2026-09-24: rewritten for the 26-role model. The previous version described 66
evidence-cited personas and keyed a tick to an rbac.json row; under that model
a blank cell meant "no evidence". Grants are now exhaustive, so a blank means
DELIBERATELY NOT GRANTED — the legend's central distinction is inverted. The
archived 66-persona model lives in reference/blueprint/legacy/.
"""

import glob
import json
import os
import re
import subprocess

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONF = os.path.join(APP_ROOT, 'public', 'config')
DATA = os.path.join(APP_ROOT, 'public', 'mock-data')
SRC = os.path.join(APP_ROOT, 'src')
OUT = os.path.join(
    APP_ROOT, 'reference', 'outputs', 'Persona_Feature_Applicability_Matrix_Reference.xlsx'
)

TICK = '✓'

# FREEZE_PANES note — every sheet is emitted with panes UNFROZEN, deliberately.
#
# Requested 2026-09-24. Frozen panes are a viewing preference, and openpyxl
# bakes them into the file: they follow the workbook into Excel, Numbers,
# Sheets and any PDF export, and they cannot be undone by a reader who wants
# the raw grid. A reader who wants them can freeze locally in two clicks; a
# reader who does not had no way to remove them.
#
# Keep the assignments deleted rather than set to None — the sheet variables
# (cs, ws, caps, fs, lx, ns) each carry a marker comment where the call was, so
# this decision reads as intentional at the point someone would reintroduce it.

# ---------------------------------------------------------------- load source

with open(os.path.join(CONF, 'personas.json')) as f:
    PERSONAS = json.load(f)
with open(os.path.join(CONF, 'feature-catalogue.json')) as f:
    CATALOGUE = json.load(f)
with open(os.path.join(CONF, 'routes.json')) as f:
    ROUTES = {r['screenId']: r for r in json.load(f)}
with open(os.path.join(DATA, 'users-agents.json')) as f:
    AGENTS = {a['userId']: a for a in json.load(f)}

FEATURE_BY_KEY = {f['key']: f for f in CATALOGUE}
LEVEL_ORDER = ['View', 'Create', 'Edit', 'Approve', 'Full']


def registered_screen_ids():
    """Screen ids passed to registerScreen(), i.e. genuinely built."""
    found = set()
    for path in glob.glob(os.path.join(SRC, 'modules', '*', 'screens', 'index.tsx')):
        found |= set(re.findall(r"'(SCR-\d+)'", open(path).read()))
    return found


BUILT = registered_screen_ids()


def demo_password():
    """Parsed from staffIdRoleMap.ts rather than restated here, so the
    credentials sheet cannot drift from the value the app actually checks."""
    src = open(os.path.join(SRC, 'auth', 'staffIdRoleMap.ts')).read()
    m = re.search(r"DEMO_LOGIN_PASSWORD\s*=\s*'([^']+)'", src)
    if not m:
        raise SystemExit(
            'Could not parse DEMO_LOGIN_PASSWORD from src/auth/staffIdRoleMap.ts. '
            'If the demo credential scheme changed, update demo_password() here.'
        )
    return m.group(1)


PASSWORD = demo_password()


def declared_capabilities():
    """The PersonaCapability union from types/config.ts."""
    src = open(os.path.join(SRC, 'types', 'config.ts')).read()
    block = src[src.index('export type PersonaCapability'):]
    block = block[:block.index(';')]
    return set(re.findall(r"'([a-z-]+)'", block))


def verify_no_drift():
    """Guard the capability vocabulary, and the catalogue/grant integrity.

    Replaces the previous guard, which regexed PERSONA-\\d+ id sets out of
    agentPrivilegeEngine.ts. Those sets no longer exist — the engine reads
    declared capabilities — so the thing worth policing is now that the
    capability names used in code, declared in the type union, and granted in
    personas.json are the same vocabulary.
    """
    problems = []
    declared = declared_capabilities()

    engine = open(os.path.join(SRC, 'engines', 'agentPrivilegeEngine.ts')).read()
    used_in_code = set(re.findall(r"has\((?:personaId|id)[^,]*,\s*'([a-z-]+)'\)", engine))
    for cap in sorted(used_in_code - declared):
        problems.append(f"agentPrivilegeEngine gates on '{cap}', absent from the PersonaCapability union")

    granted = {c for p in PERSONAS for c in p['capabilities']}
    for cap in sorted(granted - declared):
        problems.append(f"personas.json grants '{cap}', absent from the PersonaCapability union")

    unused = sorted(declared - granted)
    ungated = sorted(declared - used_in_code)

    # Grants must reference real catalogue keys, and catalogue screens real routes.
    for p in PERSONAS:
        for g in p['features']:
            if g['key'] not in FEATURE_BY_KEY:
                problems.append(f"{p['id']} grants unknown feature key {g['key']}")
            if g['level'] not in LEVEL_ORDER:
                problems.append(f"{p['id']} grants unknown level {g['level']} on {g['key']}")
    for f in CATALOGUE:
        for s in f['screenIds']:
            if s not in ROUTES:
                problems.append(f"feature {f['key']} references unknown screen {s}")

    # Every role must be sign-in-able and resolve to a seeded identity.
    seen_staff, seen_role = set(), set()
    for p in PERSONAS:
        if p['staffId'] in seen_staff:
            problems.append(f"duplicate staffId {p['staffId']}")
        if p['id'] in seen_role:
            problems.append(f"duplicate role id {p['id']}")
        seen_staff.add(p['staffId'])
        seen_role.add(p['id'])
        if p['identityUserId'] not in AGENTS:
            problems.append(f"{p['id']} binds identity {p['identityUserId']}, absent from users-agents.json")

    if problems:
        raise SystemExit(
            'Source is inconsistent — refusing to emit a workbook that would misreport it:\n  - '
            + '\n  - '.join(problems)
        )
    return unused, ungated


UNUSED_CAPS, UNGATED_CAPS = verify_no_drift()

# ------------------------------------------------------ resolve applicability


def screens_for(grant_key):
    return FEATURE_BY_KEY[grant_key]['screenIds']


def is_built(grant_key):
    """A workspace feature (no SCR- ids) is routed directly and so is built.
    A module feature is built if any of its screens is registered."""
    ids = screens_for(grant_key)
    return True if not ids else any(s in BUILT for s in ids)


rows = []
for i, feature in enumerate(CATALOGUE, start=1):
    granted = {}
    for p in PERSONAS:
        for g in p['features']:
            if g['key'] != feature['key']:
                continue
            prev = granted.get(p['id'])
            if prev is None or LEVEL_ORDER.index(g['level']) > LEVEL_ORDER.index(prev):
                granted[p['id']] = g['level']
    restrictions = sorted({
        g['restrictions'] for p in PERSONAS for g in p['features']
        if g['key'] == feature['key'] and g.get('restrictions')
    })
    rows.append({
        'id': f'FEAT-{i:03d}',
        'key': feature['key'],
        'name': feature['name'],
        'area': feature['area'],
        'surface': feature['surface'],
        'screens': ', '.join(feature['screenIds']) or '—  (routed directly)',
        'built': is_built(feature['key']),
        'granted': granted,
        'levels': ', '.join(sorted({v for v in granted.values()}, key=LEVEL_ORDER.index)),
        'restrictions': restrictions,
    })



# ------------------------------------------- app referential integrity
# These are SYNC guards, not workbook guards. The workbook is generated from
# source, so it is only as truthful as the source is self-consistent: a journey
# pointing at a feature key that no longer exists, or a quick action targeting
# an unregistered screen, would be faithfully reported as working. Each check
# below is something that was verified by hand once and is now enforced, so the
# app and this workbook cannot silently drift apart again.


def verify_app_integrity():
    problems = []
    jc = open(os.path.join(SRC, 'navigation', 'journeyCatalogue.ts')).read()
    zs = open(os.path.join(SRC, 'modules', 'dashboard', 'zoneSpecs.ts')).read()
    man = open(os.path.join(SRC, 'navigation', 'navManifest.ts')).read()
    rtr = open(os.path.join(SRC, 'router.tsx')).read()
    ss = open(os.path.join(SRC, 'engines', 'searchScopeEngine.ts')).read()
    gs = open(os.path.join(SRC, 'navigation', 'GlobalSearch.tsx')).read()

    # 1. every journey's featureKey must be a real catalogue key, or its
    #    visibility rule silently never matches and the card never renders.
    for k in sorted(set(re.findall(r"featureKey:\s*'([\w.-]+)'", jc)) - set(FEATURE_BY_KEY)):
        problems.append(f"journeyCatalogue gates a journey on '{k}', absent from feature-catalogue.json")

    # 2. journey entry screens must be catalogued, and a journey claiming
    #    'available' must resolve to a screen that is actually registered —
    #    otherwise the card offers "Start now" into <ScreenNotYetBuilt>.
    for sid in sorted(set(re.findall(r"screenId:\s*'(SCR-\d+)'", jc)) - set(ROUTES)):
        problems.append(f"journeyCatalogue references screen {sid}, absent from routes.json")
    for block in re.findall(r"\{[^{}]*?status:\s*'available'[^{}]*?\}", jc):
        sid = re.search(r"screenId:\s*'(SCR-\d+)'", block)
        if sid and sid.group(1) not in BUILT:
            problems.append(
                f"journeyCatalogue marks a journey 'available' but its screen {sid.group(1)} is not registered"
            )

    # 3. a dashboard quick action pointing at an unregistered screen renders a
    #    button that does nothing when clicked.
    for sid in sorted(set(re.findall(r"screenId:\s*'(SCR-\d+)'", zs)) - BUILT):
        problems.append(f"dashboard quick action targets screen {sid}, which is not registered")

    # 4. every nav destination needs a matching <Route path>, or it falls
    #    through to /:moduleSlug and renders "Module not found."
    routes = set(re.findall(r'<Route path="([^"]+)"', rtr))
    # A dynamic route only counts as coverage if it has at least one LITERAL
    # segment that matches — e.g. /mobile/:category covers /mobile/service-management.
    # The module catch-all /:moduleSlug has none, so it must never count:
    # being "covered" by it is exactly the broken case this guard exists for.
    # /products and /customers previously fell through to it and rendered the
    # bare string "Module not found.", and a naive pattern match called that
    # covered.
    dynamic = []
    for r in routes:
        if ':' not in r:
            continue
        segs = [seg for seg in r.strip('/').split('/') if seg]
        if not any(not seg.startswith(':') for seg in segs):
            continue  # all-parameter route — a catch-all, not coverage
        dynamic.append(re.compile('^/' + '/'.join(
            '[^/]+' if seg.startswith(':') else re.escape(seg) for seg in segs) + '$'))
    for dest in sorted(set(re.findall(r"to:\s*'(/[\w./-]*)'", man))):
        if dest not in routes and not any(rx.match(dest) for rx in dynamic):
            problems.append(
                f"nav destination '{dest}' has no matching <Route path> — it would fall through "
                'to /:moduleSlug and render "Module not found."'
            )

    # 5. a declared search group with no searcher contributes nothing, so the
    #    placeholder would advertise a scope the results never cover.
    union = ss.split('SearchGroup =')[1].split(';')[0]
    declared_groups = set(re.findall(r"'([\w-]+)'", union))
    implemented = set(re.findall(r"^\s*'?([\w-]+)'?:\s*async \(\)", gs, re.M))
    for g in sorted(declared_groups - implemented):
        problems.append(f"search group '{g}' is declared but GlobalSearch implements no searcher for it")

    # 6. dead vocabulary in either direction.
    granted_anywhere = {g['key'] for p in PERSONAS for g in p['features']}
    for k in sorted(set(FEATURE_BY_KEY) - granted_anywhere):
        problems.append(f"feature key '{k}' is catalogued but granted to no role")
    for p in PERSONAS:
        if not p['features']:
            problems.append(f"{p['id']} has zero feature grants")

    if problems:
        raise SystemExit(
            'App is not internally consistent — the workbook would report broken wiring as working:\n  - '
            + '\n  - '.join(problems)
        )


verify_app_integrity()

# ---------------------------------------------- navigation (parsed from source)
# The Navigation sheet answers the question the whole approach classification
# exists to answer: what does this role actually SEE in the rail? That is
# decided by TypeScript (navigationEngine + navManifest + journeyCatalogue), so
# it is parsed out of those files rather than restated here — restating it would
# create a second source of truth for the one thing the redesign is about.


def parse_navigation():
    nav_src = open(os.path.join(SRC, 'engines', 'navigationEngine.ts')).read()
    man_src = open(os.path.join(SRC, 'navigation', 'navManifest.ts')).read()
    jc_src = open(os.path.join(SRC, 'navigation', 'journeyCatalogue.ts')).read()

    block = nav_src[nav_src.index('const APPROACH_NAV'):]
    block = block[:block.index('\n};')]
    approach_nav = {}
    for m in re.finditer(r"(?:'([\w-]+)'|(\w+))\s*:\s*\[([^\]]*)\]", block, re.S):
        approach_nav[m.group(1) or m.group(2)] = re.findall(r"'([\w.-]+)'", m.group(3))

    items = re.findall(r"key:\s*'([\w.-]+)',\s*label:\s*'([^']+)'", man_src)
    gated = re.search(r"key:\s*'(\w[\w.-]*)',[^}]*?requiresFeature:\s*'([\w.-]+)'", man_src, re.S)

    # category key -> the feature keys its journeys are gated on
    lines = {}
    for line_key in ('mobile', 'fibre-home'):
        start = jc_src.index(f"key: '{line_key}',")
        end = jc_src.index("key: 'fibre-home',") if line_key == 'mobile' else len(jc_src)
        body = jc_src[start:end]
        cats = [(m.group(1), m.start()) for m in re.finditer(r"key:\s*'([\w-]+)',\s*\n\s*label:", body)]
        # The first match is the product line's own key, not a category.
        cats = [c for c in cats if c[0] != line_key]
        per_cat = {}
        for n, (cat_key, pos) in enumerate(cats):
            stop = cats[n + 1][1] if n + 1 < len(cats) else len(body)
            per_cat[cat_key] = set(re.findall(r"featureKey:\s*'([\w.-]+)'", body[pos:stop]))
        lines[line_key] = per_cat

    problems = []
    if set(approach_nav) != {'Customer-First', 'Product-First', 'Hybrid', 'None'}:
        problems.append(f'APPROACH_NAV keys parsed as {sorted(approach_nav)}')
    if len(items) != 20:
        problems.append(f'navManifest parsed {len(items)} items, expected 20')
    if not gated:
        problems.append('no requiresFeature found in navManifest')
    for lk, cats in lines.items():
        expected = 4  # Mobile Services and Fibre & Home Services each have the same four journey categories (New Connections is its own hub)
        if len(cats) != expected:
            problems.append(f'{lk} parsed {len(cats)} categories, expected {expected}')
    if problems:
        raise SystemExit(
            'Could not parse navigation out of source — refusing to emit a Navigation sheet '
            'that might not match the app:\n  - ' + '\n  - '.join(problems)
        )
    return approach_nav, dict(items), (gated.group(1), gated.group(2)), lines


APPROACH_NAV, NAV_LABELS, (GATED_NAV_KEY, GATED_NAV_FEATURE), JOURNEY_LINES = parse_navigation()


def nav_reach(persona):
    """Mirrors navigationEngine.resolveNavFor + reachableCategories."""
    keys = set(APPROACH_NAV.get(persona['approach'], []))
    granted = {g['key'] for g in persona['features']}
    if GATED_NAV_FEATURE in granted:
        keys.add(GATED_NAV_KEY)
    reached = set(keys)
    for line_key, cats in JOURNEY_LINES.items():
        if line_key not in keys:
            continue
        gated_cats = {c: fks for c, fks in cats.items() if fks}
        live = {c for c, fks in gated_cats.items() if fks & granted}
        if not live:
            continue  # line still renders, but no categories
        for cat in cats:
            # A roadmap-only category (no gated journeys) rides along with the line.
            if cat in live or cat not in gated_cats:
                reached.add(f'{line_key}.{cat}')
    return reached


# --------------------------------------------------------------- styling

VF_RED = 'E60000'
HEADER_FILL = PatternFill('solid', fgColor=VF_RED)
HEADER_FONT = Font(color='FFFFFF', bold=True, size=10)
GROUP_FILL = PatternFill('solid', fgColor='7B1FA2')
META_FILL = PatternFill('solid', fgColor='F4F4F4')
TICK_FILL = PatternFill('solid', fgColor='E8F5E9')
PLANNED_FILL = PatternFill('solid', fgColor='FFF3E0')
TITLE_FONT = Font(bold=True, size=18, color=VF_RED)
SUB_FONT = Font(size=10, color='555555', italic=True)
BOLD = Font(bold=True)
MONO = Font(size=10, name='Menlo')
WRAP = Alignment(wrap_text=True, vertical='top')
CENTER = Alignment(horizontal='center', vertical='center')
THIN = Side(style='thin', color='DDDDDD')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

APPROACH_FILL = {
    'Customer-First': PatternFill('solid', fgColor='E8F5E9'),
    'Product-First': PatternFill('solid', fgColor='E3F2FD'),
    'Hybrid': PatternFill('solid', fgColor='FFF3E0'),
    'None': PatternFill('solid', fgColor='F4F4F4'),
}


def header_row(ws, labels, widths, row=1, height=30):
    for i, (label, width) in enumerate(zip(labels, widths), start=1):
        c = ws.cell(row=row, column=i, value=label)
        c.fill = HEADER_FILL
        c.font = HEADER_FONT
        c.alignment = Alignment(wrap_text=True, vertical='center')
        c.border = BORDER
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.row_dimensions[row].height = height


wb = Workbook()

# ================================================ Sheet 1: Roles & Credentials
cs = wb.active
cs.title = 'Roles & Credentials'

CRED_HEADERS = [
    '#', 'Role ID', 'Staff ID', 'Password', 'Persona', 'Persona Group', 'Business Unit',
    'Approach', 'Description', 'Channel', 'Context Card', 'Agent Name', 'Job Title',
    'Team', 'User ID', 'Features', 'Screens', 'Capabilities (action gates)',
    'Legacy persona IDs',
]
CRED_WIDTHS = [4, 9, 11, 14, 34, 34, 20, 15, 42, 28, 26, 20, 26, 26, 10, 9, 8, 46, 36]
header_row(cs, CRED_HEADERS, CRED_WIDTHS)

for r, p in enumerate(PERSONAS, start=2):
    agent = AGENTS[p['identityUserId']]
    screen_ids = set()
    for g in p['features']:
        screen_ids |= set(screens_for(g['key']))
    vals = [
        r - 1, p['id'], p['staffId'], PASSWORD, p['name'], p['group'], p['businessUnitLabel'],
        p['approach'], p['description'], p['channel'], p['contextCard'],
        f"{agent['firstName']} {agent['lastName']}", agent['jobTitle'], agent['team'],
        p['identityUserId'], len(p['features']), len(screen_ids),
        ', '.join(p['capabilities']) or '—',
        ', '.join(p['legacyPersonaIds']) or '—',
    ]
    for i, v in enumerate(vals, start=1):
        c = cs.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.font = Font(size=10)
        c.alignment = CENTER if i in (1, 8, 15, 16, 17) else WRAP
        if i in (2, 3):
            c.font = Font(size=10, bold=True)
        if i == 4:
            c.font = MONO
        if i == 8:
            c.fill = APPROACH_FILL.get(p['approach'], META_FILL)
    cs.row_dimensions[r].height = 30

# cs.freeze_panes intentionally unset — see FREEZE_PANES note
cs.auto_filter.ref = f'A1:S{len(PERSONAS) + 1}'

note = cs.cell(row=len(PERSONAS) + 3, column=1,
               value=('Password is a shared placeholder demo credential (DEMO_LOGIN_PASSWORD in '
                      'src/auth/staffIdRoleMap.ts), identical for all roles. The real IDAM policy '
                      'and credential source are open items (D-02, OI-AGN-04) — this is not a real '
                      'credential scheme. Staff ID entry is normalised, so "VFQ-12341", '
                      '"vfq 12341" and "VFQ12341" all resolve to the same role.'))
note.font = SUB_FONT
note.alignment = WRAP
cs.merge_cells(start_row=len(PERSONAS) + 3, start_column=1, end_row=len(PERSONAS) + 4, end_column=10)

# ================================================ Sheet 2: Applicability Matrix
ws = wb.create_sheet('Applicability Matrix')

META = [('Feature ID', 11), ('Module / Area', 22), ('Feature', 40), ('Status', 10),
        ('Screen IDs', 26), ('Levels granted', 20), ('Restrictions', 46)]
NMETA = len(META)

# Meta labels sit on row 2, not row 1, so they ARE the autofilter's header row
# (ref starts at A2). Previously the filter's header row was the blank spacer
# under the labels, which gave every dropdown an empty name. Row 1's meta cells
# stay styled-but-empty as a band aligning with the rotated role names.
for i, (label, width) in enumerate(META, start=1):
    ws.cell(row=2, column=i, value=label)
    ws.column_dimensions[get_column_letter(i)].width = width

# Role name and Staff ID share ONE rotated header cell ("Channel Manager:
# VFQ12348") rather than stacking across two rows. The two were only ever read
# together — a column is identified by which person it is and what you log in
# as — and splitting them cost a header row and made the pair easy to misread
# when scrolled. The ROLE-xx id is dropped from the label rather than crammed
# in: Staff ID is equally unique, is the value a reader actually types, and the
# Role ID remains the first column of Roles & Credentials, Capabilities and
# Navigation for joining.
def col_label(p):
    """Header label for a role column: "Channel Manager: VFQ12348".

    A trailing parenthetical is dropped — "MNP (Mobile Number Portability
    Agent)" becomes "MNP". Two names carry that expansion and, rotated
    90 degrees, they alone forced the header row 40% taller than the other 24
    needed. The expansion is not lost: Roles & Credentials prints the full name
    verbatim, and the abbreviation is in the glossary. Derived from the name
    rather than a second hand-kept short-name table.
    """
    return f"{re.sub(r'\s*\([^)]*\)$', '', p['name'])}: {p['staffId']}"


for j, p in enumerate(PERSONAS):
    col = NMETA + 1 + j
    ws.cell(row=1, column=col, value=col_label(p))
    ws.cell(row=2, column=col, value=p['approach'])
    ws.column_dimensions[get_column_letter(col)].width = 5.5

for col in range(1, NMETA + len(PERSONAS) + 1):
    for row in (1, 2):
        c = ws.cell(row=row, column=col)
        c.border = BORDER
        if col > NMETA:
            p = PERSONAS[col - NMETA - 1]
            # Left-aligned with indent=1 rather than centred. Rotated 90
            # degrees, "left" is the end nearest the grid, so every role label
            # starts on the same line just above its column of ticks instead of
            # floating at the centre of a 236pt cell — with 26 columns of
            # differing name lengths, centring left them ragged.
            c.alignment = Alignment(text_rotation=90, horizontal='left',
                                    vertical='bottom', indent=1)
            if row == 1:
                c.fill = GROUP_FILL
                c.font = HEADER_FONT
            else:
                c.fill = APPROACH_FILL.get(p['approach'], META_FILL)
                c.font = Font(size=9, color='333333')
        else:
            c.fill = HEADER_FILL
            c.font = HEADER_FONT
            c.alignment = Alignment(wrap_text=True, vertical='bottom')
# Tallest label sets row 1: the longest "name: Staff ID" string rotated 90°.
# Measured from the data rather than pinned to a number, so adding a role with
# a longer name can't clip its own header.
_longest = max(len(col_label(p)) for p in PERSONAS)
ws.row_dimensions[1].height = max(190, _longest * 6.2)
ws.row_dimensions[2].height = 74

for r, row in enumerate(rows, start=3):
    vals = [row['id'], row['area'], row['name'], 'Built' if row['built'] else 'Planned',
            row['screens'], row['levels'], '; '.join(row['restrictions'])]
    for i, v in enumerate(vals, start=1):
        c = ws.cell(row=r, column=i, value=v)
        c.alignment = WRAP
        c.border = BORDER
        c.font = Font(size=10, bold=(i == 1))
        c.fill = PLANNED_FILL if (i == 4 and not row['built']) else META_FILL
    for j, p in enumerate(PERSONAS):
        c = ws.cell(row=r, column=NMETA + 1 + j)
        c.border = BORDER
        c.alignment = CENTER
        if p['id'] in row['granted']:
            c.value = TICK
            c.fill = TICK_FILL
            c.font = Font(size=11, bold=True, color='1B5E20')
    ws.row_dimensions[r].height = 30

# ws.freeze_panes intentionally unset — see FREEZE_PANES note
ws.auto_filter.ref = f'A2:{get_column_letter(NMETA)}{len(rows) + 2}'

# ============================================== Sheet 3: Capabilities
caps = wb.create_sheet('Capabilities')
ALL_CAPS = sorted(declared_capabilities())

header_row(caps, ['Role ID', 'Staff ID', 'Persona', 'Approach'] + ALL_CAPS,
           [9, 11, 34, 15] + [17] * len(ALL_CAPS), height=64)
for i in range(5, 5 + len(ALL_CAPS)):
    caps.cell(row=1, column=i).alignment = Alignment(
        text_rotation=90, horizontal='center', vertical='bottom')

for r, p in enumerate(PERSONAS, start=2):
    vals = [p['id'], p['staffId'], p['name'], p['approach']]
    for i, v in enumerate(vals, start=1):
        c = caps.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.font = Font(size=10, bold=(i <= 2))
        c.alignment = WRAP if i == 3 else CENTER
        if i == 4:
            c.fill = APPROACH_FILL.get(p['approach'], META_FILL)
    for i, cap in enumerate(ALL_CAPS, start=5):
        c = caps.cell(row=r, column=i)
        c.border = BORDER
        c.alignment = CENTER
        if cap in p['capabilities']:
            c.value = TICK
            c.fill = TICK_FILL
            c.font = Font(size=11, bold=True, color='1B5E20')
# caps.freeze_panes intentionally unset — see FREEZE_PANES note

r_note = len(PERSONAS) + 3
caps.cell(row=r_note, column=1, value=(
    'Capabilities are in-surface ACTION gates, distinct from the feature grants on the '
    'Applicability Matrix sheet: a feature key exists for every surface carrying its own access '
                   'decision, a capability '
    'for every action gate inside one. Enforced by src/engines/agentPrivilegeEngine.ts.'
)).font = SUB_FONT
caps.cell(row=r_note, column=1).alignment = WRAP
caps.merge_cells(start_row=r_note, start_column=1, end_row=r_note + 1, end_column=8)

# ============================================== Sheet 4: Feature Inventory
fs = wb.create_sheet('Feature Inventory')
header_row(fs,
           ['Feature ID', 'Feature key', 'Feature', 'Module / Area', 'Surface', 'Status',
            'Screen IDs', 'Roles granted', 'Levels granted', 'Restrictions'],
           [11, 34, 40, 24, 12, 10, 30, 13, 20, 50])
for r, row in enumerate(rows, start=2):
    vals = [row['id'], row['key'], row['name'], row['area'], row['surface'],
            'Built' if row['built'] else 'Planned', row['screens'],
            len(row['granted']), row['levels'], '; '.join(row['restrictions'])]
    for i, v in enumerate(vals, start=1):
        c = fs.cell(row=r, column=i, value=v)
        c.alignment = CENTER if i in (5, 6, 8) else WRAP
        c.border = BORDER
        c.font = Font(size=10)
        if i == 6 and not row['built']:
            c.fill = PLANNED_FILL
# fs.freeze_panes intentionally unset — see FREEZE_PANES note
fs.auto_filter.ref = f'A1:J{len(rows) + 1}'

# ============================================== Sheet 5: Legacy Crosswalk
lx = wb.create_sheet('Legacy Crosswalk')
header_row(lx, ['Legacy persona ID', 'Maps to Role ID', 'Persona (26-role model)', 'Status'],
           [20, 16, 40, 52])

mapped = {}
for p in PERSONAS:
    for legacy in p['legacyPersonaIds']:
        mapped.setdefault(legacy, []).append(p)

ORPHANS = {
    'PERSONA-013': 'EBU PM — open item RBAC-OI-01, no operational counterpart',
    'PERSONA-015': 'Customer / end user — not a staff role',
    'PERSONA-016': 'Donor Operator (Ooredoo/QTEL) — external operator',
    'PERSONA-018': 'Presenter / Enterprise KB SME — not an operational role',
    'PERSONA-026': 'Rollout Team — not in the operational role table',
    'PERSONA-029': 'MOI — external system/authority, not a user',
    'PERSONA-031': 'Business Analyst (Rana) — named workshop participant',
    'PERSONA-032': 'Solution/Financial Architect (Marishi) — named workshop participant',
    'PERSONA-033': 'Retail Ops Stakeholder (Giri) — named workshop participant',
    'PERSONA-035': 'Credit Control Stakeholder (Anwar) — named workshop participant',
    'PERSONA-036': 'Security Stakeholder (Ali) — named workshop participant',
    'PERSONA-050': 'System user SADMIN — backend account, not a person',
    'PERSONA-052': 'Offshore Retailer / Channel Partner — external; no external-partner role exists',
    'PERSONA-056': 'Network Team — not in the operational role table',
    'PERSONA-057': 'Business/Strategy Team — not in the operational role table',
    'PERSONA-061': 'Product Team — not in the operational role table',
    'PERSONA-062': 'Governance roles — not operational day-to-day roles',
}

legacy_ids = sorted(set(mapped) | set(ORPHANS), key=lambda s: int(s.split('-')[1]))
for r, legacy in enumerate(legacy_ids, start=2):
    targets = mapped.get(legacy, [])
    vals = [
        legacy,
        ', '.join(t['id'] for t in targets) or '—',
        ', '.join(t['name'] for t in targets) or '—',
        'Mapped' if targets else f"Archive only — {ORPHANS.get(legacy, 'no counterpart')}",
    ]
    for i, v in enumerate(vals, start=1):
        c = lx.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.font = Font(size=10, bold=(i == 1))
        c.alignment = CENTER if i <= 2 else WRAP
        if not targets and i == 4:
            c.fill = PLANNED_FILL
# lx.freeze_panes intentionally unset — see FREEZE_PANES note
lx.auto_filter.ref = f'A1:D{len(legacy_ids) + 1}'


# ============================================== Sheet: Navigation
ns = wb.create_sheet('Navigation')
NAV_ORDER = [k for k in NAV_LABELS if '.' not in k] + [k for k in NAV_LABELS if '.' in k]
header_row(ns, ['Role ID', 'Staff ID', 'Persona', 'Approach'] + [NAV_LABELS[k] for k in NAV_ORDER],
           [9, 11, 34, 15] + [5.5] * len(NAV_ORDER), height=150)
# Row 3 records what actually decides each destination, because it is NOT
# uniform: most are plain IA (approach ordering only), Administration is the
# one feature-gated item, and the product-line pages inherit their gating from
# the journeys inside them rather than from a feature key of their own.
GOVERNED_BY = {}
for _k in NAV_ORDER:
    if _k == GATED_NAV_KEY:
        GOVERNED_BY[_k] = f'feature grant: {GATED_NAV_FEATURE}'
    elif '.' in _k:
        GOVERNED_BY[_k] = 'journey grants in this category'
    elif _k in ('mobile', 'fibre-home'):
        # Not a destination: the row is a disclosure control that only opens or
        # closes its sub-menu (Sidebar renders it as a <button>, not a link).
        # A tick means the role sees the GROUP. The line root page still exists
        # and is reached from a child's breadcrumb. In the collapsed icon rail
        # the sub-menu has no room in-rail, so hovering the icon floats the same
        # categories beside it (NavFlyout) — same list, same order, no extra
        # destinations.
        GOVERNED_BY[_k] = ('approach (group always shown); row expands only, does not navigate '
                           '(collapsed rail: hover flyout); categories gated by journey grants')
    else:
        GOVERNED_BY[_k] = 'approach ordering (IA only)'
for i in range(5, 5 + len(NAV_ORDER)):
    ns.cell(row=1, column=i).alignment = Alignment(
        text_rotation=90, horizontal='center', vertical='bottom')
# Row 2 names the key, so a tick is traceable to the manifest entry.
for i, k in enumerate(NAV_ORDER, start=5):
    c = ns.cell(row=2, column=i, value=k)
    c.fill = HEADER_FILL
    c.font = Font(color='FFFFFF', size=8)
    c.alignment = Alignment(text_rotation=90, horizontal='center', vertical='bottom')
    c.border = BORDER
    g = ns.cell(row=3, column=i, value=GOVERNED_BY[k])
    g.fill = META_FILL
    g.font = Font(size=7, color='555555')
    g.alignment = Alignment(text_rotation=90, horizontal='center', vertical='bottom')
    g.border = BORDER
for i in range(1, 5):
    for rr in (2, 3):
        ns.cell(row=rr, column=i).fill = HEADER_FILL if rr == 2 else META_FILL
        ns.cell(row=rr, column=i).border = BORDER
ns.cell(row=3, column=1, value='governed by →').font = Font(size=8, italic=True, color='555555')
ns.row_dimensions[2].height = 58
ns.row_dimensions[3].height = 120

for r, p in enumerate(PERSONAS, start=4):
    reached = nav_reach(p)
    vals = [p['id'], p['staffId'], p['name'], p['approach']]
    for i, v in enumerate(vals, start=1):
        c = ns.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.font = Font(size=10, bold=(i <= 2))
        c.alignment = WRAP if i == 3 else CENTER
        if i == 4:
            c.fill = APPROACH_FILL.get(p['approach'], META_FILL)
    for i, k in enumerate(NAV_ORDER, start=5):
        c = ns.cell(row=r, column=i)
        c.border = BORDER
        c.alignment = CENTER
        if k in reached:
            c.value = TICK
            c.fill = TICK_FILL
            c.font = Font(size=11, bold=True, color='1B5E20')
# ns.freeze_panes intentionally unset — see FREEZE_PANES note

r_nav = len(PERSONAS) + 5
ns.cell(row=r_nav, column=1, value=(
    'Which primary destinations each role sees in the sidebar. Parsed from '
    'src/engines/navigationEngine.ts (approach -> ordered subset), '
    'src/navigation/navManifest.ts (the closed set of destinations) and '
    'src/navigation/journeyCatalogue.ts (which product-line categories a role can reach) — '
    'not restated, so it cannot drift from the running app. Indented keys (mobile.*, '
    'fibre-home.*) are journey categories inside a product line; both product lines always '
    'appear in the rail even where a role reaches none of their categories.'
)).font = SUB_FONT
ns.cell(row=r_nav, column=1).alignment = WRAP
ns.merge_cells(start_row=r_nav, start_column=1, end_row=r_nav + 2, end_column=12)

# ============================================== Sheet: Legend & Method
ls = wb.create_sheet('Legend & Method')
ls.column_dimensions['A'].width = 32
ls.column_dimensions['B'].width = 112

ls['A1'] = 'VFQ DXP — Roles, Credentials & Feature Applicability'
ls['A1'].font = TITLE_FONT
ls['A2'] = ('SINGLE SOURCE OF TRUTH for the 26 operational roles. Generated from the app source — '
            'do not hand-edit.')
ls['A2'].font = SUB_FONT

r = 4


def section(title):
    global r
    ls.cell(row=r, column=1, value=title).font = Font(bold=True, size=13, color=VF_RED)
    r += 1


def kv(k, v):
    global r
    ls.cell(row=r, column=1, value=k).font = BOLD
    ls.cell(row=r, column=1).alignment = WRAP
    ls.cell(row=r, column=2, value=v).alignment = WRAP
    ls.row_dimensions[r].height = max(15, 13 * (len(v) // 100 + 1))
    r += 1


section('Sheets')
kv('Roles & Credentials', 'The role master: all 26 roles with Staff ID, password, group, business '
                          'unit, approach, channel, context card, the identity each resolves to at '
                          'login, capability list and legacy crosswalk. Start here.')
kv('Applicability Matrix', 'Feature x role grid. One column per role (row 1 "Persona: Staff ID", '
                           'row 2 approach), one row per catalogued feature. Row 2 carries the '
                           'feature-column headers and the autofilter.')
kv('Capabilities', 'Role x action-gate grid. In-surface permissions (resolve a ticket, assign a '
                   'task, edit customer records) as opposed to "can reach this screen".')
kv('Feature Inventory', 'Per feature: key, area, surface, built/planned, screen ids, how many '
                        'roles hold it, levels granted, and any documented restrictions.')
kv('Navigation', 'Which sidebar destinations each role sees, including per product-line journey '
                 'category. Parsed from the navigation source rather than restated, so it cannot '
                 'drift from the app.')
kv('Viewing', 'No sheet has frozen panes — the grids scroll freely, by request. Frozen panes are '
              'baked into the file by the generator and would follow it into every viewer and PDF '
              'export, so the choice is left to the reader (Excel: View > Freeze Panes).')
kv('Legacy Crosswalk', 'The 66-persona -> 26-role mapping, including the 17 legacy personas with '
                       'no operational counterpart.')
r += 1

section('How to read a cell')
kv(TICK, 'GRANTED. This role holds an explicit grant for this feature in '
         'public/config/personas.json. The "Levels granted" column shows which permission levels '
         'appear across roles; per-role level detail is in that file.')
kv('(blank)', 'NOT GRANTED — a decision, not a gap. Grants are exhaustive for the 26 roles, so an '
              'empty cell means this role was deliberately not given the feature. NOTE: this '
              'INVERTS the previous edition of this workbook, where a tick required an rbac.json '
              'evidence row and a blank meant "the source corpus never said". That model was '
              'retired on 2026-09-24.')
kv('Status = Planned', 'The feature is granted and navigable, but none of its screens is '
                       'registered in the app yet, so it renders as a visible placeholder. This is '
                       'deliberate: a granted-but-unbuilt feature stays visible to indicate '
                       'planned functionality rather than disappearing.')
r += 1

section('Approach')
kv('Customer-First', f"{sum(1 for p in PERSONAS if p['approach'] == 'Customer-First')} roles. "
                     'Drives customer-centric navigation, landing zone and search scope.')
kv('Product-First', f"{sum(1 for p in PERSONAS if p['approach'] == 'Product-First')} roles. "
                    'Work-item-first: the landing zone shows the role\'s own work queues '
                    '(fulfilment, dispatch, catalog administration) rather than a customer list.')
kv('Hybrid', f"{sum(1 for p in PERSONAS if p['approach'] == 'Hybrid')} roles. Both zones, with a "
             'Focus control to re-order and re-size them.')
kv('None', f"{sum(1 for p in PERSONAS if p['approach'] == 'None')} role (View Only). Read-only "
           'treatment, no approach-specific landing experience.')
r += 1

section('Credentials')
kv('Staff IDs', f"{PERSONAS[0]['staffId']}–{PERSONAS[-1]['staffId']}, one per role, all "
                'sign-in-able. Entry is normalised: "VFQ-12341", "vfq 12341" and "VFQ12341" all '
                'resolve to the same role.')
kv('Password', f'"{PASSWORD}" — one shared placeholder demo credential for every role, parsed from '
               'src/auth/staffIdRoleMap.ts when this workbook was generated. The real IDAM policy '
               'and credential source remain open items (D-02, OI-AGN-04). Not a real credential '
               'scheme; do not treat it as one.')
kv('Identity', 'Each role names its own seeded identity via identityUserId, so a Staff ID always '
               'resolves to the same agent name / job title / team. Replaced a keyword matcher '
               'that collapsed every manager role onto one identity.')
r += 1

section('Scope')
kv('Roles', f'{len(PERSONAS)}. Rows 1–25 are the VFQ operational role table as supplied; ROLE-26 '
            '(Complaints) was added to own ticket resolution, since the table has no '
            'Complaints Team successor and widening resolution to every care agent would have '
            'discarded the documented raise-vs-resolve separation (BR-067 / RBAC-132).')
kv('Features', f'{len(rows)} catalogued ({sum(1 for x in rows if x["built"])} built, '
               f'{sum(1 for x in rows if not x["built"])} planned).')
kv('Screens', f'{len(BUILT)} of {len(ROUTES)} catalogued screens are registered in the app. '
              'Features whose screens are all unregistered show as Planned rather than being '
              'omitted.')
kv('Superseded sources', 'These now-duplicate persona records should be treated as historical, not '
                         'authoritative: VFQ_DXP_Personas_Reference.xlsx "Personas" (the 66-persona '
                         'model), Test_Data_Reference.xlsx "Login Credentials" (7 old Staff '
                         'IDs with role labels that have since changed meaning), and the same '
                         'workbook\'s "Persona" and "Persona by Approach" sheets. The 66-persona '
                         'model and its RBAC evidence are archived under '
                         'reference/blueprint/legacy/.')
r += 1

section('Keeping this file the SSOT')
kv('1. Edit the source, not the file', 'Roles, grants, capabilities and credentials all live in '
                                       'public/config/personas.json and '
                                       'public/config/feature-catalogue.json.')
kv('2. Regenerate', 'python3 reference/scripts/build_persona_feature_matrix.py')
kv('3. Never hand-edit the .xlsx', 'The next regeneration overwrites it. The script is the source; '
                                   'the workbook is the artefact. (Opening it in Excel and saving '
                                   'will also silently rewrite it.)')
kv('Drift guards', 'The script aborts rather than emit a misleading workbook if: a capability is '
                   'gated in code or granted in personas.json but missing from the '
                   'PersonaCapability union; a grant references an unknown feature key or level; a '
                   'catalogue entry references a screen absent from routes.json; a Staff ID or role '
                   'id is duplicated; or a role binds an identity absent from users-agents.json.')
if UNUSED_CAPS:
    kv('Declared but unused', f"Capabilities in the type union that no role currently holds: "
                              f"{', '.join(UNUSED_CAPS)}.")
if UNGATED_CAPS:
    kv('Declared but not gated', f"Capabilities no agentPrivilegeEngine predicate reads yet: "
                                 f"{', '.join(UNGATED_CAPS)}.")

try:
    sha = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=APP_ROOT,
                         capture_output=True, text=True).stdout.strip() or 'unknown'
except Exception:
    sha = 'unknown'
r += 1
ls.cell(row=r, column=1, value='Generated from commit').font = BOLD
ls.cell(row=r, column=2, value=f'{sha}')

wb.save(OUT)

from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines

format_file(OUT)

print(f'Wrote {OUT}')
print(f'  roles: {len(PERSONAS)}  staff ids {PERSONAS[0]["staffId"]}–{PERSONAS[-1]["staffId"]}')
print(f'  features: {len(rows)} ({sum(1 for x in rows if x["built"])} built / '
      f'{sum(1 for x in rows if not x["built"])} planned)')
print(f'  {TICK} grants: {sum(len(x["granted"]) for x in rows)}')
print(f'  capabilities: {len(ALL_CAPS)} declared, {sum(len(p["capabilities"]) for p in PERSONAS)} assignments')
print(f'  legacy crosswalk: {len(legacy_ids)} rows ({len(ORPHANS)} archive-only)')
if UNUSED_CAPS:
    print(f'  note: declared but unused capabilities: {", ".join(UNUSED_CAPS)}')
if UNGATED_CAPS:
    print(f'  note: declared but not gated in code: {", ".join(UNGATED_CAPS)}')
