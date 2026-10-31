#!/usr/bin/env python3
"""Removes imports tsc reports as unused (TS6133 on an import specifier). Run after split_module.py:
   npx tsc -b 2>&1 | python3 reference/scripts/fix_unused_imports.py
Only touches import statements; anything else tsc reports is left for a human."""
import re, sys, collections
todo = collections.defaultdict(set)
for line in sys.stdin:
    m = re.match(r"^(\S+)\((\d+),(\d+)\): error TS6133: '(\w+)' is declared but its value is never read", line)
    if m:
        todo[m.group(1)].add((int(m.group(2)), m.group(4)))
for path, items in todo.items():
    s = open(path).read()
    lines = s.split("\n")
    for ln, name in sorted(items, reverse=True):
        i = ln - 1
        # find the import statement containing this line (may be single-line)
        if not lines[i].lstrip().startswith("import"):
            continue
        stmt = lines[i]
        m = re.match(r"^import\s+(type\s+)?(\w+\s*,\s*)?\{([^}]*)\}\s+from\s+('[^']+');?$", stmt)
        if m:
            names = [x.strip() for x in m.group(3).split(",") if x.strip()]
            names = [x for x in names if re.sub(r"^type\s+", "", re.split(r"\s+as\s+", x)[-1]).strip() != name]
            if names or m.group(2):
                lines[i] = f"import {m.group(1) or ''}{m.group(2) or ''}{{ {', '.join(names)} }} from {m.group(4)};" if names else f"import {m.group(1) or ''}{m.group(2).rstrip(', ').strip()} from {m.group(4)};"
            else:
                lines[i] = None
        else:
            m = re.match(r"^import\s+(type\s+)?(\w+)\s+from\s+('[^']+');?$", stmt)
            if m and m.group(2) == name:
                lines[i] = None
    open(path, "w").write("\n".join(l for l in lines if l is not None))
    print("fixed", path, sorted(n for _, n in items))
