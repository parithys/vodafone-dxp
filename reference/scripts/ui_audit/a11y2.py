#!/usr/bin/env python3
"""Accurate JSX-tag a11y scan (brace/string aware) - replaces regex heuristics that stop at '=>' inside props."""
import re, os, glob, json, collections
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
SRC = ROOT + '/src'
WORK = os.environ.get('UI_AUDIT_WORK') or os.path.join(os.environ.get('TMPDIR', '/tmp'), 'ui_audit')
os.makedirs(WORK, exist_ok=True)
OUT = WORK

def tags(t, names):
    """yield (name, attrs_str, start_index, end_index_of_open_tag, self_closing)"""
    pat = re.compile(r'<(' + '|'.join(names) + r')(?=[\s/>])')
    for m in pat.finditer(t):
        i = m.end()
        depth = 0
        q = None
        while i < len(t):
            c = t[i]
            if q:
                if c == '\\':
                    i += 1
                elif c == q:
                    q = None
            elif depth == 0 and c in '"\'':
                q = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
            elif depth > 0 and c in '"\'`':
                # string inside braces
                q = c
            elif depth == 0 and c == '>':
                break
            i += 1
        attrs = t[m.end():i]
        yield m.group(1), attrs, m.start(), i, attrs.rstrip().endswith('/')

def line_of(t, idx):
    return t.count('\n', 0, idx) + 1

res = collections.defaultdict(list)
for p in sorted(glob.glob(SRC + '/**/*.tsx', recursive=True)):
    t = open(p, encoding='utf-8').read()
    # strip block + line comments but keep length for indexes
    t2 = re.sub(r'/\*.*?\*/', lambda m: ' ' * len(m.group(0)), t, flags=re.S)
    t2 = re.sub(r'(?m)^(\s*)//.*$', lambda m: m.group(1) + ' ' * (len(m.group(0)) - len(m.group(1))), t2)
    r = os.path.relpath(p, ROOT)
    inprim = '/components/primitives/' in p
    for name, attrs, s, e, sc in tags(t2, ['button']):
        if not re.search(r'\btype=', attrs) and '{...' not in attrs:
            res['button_without_type'].append(f'{r}:{line_of(t2, s)}')
        # icon-only: open tag followed by single <Icon/> or <svg>..</svg> then </button>
        if not sc:
            close = t2.find('</button>', e)
            inner = t2[e + 1:close] if close > 0 else ''
            stripped = re.sub(r'\s+', ' ', inner).strip()
            if re.fullmatch(r'<(?:Icon|svg)\b[^<]*?(?:/>|>.*?</svg>)', stripped, flags=re.S) and not re.search(r'aria-label|aria-labelledby|\btitle=', attrs):
                res['icon_only_button_no_name'].append(f'{r}:{line_of(t2, s)}')
    for name, attrs, s, e, sc in tags(t2, ['div', 'span', 'li', 'td', 'tr', 'p', 'section', 'article', 'header', 'aside']):
        if re.search(r'\bonClick=', attrs):
            if not re.search(r'\brole=', attrs):
                res['onClick_non_interactive_no_role'].append(f'{r}:{line_of(t2, s)} <{name}>')
            elif not re.search(r'onKeyDown|onKeyUp|tabIndex', attrs):
                res['onClick_role_no_keyboard'].append(f'{r}:{line_of(t2, s)} <{name} role>')
    for name, attrs, s, e, sc in tags(t2, ['input', 'select', 'textarea']):
        if 'type="hidden"' in attrs:
            continue
        if not re.search(r'aria-label|aria-labelledby|\bid=|\{\.\.\.', attrs):
            res['raw_' + name + '_no_accessible_name_or_id'].append(f'{r}:{line_of(t2, s)}')
    for name, attrs, s, e, sc in tags(t2, ['img']):
        if not re.search(r'\balt=', attrs):
            res['img_without_alt'].append(f'{r}:{line_of(t2, s)}')
    for name, attrs, s, e, sc in tags(t2, ['a']):
        if 'target="_blank"' in attrs and not re.search(r'\brel=', attrs):
            res['target_blank_no_rel'].append(f'{r}:{line_of(t2, s)}')
    # outline removal without replacement ring on the same class string
    for m in re.finditer(r'className=(?:"([^"]*)"|\{`([^`]*)`\}|\{\'([^\']*)\'\})', t2):
        c = m.group(1) or m.group(2) or m.group(3) or ''
        if re.search(r'(?<![\w-])(?:focus:|focus-visible:)?outline-(?:none|0)\b', c):
            ok = re.search(r'focus-visible:|focus:(?:shadow|ring|border|bg|underline)|focus-within:|--focus-ring|focus:\[|focus:bg|focus:text', c)
            res['outline_removed_with_replacement' if ok else 'outline_removed_NO_replacement'].append(f'{r}:{line_of(t2, m.start())}')
    # raw table elements (not DataTable)
    for name, attrs, s, e, sc in tags(t2, ['table']):
        res['raw_table'].append(f'{r}:{line_of(t2, s)}')
    # heading elements
    for name, attrs, s, e, sc in tags(t2, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        res['heading_' + name].append(f'{r}:{line_of(t2, s)}')
    # tiny text
    for m in re.finditer(r'text-\[(?:9|10|11)px\]|--fs-micro', t2):
        res['text_below_12px_refs'].append(f'{r}:{line_of(t2, m.start())}')
    # tabIndex={-1} on interactive? skip
summary = {k: len(v) for k, v in sorted(res.items(), key=lambda kv: -len(kv[1]))}
json.dump({'summary': summary, 'items': {k: v[:60] for k, v in res.items()}}, open(OUT + '/a11y2.json', 'w'), indent=1)
print(json.dumps(summary, indent=0))
