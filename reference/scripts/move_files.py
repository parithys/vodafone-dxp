#!/usr/bin/env python3
"""Refactor helper: move/rename source files under src/ and rewrite every relative import.

  python3 reference/scripts/move_files.py OLD=NEW [OLD=NEW ...]      (paths relative to the project root)

* Uses `git mv` (two steps, so case-only renames work on a case-insensitive file system).
* Every relative specifier in every src/ TS/TSX/CSS file - the moved files included - is resolved to a real
  file, mapped through the moves, and rewritten relative to the importing file's new location.
* Covers `import ... from`, `export ... from`, side-effect imports and dynamic import().
Nothing else is touched; `npx tsc -b` then proves nothing was missed.
"""
import os, re, subprocess, sys

EXTS = ["", ".ts", ".tsx", ".css", "/index.ts", "/index.tsx"]


def resolve(from_dir, spec):
    base = os.path.normpath(os.path.join(from_dir, spec))
    for e in EXTS:
        p = base + e
        if os.path.isfile(p):
            return p
    return None


def relspec(from_dir, target, keep_ext):
    t = target
    if not keep_ext:
        for e in (".tsx", ".ts"):
            if t.endswith(e):
                t = t[: -len(e)]
                break
        if t.endswith("/index"):
            t = t[: -len("/index")]
    r = os.path.relpath(t, from_dir).replace(os.sep, "/")
    return r if r.startswith(".") else "./" + r


def main():
    moves = {}
    for a in sys.argv[1:]:
        o, n = a.split("=")
        moves[os.path.normpath(o)] = os.path.normpath(n)
    # snapshot every source file and its imports BEFORE moving
    files = []
    for root, _, fs in os.walk("src"):
        for f in fs:
            if f.endswith((".ts", ".tsx", ".css")):
                files.append(os.path.normpath(os.path.join(root, f)))
    pat = re.compile(r"""((?:from|import)\s*\(?\s*)(['"])(\.{1,2}/[^'"]*)\2""")
    plan = {}
    for f in files:
        text = open(f).read()
        new_loc = moves.get(f, f)

        def repl(m):
            spec = m.group(3)
            tgt = resolve(os.path.dirname(f), spec)
            if tgt is None:
                return m.group(0)
            tgt = os.path.normpath(tgt)
            new_tgt = moves.get(tgt, tgt)
            if new_tgt == tgt and new_loc == f:
                return m.group(0)
            keep_ext = os.path.splitext(spec)[1] in (".css", ".ts", ".tsx")
            return f"{m.group(1)}{m.group(2)}{relspec(os.path.dirname(new_loc), new_tgt, keep_ext)}{m.group(2)}"

        plan[f] = pat.sub(repl, text)
    # move (two-step for case-only renames)
    for o, n in moves.items():
        os.makedirs(os.path.dirname(n) or ".", exist_ok=True)
        if o.lower() == n.lower():
            tmp = o + ".__mv__"
            subprocess.check_call(["git", "mv", o, tmp])
            subprocess.check_call(["git", "mv", tmp, n])
        else:
            subprocess.check_call(["git", "mv", o, n])
    for f, text in plan.items():
        dest = moves.get(f, f)
        open(dest, "w").write(text)
    print(f"moved {len(moves)} file(s); rewrote imports in {len(plan)} file(s) considered")


main()
