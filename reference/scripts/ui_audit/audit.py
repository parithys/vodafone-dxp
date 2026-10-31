#!/usr/bin/env python3
"""Static UI audit for vfq-dxp-app. Read-only. Writes metrics.json to $UI_AUDIT_WORK (default $TMPDIR/ui_audit)."""
import re, os, json, glob, collections, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
SRC = ROOT + '/src'
WORK = os.environ.get('UI_AUDIT_WORK') or os.path.join(os.environ.get('TMPDIR', '/tmp'), 'ui_audit')
os.makedirs(WORK, exist_ok=True)
OUT = WORK

def read(p):
    try:
        return open(p, encoding='utf-8').read()
    except Exception:
        return ''

files = [p for p in glob.glob(SRC + '/**/*', recursive=True) if os.path.isfile(p) and p.endswith(('.tsx', '.ts', '.css'))]
tsx = [p for p in files if p.endswith('.tsx')]
code = [p for p in files if p.endswith(('.tsx', '.ts'))]
rel = lambda p: os.path.relpath(p, ROOT)
txt = {p: read(p) for p in files}

def layer(p):
    r = os.path.relpath(p, SRC)
    parts = r.split(os.sep)
    if parts[0] == 'components' and len(parts) > 1:
        return 'components/' + parts[1]
    return parts[0]

M = {}

# ---------------------------------------------------------------- tokens
tok_css = txt[SRC + '/tokens.css']
blocks = re.split(r'(?=^\s*:root(?:\.dark)?\s*\{)', tok_css, flags=re.M)
light, dark = {}, {}
for b in blocks:
    m = re.match(r'^\s*(:root(?:\.dark)?)\s*\{', b)
    if not m:
        continue
    target = dark if m.group(1).endswith('.dark') else light
    for name, val in re.findall(r'^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);', b, flags=re.M):
        target[name] = val.strip()
# other css files that define tokens
for extra in ['/index.css', '/components/primitives/tooltip-tokens.css']:
    t = txt.get(SRC + extra, '')
    for blk in re.finditer(r'(:root(?:\.dark)?)\s*\{([^}]*)\}', t):
        tgt = dark if blk.group(1).endswith('.dark') else light
        for name, val in re.findall(r'(--[a-z0-9-]+)\s*:\s*([^;]+);', blk.group(2)):
            tgt.setdefault(name, val.strip())
all_tokens = dict(light)
for k, v in dark.items():
    all_tokens.setdefault(k, v)

def group_of(name):
    n = name[2:]
    for pre in ['fs-', 'font', 'lh-', 'fw-', 'space', 'radius', 'elev', 'shadow', 'size', 'z-', 'dur', 'ease', 'field-', 'icon', 'tooltip', 'accent', 'brand', 'danger', 'success', 'warn', 'info', 'bg', 'surface', 'fg', 'muted', 'border', 'link', 'focus', 'btn', 'grad']:
        if n.startswith(pre):
            return pre.rstrip('-')
    return 'other'

grp = collections.Counter(group_of(n) for n in all_tokens)
# usage counts
usage = collections.Counter()
var_ref_re = re.compile(r'var\((--[a-z0-9-]+)')
tw_theme = txt[SRC + '/index.css']
for p, t in txt.items():
    for n in var_ref_re.findall(t):
        usage[n] += 1
# tokens consumed via Tailwind @theme mapping: --color-x -> var(--x) - count utility class use
theme_map = dict(re.findall(r'(--(?:color|radius|shadow|font)-[a-z0-9-]+)\s*:\s*var\((--[a-z0-9-]+)\)', tw_theme))
util_use = collections.Counter()
class_blob = '\n'.join(t for p, t in txt.items() if p.endswith('.tsx'))
for tname, base in theme_map.items():
    short = tname[2:].split('-', 1)[1]
    kind = tname.split('-')[2 - 1 + 0] if False else tname[2:].split('-')[0]
    pref = {'color': r'(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide|decoration|placeholder|accent|caret)', 'radius': 'rounded', 'shadow': 'shadow', 'font': 'font'}[kind]
    c = len(re.findall(r'(?<![\w-])' + pref + r'(?:-[a-z]+)?-' + re.escape(short) + r'(?![\w-])', class_blob))
    util_use[base] += c
defined_names = set(all_tokens)
used_direct = {n for n in usage if n in defined_names}
used_via_theme = {n for n, c in util_use.items() if c > 0}
unused = sorted(n for n in defined_names if n not in used_direct and n not in used_via_theme and usage[n] == 0)
# referenced but undefined (exclude tailwind generated --tw-*, --color-*, --radius-*, --shadow-* from @theme)
theme_names = set(theme_map)
undefined = collections.Counter()
for p, t in txt.items():
    for n in var_ref_re.findall(t):
        if n not in defined_names and n not in theme_names and not n.startswith('--tw-') and not n.startswith('--spacing') and not n.startswith('--text-') and not n.startswith('--font-') and not n.startswith('--default-'):
            undefined[n] += 1
# duplicate values
byval = collections.defaultdict(list)
for n, v in light.items():
    byval[re.sub(r'\s+', ' ', v.lower())].append(n)
dupvals = {v: ns for v, ns in byval.items() if len(ns) > 1 and (v.startswith('#') or v.endswith('px') or v.endswith('rem'))}
# dark coverage: colour tokens in light not overridden in dark
colour_light = [n for n, v in light.items() if re.search(r'#[0-9a-f]{3,8}\b|rgb|hsl|color-mix', v, re.I)]
dark_missing = [n for n in colour_light if n not in dark]
# design-tokens.json sync
dt = json.loads(read(ROOT + '/public/config/design-tokens.json') or '{}')
def flatten(d, pre=''):
    out = {}
    for k, v in d.items():
        if isinstance(v, dict):
            out.update(flatten(v, pre + k + '.'))
        else:
            out[pre + k] = v
    return out
dtflat = flatten(dt)
M['tokens'] = {
    'light_count': len(light), 'dark_count': len(dark), 'total_defined': len(all_tokens),
    'by_group': dict(grp.most_common()),
    'used_directly': len(used_direct), 'unused_count': len(unused), 'unused': unused,
    'undefined_refs': dict(undefined.most_common(40)),
    'duplicate_values': {k: v for k, v in list(dupvals.items())[:40]},
    'colour_tokens_without_dark_override': len(dark_missing), 'colour_tokens_total': len(colour_light),
    'dark_missing_sample': dark_missing[:60],
    'design_tokens_json_keys': len(dtflat),
    'top_used': usage.most_common(25),
}

# ---------------------------------------------------------------- hardcoded values
def strip_comments(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    t = re.sub(r'(?m)^\s*//.*$', '', t)
    t = re.sub(r'(?<=[;{,\s])//[^\n]*', '', t) if False else t
    return t

hard = collections.defaultdict(lambda: collections.Counter())
per_file = collections.defaultdict(collections.Counter)
examples = collections.defaultdict(list)
HEX = re.compile(r'(?<![\w&/#-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])')
RGB = re.compile(r'\b(?:rgba?|hsla?|oklch|oklab)\([^)]*\)')
ARB_PX = re.compile(r'\b(?:text|w|h|min-w|min-h|max-w|max-h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|top|left|right|bottom|inset|size|leading|tracking|rounded|space-x|space-y|basis|grid-cols)-\[(?!var\(|length:var|calc\(var)[^\]]*?(?:px|rem|em|vh|vw|%)[^\]]*\]')
ARB_COLOR = re.compile(r'\b(?:bg|text|border|ring|fill|stroke|from|to|via|shadow|outline|divide|decoration)-\[(?:#|rgb|hsl|color:#)[^\]]*\]')
ARB_SHADOW = re.compile(r'\bshadow-\[(?!var\()[^\]]*\]')
TW_PALETTE = re.compile(r'\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide|decoration|placeholder|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b')
TW_BWC = re.compile(r'\b(?:bg|text|border)-(?:white|black)\b(?!/)')
TW_TEXT_SIZE = re.compile(r'(?<![\w-])text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b')
TW_FW = re.compile(r'(?<![\w-])font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b')
TW_RADIUS = re.compile(r'(?<![\w-])rounded(?:-(?:t|b|l|r|tl|tr|bl|br))?-(?:none|sm|md|lg|xl|2xl|3xl|full)\b')
TW_SHADOW = re.compile(r'(?<![\w-])shadow-(?:xs|sm|md|lg|xl|2xl|inner|none)\b')
TW_SPACING = re.compile(r'(?<![\w-])(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(?:\d+(?:\.\d+)?)\b')
TW_DUR = re.compile(r'(?<![\w-])(?:duration|delay)-\d+\b')
TW_Z = re.compile(r'(?<![\w-])z-(?:\d+|\[[^\]]+\])\b')
INLINE_STYLE = re.compile(r'style=\{\{([^}]*)\}\}')
INLINE_LIT = re.compile(r'(?:color|background(?:Color)?|borderColor|fill|stroke|boxShadow|fontSize|fontWeight|padding\w*|margin\w*|width|height|minHeight|minWidth|maxWidth|maxHeight|gap|top|left|right|bottom|borderRadius|zIndex|lineHeight|letterSpacing)\s*:\s*(?:\'[^\']*\'|"[^"]*"|`[^`]*`|-?\d[\d.]*)')
SVG_PAINT = re.compile(r'\b(?:fill|stroke|stopColor|floodColor)=["\'](#[0-9a-fA-F]{3,8}|rgb[^"\']*|[a-z]+)["\']')

def add(cat, p, m):
    hard[cat][rel(p)] += 1
    per_file[rel(p)][cat] += 1
    if len(examples[cat]) < 12:
        examples[cat].append((rel(p), m[:90]))

SKIP_FILES = {SRC + '/tokens.css'}
# Files that legitimately carry brand artwork / synthetic specimens (still counted, but flagged separately)
ART = re.compile(r'(Vodafone(Mark|Wordmark)|OoredooMark|CountryMarker|PanelIcon|specimen|Specimen|synthetic|idScanSamples|Scanner)', re.I)
for p in files:
    if p in SKIP_FILES:
        continue
    t = strip_comments(txt[p])
    is_css = p.endswith('.css')
    art = bool(ART.search(rel(p)))
    suffix = '_art' if art else ''
    for m in HEX.findall(t):
        add('hex_colour' + suffix, p, m)
    for m in RGB.findall(t):
        if is_css and 'var(' in m and 'color-mix' not in m:
            pass
        add('rgb_hsl_colour' + suffix, p, m)
    if is_css:
        # raw px/rem values in css declarations outside tokens
        for m in re.findall(r'(?:padding|margin|gap|width|height|font-size|border-radius|top|left|right|bottom|min-\w+|max-\w+|line-height|letter-spacing)\s*:\s*[^;{}]*?\b\d+(?:\.\d+)?(?:px|rem|em)\b[^;{}]*;', t):
            if 'var(' not in m:
                add('css_literal_length', p, m)
        continue
    for m in ARB_PX.findall(t):
        add('tw_arbitrary_length', p, m)
    for m in ARB_COLOR.findall(t):
        add('tw_arbitrary_colour', p, m)
    for m in ARB_SHADOW.findall(t):
        add('tw_arbitrary_shadow', p, m)
    for m in TW_PALETTE.findall(t):
        add('tw_default_palette', p, m)
    for m in TW_BWC.findall(t):
        add('tw_white_black', p, m)
    for m in TW_TEXT_SIZE.findall(t):
        add('tw_default_text_size', p, m)
    for m in TW_FW.findall(t):
        add('tw_font_weight_utility', p, m)
    for m in TW_RADIUS.findall(t):
        add('tw_default_radius', p, m)
    for m in TW_SHADOW.findall(t):
        add('tw_default_shadow', p, m)
    for m in TW_SPACING.findall(t):
        add('tw_spacing_scale', p, m)
    for m in TW_DUR.findall(t):
        add('tw_duration', p, m)
    for m in TW_Z.findall(t):
        add('tw_zindex', p, m)
    for sty in INLINE_STYLE.findall(t):
        for m in INLINE_LIT.findall(sty):
            add('inline_style_literal', p, m)
    for m in SVG_PAINT.findall(t):
        if m not in ('none', 'currentColor', 'currentcolor', 'transparent', 'white', 'black') :
            add('svg_paint_literal' + suffix, p, m)

M['hardcoded'] = {
    'totals': {k: sum(v.values()) for k, v in sorted(hard.items(), key=lambda kv: -sum(kv[1].values()))},
    'files_affected': {k: len(v) for k, v in hard.items()},
    'examples': {k: v for k, v in examples.items()},
    'top_files_overall': sorted(((f, sum(c.values()), dict(c.most_common(4))) for f, c in per_file.items()), key=lambda x: -x[1])[:40],
}
# per layer rollup
lay = collections.defaultdict(collections.Counter)
for f, c in per_file.items():
    l = layer(ROOT + '/' + f)
    for k, v in c.items():
        lay[l][k] += v
M['hardcoded']['by_layer'] = {l: dict(c.most_common()) for l, c in lay.items()}

# ---------------------------------------------------------------- token-compliant usage (denominators)
tok_use = {
    'var_refs_in_tsx': sum(len(var_ref_re.findall(txt[p])) for p in tsx),
    'tw_var_arbitrary': len(re.findall(r'\[(?:length:|color:)?var\(--', class_blob)),
    'tw_theme_colour_utils': sum(util_use.values()),
}
M['token_usage'] = tok_use

# ---------------------------------------------------------------- component inventory / orphans
comp_files = [p for p in tsx if '/components/' in p or '/capabilities/' in p or '/navigation/' in p or '/modules/' in p or '/workspace/' in p or '/auth/' in p]
exp_re = re.compile(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)')
exp2_re = re.compile(r'export\s*\{([^}]*)\}')
defs = {}
for p in tsx:
    t = txt[p]
    names = set(exp_re.findall(t))
    for blk in exp2_re.findall(t):
        for n in blk.split(','):
            n = n.strip().split(' as ')[-1].strip()
            if n and n[0].isupper():
                names.add(n)
    for n in names:
        defs.setdefault(n, []).append(p)
all_text = {p: txt[p] for p in code}
ref_count = collections.Counter()
ident = re.compile(r'\b[A-Z][A-Za-z0-9_]*\b')
file_idents = {p: collections.Counter(ident.findall(t)) for p, t in all_text.items()}
orph = []
single = []
for n, ps in defs.items():
    external = 0
    for q, c in file_idents.items():
        if q in ps:
            continue
        external += c.get(n, 0)
    # also lazy routes etc. use strings; count 'screens' registrations by name in same file occurrences > 1
    internal = sum(file_idents[q].get(n, 0) for q in ps)
    ref_count[n] = external
    if external == 0:
        orph.append((n, [rel(x) for x in ps], internal))
    elif external == 1:
        single.append(n)
# filter orphans: components whose only references are inside the defining file; flag those in components/ & capabilities/ separately
orph_components = [o for o in orph if any(('/components/' in ROOT + '/' + f or '/capabilities/' in ROOT + '/' + f) for f in o[1])]
M['inventory'] = {
    'tsx_files': len(tsx), 'ts_files': len([p for p in files if p.endswith('.ts')]), 'css_files': len([p for p in files if p.endswith('.css')]),
    'by_layer_files': dict(collections.Counter(layer(p) for p in tsx).most_common()),
    'by_layer_lines': {l: sum(txt[p].count('\n') for p in tsx if layer(p) == l) for l in set(layer(p) for p in tsx)},
    'exported_components': len(defs),
    'orphan_exports_total': len(orph),
    'orphan_exports_in_components_or_capabilities': [(n, f, i) for n, f, i in orph_components],
    'orphan_exports_elsewhere': [(n, f) for n, f, i in orph if (n, f, i) not in orph_components][:80],
    'single_use_components_in_shared_layers': [n for n in single if any(('/components/' in p or '/capabilities/' in p) for p in defs[n])][:80],
}

# primitives usage ranking
prim_dir = SRC + '/components/primitives/'
prims = {}
for p in tsx:
    if p.startswith(prim_dir):
        for n in exp_re.findall(txt[p]):
            prims[n] = prims.get(n, 0)
prim_use = {}
for n in prims:
    prim_use[n] = sum(c.get(n, 0) for q, c in file_idents.items() if not q.startswith(prim_dir + n))
M['inventory']['primitive_usage'] = dict(sorted(prim_use.items(), key=lambda kv: -kv[1]))

# ---------------------------------------------------------------- raw elements vs primitives by layer
def count(pat, p):
    return len(re.findall(pat, txt[p]))
raw = collections.defaultdict(collections.Counter)
rawfiles = collections.defaultdict(collections.Counter)
for p in tsx:
    l = layer(p)
    in_prim = p.startswith(prim_dir)
    t = strip_comments(txt[p])
    for el, pat in [('raw_button', r'<button\b'), ('Button', r'<Button\b'), ('raw_input', r'<input\b'), ('Input', r'<Input\b'), ('raw_select', r'<select\b'), ('Select', r'<Select\b'), ('raw_textarea', r'<textarea\b'), ('Textarea', r'<Textarea\b'),
                    ('raw_table', r'<table\b'), ('DataTable', r'<DataTable\b'), ('raw_dialog_role', r'role=["\']dialog["\']'), ('Modal', r'<Modal\b'), ('Drawer', r'<Drawer\b'), ('Badge', r'<Badge\b'),
                    ('raw_anchor', r'<a\b'), ('Link', r'<Link\b|<NavLink\b'), ('raw_img', r'<img\b'), ('raw_svg', r'<svg\b'), ('Icon', r'<Icon\b'), ('Spinner', r'<Spinner\b'), ('Tabs', r'<(?:Tabs|SegmentedTabs)\b'),
                    ('role_tab', r'role=["\']tab["\']'), ('Checkbox', r'<Checkbox\b'), ('Radio', r'<Radio\b')]:
        c = len(re.findall(pat, t))
        if c and not in_prim:
            raw[l][el] += c
            if el.startswith('raw_'):
                rawfiles[el][rel(p)] += c
M['elements_by_layer'] = {l: dict(c) for l, c in raw.items()}
M['raw_element_top_files'] = {k: v.most_common(12) for k, v in rawfiles.items()}

# raw <button> with accent styling (hand-rolled primary buttons)
handrolled = []
for p in tsx:
    if p.startswith(prim_dir):
        continue
    t = txt[p]
    for m in re.finditer(r'<button\b[^>]*className=(?:"([^"]*)"|\{`([^`]*)`\})', t):
        cls = m.group(1) or m.group(2) or ''
        if re.search(r'bg-accent|bg-\[var\(--accent|--grad-primary|bg-\[image', cls):
            handrolled.append((rel(p), cls[:100]))
M['handrolled_accent_buttons'] = {'count': len(handrolled), 'files': collections.Counter(f for f, c in handrolled).most_common(15)}

# ---------------------------------------------------------------- repeated class sequences (extraction candidates)
cls_re = re.compile(r'className=(?:"([^"]+)"|\{`([^`$]+)`\})')
seq_counter = collections.Counter()
seq_files = collections.defaultdict(set)
for p in tsx:
    for m in cls_re.finditer(txt[p]):
        c = m.group(1) or m.group(2)
        toks = [x for x in c.split() if x]
        if len(toks) >= 4:
            key = ' '.join(sorted(toks))
            seq_counter[key] += 1
            seq_files[key].add(rel(p))
top_seq = [(k, n, len(seq_files[k])) for k, n in seq_counter.most_common(60) if n >= 4]
M['repeated_class_strings'] = [{'classes': k[:200], 'occurrences': n, 'files': f} for k, n, f in top_seq[:30]]
# card pattern
card_pat = collections.Counter()
for p in tsx:
    for m in cls_re.finditer(txt[p]):
        c = m.group(1) or m.group(2)
        if 'border' in c and re.search(r'rounded-\[var\(--radius-card', c) and 'bg-' in c:
            padm = re.search(r'\bp-(\d+|\[[^\]]+\])', c)
            card_pat[padm.group(0) if padm else 'no-p'] += 1
M['card_pattern_padding_variants'] = dict(card_pat.most_common())

# ---------------------------------------------------------------- accessibility (static)
a11y = collections.Counter()
a11y_ex = collections.defaultdict(list)
def a11y_add(cat, p, snippet):
    a11y[cat] += 1
    if len(a11y_ex[cat]) < 15:
        a11y_ex[cat].append((rel(p), snippet[:110].replace('\n', ' ')))
for p in tsx:
    t = strip_comments(txt[p])
    # img without alt
    for m in re.finditer(r'<img\b[^>]*>', t):
        if 'alt=' not in m.group(0):
            a11y_add('img_without_alt', p, m.group(0))
    # button without type
    for m in re.finditer(r'<button\b([^>]*)>', t):
        if 'type=' not in m.group(1) and '{...' not in m.group(1):
            a11y_add('button_without_type', p, m.group(0))
    # icon-only button candidates: <button ...> <Icon .../> </button> with no aria-label/title
    for m in re.finditer(r'<button\b([^>]*)>\s*(<(?:Icon|svg)\b[^>]*/?>(?:.*?</svg>)?)\s*</button>', t, flags=re.S):
        if 'aria-label' not in m.group(1) and 'title=' not in m.group(1) and 'aria-labelledby' not in m.group(1):
            a11y_add('icon_only_button_no_name', p, m.group(0)[:100])
    # clickable div/span without role/keyboard
    for m in re.finditer(r'<(div|span|li|td|tr|p|section)\b([^>]*\bonClick=[^>]*)>', t):
        attrs = m.group(2)
        if 'role=' not in attrs:
            a11y_add('onClick_on_non_interactive_no_role', p, m.group(0))
        elif 'onKeyDown' not in attrs and 'onKeyUp' not in attrs and 'tabIndex' not in attrs:
            a11y_add('onClick_with_role_but_no_keyboard', p, m.group(0))
    # outline removed
    for m in re.finditer(r'(?<![\w-])(?:focus:)?outline-(?:none|0)\b', t):
        a11y_add('outline_removed', p, m.group(0))
    # inputs: no label association heuristics (raw input w/o id, aria-label, aria-labelledby)
    for m in re.finditer(r'<input\b([^>]*?)/?>', t, flags=re.S):
        a = m.group(1)
        if 'type="hidden"' in a or 'sr-only' in a and 'aria-label' in a:
            continue
        if not re.search(r'aria-label|aria-labelledby|\bid=', a) and '{...' not in a:
            a11y_add('raw_input_no_name', p, m.group(0))
    for m in re.finditer(r'<select\b([^>]*)>', t):
        if not re.search(r'aria-label|aria-labelledby|\bid=', m.group(1)) and '{...' not in m.group(1):
            a11y_add('raw_select_no_name', p, m.group(0))
    # positive tabIndex
    for m in re.finditer(r'tabIndex=\{?["\']?([1-9]\d*)', t):
        a11y_add('positive_tabindex', p, m.group(0))
    # target blank without rel
    for m in re.finditer(r'<a\b[^>]*target="_blank"[^>]*>', t):
        if 'rel=' not in m.group(0):
            a11y_add('target_blank_no_rel', p, m.group(0))
    # autoFocus
    for m in re.finditer(r'\bautoFocus\b', t):
        a11y_add('autofocus_usage', p, 'autoFocus')
    # table without th scope/caption
    for m in re.finditer(r'<table\b', t):
        a11y_add('raw_table_instances', p, '<table')
    # color-only status: very rough - skip
a11y['aria_label_total'] = sum(len(re.findall(r'aria-label', txt[p])) for p in tsx)
a11y['role_attr_total'] = sum(len(re.findall(r'\brole=', txt[p])) for p in tsx)
a11y['aria_live_total'] = sum(len(re.findall(r'aria-live|role="status"|role="alert"', txt[p])) for p in tsx)
a11y['focus_visible_usages'] = sum(len(re.findall(r'focus-visible|focus-within|--focus-ring', txt[p])) for p in tsx)
a11y['sr_only_usages'] = sum(len(re.findall(r'sr-only', txt[p])) for p in tsx)
a11y['prefers_reduced_motion_refs'] = sum(len(re.findall(r'prefers-reduced-motion|motion-safe|motion-reduce', txt[p])) for p in files)
a11y['skip_link_refs'] = sum(len(re.findall(r'[Ss]kip to|skip-link', txt[p])) for p in tsx)
a11y['html_lang'] = 'lang=' in read(ROOT + '/index.html')
M['a11y'] = {'counts': dict(a11y), 'examples': dict(a11y_ex)}

# ---------------------------------------------------------------- contrast on token pairs
def parse_colour(v, env):
    v = v.strip()
    m = re.match(r'^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', v)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = ''.join(c * 2 for c in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    m = re.match(r'^var\((--[a-z0-9-]+)\)$', v)
    if m and m.group(1) in env:
        return parse_colour(env[m.group(1)], env)
    return None
def lum(c):
    def f(x):
        x /= 255
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
fg_tokens = ['--fg', '--fg-2', '--muted', '--muted-2', '--accent', '--link', '--danger', '--success', '--warn', '--info']
bg_tokens = ['--bg', '--surface', '--page-bg', '--surface-subtle', '--surface-warm']
res = {}
for mode, env in [('light', light), ('dark', {**light, **dark})]:
    rows = []
    for f in fg_tokens:
        fc = parse_colour(env.get(f, ''), env)
        for b in bg_tokens:
            bc = parse_colour(env.get(b, ''), env)
            if fc and bc:
                r = ratio(fc, bc)
                rows.append((f, b, round(r, 2), 'PASS' if r >= 4.5 else ('LARGE-ONLY' if r >= 3 else 'FAIL')))
    res[mode] = rows
M['contrast'] = res

# ---------------------------------------------------------------- duplicated helpers / naming
def find_funcs(pat):
    out = []
    for p in code:
        for m in re.finditer(pat, txt[p]):
            out.append(rel(p) + ':' + str(txt[p][:m.start()].count('\n') + 1))
    return out
M['duplicates'] = {
    'qar_formatters': find_funcs(r'(?:function|const)\s+(?:formatQar|formatQAR|fmtQar|fmtQAR|qar|formatCurrency|formatMoney|money|fmtMoney|formatPrice)\b'),
    'date_formatters': find_funcs(r'(?:function|const)\s+(?:formatDate|fmtDate|formatDateTime|fmtDateTime|formatShortDate|dateLabel|toDisplayDate)\b'),
    'pill_badge_chip_tag_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'(Pill|Badge|Chip|Tag|Status)$', n) or re.match(r'^(Pill|Badge|Chip|Tag|Status)', n)},
    'search_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Search(Box|Field|Input|Bar)', n)},
    'tab_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Tabs?$|TabBar|TabList|UnderlineTabs|SegmentedTabs', n)},
    'modal_drawer_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'(Modal|Drawer|Dialog|Sheet|Popover|SideDrawer)$', n)},
    'table_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'(Table|Grid|DataGrid|List)$', n) and 'Page' not in n},
    'pager_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Pager|Pagination', n)},
    'empty_state_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Empty|NoData|NoResults', n)},
    'card_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Card$|Tile$|Panel$', n)},
    'button_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Button$|Btn$', n)},
    'toast_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Toast', n)},
    'spinner_loading_components': {n: [rel(x) for x in ps] for n, ps in defs.items() if re.search(r'Spinner|Skeleton|Loading|Loader', n)},
}
# status colour maps
M['duplicates']['status_colour_maps'] = find_funcs(r'(?:const|function)\s+(?:pillFor|toneFor|statusTone|statusColour|statusColor|badgeTone|toneClass|statusClass|statusVariant)\w*')

# ---------------------------------------------------------------- lint hints already known
M['scan_meta'] = {'files_scanned': len(files)}

# ---------------------------------------------------------------- dark mode risk: hardcoded colours in tsx
dm = 0
for p in tsx:
    t = strip_comments(txt[p])
    dm += len(HEX.findall(t)) + len(RGB.findall(t))
M['dark_mode_hardcode_risk'] = dm

M['per_file_all']=[{'file':f,'total':sum(c.values()),**dict(c)} for f,c in sorted(per_file.items(), key=lambda kv:-sum(kv[1].values()))]
json.dump(M, open(OUT + '/metrics.json', 'w'), indent=1, default=str)
print('ok', len(files), 'files')
