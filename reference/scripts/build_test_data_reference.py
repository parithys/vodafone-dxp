import glob
import json
import os
import re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# !! WARNING — THIS SCRIPT NO LONGER PRODUCES THE FULL WORKBOOK !!
#
# Test_Data_Reference.xlsx now contains three sheets that this script
# does NOT create, because they were added directly in Excel:
#     "Persona", "Persona by Approach", "ID Lookup (MOI Fetch)"
# Running this script rebuilds the workbook from scratch and WOULD DELETE THEM.
#
# Before regenerating, either port those three sheets into this script, or copy
# them across afterwards from a backup. The Login Credentials sheet below is
# derived from source and was patched into the live workbook in place on
# 2026-09-24 precisely to avoid this destructive rebuild.
#
# Regenerate with: python3 reference/scripts/build_test_data_reference.py
# (run from anywhere — paths are resolved relative to this script's location,
# i.e. <repo>/vfq-dxp-app/reference/scripts/../.. )
APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(APP_ROOT, 'public', 'mock-data')
CONF = os.path.join(APP_ROOT, 'public', 'config')

def load(name, base=DATA):
    with open(f'{base}/{name}.json') as f:
        return json.load(f)

wb = Workbook()

HEADER_FILL = PatternFill('solid', fgColor='E60000')
HEADER_FONT = Font(color='FFFFFF', bold=True)
TITLE_FONT = Font(bold=True, size=16, color='E60000')
SUBTITLE_FONT = Font(size=11, color='555555', italic=True)
NOTE_FONT = Font(size=10, color='7A5C00')
NOTE_FILL = PatternFill('solid', fgColor='FFF6DC')
WRAP = Alignment(wrap_text=True, vertical='top')
THIN = Side(style='thin', color='DDDDDD')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        cell.border = BORDER
    ws.row_dimensions[row].height = 28

def write_table(ws, start_row, headers, rows, col_widths=None):
    for i, h in enumerate(headers, start=1):
        ws.cell(row=start_row, column=i, value=h)
    style_header(ws, start_row, len(headers))
    for r, row_data in enumerate(rows, start=start_row + 1):
        for c, val in enumerate(row_data, start=1):
            cell = ws.cell(row=r, column=c, value=val)
            cell.alignment = WRAP
            cell.border = BORDER
        ws.row_dimensions[r].height = 30
    if col_widths:
        for i, w in enumerate(col_widths, start=1):
            ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=start_row + 1, column=1).coordinate

def title_block(ws, title, subtitle, note=None):
    ws['A1'] = title
    ws['A1'].font = TITLE_FONT
    ws.merge_cells('A1:F1')
    ws['A2'] = subtitle
    ws['A2'].font = SUBTITLE_FONT
    ws.merge_cells('A2:F2')
    row = 4
    if note:
        ws.cell(row=row, column=1, value=note)
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=6)
        cell = ws.cell(row=row, column=1)
        cell.font = NOTE_FONT
        cell.fill = NOTE_FILL
        cell.alignment = WRAP
        ws.row_dimensions[row].height = 45
        row += 2
    return row

# ---------------------------------------------------------------------------
# Sheet 0: Overview
# ---------------------------------------------------------------------------
ws = wb.active
ws.title = 'Start Here'
ws['A1'] = 'VFQ DXP — Test Data Reference'
ws['A1'].font = Font(bold=True, size=20, color='E60000')
ws.merge_cells('A1:D1')
ws['A2'] = 'Every value below is real seed data from public/mock-data and public/config — nothing here is invented. Use it to log in and exercise each screen.'
ws['A2'].font = SUBTITLE_FONT
ws.merge_cells('A2:D2')

overview_rows = [
    ('Login Credentials', 'Staff ID + password to sign in, and which agent identity each one resolves to.'),
    ('Customer Search', 'Every value that matches on the Customer Search page — mobile, QID, customer #, account #, name, email, service ID.'),
    ('Accounts & Services', 'Account IDs and Service IDs behind each customer, for the account-number / service-ID search fields.'),
    ('Orders & Approval Queue', 'Existing orders, how to generate a fresh one that lands in the Approval Queue, the approval matrix, and reject reasons.'),
    ('Agent Task View', 'Seeded tasks and which agent identity each is assigned to, for testing per-agent task scoping.'),
    ('Trouble Tickets', 'The full ticket lifecycle (assignment, SLA/RAG, escalation, resolution/closure, reopen, RBAC) and what each seeded ticket demonstrates.'),
    ('Bell Notifications', 'Seeded notifications per customer, for the Customer 360 banner and Administration config screen.'),
    ('Bulk Notes', 'Seeded bulk notes and the accounts they were posted against.'),
    ('Leads (Sales)', 'Seeded leads for the Sales workspace.'),
    ('Postpaid Plans & Discounts', 'The RED plan tiers and eligible discounts shown on the New Postpaid Activation wizard\'s redesigned Plan & Add-ons step.'),
    ('Number Selection', 'Seeded MSISDN inventory plus how to test the Manual MSISDN Entry card\'s valid/blocked/malformed paths.'),
    ('Devices (DOI)', 'The device catalogue and colour/storage/stock options on the redesigned Device & DOI step, and its DOI declaration gate.'),
    ('Prepaid Activation Eligibility', 'Which seeded customers pass/fail the New Prepaid Activation wizard\'s eligibility gate (blacklist + BR-347 line cap) and payment gating.'),
    ('Prepaid Full Journey', 'The full 9-step Prepaid wizard beyond eligibility/payment: plan tiers, discounts, the BR-348 SIM card charge, HRN approval routing, SIM depletion, fulfilment status progression, and notifications.'),
    ('Verification Codes', 'The demo password and OTP/verification code used everywhere a code is required (password reset, MFA, change password).'),
]
r = 4
ws.cell(row=r, column=1, value='Sheet').font = Font(bold=True)
ws.cell(row=r, column=2, value='What it covers').font = Font(bold=True)
style_header(ws, r, 2)
for i, (name, desc) in enumerate(overview_rows, start=r + 1):
    ws.cell(row=i, column=1, value=name).border = BORDER
    d = ws.cell(row=i, column=2, value=desc)
    d.border = BORDER
    d.alignment = WRAP
    ws.row_dimensions[i].height = 30
ws.column_dimensions['A'].width = 26
ws.column_dimensions['B'].width = 95

# ---------------------------------------------------------------------------
# Sheet 1: Login Credentials
# ---------------------------------------------------------------------------
ws = wb.create_sheet('Login Credentials')
note = ('2026-09-24: regenerated for the 26 operational roles (ROLE-01..ROLE-26, VFQ12341..VFQ12366). Every row '
        'below is DERIVED from public/config/personas.json + public/mock-data/users-agents.json, with the password '
        'parsed from src/auth/staffIdRoleMap.ts — nothing here is restated by hand, so it cannot drift from the app. '
        'Password is the SAME for every Staff ID (placeholder — real VFQ credentials are not confirmed, see '
        'D-02/OI-AGN-04). Staff ID entry is normalised, so "VFQ-12341", "vfq 12341" and "VFQ12341" all resolve to '
        'the same role. Channel and Context card are no longer traceability-only: they drive the header context '
        'chip via agentPrivilegeEngine. "Resulting agent identity" is now a deterministic 1:1 lookup via the role\'s '
        'identityUserId, so each Staff ID logs you in as a distinct person — the previous keyword matcher, which '
        'collapsed VFQ12342/12344/12345 onto Rachel Thompson, is gone.')
row = title_block(ws, 'Login Credentials', 'public/config/personas.json + public/mock-data/users-agents.json', note)

# Derived, not restated — see the note above.
_pw = re.search(r"DEMO_LOGIN_PASSWORD\s*=\s*'([^']+)'",
                open(os.path.join(APP_ROOT, 'src', 'auth', 'staffIdRoleMap.ts')).read()).group(1)
_personas = load('personas', base=CONF)
_agents = {a['userId']: a for a in load('users-agents')}
_catalogue = {f['key']: f for f in load('feature-catalogue', base=CONF)}
_built = set()
for _p in glob.glob(os.path.join(APP_ROOT, 'src', 'modules', '*', 'screens', 'index.tsx')):
    _built |= set(re.findall(r"'(SCR-\d+)'", open(_p).read()))

_CAP_HINT = {
    'ticket-resolve': 'set a Resolution Code and close a complaint',
    'ticket-reassign-queue': 'reassign a ticket queue',
    'task-assign': 'assign a task to another team member',
    'backoffice-config': 'configure Bell Notifications and Bulk Notes',
    'invoice-actions': 'download/print/resend invoices (BR-06)',
    'edit-customer-records': 'edit customer contact/address/billing profile (BR-02)',
    'agent-oversight': 'see BOTH session reference numbers',
    'ticket-audit-trail': 'view the ticket audit trail (BR-067)',
}


def _what_to_test(p):
    bits = [f"Approach: {p['approach']}"]
    bits.append(f"header shows {p['contextCard']}" if p['contextCard'] != 'Hidden' else 'no header context card')
    bits += ['can ' + _CAP_HINT[c] for c in p['capabilities'] if c in _CAP_HINT]
    if 'edit-customer-records' not in p['capabilities']:
        bits.append('CANNOT edit customer records — use to verify the read-only path')
    planned = sum(1 for g in p['features']
                  if _catalogue[g['key']]['screenIds']
                  and not any(s in _built for s in _catalogue[g['key']]['screenIds']))
    if planned:
        bits.append(f'{planned} granted feature(s) show as Planned placeholders')
    return '. '.join(bits[:6]) + '.'


login_rows = []
for p in _personas:
    a = _agents[p['identityUserId']]
    login_rows.append((
        p['staffId'], _pw, p['name'], p['channel'], p['contextCard'],
        f"{a['firstName']} {a['lastName']}", a['jobTitle'], a['team'], p['identityUserId'],
        _what_to_test(p),
    ))
login_rows.append(('anything else', 'any value') + ('\u2014',) * 7 + (
    f'Login is rejected with "Staff ID not recognised." \u2014 only the {len(_personas)} Staff IDs above are '
    'recognised. Entry is normalised, so "VFQ-12341", "vfq 12341" and "VFQ12341" all resolve to the same role.',))
login_rows.append(('any of the above', 'wrong password') + ('\u2014',) * 7 + (
    'Login is rejected with "Incorrect password." \u2014 use this to test the login failure state.',))

write_table(ws, row,
    ['Staff ID', 'Password', 'Role label shown at login', 'Channel', 'Context card', 'Resulting agent name', 'Resulting job title', 'Resulting team', 'Resulting userId', 'What to test with it'],
    login_rows,
    [16, 14, 33, 22, 20, 18, 24, 18, 16, 60])

# ---------------------------------------------------------------------------
# Sheet 2: Customer Search
# ---------------------------------------------------------------------------
customers = load('customers')
ws = wb.create_sheet('Customer Search')
note = ('Customer Search matches on: Mobile, QID/Passport, Customer #, Name, and Email directly against the fields below '
        '(partial, case-insensitive match — typing part of a value works, e.g. "28512" matches Ahmed\'s mobile). '
        'Account # and Service ID are matched separately — see the "Accounts & Services" sheet for those values. '
        '(src/engines/customer360Engine.ts)')
row = title_block(ws, 'Customer Search', 'public/mock-data/customers.json', note)

cust_rows = []
for c in customers:
    cust_rows.append((
        c.get('customerId'), c.get('qid'), c.get('idType'), c.get('name'), c.get('phone'), c.get('email'),
        c.get('segment'), 'Yes' if c.get('blacklisted') else 'No',
        'Yes' if c.get('hrnAdvancePaymentRequired') else 'No',
    ))
# Notes per interesting customer
special_notes = {
    'CUST-1001': 'Plain consumer, no special flags — baseline happy-path customer.',
    'CUST-1002': 'HRN customer (High Risk Nationality) — triggers the advance-payment eligibility gate and routes new postpaid orders to the Approval Queue.',
    'CUST-1003': 'Plain consumer with an existing Fixed Line (GigaHome) account — has an installed asset/Service ID.',
    'CUST-1004': 'Blacklisted = true — use to test the blacklist rejection path in the eligibility gate.',
    'CUST-2001': 'Enterprise (EBU) contact — has both a parent and a sub-account.',
    'CUST-1005': 'Consumer with a UAE passport-style QID, no seeded account/orders.',
    'CUST-1006': 'Diplomatic ID holder, no seeded account/orders.',
    'CUST-9001': 'Generic QA test user, no seeded account/orders.',
}
headers = ['Customer ID', 'QID / Passport', 'ID Type', 'Name', 'Mobile', 'Email', 'Segment', 'Blacklisted?', 'HRN advance payment required?', 'Notes']
rows_with_notes = []
for r_, c in zip(cust_rows, customers):
    rows_with_notes.append(r_ + (special_notes.get(c.get('customerId'), ''),))
write_table(ws, row, headers, rows_with_notes, [14, 20, 12, 24, 16, 30, 18, 14, 14, 60])

# ---------------------------------------------------------------------------
# Sheet 3: Accounts & Services
# ---------------------------------------------------------------------------
accounts = load('accounts')
assets = load('installed-assets')
ws = wb.create_sheet('Accounts & Services')
note = ('"Account #" and "Service ID" are two more Customer Search fields — try these values there too. Only the '
        'customers/accounts listed here have a seeded account; the rest (CUST-1004/1005/1006/9001) have none.')
row = title_block(ws, 'Accounts & Services', 'public/mock-data/accounts.json + installed-assets.json', note)

acc_by_id = {a['accountId']: a for a in accounts}
asset_by_acc = {}
for a in assets:
    asset_by_acc.setdefault(a['accountId'], []).append(a)

acc_rows = []
for a in accounts:
    svc = asset_by_acc.get(a['accountId'], [])
    svc_ids = ', '.join(s.get('serviceId', '') for s in svc) or '—'
    svc_desc = ', '.join(s.get('productServiceName', '') for s in svc) or '—'
    acc_rows.append((a.get('accountId'), a.get('customerId'), a.get('accountType'), a.get('status'), svc_ids, svc_desc))

write_table(ws, row,
    ['Account #', 'Customer ID', 'Account Type', 'Status', 'Service ID(s)', 'Service description'],
    acc_rows, [14, 14, 30, 12, 18, 34])

# ---------------------------------------------------------------------------
# Sheet 4: Orders & Approval Queue
# ---------------------------------------------------------------------------
orders = load('orders')
reject_reasons = load('reject-reasons')
matrix = json.load(open(f'{CONF}/approval-matrix.json'))
ws = wb.create_sheet('Orders & Approval Queue')
note = ('The Approval Queue is EMPTY by default — none of the 5 seeded orders are in "Submitted for Approval" status. '
        'To populate it: run the New Postpaid Activation, New Fixed Line, New FWA, or MNP Port-In wizard (Sales workspace) '
        'and tick the "B2B2C order" checkbox on the contact step — all four wizards now write an order-type string that '
        'matches an approval-matrix category (New Postpaid Activation / New Fixed Line Activation / New FWA Postpaid '
        'Outdoor Order / MNP Postpaid Port-In), so the role gate applies to all of them. Note the two seeded historical '
        'orders ORD-90003/ORD-90004 use slightly different order-type strings ("New FWA 5G Outdoor Activation" / "New '
        'Fixed Line - Triple Play") than the matrix — that is harmless since both are already Complete/Open and never '
        're-enter the approval flow, but do not use those exact strings as a template if you are hand-editing an order '
        'into "Submitted for Approval" for testing; use the wizard-created strings shown in the matrix below instead. '
        'For MNP specifically: only a B2B2C Port-In goes to approval — a Consumer/HRN Port-In (the evidenced UJ-069 case) '
        'still lands in status "Pending" as before, since that reflects a real port request awaiting the donor operator, '
        'not a B2B2C order awaiting manager sign-off. Also: CUST-1002 (HRN) will trigger the advance-payment gate on the '
        'New Postpaid wizard, which independently sets the order to Submitted for Approval regardless of the B2B2C '
        'checkbox. New Prepaid Activation now has its own matrix entry too — any prepaid order for an HRN customer '
        '(CUST-1002) routes to approval the same way, no B2B2C checkbox involved (prepaid has no B2B2C concept).')
row = title_block(ws, 'Orders & Approval Queue', 'public/mock-data/orders.json + public/config/approval-matrix.json', note)

order_rows = [(o.get('orderId'), o.get('orderType'), o.get('orderSubType'), o.get('status'), o.get('approvalStatus'), o.get('customerId')) for o in orders]
row = write_table(ws, row,
    ['Order #', 'Order Type', 'Sub-Type', 'Status', 'Approval Status', 'Customer ID'],
    order_rows, [14, 26, 14, 14, 20, 14]) or row

next_row = row + len(order_rows) + 3
ws.cell(row=next_row, column=1, value='Configured Approval Matrix (AAV-01)').font = Font(bold=True, size=13, color='E60000')
next_row += 1
ws.cell(row=next_row, column=1, value='Placeholder mapping — the BRSD does not specify real category/role content; see public/config/approval-matrix.json for the source.').font = NOTE_FONT
next_row += 2
matrix_rows = [(m['category'], m['requiredRole']) for m in matrix]
write_table(ws, next_row, ['Order Category', 'Role required to approve'], matrix_rows, [30, 30])

next_row2 = next_row + len(matrix_rows) + 3
ws.cell(row=next_row2, column=1, value='Reject Reasons').font = Font(bold=True, size=13, color='E60000')
next_row2 += 2
reason_rows = [(r_.get('reasonCode'), r_.get('reasonLabel')) for r_ in reject_reasons]
write_table(ws, next_row2, ['Reason Code', 'Reason Label'], reason_rows, [22, 44])

# ---------------------------------------------------------------------------
# Sheet 5: Agent Task View
# ---------------------------------------------------------------------------
tasks = load('tasks')
ws = wb.create_sheet('Agent Task View')
note = ('Tasks with no assigned agent (blank below) are visible to every logged-in agent. Tasks assigned to a specific '
        'userId are ONLY visible to that agent — log in as USR-1101 (Fatima, Staff ID VFQ12341) vs USR-1102 (Omar, '
        'VFQ12355) to see the difference (ATV-02 per-agent scoping). Log in as VFQ12363 (Rachel, Sales '
        'Manager) to test assigning an unassigned task to a team member — that control only appears for the Manager persona.')
row = title_block(ws, 'Agent Task View', 'public/mock-data/tasks.json', note)
task_rows = [(t.get('taskId'), t.get('taskName'), t.get('taskType'), t.get('taskStatus'), 'Yes' if t.get('priorityFlag') else 'No', t.get('assignedAgentId') or '(unassigned — visible to everyone)') for t in tasks]
write_table(ws, row,
    ['Task ID', 'Task Name', 'Type', 'Status', 'Priority?', 'Assigned to (userId)'],
    task_rows, [14, 34, 14, 14, 12, 34])

# ---------------------------------------------------------------------------
# Sheet 6: Trouble Tickets
# ---------------------------------------------------------------------------
tickets = load('trouble-tickets')
ws = wb.create_sheet('Trouble Tickets')
note = ('2026-09-11 rebuild closes most of the gaps found in the Trouble Ticket BRSD forensic gap analysis: '
        'assignment (Assign to me / supervisor Reassign queue), SLA/RAG (BR-349, computed live against slaDueAt) with '
        'auto-escalation, manual escalation with mandatory reason, resolution (Resolution Code + Hashtag gate, RES-01) '
        '-> Complete (gated on no open activities, RES-08) -> Close (closes all activities, triggers a CSA-01/02 '
        'notification) -> Reopen (mandatory reason + a 7-day window, P-12 placeholder) or Cancel (mandatory reason '
        'code), real Activities (manual + auto-logged), Attachments (metadata only, blocked on Closed/Cancelled per '
        'ATT-03), and an Audit Trail tab wired to audit-trail.json. Status vocabulary was corrected to match the '
        'BRSD\'s own terms (Not Solved/Assigned/Escalate/Solved/Completed/Closed/Cancelled) — "Open"/"Reopened" '
        'never appear in the source and were replaced. RBAC (§12 of the gap report): Resolution is gated to the '
        'Complaints Team/Supervisor/Admin personas — switch role via the profile menu\'s "Switch role" select to '
        '"Complaints Team (Mobile and Fixed)" to test it; the default Retail/Sales Agent persona sees "Resolution '
        'requires Complaints Team — use Escalate to route it" instead. The Audit Trail tab is hidden for the '
        'Retail/Sales Agent and FL Agents personas (BR-067) and visible for every other persona.')
row = title_block(ws, 'Trouble Tickets', 'public/mock-data/trouble-tickets.json + TicketDetail.tsx', note)
ticket_rows = [
    (t.get('ticketId'), t.get('customerId'), t.get('status'), t.get('category'), t.get('area', ''), t.get('priority', ''),
     t.get('queue', ''), t.get('assignedTo') or '—', t.get('slaTargetHours', ''))
    for t in tickets
]
row = write_table(
    ws, row,
    ['Ticket ID', 'Customer ID', 'Status', 'Category', 'Area', 'Priority', 'Queue', 'Assigned To', 'SLA Target (h)'],
    ticket_rows, [14, 14, 14, 20, 14, 12, 18, 16, 14],
) or row

next_row = row + len(ticket_rows) + 3
ws.cell(row=next_row, column=1, value='What each seeded ticket demonstrates').font = Font(bold=True, size=13, color='E60000')
next_row += 2
demo_rows = [
    ('TT-40001', 'Fresh, unassigned, SLA Green — the baseline ticket for Assign/Escalate/Resolve/Complete/Close/Reopen testing.'),
    ('TT-40002', 'Closed 3 days before the demo date — within the 7-day reopen window, so Reopen should succeed.'),
    ('TT-40003', 'HRN customer (48h Expatriate SLA target), created far enough in the past that its SLA is already breached — a real RAG-Red, auto-escalated ("Escalate" status) demo ticket.'),
    ('TT-40004', 'Closed well over 7 days before the demo date — outside the reopen window, so Reopen is disabled with the RES-10 guidance message.'),
    ('TT-40005', 'Enterprise customer (CUST-2001) — demonstrates CRE-16 priority derivation locking to 1-ASAP instead of a freely-chosen value; also a duplicate-detection hit when creating a new SOC ticket for the same customer.'),
]
write_table(ws, next_row, ['Ticket', 'What it tests'], demo_rows, [14, 90])

# ---------------------------------------------------------------------------
# Sheet 7: Bell Notifications
# ---------------------------------------------------------------------------
bells = load('bell-notifications')
ws = wb.create_sheet('Bell Notifications')
note = ('Open Customer 360 for the Customer IDs below to see the banner (Published + not yet expired only — Drafts and '
        'already-expired ones are hidden from the agent-facing banner, only visible on the Administration > Bell '
        'Notifications config screen). BELL-8004 is already past its expiry date and will show as "Expired" there.')
row = title_block(ws, 'Bell Notifications', 'public/mock-data/bell-notifications.json', note)
bell_rows = [(b.get('notificationId'), b.get('customerId'), b.get('status'), b.get('expiresAt') or '—', b.get('message', '')) for b in bells]
write_table(ws, row, ['Notification ID', 'Customer ID', 'Status', 'Expires At', 'Message'], bell_rows, [16, 14, 12, 26, 55])

# ---------------------------------------------------------------------------
# Sheet 8: Bulk Notes
# ---------------------------------------------------------------------------
notes = load('bulk-notes')
ws = wb.create_sheet('Bulk Notes')
row = title_block(ws, 'Bulk Notes', 'public/mock-data/bulk-notes.json',
                   'Open any account listed below in Customer 360 > Bulk Notes tab to see the note.')
note_rows = [(n.get('noteId'), ', '.join(n.get('accountIds', [])), n.get('postedAt'), n.get('content', '')) for n in notes]
write_table(ws, row, ['Note ID', 'Posted to Account(s)', 'Posted At', 'Content'], note_rows, [14, 30, 22, 60])

# ---------------------------------------------------------------------------
# Sheet 9: Leads
# ---------------------------------------------------------------------------
leads = load('leads')
ws = wb.create_sheet('Leads (Sales)')
row = title_block(ws, 'Leads (Sales workspace)', 'public/mock-data/leads.json', None)
lead_rows = [(l.get('leadId'), l.get('serviceNeeded'), l.get('status'), l.get('ownerId'), l.get('mobileNumber') or '—', l.get('callbackDate') or '—') for l in leads]
write_table(ws, row, ['Lead ID', 'Service Needed', 'Status', 'Owner (agent ID)', 'Mobile', 'Callback Date'], lead_rows, [14, 18, 20, 20, 18, 16])

# ---------------------------------------------------------------------------
# Sheet: New Postpaid Plans & Discounts
# ---------------------------------------------------------------------------
products = load('products')
addons_discounts = load('addons-discounts')
ws = wb.create_sheet('Postpaid Plans & Discounts')
note = ('Redesigned "Plan & Add-ons" step (New Postpaid Activation wizard only — Fixed Line/FWA/MNP/Pre-to-Post still use '
        'the original single-column ProductPlanStep and are unaffected). Plan names follow the evidenced "Postpaid Red '
        '<price> Promotion" naming family (Pre-to-Post guided-journey Plan step); the specific data/speed values per '
        'tier are representative demo catalogue entries, same as the rest of products.json. Discounts reuse the '
        'Loyalty Discount concept/rate already evidenced in addons-discounts.json (ADO-7103) rather than inventing new '
        'discount types.')
row = title_block(ws, 'Postpaid Plans & Discounts', 'public/mock-data/products.json + addons-discounts.json', note)
plan_rows = [
    (p.get('productId'), p.get('name'), p.get('mrcQAR'), p.get('dataAllowanceGB') or 'Unlimited', p.get('minutesAllowance'),
     p.get('speedTier'), 'Yes' if p.get('popular') else '')
    for p in products if p.get('type') == 'Postpaid Plan'
]
row = write_table(ws, row, ['Product ID', 'Plan Name', 'MRC (QAR)', 'Data', 'Voice', 'Speed', 'Popular?'], plan_rows, [12, 32, 12, 14, 20, 16, 12]) or row

next_row = row + len(plan_rows) + 3
ws.cell(row=next_row, column=1, value='Eligible Discounts (per plan)').font = Font(bold=True, size=13, color='E60000')
next_row += 2
disc_rows = [(d.get('addonDiscountId'), d.get('planId'), d.get('name'), f"{round(d.get('price', 0) * 100)}%", d.get('description')) for d in addons_discounts if d.get('category') == 'Discount']
write_table(ws, next_row, ['Discount ID', 'Applies to Product ID', 'Name', 'Rate', 'Description'], disc_rows, [14, 18, 20, 10, 44])

# ---------------------------------------------------------------------------
# Sheet 10: Verification Codes
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Sheet: Number Selection
# ---------------------------------------------------------------------------
numbers = load('numbers')
ws = wb.create_sheet('Number Selection')
note = ('The Number Selection step (New Postpaid/Fixed Line/FWA wizards) also has a "Manual MSISDN Entry" card below '
        'the grid for reserving any MSISDN not in the seeded inventory below — type a full +974-prefixed 8-digit '
        'number (e.g. +974 3300 9999) and click "Reserve Custom Number". To test its rejection paths: type '
        '+97433001003 (seeded as Blocked below) to see the "already blocked" error, or an incomplete/malformed number '
        'to see the format error.')
row = title_block(ws, 'Number Selection', 'public/mock-data/numbers.json', note)
number_rows = [(n.get('msisdn'), n.get('category'), n.get('status'), n.get('priceQAR'), n.get('valueTier') or '—') for n in numbers]
write_table(ws, row, ['MSISDN', 'Category', 'Status', 'Price (QAR)', 'Value Tier'], number_rows, [18, 12, 14, 14, 14])

# ---------------------------------------------------------------------------
# Sheet 10: Verification Codes
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Sheet: Devices (DOI)
# ---------------------------------------------------------------------------
devices = load('device-installments')
ws = wb.create_sheet('Devices (DOI)')
note = ('New Postpaid Activation\'s redesigned "Device & DOI" step. DOI = Device on Installment (BR-114/BR-106/BR-329) '
        '— the step\'s own declaration section is correctly labelled "Device on Installment (DOI) Declaration", not '
        '"Declaration of Intent". Selecting any device below (not "SIM only") requires ticking both DOI checkboxes '
        'before Continue enables — "SIM only" skips the declaration entirely. Total contract value = upfront + '
        '(monthly instalment x term); Monthly total = device instalment + the Plan & Add-ons total from the earlier step.')
row = title_block(ws, 'Devices (DOI)', 'public/mock-data/device-installments.json', note)
seen_devices = set()
device_rows = []
for d in devices:
    if d['deviceName'] in seen_devices:
        continue
    seen_devices.add(d['deviceName'])
    device_rows.append((
        d.get('deviceName'), d.get('devicePriceQar'), d.get('downPaymentQar'), d.get('installmentMonths'),
        d.get('monthlyInstallmentQar'), ', '.join(d.get('colourOptions', [])), ', '.join(d.get('storageOptions', [])),
        d.get('catalogStockStatus'), d.get('tradeInBonusQar') or '—'
    ))
write_table(ws, row,
    ['Device', 'Price (QAR)', 'Default Upfront', 'Default Term', 'Default Monthly', 'Colours', 'Storage', 'Stock Status', 'Trade-in Bonus'],
    device_rows, [22, 12, 14, 12, 14, 30, 20, 14, 14])

# ---------------------------------------------------------------------------
# Sheet: Prepaid Activation Eligibility
# ---------------------------------------------------------------------------
ws = wb.create_sheet('Prepaid Activation Eligibility')
note = ('New Prepaid Activation wizard (SCR-190) has 10 steps, in the shape of New Connection: Customer Identification (identity, '
        'contact and eligibility) -> Address -> Offers -> Plan -> Number (or a Pre-Paired SIM) -> SIM -> Subscriptions (Add another subscription?) -> Checkout -> CAF & Signature -> Payment '
        '(originally just Contact -> Number -> SIM Serial, with no gate before reservation, no plan/CAF/checkout at all, '
        'and no payment before the order was marked Complete — see the "Prepaid Full Journey" sheet for the other 6 '
        'steps and full onSubmit mechanics). Eligibility reuses the same EligibilityGateStep component New Postpaid '
        'Activation uses, in a "prepaid" mode: it checks blacklist status (same as postpaid) plus a prepaid-specific line '
        '-count cap (BR-347 in ruleEngine.ts, sourced from this journey\'s own BRSD BR-003 — NOT the general catalogue\'s '
        'unrelated BR-003 "Try & Buy 30-Day Waiver"), and it deliberately hides the HRN-advance-payment banner and '
        'credit-limit badge that postpaid shows, since MPRA_001_CAM_04/ECC_03/BAM_01 explicitly exclude both from '
        'Prepaid Activation. On submit, the wizard finds-or-creates a "Consumer Mobile Prepaid" account for the resolved '
        'customer (visible on their Customer 360 > Profile > Accounts list) and increments that customer\'s '
        'activePrepaidLines by 1 — so re-running the wizard against the same customer moves them closer to (or past) '
        'their BR-347 cap. That increment only persists for the current browser session; a full page reload re-seeds '
        'from these JSON files.')
row = title_block(ws, 'Prepaid Activation Eligibility', 'src/components/domain/EligibilityGateStep.tsx + ruleEngine.ts (BR-347) + customers.json', note)

elig_rows = [
    ('CUST-1004', 'QID', 'Qatari', 'blacklisted', '—', 'Blocked — blacklist check fails regardless of line count (blacklistReason: "Outstanding dues > threshold").'),
    ('CUST-1005', 'GCC ID', 'Emirati', 2, 2, 'Blocked — GCC ID cap is 2 prepaid lines (BR-003) and this customer is already at 2. Same customer is also pre-seeded at the postpaid BR-288 cap, so it exercises both gates\' failure paths.'),
    ('CUST-1002', 'Passport', 'Nepalese (HRN)', 1, 1, 'Passes at 1/2 — a boundary case one below the Passport cap of 2. HRN flag is true on this customer but the HRN banner/credit-limit badge stay hidden per CAM_04, unlike on the postpaid wizard.'),
    ('CUST-1001', 'QID', 'Qatari', 1, 0, 'Passes — Qatari nationals are unrestricted under BR-003 regardless of line count.'),
    ('CUST-1003', 'QID', 'Qatari', 0, 0, 'Passes — unrestricted, clean baseline customer.'),
    ('CUST-1006', 'Diplomatic ID', 'French', 0, 0, 'Passes — BR-003\'s source text does not cover Diplomatic ID at all, so it is left unrestricted rather than an invented cap.'),
    ('CUST-9001', 'QID', 'Qatari', 0, 0, 'Passes — QA test identity, unrestricted (Qatari).'),
]
write_table(ws, row,
    ['Customer ID', 'ID Type', 'Nationality / Segment', 'Active postpaid lines', 'Active prepaid lines', 'Expected Eligibility result'],
    elig_rows, [14, 16, 22, 16, 16, 70])

# ---------------------------------------------------------------------------
# Sheet: Prepaid Full Journey
# ---------------------------------------------------------------------------
ws = wb.create_sheet('Prepaid Full Journey')
note = ('Closes the remaining Mobile Prepaid Activation BRSD gaps beyond the P1 fixes above (2026-09-11 follow-up). '
        'Full step list: Contact -> Eligibility -> Address & Contact Details (MPRA_001_CAM_05, reuses ZsbAddressStep, '
        'non-blocking) -> Plan & Discount (MPRA_001_QPC_01-04, new PrepaidPlanStep) -> Number Selection -> SIM Type '
        '(MPRA_001_SIM_01, reuses SimTypeStep — Physical or eSIM only; "Printed eSIM"/"Virtual eSIM" are not modelled '
        'as distinct selectable options, matching the same component postpaid uses) -> Checkout (MPRA_001_CVC_01-03, '
        'new PrepaidCheckoutStep) -> CAF & Key Information (MPRA_001_CAF_01-03, reuses CafSignatureCapture) -> Payment '
        '(MPRA_001_PAY_01/02, reuses WinCashPaymentStep, now gated on the FULL checkout total, not just the number '
        'price). On submit: physical SIMs are depleted (stockStatus -> Issued, MPRA_001_PAY_03) — try reusing a serial '
        'from a completed order and it now correctly shows "This SIM is already assigned"; HRN customers route to the '
        'Order Approval Queue instead of auto-completing (BR-004, new "New Prepaid Activation" approval-matrix entry, '
        'same mechanism as postpaid\'s HRN/B2B2C routing) with orderSubType recording the derived HRN flag '
        '(MPRA_001_CAM_03); non-HRN orders run through a ~1 second simulated fulfilment delay before flipping from '
        '"Open" to "Complete" (MPRA_001_NET_02-06 — the first place in this app an order progresses through an '
        'intermediate status rather than jumping straight to a terminal one); and a real osb-notifications record is '
        'created (MPRA_001_NOT_01, visible on Customer 360 > Notifications), not just a toast. Not built, and why: '
        'Qnomy queue ticketing (MPRA_001_JSM_01) and a Tracking Record entity (DF-01) have zero implementation '
        'anywhere else in this app — building them only for prepaid would be a fabricated one-off, not a real reused '
        'capability. Email is captured/displayed but not "verified" (INT-04), consistent with every other journey '
        'including postpaid. The BRSD\'s "notify all active MSISDNs on the QID" recipient list (DF-20) is not modelled '
        '— this schema has no cross-line directory to resolve that from, so the notification targets only the '
        'just-activated MSISDN.')
row = title_block(ws, 'Prepaid Full Journey', 'src/modules/mobile-prepaid/screens/NewPrepaidWizard.tsx + ruleEngine.ts (BR-348)', note)

journey_rows = [
    ('Plan tiers', 'PROD-300 SIM only (QAR 0), PROD-301 Prepaid Red 25, PROD-302 Prepaid Red 50 (POPULAR), PROD-303 Prepaid Red 100 — each with a starter pack charge, data/voice allowance and pack validity instead of postpaid\'s monthly recurring charge.'),
    ('Discounts', 'ADO-7109/7110/7111 "Prepaid Welcome Discount" (-10%), one per Red tier — MPRA_001_QPC_04\'s "Special discount."'),
    ('SIM card charge (BR-348/BR-013)', 'Threshold QAR 10 for QID, QAR 40 for Passport, compared against the selected pack\'s starter pack charge. Below threshold: a QAR 15 placeholder charge applies (the BRSD names the threshold but never the charge amount itself — flagged in ruleEngine.ts). Try Prepaid Red 25 (QAR 25) with a Passport contact: 25 < 40, so the charge applies.'),
    ('HRN approval routing test', 'CUST-1002 (Passport, HRN) — any prepaid order for this customer routes to "Submitted for Approval" and appears in Orders > Approval Queue requiring the "Back Office Fulfilment" role, instead of completing automatically.'),
    ('SIM depletion test', 'Complete one order with a Physical SIM and a specific serial (e.g. the always-available 8974412345678901234), then start a second order and enter the same serial at the SIM Type step — it now correctly shows "This SIM is already assigned."'),
    ('Fulfilment status progression test', 'Complete a non-HRN order and immediately check Customer 360 > Orders — status briefly reads the intermediate state before settling on "Complete" a moment later (the ~900ms simulated NET_02-06 fulfilment delay).'),
    ('Notification test', 'After any completed or approval-routed order, open Customer 360 > Notifications for that customer — a new row appears sourced from osb-notifications.json, not just a toast.'),
]
write_table(ws, row, ['Aspect', 'Details / how to test it'], journey_rows, [30, 90])

# ---------------------------------------------------------------------------
# Sheet 10: Verification Codes
# ---------------------------------------------------------------------------
ws = wb.create_sheet('Verification Codes')
note = ('These are placeholder demo values (the BRSD leaves the real password policy and OTP mechanism open — '
        'OI-AGN-04/05/06, D-02) — they are not real VFQ credentials, just what this mock build checks against.')
row = title_block(ws, 'Passwords & Verification Codes', 'src/auth/staffIdRoleMap.ts, src/auth/ForgotPasswordFlow.tsx, src/workspace/profile/AgentProfileWorkspace.tsx', note)
code_rows = [
    ('Login password', 'Vodafone@123', 'Same for every Staff ID on the Login screen.'),
    ('Forgot Password — verification code', '123456', 'Sent after entering a Staff ID in the Forgot Password flow.'),
    ('Change Password (Agent Profile) — verification code', '123456', 'Required alongside current password to change password from the Profile screen.'),
    ('Enable MFA — verification code', '123456', 'Required to confirm enabling MFA from the Profile screen.'),
    ('New password policy', '(free text, min 8 chars, ≥1 letter, ≥1 number)', 'Applies to both Forgot Password reset and in-session Change Password.'),
]
write_table(ws, row, ['Where it is used', 'Value to enter', 'Notes'], code_rows, [42, 40, 55])

for name in wb.sheetnames:
    wb[name].sheet_view.showGridLines = False

out_path = os.path.join(APP_ROOT, 'reference', 'outputs', 'Test_Data_Reference.xlsx')
wb.save(out_path)
from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines
format_file(out_path)
print('Saved:', out_path)
