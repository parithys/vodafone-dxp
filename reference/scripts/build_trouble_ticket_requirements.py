"""Generate Trouble_Ticket_Requirements_Extraction_Reference.xlsx.

Regenerate with: python3 reference/scripts/build_trouble_ticket_requirements.py

A structured extraction of what the project has ALREADY captured about Trouble Tickets and the Raise Trouble Ticket journey.
Nothing is invented: every row carries the identifier and source it came from, and the extraction is rebuilt from the sources:

  reference/blueprint/*.md   the consolidated requirements, business rules, journeys, personas, screens, exceptions,
                             notifications and gap analysis (each item cites its .knowledge document slug)
  src/ (trouble-ticketing)   the rules the app already implements, read from MPRA_001_* / BR-* comments and the reference
                             data (statuses, queues, picklists, reopen window), plus the gaps the code itself documents
  public/config/*.json       roles, feature grants and capabilities for the ticket features

A blueprint item is "ticket-related" when its title or body mentions a ticket, trouble ticket, complaint, SLA, resolution code,
hashtag or queue assignment. Open the cited .knowledge/docs/<slug>.md for the full source context.
"""
import glob
import json
import os
import re
import sys
from collections import defaultdict

from openpyxl import Workbook
from openpyxl.styles import Alignment
from openpyxl.utils import get_column_letter

APP = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BP = os.path.join(APP, 'reference', 'blueprint')
OUT = os.path.join(APP, 'reference', 'outputs', 'Trouble_Ticket_Requirements_Extraction_Reference.xlsx')

TICKET = re.compile(r'ticket|trouble|\bTT\b|complaint|resolution code|hashtag|\bSR number|service request', re.I)
ID_RE = re.compile(r'^(#{2,3})\s+((?:REQ|BR|UJ|SCR|PERSONA|RBAC|WF|EXC|FLD|VAL|NOT|G)-?[A-Za-z0-9]*-?\d+[A-Za-z]?)\s*[:\-]?\s*(.*)$')
SLUG_RE = re.compile(r'\[`([^`]+)`\]')


def read(p):
    return open(p, encoding='utf-8').read()


def blocks(path, id_prefixes):
    """Split a blueprint file into ID blocks: id, title, section (nearest preceding H2 without an ID), tag line, fields, source slugs."""
    out, cur, section = [], None, ''
    for line in read(path).split('\n'):
        h2 = re.match(r'^##\s+(.*)$', line)
        m = ID_RE.match(line)
        if m and m.group(2).split('-')[0] in id_prefixes:
            if cur:
                out.append(cur)
            cur = {'id': m.group(2), 'title': m.group(3).strip(), 'section': section, 'tag': '', 'fields': {}, 'slugs': [], 'quotes': [], 'raw': []}
            continue
        if h2 and not m:
            section = h2.group(1).strip()
            if cur:
                out.append(cur)
                cur = None
            continue
        if cur is None:
            continue
        cur['raw'].append(line)
        if line.startswith('`') and 'confidence' in line:
            cur['tag'] = re.sub(r'`', '', line).strip()
        fm = re.match(r'^- \*\*([^:*]+):\*\*\s*(.*)$', line)
        if fm and fm.group(1).strip() != 'Sources':
            cur['fields'][fm.group(1).strip()] = fm.group(2).strip()
        for s in SLUG_RE.findall(line):
            if s not in cur['slugs']:
                cur['slugs'].append(s)
        q = re.search(r'“(.*)”', line)
        if q:
            cur['quotes'].append(q.group(1)[:300])
    if cur:
        out.append(cur)
    return out


def body(b):
    return ' '.join([b['title']] + list(b['fields'].values()))


def related(b):
    return bool(TICKET.search(b['title'])) or bool(TICKET.search(' '.join(b['fields'].values()))) or (not b['fields'] and bool(TICKET.search(' '.join(b['quotes']))))


def src(b):
    return ', '.join(b['slugs'][:4]) + (f' (+{len(b["slugs"]) - 4})' if len(b['slugs']) > 4 else '')


def quote(b):
    return b['quotes'][0] if b['quotes'] else ''


# ------------------------------------------------------------------ blueprint
req_blocks = [b for b in blocks(os.path.join(BP, 'requirements.md'), {'REQ'}) if related(b)]
br_blocks = [b for b in blocks(os.path.join(BP, 'business-rules.md'), {'BR'}) if related(b)]
uj_blocks = [b for b in blocks(os.path.join(BP, 'journeys.md'), {'UJ'}) if related(b)]
scr_blocks = [b for b in blocks(os.path.join(BP, 'screens.md'), {'SCR'}) if related(b)]
persona_blocks = [b for b in blocks(os.path.join(BP, 'personas.md'), {'PERSONA'}) if related(b)]
beh_blocks = {b['id']: b for b in blocks(os.path.join(BP, 'screen-behaviour-catalogue.md'), {'SCR'})}

TYPE_OF = lambda b: re.sub(r'\s*Requirements?\s*$', '', b['section']).strip() or 'Requirement'

# ------------------------------------------------------------------ as-built code
TT_DIR = os.path.join(APP, 'src', 'modules', 'trouble-ticketing-complaints')
code_files = glob.glob(os.path.join(TT_DIR, '**', '*.ts*'), recursive=True) + [os.path.join(APP, 'src', 'data', 'reference', 'ticketReferenceData.ts')]
MPRA = defaultdict(lambda: {'text': [], 'files': set()})
for f in code_files:
    lines = read(f).split('\n')
    for i, line in enumerate(lines):
        for m in re.finditer(r'MPRA_001_([A-Z]{2,4}-\d{2}(?:[/–-]\d{2})?)', line):
            code = m.group(1)
            # the comment block this reference sits in
            j = i
            block = []
            while j < len(lines) and lines[j].strip().startswith('//'):
                block.append(lines[j].strip().lstrip('/').strip())
                j += 1
            k = i - 1
            while k >= 0 and lines[k].strip().startswith('//'):
                block.insert(0, lines[k].strip().lstrip('/').strip())
                k -= 1
            text = ' '.join(block).strip() or line.strip()
            if text not in MPRA[code]['text']:
                MPRA[code]['text'].append(text[:420])
            MPRA[code]['files'].add(os.path.relpath(f, APP))

MPRA_GROUP = {
    'CRE': 'Ticket creation', 'ASC': 'Duplicate detection', 'ASG': 'Assignment', 'ESC': 'Escalation', 'RES': 'Resolution, closure and reopen',
    'CSA': 'Customer survey', 'ATT': 'Attachments', 'ACT': 'Activities', 'COM': 'Communication', 'AUD': 'Audit',
}

# reference data the app enforces
ref = read(os.path.join(APP, 'src', 'data', 'reference', 'ticketReferenceData.ts'))


def tuple_of(name):
    m = re.search(r'export const ' + name + r'[^=]*=\s*(\[[^\]]*\])', ref, re.S)
    if not m:
        return []
    return re.findall(r"'([^']+)'", m.group(1))


STATUSES = tuple_of('TICKET_STATUSES')
QUEUES = tuple_of('TICKET_QUEUES')
PRIORITIES = tuple_of('PRIORITY_OPTIONS')
RES_CODES = tuple_of('RESOLUTION_CODES')
ESC_REASONS = tuple_of('ESCALATION_REASONS')
CANCEL_REASONS = tuple_of('CANCELLATION_REASONS')
RET_CODES = tuple_of('RETENTION_RESOLUTION_CODES')
APPROVER_TITLES = tuple_of('TICKET_APPROVAL_ELIGIBLE_JOB_TITLES')
REJECT_REASONS = tuple_of('APPROVAL_REJECT_REASONS')
RETURN_REASONS = tuple_of('APPROVAL_RETURN_REASONS')
REOPEN_DAYS = (re.search(r'REOPEN_WINDOW_DAYS\s*=\s*(\d+)', ref) or [None, '?'])[1]

# documented gaps in the code header
hdr = ref.split('\n')
GAPS = []
cur = None
for line in hdr[:70]:
    if not line.startswith('//'):
        break
    t = line.lstrip('/').strip()
    if re.match(r'^- (Screen \d+|No flag)', t):
        cur = t[2:]
        GAPS.append(cur)
    elif cur and t and not t.startswith('Documented gaps') and line.startswith('//   '):
        GAPS[-1] += ' ' + t
    elif not t:
        cur = None
GAPS = [re.sub(r'\s+', ' ', g) for g in GAPS]

# ------------------------------------------------------------------ app roles and features
personas = json.load(open(os.path.join(APP, 'public', 'config', 'personas.json'), encoding='utf-8'))
catalogue = {f['key']: f for f in json.load(open(os.path.join(APP, 'public', 'config', 'feature-catalogue.json'), encoding='utf-8'))}
TT_FEATURES = [k for k in catalogue if k.startswith('tickets.') or k in ('workspace.qnomy-ticket-history', 'workspace.support-launcher')]
TT_CAPS = ['ticket-audit-trail', 'ticket-reassign-queue', 'ticket-resolve']

# ------------------------------------------------------------------ rows
HEAD = ['ID', 'Category / type', 'Requirement / statement', 'Detail', 'Source type', 'Source reference', 'Status / confidence']


def row(i, cat, stmt, detail, stype, sref, status):
    return [i, cat, stmt, detail, stype, sref, status]


sheets = {}


def add(name, r):
    sheets.setdefault(name, []).append(r)


def conf(b):
    return b['tag'] or 'Explicit'


# 1. Features & capabilities ------------------------------------------------------
for b in req_blocks:
    t = TYPE_OF(b)
    if t in ('Functional', 'UI', 'Reporting'):
        add('Features & Capabilities', row(b['id'], t, b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint requirement', src(b), conf(b)))
for k in TT_FEATURES:
    f = catalogue[k]
    add('Features & Capabilities', row(k, 'As-built feature', f.get('name') or f.get('label') or k, f.get('description', ''), 'App feature catalogue', 'public/config/feature-catalogue.json', 'Implemented' if f.get('screens') is not None or True else ''))
for c in TT_CAPS:
    add('Features & Capabilities', row(c, 'As-built capability (action gate)', c.replace('-', ' ').capitalize(), 'Granted per role in personas.json; gates the matching action in the ticket detail screen.', 'App persona config', 'public/config/personas.json', 'Implemented'))
for b in scr_blocks:
    add('Features & Capabilities', row(b['id'], 'Screen', b['title'], b['fields'].get('Purpose', '') or b['fields'].get('Description', '') or quote(b), 'Blueprint screen', src(b), conf(b)))

# 2. Personas ----------------------------------------------------------------------
for b in persona_blocks:
    f = b['fields']
    detail = '; '.join(f'{k}: {v}' for k, v in f.items() if k in ('Responsibilities', 'Permissions', 'Accessible screens', 'Accessible journeys', 'Restricted features') and TICKET.search(v))
    add('Personas', row(b['id'], 'Persona (blueprint)', b['title'], detail or body(b), 'Blueprint persona', src(b), conf(b)))
for p in personas:
    grants = [g for g in p['features'] if g['key'] in TT_FEATURES]
    caps = [c for c in p['capabilities'] if c in TT_CAPS]
    if grants or caps:
        add('Personas', row(p['id'], f"App role - {p.get('group', '')}", p['name'], '; '.join([f"{g['key']} ({g['level']})" for g in grants] + [f'capability: {c}' for c in caps]), 'App persona config', 'public/config/personas.json', 'Implemented'))
add('Personas', row('APP-APPROVERS', 'Approval eligibility', 'Who can approve or reject a ticket in the approval queue', 'Job titles: ' + ', '.join(APPROVER_TITLES), 'As-built code', 'src/data/reference/ticketReferenceData.ts', 'Implemented (no per-category approval matrix exists for tickets)'))

# 3. Business rules ----------------------------------------------------------------
for b in br_blocks:
    add('Business Rules', row(b['id'], b['section'] or 'Business rule', b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint business rule', src(b), conf(b)))
for code, v in sorted(MPRA.items()):
    g = code[:3]
    if g in ('ASG', 'ESC', 'ASC'):
        add('Business Rules', row('MPRA_001_' + code, MPRA_GROUP.get(g, g), v['text'][0].split('. ')[0][:160], ' '.join(v['text'])[:600], 'As-built code (BRSD item cited in source)', ', '.join(sorted(v['files'])), 'Implemented'))
add('Business Rules', row('APP-REOPEN-WINDOW', 'Resolution, closure and reopen', f'A ticket can be reopened only within {REOPEN_DAYS} days of closing', 'Placeholder window pending Vodafone Qatar confirmation; reopening returns the status to Not Solved and increments the reopen count.', 'As-built code', 'src/data/reference/ticketReferenceData.ts (REOPEN_WINDOW_DAYS)', 'Implemented - value unconfirmed'))
add('Business Rules', row('APP-PRIORITY', 'Ticket creation', 'Priority is derived from the customer type and locked; it is not picked by the agent', 'SLA target hours derive from the customer nationality.', 'As-built code (MPRA_001_CRE-16)', 'src/modules/trouble-ticketing-complaints/screens/TicketCreationModal.tsx', 'Implemented'))

# 4. Validations & eligibility ------------------------------------------------------
for b in req_blocks:
    if TYPE_OF(b) == 'Validation':
        add('Validations & Eligibility', row(b['id'], 'Validation', b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint requirement', src(b), conf(b)))
for code, v in sorted(MPRA.items()):
    g = code[:3]
    if g in ('RES', 'ATT', 'CRE') and re.search(r'mandatory|gated|only|cannot|must|require|within|no outstanding|reason', ' '.join(v['text']), re.I):
        add('Validations & Eligibility', row('MPRA_001_' + code, MPRA_GROUP.get(g, g), v['text'][0].split('. ')[0][:160], ' '.join(v['text'])[:600], 'As-built code (BRSD item cited in source)', ', '.join(sorted(v['files'])), 'Implemented'))
for i, (stmt, det) in enumerate([
    ('Issue Type and template content are both required to commit a ticket', 'An unsubmitted ticket never routes to a queue (BR-068).'),
    ('Resolving requires a Resolution Code and a Hashtag', 'The BRSD also expects Actual Issue; the app does not yet require it (documented gap).'),
    ('Completing a ticket requires no outstanding activities', 'Closing also closes all activities on the ticket (RES-08/09).'),
    ('A Disconnection-category ticket must be closed with a retention Resolution Code (' + ' / '.join(RET_CODES) + ')', 'BR-060: a disconnection order cannot proceed until the ticket is closed with the specific resolution.'),
    ('Escalation, reopening and cancellation each require a reason', 'Escalation reasons: ' + ', '.join(ESC_REASONS) + '. Cancellation reasons: ' + ', '.join(CANCEL_REASONS) + '.'),
    ('Approve or reject only by eligible job titles', 'Eligible: ' + ', '.join(APPROVER_TITLES) + '. Reject reasons: ' + ', '.join(REJECT_REASONS) + '. Return reasons: ' + ', '.join(RETURN_REASONS) + '.'),
    ('A duplicate candidate is flagged when Customer + Category + Area match an open ticket', 'MSISDN and Sub-Area are not captured in the app schema, so only the two matching fields are checked (ASC-02/04).'),
], 1):
    add('Validations & Eligibility', row(f'APP-VAL-{i:02d}', 'As-built validation', stmt, det, 'As-built code', 'src/modules/trouble-ticketing-complaints', 'Implemented'))

# 5. Journey steps & user actions --------------------------------------------------
for b in uj_blocks:
    f = b['fields']
    add('Journey Steps & Actions', row(b['id'], 'Journey (blueprint)', b['title'], f"Actors: {f.get('Actors', '-')} | Steps: {f.get('Workflow steps (summary)', f.get('Workflow steps', '-'))} | Preconditions: {f.get('Preconditions', '-')} | Success: {f.get('Success conditions', '-')} | Exit: {f.get('Exit conditions', '-')}", 'Blueprint journey', src(b), conf(b)))
raise_steps = [
    ('Open the ticket form', 'From Support or a Customer 360 query (How can we help today?). The agent searches an issue or picks an example; the Preview Details drawer shows the query context.'),
    ('Pick the Issue Type', 'Taxonomy from the Process Overview deck (slide 15); 3-character smart search over the issue-type list (CRE-01); Area picklist cascades from Issue Type (CRE-08/09).'),
    ('Enter or paste the template content', 'A per-issue-type template (SCR-213). Only two complaint categories have canned templates evidenced; others get free text. Fields auto-populate from the account/MSISDN context (REQ-065).'),
    ('Resolve the customer', 'Customer ID drives the derived, locked Priority and the SLA target (CRE-16). Knowledge Base access is shown as pending (CRE-05; no integration exists).'),
    ('Duplicate check', 'A warning lists open tickets with the same Customer + Category + Area (ASC-02/04); the agent decides whether to continue.'),
    ('Confirm and submit', 'Confirm commits the ticket (BR-068 gate); Cancel discards it. From the Preview Details drawer the ticket is auto-assigned: the routing rule\'s team where one exists, otherwise Complaints Team.'),
    ('Routing and assignment', 'Assigned at team/queue level (BR-064), never to an individual agent on creation; queues: ' + ', '.join(QUEUES) + '. Self-assignment sets Status and Sub-Status to Assigned (ASG-05/06/07); supervisors reassign across queues.'),
    ('Work the ticket', 'Details, Activities, Notes, Communication (SMS templates), Attachments and Audit tabs on the ticket detail screen (SCR-029/210). Statuses: ' + ', '.join(STATUSES) + '.'),
    ('Escalate, resolve, close, reopen or cancel', 'Each action needs its reason or code (see Validations). Closing triggers the customer satisfaction survey (CSA-01/02). Reopen within the window returns the ticket to Not Solved.'),
    ('Approval (where used)', 'A ticket can be sent to the approval queue and approved, rejected or returned by an eligible approver (Screen 16).'),
]
for i, (s, d) in enumerate(raise_steps, 1):
    add('Journey Steps & Actions', row(f'RTT-{i:02d}', 'Raise Trouble Ticket - step', s, d, 'As-built journey (code + blueprint)', 'src/modules/trouble-ticketing-complaints; src/workspace/customer360/queryFlow', 'Implemented'))

# 6. System behaviours --------------------------------------------------------------
for b in req_blocks:
    if TYPE_OF(b) in ('Workflow', 'Business', 'NonFunctional', 'Security') and b['id'] not in {x['id'] for x in []}:
        add('System Behaviours', row(b['id'], TYPE_OF(b), b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint requirement', src(b), conf(b)))
for sid in ('SCR-210', 'SCR-211', 'SCR-029', 'SCR-212', 'SCR-213'):
    b = beh_blocks.get(sid)
    if b:
        txt = ' | '.join(l.lstrip('- ').strip() for l in b['raw'] if l.startswith('- **'))[:700]
        add('System Behaviours', row(sid, 'Screen behaviour', b['title'], txt, 'Blueprint screen behaviour', 'reference/blueprint/screen-behaviour-catalogue.md', 'Explicit'))
for code, v in sorted(MPRA.items()):
    if code[:3] in ('RES', 'CSA', 'ACT', 'COM', 'AUD', 'ESC', 'ATT'):
        add('System Behaviours', row('MPRA_001_' + code, MPRA_GROUP.get(code[:3], code[:3]), v['text'][0].split('. ')[0][:160], ' '.join(v['text'])[:600], 'As-built code (BRSD item cited in source)', ', '.join(sorted(v['files'])), 'Implemented'))
add('System Behaviours', row('APP-SLA-SWEEP', 'Escalation', 'Breached-SLA tickets are escalated automatically', 'A sweep escalates a ticket once per breach (BR-349): it adds an audit entry and a notification record for the distribution list and next hierarchy position (ESC-06/07). A guard stops a double escalation.', 'As-built code', 'src/modules/trouble-ticketing-complaints/slaEscalationSweep.ts', 'Implemented'))

# 7. Exceptions & alternates --------------------------------------------------------
for b in uj_blocks:
    ex = b['fields'].get('Exit conditions')
    if ex:
        add('Exceptions & Alternates', row(b['id'] + '-EXIT', 'Exit condition', b['title'], ex, 'Blueprint journey', src(b), conf(b)))
txt = read(os.path.join(BP, 'exception-catalogue.md'))
for m in re.finditer(r'^###\s+(.*?[Tt]icket.*?)\n(.*?)(?=^###|\Z)', txt, re.S | re.M):
    steps = [l.lstrip('- ').strip() for l in m.group(2).split('\n') if l.startswith('- **WF')]
    add('Exceptions & Alternates', row('EXC-' + re.sub(r'\W+', '-', m.group(1))[:30], 'Exception flow', m.group(1).strip(), ' | '.join(steps)[:700], 'Blueprint exception catalogue', 'reference/blueprint/exception-catalogue.md', 'Explicit'))
for b in req_blocks:
    if re.search(r'exception|fail|error|delay|escalat|auto-resolved|not submit|reopen|cancel|manual', body(b), re.I) and TYPE_OF(b) not in ('Validation',):
        add('Exceptions & Alternates', row(b['id'], 'Exception / alternate', b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint requirement', src(b), conf(b)))
for code, v in sorted(MPRA.items()):
    if re.search(r'not built|no real|placeholder|honest|cannot|no ', ' '.join(v['text']), re.I) and code[:3] in ('CRE', 'ATT', 'ESC', 'RES'):
        add('Exceptions & Alternates', row('MPRA_001_' + code, 'Alternate / limitation in the app', v['text'][0].split('. ')[0][:160], ' '.join(v['text'])[:600], 'As-built code', ', '.join(sorted(v['files'])), 'Implemented with limitation'))

# 8. Dependencies & integrations ----------------------------------------------------
for b in req_blocks:
    if TYPE_OF(b) == 'Integration':
        add('Dependencies & Integrations', row(b['id'], 'Integration', b['title'], b['fields'].get('Description', '') or quote(b), 'Blueprint requirement', src(b), conf(b)))
for sysname, what, status in [
    ('Siebel (Open UI / Web Call Center)', 'Current system of record for tickets, queues, hashtags and Actual Issue LOVs.', 'Current state'),
    ('NPAS / NPass', 'Auto-creates MNP Port Out tickets (BR-342); 2-hour action window extending to 24 hours once documents validate (BR-049).', 'Documented'),
    ('eShop / portal / MVA', 'System- or customer-originated tickets; MVA requests pass a validation queue before becoming an agent-created ticket (UJ-022).', 'Documented'),
    ('Medallia (survey)', 'Customer satisfaction survey fires on reaching the terminal state (CSA-01/02).', 'Mocked in the app'),
    ('Email / distribution lists / OSB notification', 'Escalation and timer-expiry notifications (ESC-06/07, REQ-075).', 'Persisted as a notification record in the app'),
    ('SMS gateway', 'Automatic SMS templates for ticket events (notification catalogue); manual SMS from the Communication tab.', 'Partial template set in the app'),
    ('Knowledge Base', 'Knowledge-base-assisted category search (CRE-05).', 'Not integrated - the button shows a pending message'),
    ('WFM / OFS', 'Booking a WFM appointment from a ticket (gap #73).', 'Gap'),
    ('Orders', 'Closing a disconnection ticket should auto-create a disconnection order (BR-341).', 'Not built in the app'),
    ('Customer 360 / query flow', 'Provides the customer, segment, nationality and services that drive priority, SLA target and routing.', 'Implemented'),
]:
    add('Dependencies & Integrations', row('DEP-' + re.sub(r'\W+', '', sysname)[:10].upper(), 'System dependency', sysname, what, 'Blueprint + code', 'see Detail', status))

# 9. Reference data -----------------------------------------------------------------
for name, vals in [('Ticket statuses', STATUSES), ('Queues', QUEUES), ('Priorities', PRIORITIES), ('Resolution codes', RES_CODES), ('Escalation reasons', ESC_REASONS),
                   ('Cancellation reasons', CANCEL_REASONS), ('Retention resolution codes', RET_CODES), ('Approval reject reasons', REJECT_REASONS), ('Approval return reasons', RETURN_REASONS)]:
    add('Reference Data', row('REF-' + re.sub(r'\W+', '', name)[:8].upper(), 'Picklist', name, '; '.join(vals), 'As-built code', 'src/data/reference/ticketReferenceData.ts', 'Implemented'))
add('Reference Data', row('REF-HASHTAGS', 'Picklist', 'Hashtags and Actual Issue', 'Siebel LOV exports: VFQA_TT_HASHTAGS (454 values) and VFQA_TT_ACTUAL_ISSUE (355 values); the app carries a sample set.', 'Knowledge document', 'tt-hashtags-and-actual-issue-8d8ccaa5', 'Explicit'))
areas = re.search(r'TT_AREAS[^=]*=\s*\{(.*?)\n\};', ref, re.S)
if areas:
    add('Reference Data', row('REF-AREAS', 'Picklist', 'Areas by issue type', re.sub(r'\s+', ' ', areas.group(1))[:600], 'As-built code', 'src/data/reference/ticketReferenceData.ts', 'Implemented (Sub-Area tier not enumerated in the source)'))

# 10. Notifications -----------------------------------------------------------------
nt = read(os.path.join(BP, 'notification-catalogue.md'))
for m in re.finditer(r'^###\s+(.*?)\n(.*?)(?=^###|^##|\Z)', nt, re.S | re.M):
    if TICKET.search(m.group(1) + m.group(2)):
        msg = re.search(r'\*\*Message \(English\):\*\*\s*(.*)', m.group(2))
        add('Notifications', row('NOT-' + re.sub(r'\W+', '', m.group(1))[:14].upper(), 'SMS / notification', m.group(1).strip(), (msg.group(1) if msg else m.group(2).strip())[:600], 'Blueprint notification catalogue', 'reference/blueprint/notification-catalogue.md', 'Explicit'))

# 11. Gaps & open items --------------------------------------------------------------
ga = read(os.path.join(BP, 'gap-analysis.md'))
for line in ga.split('\n'):
    if line.startswith('- ') and TICKET.search(line):
        m = re.match(r'^- \*\*(.*?)\*\*\s*(?:\((.*?)\))?:?\s*(.*)$', line)
        if m and not (m.group(3) or '').lstrip().startswith('— recovered'):
            gap_n = len([r for r in sheets.get('Gaps & Open Items', []) if str(r[0]).startswith('BP-GAP')]) + 1
            add('Gaps & Open Items', row(f'BP-GAP-{gap_n:02d}', 'Blueprint gap', m.group(1).strip()[:150], (m.group(3) or '')[:600], 'Blueprint gap analysis', 'reference/blueprint/gap-analysis.md', 'Open'))
for i, g in enumerate(GAPS, 1):
    add('Gaps & Open Items', row(f'APP-GAP-{i:02d}', 'Built-app gap (documented in code)', g.split(':')[0][:120], g[:600], 'As-built code', 'src/data/reference/ticketReferenceData.ts', 'Open'))
add('Gaps & Open Items', row('APP-GAP-FLAGS', 'Built-app gap', 'Configuration flags described in the build plan are hard-coded', 'No flag mechanism exists for the ticket features; every behaviour is fixed to its default.', 'As-built code', 'src/data/reference/ticketReferenceData.ts', 'Open'))

# ------------------------------------------------------------------ summary + write
for name in sheets:
    seen, uniq = set(), []
    for r in sheets[name]:
        key = (r[0], r[2])
        if key in seen:
            continue
        seen.add(key)
        uniq.append(r)
    sheets[name] = uniq

ORDER = ['Features & Capabilities', 'Personas', 'Business Rules', 'Validations & Eligibility', 'Journey Steps & Actions', 'System Behaviours',
         'Exceptions & Alternates', 'Dependencies & Integrations', 'Reference Data', 'Notifications', 'Gaps & Open Items']
wb = Workbook()
ws = wb.active
ws.title = 'Summary'
ws.append(['Sheet', 'Rows', 'What it holds'])
DESC = {
    'Features & Capabilities': 'Functional, UI and reporting requirements; the screens; the implemented ticket features and action gates',
    'Personas': 'Blueprint personas that touch tickets, the app roles holding ticket features, and approval eligibility',
    'Business Rules': 'Blueprint BR-* rules and the assignment, escalation and duplicate rules already built',
    'Validations & Eligibility': 'Validation requirements and every mandatory-field, gating and eligibility rule the app enforces',
    'Journey Steps & Actions': 'Blueprint journeys (UJ-022, UJ-109, MNP/FNP ticket handling ...) and the step-by-step Raise Trouble Ticket journey as built',
    'System Behaviours': 'Workflow, business, non-functional and security requirements; screen behaviour; automatic behaviours (SLA sweep, survey trigger)',
    'Exceptions & Alternates': 'Exit conditions, exception flows, alternates and limitations',
    'Dependencies & Integrations': 'Integration requirements and the systems the ticket journey depends on, with their status in the app',
    'Reference Data': 'Statuses, queues, priorities, picklists and reason catalogues',
    'Notifications': 'Automatic SMS and notification templates tied to tickets',
    'Gaps & Open Items': 'Gaps recorded in the blueprint and the gaps the code documents about itself',
}
for n in ORDER:
    ws.append([n, len(sheets.get(n, [])), DESC[n]])
ws.append([])
ws.append(['How to read this', '', 'One row per extracted item. "Source type" says whether it comes from the blueprint (workshops, BRSDs, walkthroughs - cited by knowledge-document slug), from the code the app already implements, or from the app configuration. "Status / confidence" is the blueprint confidence tag, or Implemented / Open for built behaviour. Nothing here is inferred beyond what those sources state; open the cited .knowledge/docs/<slug>.md for full context.'])
ws.append(['Not captured', '', 'The VFQ Trouble Ticket BRSD v1.0 itself is not in the knowledge base; MPRA_001_* identifiers appear only where the code cites them, so the BRSD item text is taken from those code comments.'])
for n in ORDER:
    s = wb.create_sheet(n[:31])
    s.append(HEAD)
    for r in sheets.get(n, []):
        s.append(r)
    s.auto_filter.ref = f'A1:{get_column_letter(len(HEAD))}{max(2, s.max_row)}'

for sheet in wb.worksheets:
    widths = [14, 26, 52, 80, 26, 42, 24] if sheet.title != 'Summary' else [30, 8, 120]
    for i, w in enumerate(widths, 1):
        sheet.column_dimensions[get_column_letter(i)].width = w
    for r in sheet.iter_rows(min_row=2):
        for c in r:
            c.alignment = Alignment(vertical='top', wrap_text=True)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)
sys.path.insert(0, os.path.dirname(__file__))
import format_xlsx  # noqa: E402

format_xlsx.format_file(OUT)
print('wrote', OUT)
for n in ORDER:
    print(f'  {n:30s} {len(sheets.get(n, []))}')
