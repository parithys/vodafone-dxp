#!/usr/bin/env python3
"""Component inventory rows: every .tsx file under src with its exports, size, and inbound reference count."""
import re, os, glob, json, collections
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
SRC = ROOT + '/src'
WORK = os.environ.get('UI_AUDIT_WORK') or os.path.join(os.environ.get('TMPDIR', '/tmp'), 'ui_audit')
os.makedirs(WORK, exist_ok=True)
OUT = WORK
files = [p for p in glob.glob(SRC + '/**/*', recursive=True) if os.path.isfile(p) and p.endswith(('.tsx', '.ts'))]
txt = {p: open(p, encoding='utf-8').read() for p in files}
tsx = [p for p in files if p.endswith('.tsx')]
exp_re = re.compile(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)')
ident = re.compile(r'\b[A-Z][A-Za-z0-9_]*\b')
file_idents = {p: collections.Counter(ident.findall(t)) for p, t in txt.items()}
# also map import-path references so default-exported/lazy files are counted
def inbound_by_path(p):
    base = os.path.splitext(os.path.relpath(p, SRC))[0]
    stem = os.path.basename(base)
    cnt = 0
    for q, t in txt.items():
        if q == p:
            continue
        if re.search(r"from\s+['\"][^'\"]*/" + re.escape(stem) + r"['\"]|import\(['\"][^'\"]*/" + re.escape(stem) + r"['\"]\)", t):
            cnt += 1
    return cnt
rows = []
for p in sorted(tsx):
    t = txt[p]
    names = sorted(set(exp_re.findall(t)))
    r = os.path.relpath(p, SRC)
    parts = r.split(os.sep)
    layer = '/'.join(parts[:2]) if parts[0] == 'components' and len(parts) > 2 else parts[0]
    ext = 0
    for n in names:
        ext += sum(c.get(n, 0) for q, c in file_idents.items() if q != p)
    ib = inbound_by_path(p)
    rows.append({
        'file': 'src/' + r, 'layer': layer, 'lines': t.count('\n') + 1, 'exports': ', '.join(names)[:160],
        'inbound_files_by_import_path': ib, 'external_name_refs': ext,
        'raw_button': len(re.findall(r'<button\b', t)), 'raw_input_select_textarea': len(re.findall(r'<(?:input|select|textarea)\b', t)),
        'raw_table': len(re.findall(r'<table\b', t)),
        'uses_Button': len(re.findall(r'<Button\b', t)), 'uses_Input_Select': len(re.findall(r'<(?:Input|Select|Textarea)\b', t)),
        'var_tokens': len(re.findall(r'var\(--', t)),
    })
json.dump(rows, open(OUT + '/inventory.json', 'w'), indent=1)
print(len(rows), 'rows')
zero = [r for r in rows if r['inbound_files_by_import_path'] == 0 and r['external_name_refs'] == 0 and not r['file'].endswith(('main.tsx', 'App.tsx'))]
print('files with no inbound reference:', len(zero))
for r in zero:
    print(' ', r['file'], r['exports'][:70])
