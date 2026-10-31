#!/usr/bin/env python3
"""Build Postpaid_Activation_Open_Questions_Reference.xlsx.

Generated, never hand-edited - same rule as the persona/feature matrix.
Opening the workbook in Excel and saving will silently rewrite it.

    python3 reference/scripts/build_postpaid_open_questions.py

The MARKDOWN IS THE SOURCE. Every question, its status, body text, source
citation and priority is parsed out of

    reference/docs/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md

and nothing is restated here, per the house rule: if a value already exists in
source, parse it rather than retype it. Edit the markdown and re-run this to
regenerate the workbook; the two cannot drift.

The parser is deliberately strict and aborts rather than emit a workbook that
silently dropped content - a question that fell on the floor because a bullet
was reformatted would be invisible in the output, and a stakeholder question
list that quietly lost three questions is worse than no list. Guards:

  - every `##` section must yield at least one parsed row
  - every item must carry a [OWED] or [GAP] tag
  - the question text must be non-empty and end up inside the bold span
  - the total row count must match the number of tagged bullets in the file
  - the priority list must reference only sections that exist
"""

import re
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'docs' / 'VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md'
OUT = ROOT / 'outputs' / 'Postpaid_Activation_Open_Questions_Reference.xlsx'


def die(msg):
    sys.exit(f'ABORT: {msg}')


# ------------------------------------------------------------------- parse

if not SRC.exists():
    die(f'source markdown not found: {SRC}')

LINES = SRC.read_text(encoding='utf-8').split('\n')

# A tagged bullet opens with "- **[OWED ...]" or "- **[GAP]".
TAGGED = re.compile(r'^- \*\*\[(OWED|GAP)([^\]]*)\]')

# Sections that are prose/meta rather than question lists.
NON_QUESTION_SECTIONS = {
    'Priority for the next stakeholder session',
    'What to ask for as well as answers',
}


def _is_question_section(title):
    return title is not None and title not in NON_QUESTION_SECTIONS


def count_expected(lines):
    """Tagged bullets that are actually questions.

    Counted with the same section awareness as the parser, because the
    document's own legend defines [OWED] and [GAP] using two tagged bullets in
    the preamble - before the first heading - and a flat count over the whole
    file picks those up as questions. The guard below compares this against
    what the parser kept, so an over-count here would report a phantom drop
    and an under-count would mask a real one.
    """
    section, n = None, 0
    for ln in lines:
        if ln.startswith('## '):
            section = ln[3:].strip()
        elif _is_question_section(section) and TAGGED.match(ln):
            n += 1
    return n


EXPECTED_ITEMS = count_expected(LINES)
if EXPECTED_ITEMS == 0:
    die('no tagged bullets found in any question section - has the format changed?')

items = []          # question rows
priority = []       # ranked shortlist
artefacts = []      # things to request as artefacts, not answers
section_order = []  # "1. Identification and KYC" in file order

current = None      # current section title
buf = None          # accumulating item lines


def flush():
    """Close the item under construction and append it to `items`."""
    global buf
    if buf is None:
        return
    raw = '\n'.join(buf)
    buf = None

    m = re.match(r'^- \*\*\[(OWED|GAP)([^\]]*)\]\s*(.*)$', raw, re.S)
    if not m:
        die(f'item did not parse in section {current!r}: {raw[:90]!r}')
    status, ref, rest = m.group(1), m.group(2).strip(), m.group(3)

    # The bold span holds the question; everything after it is the body. Some
    # items close the bold mid-line and continue with plain prose, others are
    # bold to the end of the first line.
    parts = rest.split('**', 1)
    question = parts[0].strip()
    body = (parts[1] if len(parts) > 1 else '').strip()
    if not question:
        die(f'empty question text in section {current!r}: {raw[:90]!r}')
    # A question ending in a comma means the bold span closed mid-sentence, so
    # the Question column would carry half a sentence and the rest would leak
    # into the detail column. Fine in prose, wrong in a spreadsheet where the
    # column is read on its own. A trailing comma is unambiguous; noun-phrase
    # topics ("The agent role privilege matrix") end without punctuation and
    # are left alone.
    if question.rstrip().endswith(','):
        die(f'question ends mid-sentence, extend the bold span to cover it: {question!r}')

    # Source citations live on their own trailing line(s).
    source = ''
    body_lines, src_lines = [], []
    for ln in body.split('\n'):
        s = ln.strip()
        if re.match(r'^Sources?:', s) or src_lines:
            src_lines.append(re.sub(r'^Sources?:\s*', '', s))
        else:
            body_lines.append(s)
    if src_lines:
        source = ' '.join(x for x in src_lines if x)
    body = ' '.join(x for x in body_lines if x)

    items.append({
        'section': current,
        'status': status,
        'ref': ref,
        'question': clean(question),
        'detail': clean(body),
        'source': clean(source),
    })


def clean(text):
    """Strip markdown emphasis and code ticks; Excel renders none of it."""
    text = text.replace('**', '').replace('`', '')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


in_body = False  # past the legend/preamble

for ln in LINES:
    if ln.startswith('## '):
        flush()
        title = ln[3:].strip()
        current = title
        in_body = True
        if title not in NON_QUESTION_SECTIONS:
            section_order.append(title)
        continue

    if not in_body or current is None:
        continue

    if current == 'Priority for the next stakeholder session':
        m = re.match(r'^(\d+)\.\s+(.*)$', ln.strip())
        if m:
            priority.append({'rank': int(m.group(1)), 'text': clean(m.group(2))})
        elif ln.startswith('   ') and priority:
            priority[-1]['text'] = clean(priority[-1]['text'] + ' ' + ln.strip())
        continue

    if current == 'What to ask for as well as answers':
        if ln.startswith('- '):
            artefacts.append(clean(ln[2:]))
        elif ln.startswith('  ') and artefacts:
            artefacts[-1] = clean(artefacts[-1] + ' ' + ln.strip())
        continue

    if TAGGED.match(ln):
        flush()
        buf = [ln]
    elif buf is not None and (ln.startswith('  ') or ln.strip() == ''):
        if ln.strip():
            buf.append(ln)
    elif ln.startswith('- '):
        # An untagged bullet inside a question section means a question lost
        # its status tag - surface it rather than skip it.
        flush()
        die(f'untagged bullet in question section {current!r}: {ln[:90]!r}')

flush()

# ------------------------------------------------------------------ guards

if len(items) != EXPECTED_ITEMS:
    die(f'parsed {len(items)} items but the file has {EXPECTED_ITEMS} tagged '
        'bullets - the parser dropped content')

empty = [s for s in section_order if not any(i['section'] == s for i in items)]
if empty:
    die(f'sections parsed with zero questions: {empty}')

if not priority:
    die('priority shortlist parsed empty')
if not artefacts:
    die('artefact request list parsed empty')

# The shortlist cites sections as "(S4)". Every such reference must resolve to
# a real section number, or the workbook would point readers at nothing.
section_numbers = {s.split('.', 1)[0].strip() for s in section_order}
for p in priority:
    for ref in re.findall(r'\(S(\d+)\)', p['text']):
        if ref not in section_numbers:
            die(f'priority item {p["rank"]} cites section S{ref}, which does not exist')

# ----------------------------------------------------------------- styling
# Matches the other reference workbooks (build_persona_feature_matrix.py) so
# this file reads as one of the family rather than a one-off.

VF_RED = 'E60000'
HEADER_FILL = PatternFill('solid', fgColor=VF_RED)
HEADER_FONT = Font(color='FFFFFF', bold=True, size=10)
META_FILL = PatternFill('solid', fgColor='F4F4F4')
OWED_FILL = PatternFill('solid', fgColor='E3F2FD')   # already committed
GAP_FILL = PatternFill('solid', fgColor='FFF3E0')    # not on anyone's list
TITLE_FONT = Font(bold=True, size=18, color=VF_RED)
SUB_FONT = Font(size=10, color='555555', italic=True)
BOLD = Font(bold=True)
SMALL = Font(size=10)
MONO = Font(size=9, name='Menlo', color='333333')
WRAP = Alignment(wrap_text=True, vertical='top')
CENTER = Alignment(horizontal='center', vertical='center')
THIN = Side(style='thin', color='DDDDDD')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

STATUS_FILL = {'OWED': OWED_FILL, 'GAP': GAP_FILL}


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

# openpyxl writes formulas as strings with no cached result, so a reader that
# trusts cached values (Quick Look, Numbers, Sheets, pandas) shows the count
# cells blank. This asks the application to recalculate the whole book on open,
# which is what fills them in. Normally the build step would instead run
# LibreOffice to bake the values in; there is no soffice on this machine, so
# this flag is doing that job. The counted values are asserted at the end of
# this script regardless, so a wrong formula cannot ship unnoticed.
wb.calculation.fullCalcOnLoad = True

# ====================================================== Sheet 2 first (data)
# Built before Read Me so the summary formulas can address a known row count.

qs = wb.active
qs.title = 'Open Questions'

QCOLS = ['ID', 'Area', 'Status', 'Committed as', 'Question',
         'What is known / why it matters', 'Source', 'Priority area', 'Ask this first', 'Why it leads']
QWIDTHS = [7, 26, 9, 14, 52, 74, 46, 9, 44, 36]
header_row(qs, QCOLS, QWIDTHS)

# The shortlist ranks AREAS, not individual questions, so this stamps every
# question in a shortlisted area with that area's rank. The column is named
# 'Priority area' for exactly that reason - calling it 'Priority' would read as
# though 33 of the 57 questions had been individually ranked, which they have
# not. Sort on it to group the areas worth opening the meeting with.
priority_sections = {}
for p in priority:
    for ref in re.findall(r'\(S(\d+)\)', p['text']):
        priority_sections.setdefault(ref, p['rank'])

# The former Priority Shortlist, folded in: each ranked area's "ask this first" item and the
# reason it leads sit on the questions of that area, beside the rank itself.
rank_text = {}
for p in priority:
    # "Thing to ask (S4). Reason follows." - split the trailing rationale off
    m = re.match(r'^(.*?\(S[\d,\s S]*\)\.?)\s*(.*)$', p['text'])
    rank_text[p['rank']] = (m.group(1), m.group(2)) if m else (p['text'], '')

for r, it in enumerate(items, start=2):
    sec_no = it['section'].split('.', 1)[0].strip()
    sec_name = it['section'].split('.', 1)[1].strip() if '.' in it['section'] else it['section']
    rank = priority_sections.get(sec_no, '')

    vals = [
        f'Q{r - 1:02d}',
        sec_name,
        it['status'],
        it['ref'] or '',
        it['question'],
        it['detail'],
        it['source'],
        rank,
        rank_text.get(rank, ('', ''))[0] if rank else '',
        rank_text.get(rank, ('', ''))[1] if rank else '',
    ]
    for i, v in enumerate(vals, start=1):
        c = qs.cell(row=r, column=i, value=v)
        c.border = BORDER
        c.alignment = WRAP
        c.font = SMALL
        if i == 3:
            c.fill = STATUS_FILL[it['status']]
            c.alignment = CENTER
            c.font = Font(size=10, bold=True)
        elif i == 5:
            c.font = Font(size=10, bold=True)
        elif i == 7:
            c.font = MONO
        elif i in (1, 4, 8):
            c.alignment = CENTER
        elif i == 9:
            c.font = Font(size=10, bold=True)
    qs.row_dimensions[r].height = 58

LAST = len(items) + 1
# qs.freeze_panes intentionally unset - see the FREEZE_PANES note in
# build_persona_feature_matrix.py. Same decision, same reason: panes are a
# viewing preference and baking them in takes the choice away from the reader.
qs.auto_filter.ref = f'A1:J{LAST}'

qs.cell(row=LAST + 2, column=1, value=(
    'Status: OWED = already logged as a formal dependency in the Mobile Postpaid Activation '
    'BRSD v2.0, so VFQ has committed to supply it; chase, do not re-ask. GAP = found while '
    'building the journey and not on anyone list - the app carries an assumption today, named '
    'in the source file cited. Priority area, Ask this first and Why it leads are filled only '
    'for the shortlisted areas (ranked by how much of the journey is blocked behind the answer, '
    'not by how hard the question is to ask); blank means unranked, not unimportant.'
)).font = SUB_FONT
qs.cell(row=LAST + 2, column=1).alignment = WRAP
qs.merge_cells(start_row=LAST + 2, start_column=1, end_row=LAST + 4, end_column=10)

wb.save(OUT)

from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines

format_file(OUT)

# ------------------------------------------------- verify the count formulas
# A recalc pass would normally prove these evaluate. Without LibreOffice here,
# the next best thing is to compute the same answers independently in Python
# and assert them, so a mis-aimed range cannot ship looking plausible. These
# are the summary counts the workbook used to carry on its (now removed) Read Me sheet.

areas = [i['section'].split('.', 1)[1].strip() if '.' in i['section'] else i['section']
         for i in items]
expect = {
    'Open questions total': len(items),
    'OWED - already committed': sum(1 for i in items if i['status'] == 'OWED'),
    'GAP - not yet logged': sum(1 for i in items if i['status'] == 'GAP'),
    'Areas covered': len(set(areas)),
    'Questions in a priority area': sum(
        1 for i in items
        if priority_sections.get(i['section'].split('.', 1)[0].strip())),
}
if expect['OWED - already committed'] + expect['GAP - not yet logged'] != len(items):
    die('status values other than OWED/GAP present - the count formulas would under-report')
if expect['Areas covered'] != len(section_order):
    die(f'{expect["Areas covered"]} distinct areas in the rows but '
        f'{len(section_order)} sections parsed - the Area column disagrees with the '
        'By area table, so one of the two is wrong')
if expect['Questions in a priority area'] == 0:
    die('no question row carries a priority rank - the shortlist did not join to any area')

owed = expect['OWED - already committed']
print(f'Wrote {OUT.relative_to(ROOT.parent)}')
print('  counts: ' + ', '.join(f'{k}={v}' for k, v in expect.items()))
print(f'  {len(items)} questions across {len(section_order)} areas '
      f'({owed} OWED, {len(items) - owed} GAP)')
print(f'  {len(priority)} priority items folded into the Open Questions sheet')
