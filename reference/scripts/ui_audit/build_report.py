#!/usr/bin/env python3
import json, collections, os, re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
WORK = os.environ.get('UI_AUDIT_WORK') or os.path.join(os.environ.get('TMPDIR', '/tmp'), 'ui_audit')
OUT = ROOT + '/reference/outputs'
F = json.load(open(HERE + '/findings.json'))
M = json.load(open(WORK + '/metrics.json'))
INV = json.load(open(WORK + '/inventory.json'))
A11 = json.load(open(WORK + '/a11y2.json'))

DAYS = {'S': 1, 'M': 4, 'L': 12}
PHASES = {
    0: ('Phase 0 - Guardrails and dead code', 'Stop new drift before fixing old drift. Token test, literal-ban test, JSX-aware button-type check, unused-export check, CI workflow; delete dead tokens/code; decide the token JSON.',
        'CI runs lint + test + build; token and literal tests green with the allow-list; dead tokens/orphans removed.'),
    1: ('Phase 1 - P0/P1 quick wins (shared-place fixes)', 'Fix the blocking accessibility gaps and the visible 1024px defects with changes made once: focus outline, skip link/route announcer/title, reduced-motion rule, Button default type, color-scheme, summary accordion below lg, top-bar grid, login form, carousel pause, Qnomy confirm, signature ink, control border contrast (after sign-off).',
        '0 P0 findings; keyboard + forced-colours pass on the 12 audited routes; 1024px and 400% zoom checks clean.'),
    2: ('Phase 2 - New primitives and shared libraries', 'FieldShell, Popover/Combobox/Menu, Card, Banner, EmptyState/Skeleton, IconButton, Avatar, ClickableCard, lib/format.ts, statusTone.ts; migrate each family with a codemod, one PR per family.',
        'Each primitive has tests and a migration PR; duplicated families in section 7 reduced to 0 outside the primitive.'),
    3: ('Phase 3 - Token tiering and migration', 'Add --ref-* tier, alias component tokens, define dark values with light, adopt --spacing / --font-weight-* / --z-* / --duration-* / --ease-* / size tokens, lock out Tailwind defaults, generate the JSON.',
        'Token test: 0 undefined, 0 dead, full dark parity; rendered-DOM audit reports 0 off-token values.'),
    4: ('Phase 4 - Customer 360 consolidation', 'Fold GridTable into DataTable, merge Pill/KV/Stat/Avatar/icon kits into primitives, retire the legacy tab tree where personas allow, unify submit builders and helpers.',
        'One table, one pill, one key-value row, one stat tile, one icon registry; legacy tree removed or documented.'),
    5: ('Phase 5 - Content, behaviour and documentation standards', 'Decide and apply the case convention, action verbs, required marking, confirm/dirty-guard rules, toast copy; role-based type components; breadcrumb displayName; self-host font; token docs and changelog.',
        'Interaction standard published and enforced by presets/lint; docs regenerated from the token test.'),
}

sev_order = {'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3}
F.sort(key=lambda f: (sev_order[f['severity']], f['id']))
bysev = collections.Counter(f['severity'] for f in F)
byarea = collections.Counter(f['area'] for f in F)
bytier = collections.Counter(f['tier'] for f in F)
bystatus = collections.Counter(f.get('status','Open') for f in F)
total_days = sum(DAYS[f['effort']] for f in F)
remaining_days = sum(DAYS[f['effort']] for f in F if f.get('status', 'Open') != 'Resolved')
counts = (f"{len(F)} findings - P0 {bysev['P0']}, P1 {bysev['P1']}, P2 {bysev['P2']}, P3 {bysev['P3']}. "
          f"By remediation tier: A (deterministic, mechanical) {bytier['A']}, B (shared-layer change + codemod) {bytier['B']}, C (needs a human decision) {bytier['C']}. "
          f"Estimated effort {total_days} developer-days (S=1, M=4, L=12) at audit time. Status after the 2026-10-10 remediation (section 14): "
          f"{bystatus['Resolved']} resolved, {bystatus['Partial']} partial, {bystatus['Open']} open; about {remaining_days} developer-days remain (open + partial, counted in full).")

# ------------------------------------------------------------------ plan
plan = ['| Phase | Scope | Findings | Effort | Exit criteria |', '|---|---|---|---|---|']
for p in range(6):
    fs = [f for f in F if f['phase'] == p]
    d = sum(DAYS[f['effort']] for f in fs)
    mark = {'Resolved': ' ✓', 'Partial': ' ◐', 'Open': ''}
    ids = ', '.join(f['id'] + mark[f.get('status', 'Open')] for f in sorted(fs, key=lambda x: x['id']))
    name, scope, exitc = PHASES[p]
    plan.append(f"| **{name}** | {scope} | {ids} ({len(fs)}) | {d} d | {exitc} |")
plan.append('')
plan.append('✓ resolved, ◐ partially resolved, no mark = open.')
plan.append('')
plan.append('Sequencing rationale: Phase 0 first because every later fix otherwise regresses; Phase 1 next because it removes all P0s with a handful of shared edits; Phase 2 before Phase 3/4 because the primitives are what the token migration and Customer 360 consolidation land on. Phases 3 and 5 can overlap with Phase 2 once the token test is in place.')
plan.append('')
plan.append('**Do first this week (all Tier A, ≤ 1 day each):** global `:focus-visible` outline (A-01) · skip link + route announcer + `document.title` (A-03) · summary accordion below `lg` (A-04) · top-bar grid fix (L-10) · global reduced-motion rule (A-20) · `color-scheme` (T-12) · `Button` default `type` + JSX-aware guard (A-23, T-17) · login `<form>` (A-09) · SignaturePad ink (T-16) · delete orphans and dead tokens (C-15, T-10).')
PLAN = '\n'.join(plan)

# ------------------------------------------------------------------ register (markdown)
reg = ['| ID | Area | Finding | Sev | Effort | Tier | Phase | Status | Count / evidence summary |', '|---|---|---|---|---|---|---|---|---|']
for f in F:
    reg.append(f"| {f['id']} | {f['area']} | {f['title']} | {f['severity']} | {f['effort']} | {f['tier']} | {f['phase']} | {f.get('status', 'Open')} | {f['count']} |")
reg.append('')
reg.append('Full evidence (`path:line`) and recommendations for every row are in the workbook, sheet "Finding register". Tier: A = deterministic single-place fix, B = shared-layer change propagated by codemod, C = needs a human/design decision.')
REGISTER = '\n'.join(reg)

t = open(HERE + '/report_template.md').read()
t = t.replace('{{RESOLVED_N}}', str(bystatus['Resolved'])).replace('{{PARTIAL_N}}', str(bystatus['Partial'])).replace('{{OPEN_N}}', str(bystatus['Open'])).replace('{{COUNTS}}', counts).replace('{{PLAN}}', PLAN).replace('{{REGISTER}}', REGISTER)
open(OUT + '/UI_Design_System_Gap_Analysis_Reference.md', 'w').write(t)

# ------------------------------------------------------------------ workbook
wb = Workbook()
hdr_fill = PatternFill('solid', fgColor='1F2937')
hdr_font = Font(bold=True, color='FFFFFF')
thin = Side(style='thin', color='D0D5DD')
sevfill = {'P0': 'F8B4B4', 'P1': 'FCD9A8', 'P2': 'FFF3B0', 'P3': 'D6E9F8'}

def sheet(name, headers, rows, widths=None, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = name
    ws.append(headers)
    for c in ws[1]:
        c.fill = hdr_fill; c.font = hdr_font; c.alignment = Alignment(wrap_text=True, vertical='center')
    for r in rows:
        ws.append(r)
    ws.freeze_panes = 'A2'
    ws.auto_filter.ref = ws.dimensions
    for i, h in enumerate(headers, 1):
        w = (widths or {}).get(h, min(60, max(12, len(str(h)) + 4)))
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical='top')
    return ws

# Summary
ws = wb.active
ws.title = 'Summary'
rows = [
    ['UI Design-System Gap Analysis - VFQ DXP', ''],
    ['Audit date', '2026-10-10'],
    ['Mode', 'Report only - no source changed'],
    ['Report', 'UI_Design_System_Gap_Analysis_Reference.md'],
    ['', ''],
    ['Findings', len(F)], ['Resolved / Partial / Open', f"{bystatus['Resolved']} / {bystatus['Partial']} / {bystatus['Open']}"], ['P0', bysev['P0']], ['P1', bysev['P1']], ['P2', bysev['P2']], ['P3', bysev['P3']],
    ['Tier A / B / C', f"{bytier['A']} / {bytier['B']} / {bytier['C']}"],
    ['Estimated effort (dev-days)', total_days],
    ['', ''],
    ['Files scanned', M['scan_meta']['files_scanned']], ['.tsx files', M['inventory']['tsx_files']],
    ['Tokens defined (at audit; 280 after derived-colour fix)', 246], ['Dead tokens', 57], ['Colour tokens without dark override', 51],
    ['Hard-coded colour literals (src, excl. tokens.css)', M['hardcoded']['totals'].get('hex_colour', 0) + M['hardcoded']['totals'].get('rgb_hsl_colour', 0) + M['hardcoded']['totals'].get('svg_paint_literal', 0)],
    ['Tailwind spacing utilities (0 via --space-*)', M['hardcoded']['totals'].get('tw_spacing_scale')],
    ['Font-weight utilities (0 via --fw-*)', M['hardcoded']['totals'].get('tw_font_weight_utility')],
    ['z-index literals', M['hardcoded']['totals'].get('tw_zindex')],
    ['Raw <button> outside primitives', 131], ['Button adoption', '64%'],
]
for r in rows:
    ws.append(r)
ws['A1'].font = Font(bold=True, size=14)
ws.column_dimensions['A'].width = 52; ws.column_dimensions['B'].width = 60

# Finding register
rows = []
for f in F:
    rows.append([f['id'], f['area'], f['title'], f['severity'], f['effort'], f['tier'], f['phase'], f.get('status', 'Open'), f.get('resolution', ''), f['count'], f['evidence'], f['recommendation']])
w = sheet('Finding register', ['ID', 'Area', 'Finding', 'Severity', 'Effort', 'Tier', 'Phase', 'Status', 'Resolution (2026-10-10)', 'Count', 'Evidence (path:line)', 'Recommendation'], rows,
          {'ID': 8, 'Area': 14, 'Finding': 48, 'Severity': 9, 'Effort': 8, 'Tier': 6, 'Phase': 7, 'Status': 10, 'Resolution (2026-10-10)': 70, 'Count': 34, 'Evidence (path:line)': 90, 'Recommendation': 60})
for row in w.iter_rows(min_row=2):
    row[3].fill = PatternFill('solid', fgColor=sevfill[row[3].value])
    row[7].fill = PatternFill('solid', fgColor={'Resolved': 'C8E6C9', 'Partial': 'FFF3B0', 'Open': 'FFFFFF'}[row[7].value])

# Remediation plan
rows = []
for p in range(6):
    name, scope, exitc = PHASES[p]
    for f in sorted([x for x in F if x['phase'] == p], key=lambda x: (sev_order[x['severity']], x['id'])):
        rows.append([name, f['id'], f['title'], f['severity'], f['effort'], DAYS[f['effort']], f['tier'], f['recommendation'], exitc])
sheet('Remediation plan', ['Phase', 'ID', 'Finding', 'Severity', 'Effort', 'Dev-days', 'Tier', 'Action', 'Phase exit criteria'], rows,
      {'Phase': 36, 'ID': 8, 'Finding': 48, 'Severity': 9, 'Effort': 8, 'Dev-days': 9, 'Tier': 6, 'Action': 70, 'Phase exit criteria': 60})

# Component inventory
rows = [[r['file'], r['layer'], r['lines'], r['exports'], r['inbound_files_by_import_path'], r['external_name_refs'], r['raw_button'], r['raw_input_select_textarea'], r['raw_table'], r['uses_Button'], r['uses_Input_Select'], r['var_tokens']] for r in INV]
sheet('Component inventory', ['File', 'Layer', 'Lines', 'Exports', 'Importing files', 'External name refs', 'Raw <button>', 'Raw input/select/textarea', 'Raw <table>', '<Button> uses', '<Input|Select|Textarea> uses', 'var(--) refs'], rows,
      {'File': 70, 'Layer': 22, 'Exports': 60})

# Primitive adoption
adopt = [
    ['Button', 236, '131 raw <button>', '64%'], ['Input', 91, '12 raw <input> (5 file inputs)', '93%'], ['Select', 62, '7 native <select> + FilterSelect (25 uses)', '90%'],
    ['Textarea', 22, '0', '100%'], ['DataTable', 37, 'GridTable 21 (+20 via Telesales) + 8 raw <table>', '56%'], ['Badge', 101, '~17 hand-rolled pills + 2 Pill kits', '~84%'],
    ['Modal', 5, '0 custom dialogs', '100%'], ['Drawer', 33, '0 custom dialogs', '100%'], ['Tabs/SegmentedTabs', 14, '1 hand-rolled tablist, 3 pass-through aliases', '~95%'],
    ['Icon', 186, '11 inline <svg>; 109 path constants', '94%'], ['Spinner', 4, 'hand-rolled animate-spin; text-only loading', 'low'],
]
sheet('Primitive adoption', ['Primitive', 'Uses outside primitives', 'Bypassed by', 'Adoption'], adopt, {'Bypassed by': 60})

# Token compliance
T = M['hardcoded']['totals']
comp = [
    ['Colour (rendered DOM, 12 routes)', 'all but alpha/tint derivations', 'white-alpha text/overlays; color-mix tints', '~98%'],
    ['Type size', 1159, '3 off-ramp (text-base, text-[0.5rem], clamp)', '99.7%'],
    ['Radius', 401, f"{T.get('tw_default_radius')} default rounded-*", '87%'],
    ['Shadow / elevation', '23 tokenised + 52 focus-ring + 18 shadow-raised', f"{T.get('tw_default_shadow')} default", '~95%'],
    ['Spacing', '0 by reference (scale-aligned)', f"{T.get('tw_spacing_scale')} numeric utilities; {T.get('tw_arbitrary_length')} arbitrary lengths", '0% by reference'],
    ['Font weight', 0, f"{T.get('tw_font_weight_utility')} utilities", '0%'],
    ['z-index', 0, f"{T.get('tw_zindex')} literals", '0%'],
    ['Motion', 2, f"{T.get('tw_duration')} duration-* + ~2 easing literals", '~15%'],
    ['Raw white/black', '', f"{T.get('tw_white_black')} utilities", ''],
    ['Hex literals (src)', '', f"{T.get('hex_colour')} (+{T.get('hex_colour_art')} brand art)", ''],
    ['rgba/hsl literals', '', T.get('rgb_hsl_colour'), ''],
    ['SVG paint literals', '', f"{T.get('svg_paint_literal')} (+{T.get('svg_paint_literal_art')} brand art)", ''],
]
sheet('Token compliance', ['Category', 'Tokenised', 'Not tokenised', 'Compliance'], comp, {'Category': 36, 'Tokenised': 42, 'Not tokenised': 60})

# Hardcoded by file
cats = ['hex_colour', 'rgb_hsl_colour', 'svg_paint_literal', 'tw_arbitrary_length', 'tw_white_black', 'tw_default_radius', 'tw_default_shadow', 'tw_zindex', 'tw_duration', 'tw_font_weight_utility', 'tw_spacing_scale', 'css_literal_length', 'inline_style_literal', 'tw_default_text_size']
rows = [[p['file'], p['total']] + [p.get(c, 0) for c in cats] for p in M['per_file_all']]
sheet('Hardcoded by file', ['File', 'Total'] + cats, rows, {'File': 70})

# Dead tokens and duplicate values
sheet('Dead tokens', ['Token'], [[t] for t in M['tokens']['unused']], {'Token': 40})
rows = [[v, ', '.join(ns), len(ns)] for v, ns in M['tokens']['duplicate_values'].items()]
sheet('Duplicate token values', ['Value', 'Tokens holding it', 'Count'], rows, {'Value': 16, 'Tokens holding it': 100})
sheet('Colour tokens no dark', ['Token'], [[t] for t in M['tokens']['dark_missing_sample']], {'Token': 40})

# Contrast (light)
rows = [[r[0], r[1], r[2], r[3]] for r in M['contrast']['light']]
sheet('Contrast (light, computed)', ['Foreground token', 'Background token', 'Ratio', 'Result (>=4.5 text)'], rows, {'Foreground token': 24, 'Background token': 24})

# a11y evidence
rows = []
for k, v in A11['items'].items():
    for x in v:
        rows.append([k, x])
sheet('A11y evidence (JSX scan)', ['Check', 'Location'], rows, {'Check': 44, 'Location': 70})

# Duplicate families
D = M['duplicates']
rows = []
for k, v in D.items():
    if isinstance(v, dict):
        for n, ps in v.items():
            rows.append([k, n, '; '.join(ps)])
    else:
        rows.append([k, '', '; '.join(v)])
sheet('Duplicate families (scan)', ['Family', 'Name', 'Defined in'], rows, {'Family': 34, 'Name': 28, 'Defined in': 100})

# Repeated class strings
rows = [[r['occurrences'], r['files'], r['classes']] for r in M['repeated_class_strings']]
sheet('Repeated class strings', ['Occurrences', 'Files', 'Class string (sorted)'], rows, {'Class string (sorted)': 110})

wb.save(OUT + '/UI_Design_System_Gap_Analysis_Reference.xlsx')
print('written', len(F), 'findings;', total_days, 'dev-days;', dict(bysev))
