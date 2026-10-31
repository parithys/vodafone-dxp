#!/usr/bin/env python3
"""Refactor helper: move top-level declarations out of a TS/TSX file into new sibling files, verbatim.

  python3 reference/scripts/split_module.py SRC.tsx NEW=Name1,Name2 [NEW2=Name3 ...]

* Each NEW (a file name in the same directory) receives the named top-level declarations
  (function/const/class/interface/type/enum), copied unchanged together with the comment block directly above.
* A moved declaration is exported only if it was exported before or is used by the source file, another new file,
  or another module; nothing else gains an `export`.
* The source file imports back what it still uses. Other modules that imported a moved name from SRC are
  rewritten to import it from its new file, so no re-export barrel is left behind.
* Import lines are copied to each new file and pruned to the identifiers actually used (comments ignored).
Nothing else is rewritten: if a moved declaration needs a name that stayed behind, tsc reports it.
"""
import os, re, sys

DECL = re.compile(r"^(export )?(default )?(async )?(function|const|interface|type|class|enum) (\w+)")
VALUE_KINDS = ("function", "const", "class", "enum")


def strip_comments(t):
    t = re.sub(r"/\*.*?\*/", "", t, flags=re.S)
    return re.sub(r"(^|\s)//.*$", "", t, flags=re.M)


def uses(name, text):
    return re.search(r"\b" + re.escape(name) + r"\b", text) is not None


def parse(src):
    lines = src.split("\n")
    imports, i = [], 0
    while i < len(lines):
        if lines[i].startswith("import"):
            j = i
            while not re.search(r"""from\s+['"][^'"]+['"]\s*;?\s*$|^import\s+['"][^'"]+['"]\s*;?\s*$""", lines[j]):
                j += 1
            imports.append("\n".join(lines[i:j + 1]))
            i = j + 1
            continue
        k = i
        while k < len(lines) and lines[k].strip() == "":
            k += 1
        if k > i and k < len(lines) and lines[k].startswith("import"):
            i = k
            continue
        break
    return imports, lines[i:]


def spans(body):
    starts = [k for k, l in enumerate(body) if DECL.match(l)]
    res = []
    for s in starts:
        a = s
        while a > 0 and re.match(r"^(//|/\*|\s\*|\*/)", body[a - 1]):
            a -= 1
        m = DECL.match(body[s])
        res.append((m.group(5), a, s, bool(m.group(1)), m.group(4)))
    out = {}
    for n, (name, a, s, exp, kind) in enumerate(res):
        end = res[n + 1][1] if n + 1 < len(res) else len(body)
        out[name] = dict(a=a, s=s, e=end, exp=exp, kind=kind)
    return out


def parse_import(stmt):
    m = re.match(r"import\s+(type\s+)?(.*?)\s+from\s+['\"]([^'\"]+)['\"]\s*;?\s*$", stmt, re.S)
    if not m:
        return None
    type_only, clause, mod = m.group(1) is not None, m.group(2).strip(), m.group(3)
    default, named, star = None, [], None
    if clause.startswith("* as"):
        star = clause.split()[-1]
    else:
        b = re.match(r"^\{(.*)\}\s*$", clause, re.S)
        d = re.match(r"^(\w+)\s*(?:,\s*\{(.*)\})?\s*$", clause, re.S)
        if b:
            named = [x.strip() for x in b.group(1).split(",") if x.strip()]
        elif d:
            default = d.group(1)
            if d.group(2):
                named = [x.strip() for x in d.group(2).split(",") if x.strip()]
    return type_only, default, named, star, mod


def local_name(spec):
    spec = re.sub(r"^type\s+", "", spec)
    return re.split(r"\s+as\s+", spec)[-1].strip()


def prune(imports, text):
    code = strip_comments(text)
    out = []
    for stmt in imports:
        p = parse_import(stmt)
        if not p:
            out.append(stmt)
            continue
        type_only, default, named, star, mod = p
        keep_named = [n for n in named if uses(local_name(n), code)]
        keep_default = default if default and uses(default, code) else None
        keep_star = star if star and uses(star, code) else None
        if not (keep_named or keep_default or keep_star):
            continue
        t = "type " if type_only else ""
        if keep_star:
            out.append(f"import {t}* as {keep_star} from '{mod}';")
        else:
            parts = []
            if keep_default:
                parts.append(keep_default)
            if keep_named:
                parts.append("{ " + ", ".join(keep_named) + " }")
            out.append(f"import {t}{', '.join(parts)} from '{mod}';")
    return out


def rel_module(from_dir, to_file):
    r = os.path.relpath(os.path.splitext(to_file)[0], from_dir).replace(os.sep, "/")
    return r if r.startswith(".") else "./" + r


def import_lines(names_by_module, kinds):
    out = []
    for mod, names in names_by_module.items():
        v = [n for n in names if kinds[n] in VALUE_KINDS]
        t = [n for n in names if kinds[n] not in VALUE_KINDS]
        if v:
            out.append(f"import {{ {', '.join(v)} }} from '{mod}';")
        if t:
            out.append(f"import type {{ {', '.join(t)} }} from '{mod}';")
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    src_path = args[0]
    base = os.path.dirname(src_path)
    moves = {}
    for a in args[1:]:
        f, names = a.split("=")
        moves[f] = names.split(",")
    src = open(src_path).read()
    imports, body = parse(src)
    sp = spans(body)
    for f, names in moves.items():
        for n in names:
            assert n in sp, f"{n} is not a top-level declaration of {src_path}"
    where = {n: f for f, names in moves.items() for n in names}
    kinds = {n: sp[n]["kind"] for n in where}

    # --- chunks per new file (text only; exports decided below)
    chunk_txt = {}
    for n in where:
        d = sp[n]
        chunk = body[d["a"]:d["e"]]
        while chunk and chunk[-1].strip() == "":
            chunk.pop()
        chunk_txt[n] = "\n".join(chunk)
    removed = set()
    for n in where:
        removed.update(range(sp[n]["a"], sp[n]["e"]))
    rest = re.sub(r"\n{3,}", "\n\n", "\n".join(l for k, l in enumerate(body) if k not in removed)).rstrip("\n") + "\n"
    rest_code = strip_comments(rest)

    # --- who needs each moved name
    file_text_code = {f: strip_comments("\n".join(chunk_txt[n] for n in names)) for f, names in moves.items()}
    # importers elsewhere in src
    src_noext = os.path.splitext(src_path)[0]
    importers = []
    for root, _, fs in os.walk("src"):
        for fn in fs:
            if not fn.endswith((".ts", ".tsx")):
                continue
            p = os.path.join(root, fn)
            if os.path.normpath(os.path.splitext(p)[0]) == os.path.normpath(src_noext) or fn in moves and root == base:
                continue
            t = open(p).read()
            for m in re.finditer(r"""((?:import|export)\s+(?:type\s+)?)\{([^}]*)\}\s+from\s+'([^']+)';?""", t, re.S):
                resolved = os.path.normpath(os.path.join(root, m.group(3)))
                if resolved == os.path.normpath(src_noext):
                    importers.append(p)
                    break
    imported_elsewhere = set()
    for p in importers:
        t = open(p).read()
        for m in re.finditer(r"""(?:import|export)\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)';?""", t, re.S):
            if os.path.normpath(os.path.join(os.path.dirname(p), m.group(2))) == os.path.normpath(src_noext):
                imported_elsewhere.update(local_name(x) for x in m.group(1).split(",") if x.strip() and re.split(r"\s+as\s+", re.sub(r"^type\s+", "", x.strip()))[0])
    needed = {}
    for n, f in where.items():
        other_files = any(uses(n, file_text_code[g]) for g in moves if g != f)
        needed[n] = sp[n]["exp"] or uses(n, rest_code) or other_files or n in imported_elsewhere

    # --- write new files
    for f, names in moves.items():
        parts = []
        for n in names:
            txt = chunk_txt[n]
            if needed[n] and not sp[n]["exp"]:
                line = body[sp[n]["s"]]
                txt = txt.replace(line, "export " + line, 1)
            parts.append(txt)
        text = "\n\n".join(parts) + "\n"
        code = strip_comments(text)
        cross = {}
        for g, gnames in moves.items():
            if g == f:
                continue
            need = [n for n in gnames if uses(n, code) and n not in names]
            if need:
                cross[rel_module(base, os.path.join(base, g))] = need
        header = prune(imports, text) + import_lines(cross, kinds)
        open(os.path.join(base, f), "w").write(("\n".join(header) + "\n\n" if header else "") + text)

    # --- source file
    back = {}
    for f, names in moves.items():
        need = [n for n in names if uses(n, rest_code)]
        if need:
            back[rel_module(base, os.path.join(base, f))] = need
    final = prune(imports, rest) + import_lines(back, kinds)
    open(src_path, "w").write(("\n".join(final) + "\n\n" if final else "") + rest)

    # --- redirect other importers
    for p in importers:
        t = open(p).read()

        def repl(m):
            kw, spec_txt, mod = m.group(1), m.group(2), m.group(3)
            if os.path.normpath(os.path.join(os.path.dirname(p), mod)) != os.path.normpath(src_noext):
                return m.group(0)
            specs = [x.strip() for x in spec_txt.split(",") if x.strip()]
            stmt_type = bool(re.search(r"\btype\s*$", kw))
            keyword = "export" if kw.strip().startswith("export") else "import"
            groups = {}  # module -> [specs]
            for x in specs:
                nm = re.split(r"\s+as\s+", re.sub(r"^type\s+", "", x))[0].strip()
                tgt = rel_module(os.path.dirname(p), os.path.join(base, where[nm])) if nm in where else mod
                groups.setdefault(tgt, []).append(x)
            lines = []
            for tgt, xs in groups.items():
                lines.append(f"{keyword} {'type ' if stmt_type else ''}{{ {', '.join(xs)} }} from '{tgt}';")
            return "\n".join(lines)

        t2 = re.sub(r"""((?:import|export)\s+(?:type\s+)?)\{([^}]*)\}\s+from\s+'([^']+)';?""", repl, t, flags=re.S)
        if t2 != t:
            open(p, "w").write(t2)
    print(f"{src_path}: moved {sum(len(v) for v in moves.values())} declarations into {len(moves)} file(s); {len(importers)} importer(s) checked")


main()
