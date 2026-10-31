#!/usr/bin/env python3
"""Apply the house format to Excel workbooks, in place, WITHOUT round-tripping them through a library.

    python3 reference/scripts/format_xlsx.py                      # every .xlsx in reference/outputs
    python3 reference/scripts/format_xlsx.py path/to/a.xlsx ...   # given files

Generator scripts call format_file(path) after saving, so a regeneration keeps the format.

The format (every sheet):
  - the first row is the header and the ONLY frozen pane: no frozen columns
  - header: background #E60000, text #FFFFFF
  - a thin #FABF8F border on the POPULATED RANGE of each sheet only (the smallest rectangle holding every cell with data);\n    every cell outside it has no border
  - font Tenorite, size 14 (Excel's size unit is the point; 14 px would be 10.5 pt)
  - grid lines hidden

Why XML and not openpyxl: two of the workbooks carry pivot tables, comments and conditional-formatting extensions that
openpyxl silently drops on save. This edits styles.xml, the sheet views and the string runs directly and leaves
everything else in the package byte-for-byte as it was.

Column widths and fixed row heights are scaled by SCALE so the larger font still fits.
"""
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

from lxml import etree

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
N = f"{{{NS}}}"
FONT_NAME = "Tenorite"
FONT_SIZE = "14"
HEADER_FILL = "FFE60000"
HEADER_TEXT = "FFFFFFFF"
BORDER_COLOUR = "FFFABF8F"
SCALE = 1.35


def _el(tag, **attrs):
    e = etree.Element(N + tag)
    for k, v in attrs.items():
        e.set(k, v)
    return e


FONT_FLAGS = ("b", "i", "strike", "condense", "extend", "outline", "shadow", "u", "vertAlign")


def _normalise_font(font, bold=None, colour=None):
    """Tenorite 14 on a <font>, keeping its bold / italic / underline / colour; drops the theme scheme (it would override the name).

    Child order is fixed by the schema: flags, sz, color, name, family, charset, scheme.
    """
    flags = [e for e in font if etree.QName(e).localname in FONT_FLAGS]
    old_colour = font.find(N + "color")
    for e in list(font):
        font.remove(e)
    for e in flags:
        font.append(e)
    if bold and font.find(N + "b") is None:
        font.insert(0, _el("b"))
    font.append(_el("sz", val=FONT_SIZE))
    if colour is not None:
        font.append(_el("color", rgb=colour))
    elif old_colour is not None:
        font.append(old_colour)
    font.append(_el("name", val=FONT_NAME))


class Styles:
    """Edits styles.xml in place and hands out cell formats: the original with no border, bordered body, bordered header."""

    def __init__(self, xml: bytes):
        self.root = etree.fromstring(xml)
        fonts, fills, borders = (self.root.find(N + t) for t in ("fonts", "fills", "borders"))
        self.xfs = self.root.find(N + "cellXfs")
        for f in fonts:
            _normalise_font(f)
        hf = _el("font")
        _normalise_font(hf, bold=True, colour=HEADER_TEXT)
        fonts.append(hf)
        self.header_font = len(fonts) - 1
        fonts.set("count", str(len(fonts)))
        fill = _el("fill")
        pf = etree.SubElement(fill, N + "patternFill", patternType="solid")
        etree.SubElement(pf, N + "fgColor", rgb=HEADER_FILL)
        etree.SubElement(pf, N + "bgColor", indexed="64")
        fills.append(fill)
        self.header_fill = len(fills) - 1
        fills.set("count", str(len(fills)))
        border = _el("border")
        for side in ("left", "right", "top", "bottom"):
            sd = etree.SubElement(border, N + side, style="thin")
            etree.SubElement(sd, N + "color", rgb=BORDER_COLOUR)
        etree.SubElement(border, N + "diagonal")
        borders.append(border)
        self.border = len(borders) - 1
        borders.set("count", str(len(borders)))
        # Every ORIGINAL format loses its border: whatever sits outside the populated range must have none.
        self.original = len(self.xfs)
        for xf in self.xfs:
            xf.set("borderId", "0")
            xf.set("applyBorder", "1")
            xf.set("applyFont", "1")
        self.cache = {}

    def get(self, old: int, kind: str) -> int:
        """kind: 'body' (bordered), 'header' (bordered, red band, white bold text)."""
        key = (old, kind)
        if key not in self.cache:
            clone = etree.fromstring(etree.tostring(self.xfs[old if old < self.original else 0]))
            clone.set("borderId", str(self.border))
            for a in ("applyFont", "applyBorder"):
                clone.set(a, "1")
            if kind == "header":
                clone.set("fontId", str(self.header_font))
                clone.set("fillId", str(self.header_fill))
                clone.set("applyFill", "1")
            self.xfs.append(clone)
            self.cache[key] = len(self.xfs) - 1
        return self.cache[key]

    def xml(self) -> bytes:
        self.xfs.set("count", str(len(self.xfs)))
        return etree.tostring(self.root, xml_declaration=True, encoding="UTF-8", standalone=True)


def _col_index(letters):
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n


def _col_letters(i):
    out = ""
    while i:
        i, r = divmod(i - 1, 26)
        out = chr(65 + r) + out
    return out


def _ref(r):
    m = re.fullmatch(r"([A-Z]+)(\d+)", r)
    return _col_index(m.group(1)), int(m.group(2))


def _has_value(c):
    return any(c.find(N + t) is not None for t in ("v", "is", "f"))


def format_sheet(sheet_xml: bytes, styles: Styles):
    root = etree.fromstring(sheet_xml)
    views = root.find(N + "sheetViews")
    if views is None:
        views = _el("sheetViews")
        root.insert(0, views)
    for v in views.findall(N + "sheetView"):
        v.set("showGridLines", "0")
        for child in list(v):
            if child.tag in (N + "pane", N + "selection"):
                v.remove(child)
        v.attrib.pop("topLeftCell", None)
        v.append(_el("pane", ySplit="1", topLeftCell="A2", activePane="bottomLeft", state="frozen"))
        v.append(_el("selection", pane="bottomLeft", activeCell="A2", sqref="A2"))
    data = root.find(N + "sheetData")
    rows = {int(r.get("r")): r for r in data.findall(N + "row")}
    # The populated range: the smallest rectangle holding every cell that has a value. Merged cells have their value in the
    # top-left cell only, so the merged area is added to the rectangle.
    pts = [_ref(c.get("r")) for r in rows.values() for c in r.findall(N + "c") if _has_value(c)]
    merges = root.find(N + "mergeCells")
    if merges is not None:
        for m in merges.findall(N + "mergeCell"):
            a, _, b = m.get("ref").partition(":")
            if b and any(_ref(a) == p for p in pts):
                pts += [_ref(a), _ref(b)]
    if pts:
        c0, c1 = min(p[0] for p in pts), max(p[0] for p in pts)
        r0, r1 = min(p[1] for p in pts), max(p[1] for p in pts)
        # every cell of the rectangle exists, so a blank inside the range is bordered like its neighbours
        for r in range(r0, r1 + 1):
            row = rows.get(r)
            if row is None:
                row = _el("row", r=str(r))
                rows[r] = row
            have = {_ref(c.get("r"))[0] for c in row.findall(N + "c")}
            for c in range(c0, c1 + 1):
                if c not in have:
                    row.append(_el("c", r=f"{_col_letters(c)}{r}", s="0"))
        for row in rows.values():
            row.attrib.pop("spans", None)
            row[:] = sorted(row, key=lambda c: _ref(c.get("r"))[0] if c.tag == N + "c" else 0)
        data[:] = [rows[k] for k in sorted(rows)]
        for r in range(r0, r1 + 1):
            for c in rows[r].findall(N + "c"):
                col = _ref(c.get("r"))[0]
                if col < c0 or col > c1:
                    continue
                old = int(c.get("s", "0"))
                c.set("s", str(styles.get(old, "header" if r == 1 else "body")))
    for row in data.findall(N + "row"):
        if row.get("customHeight") in ("1", "true") and row.get("ht"):
            row.set("ht", f"{float(row.get('ht')) * SCALE:.2f}")
    cols = root.find(N + "cols")
    if cols is not None:
        for col in cols.findall(N + "col"):
            if col.get("width"):
                col.set("width", f"{float(col.get('width')) * SCALE:.2f}")
    fmt = root.find(N + "sheetFormatPr")
    if fmt is not None and fmt.get("customHeight") in ("1", "true") and fmt.get("defaultRowHeight"):
        fmt.set("defaultRowHeight", f"{float(fmt.get('defaultRowHeight')) * SCALE:.2f}")
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def format_runs(xml: bytes):
    """Rich-text runs (<rPr>) carry their own font: bring them to Tenorite 14 as well."""
    root = etree.fromstring(xml)
    changed = False
    for rpr in root.iter(N + "rPr"):
        for tag in ("rFont", "sz", "family", "scheme", "charset"):
            for e in rpr.findall(N + tag):
                rpr.remove(e)
        # schema order inside rPr: rFont, charset, family, b, i, strike, outline, shadow, condense, extend, color, sz, u, vertAlign, scheme
        rpr.insert(0, _el("rFont", val=FONT_NAME))
        col = rpr.find(N + "color")
        sz = _el("sz", val=FONT_SIZE)
        if col is not None:
            col.addnext(sz)
        else:
            rpr.append(sz)
        changed = True
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True) if changed else xml


def sheet_parts(z):
    return [n for n in z.namelist() if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", n)]


def format_file(path):
    path = Path(path)
    if path.name.startswith("~$"):
        return False
    tmp = Path(tempfile.mkdtemp()) / path.name
    with zipfile.ZipFile(path) as zin:
        parts = sheet_parts(zin)
        styles = Styles(zin.read("xl/styles.xml"))
        sheets = {p: format_sheet(zin.read(p), styles) for p in parts}
        with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == "xl/styles.xml":
                    data = styles.xml()
                elif item.filename in sheets:
                    data = sheets[item.filename]
                elif item.filename == "xl/sharedStrings.xml" or re.fullmatch(r"xl/comments\d*\.xml", item.filename):
                    data = format_runs(data)
                zout.writestr(item, data)
    shutil.move(str(tmp), str(path))
    return True


def main(argv):
    targets = [Path(a) for a in argv] or sorted((Path(__file__).resolve().parents[1] / "outputs").glob("*.xlsx"))
    for t in targets:
        if t.name.startswith("~$"):
            continue
        format_file(t)
        print(f"formatted {t.name}")


if __name__ == "__main__":
    main(sys.argv[1:])
