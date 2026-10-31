#!/usr/bin/env python3
"""Generate reference/outputs/EBU-Customer-Inventory.xlsx - the enterprise (EBU) test-customer inventory.

The EBU counterpart of Customer-Inventory.xlsx (same README / Customers / Scenario Coverage / Roles & Login /
Journey Access by Role / Open Questions layout), for business customers: enterprise accounts (ENT-ACC-*, and the
ACC-* business sub-accounts), the individuals linked to them, their authorised contacts, and the IoT / volumetric /
invoice records hanging off them.

GENERATED, never hand-edited: every row is parsed from public/mock-data, the roles and their grants from
public/config/personas.json, the demo password from src/auth/staffIdRoleMap.ts. The only hand-written text is the
SCENARIOS table below (what each NAMED account is for), kept next to the data it describes.

Run:  python3 reference/scripts/build_ebu_customer_inventory.py
"""
import json
import re
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

APP = Path(__file__).resolve().parents[2]
MOCK = APP / "public" / "mock-data"
OUT = APP / "reference" / "outputs" / "EBU-Customer-Inventory.xlsx"
CONSUMER_INVENTORY = APP / "reference" / "outputs" / "02 Customer-Inventory.xlsx"
AS_OF = date(2026, 10, 7)
RED = "E60000"
SEED_TAG = "Customer-Inventory seed (2026-10-02)"


def load(name):
    return json.loads((MOCK / f"{name}.json").read_text())


enterprise = load("enterprise-accounts")
customers = load("customers")
accounts = load("accounts")
auth_contacts = load("authorised-contacts")
iot = load("iot-sim-devices")
volumetric = load("volumetric-discounts")
invoices = load("enterprise-invoices")
b2b2c_contacts = load("contacts-b2b2c")
agents = {a["userId"] for a in load("users-agents")}
personas = json.loads((APP / "public/config/personas.json").read_text())
features = json.loads((APP / "public/config/feature-catalogue.json").read_text())
password = re.search(r"DEMO_LOGIN_PASSWORD\s*=\s*'([^']+)'", (APP / "src/auth/staffIdRoleMap.ts").read_text()).group(1)
by_cust = {c["customerId"]: c for c in customers}
acc_of_cust = {a["customerId"]: a["accountId"] for a in accounts}

# Test IDs of the same people in the consumer inventory, when that workbook is present.
consumer_tc = {}
if CONSUMER_INVENTORY.exists():
    ws = load_workbook(CONSUMER_INVENTORY, read_only=True)["Customers"]
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[1]:
            consumer_tc[row[1]] = row[0]

# --------------------------------------------------------------------------
# What each NAMED account is for. Anything not listed gets the generic text for its category (see CATEGORY_TEXT).
SCENARIOS = {
    "ENT-ACC-7701": (
        "B2B parent with two branch sub-accounts (ACC-5003, ACC-5004), contacts-only, contract 2024-03-01 to 2027-02-28.",
        "Customer Search by ENT-ACC id or name; Business 360; sub-account and authorised-contact views; IoT / volumetric / invoice records.",
        "Opens Business 360 with the account manager and contract dates; the two branches and the authorised contact are listed.",
    ),
    "ENT-ACC-7702": (
        "B2B parent whose contract ENDED 2026-01-14 (expired as of this workbook).",
        "Customer Search; Business 360 contract status.",
        "Business 360 shows the contract end date in the past - use it to check how an expired contract reads.",
    ),
    "ACC-5003": (
        "Branch sub-account of Lulu (credit limit QAR 50,000, no Finance approval needed); carries the IoT SIMs, volumetric discount, invoice and authorised contact.",
        "Business 360 sub-account view; enterprise billing profile grid; invoice; IoT SIM list; volumetric discount.",
        "Sub-account resolves under ENT-ACC-7701; its IoT SIMs, volumetric slab discount and invoice are reachable.",
    ),
    "ACC-5004": (
        "Second Lulu branch sub-account (credit limit QAR 25,000 or as on file).",
        "Business 360 sub-account view.",
        "Sub-account resolves under ENT-ACC-7701.",
    ),
    "ENT-ACC-7705": (
        "B2B2C employer (Acme Trading Qatar W.L.L.) sponsoring consumer lines: its own contact (CUST-2001, Enterprise (EBU), billed to the COMPANY) and a sponsored employee on a Passport (CUST-1002, billed to the USER).",
        "Customer Search by ENT-ACC id; Business 360 linked users; New Connection B2B2C company search; FWA / MNP / Fixed Line with Passport (B2B2C routes for approval).",
        "Business 360 lists both linked users with their billing responsibility; a sponsored order from CUST-1002 is held for approval.",
    ),
    "ENT-ACC-8201": (
        "B2B2C employer (Doha Contracting Co.) with two sponsored HRN consumers: CUST-3026 (billed to the USER) and CUST-3033 (billed to the COMPANY).",
        "Customer Search by ENT-ACC id; Business 360 linked users; New Postpaid / FWA / MNP / Fixed Line for a sponsored employee.",
        "Business 360 lists both linked users; the COMPANY-billed user's bill goes to Doha Contracting Co.; a sponsored order is held for approval.",
    ),
    "ENT-ACC-8202": (
        "B2B2C employer (Gulf Logistics W.L.L.) with three sponsored consumers: CUST-3024 and CUST-3062 (billed to the USER), CUST-3025 (billed to the COMPANY).",
        "Customer Search by ENT-ACC id; Business 360 linked users; sponsored-employee journeys.",
        "Business 360 lists all three linked users with their billing responsibility.",
    ),
}
CATEGORY_TEXT = {
    "B2B2C employer (company-search list)": (
        "Employer on the New Connection company search list; no registry fields beyond name and type, no linked users.",
        "New Connection > Customer Type > B2B2C company search (type the name); Customer Search by ENT-ACC id.",
        "The company is found by name in the B2B2C company search. It has no CR number, contract or linked users, so Business 360 shows only its name and type.",
    ),
}


def category(e):
    if e.get("level") == "subAccount":
        return "Business sub-account"
    if e.get("businessType") == "B2B":
        return "B2B enterprise (parent)"
    if e.get("crNumber") or any(c.get("parentBusinessId") == e["enterpriseAccountId"] for c in customers):
        return "B2B2C employer (with registry / linked users)"
    return "B2B2C employer (company-search list)"


def origin(e):
    note = e.get("_note", "")
    if not note:
        return "In app - original"
    if note.startswith(SEED_TAG):
        return "In app - added 2026-10-02"
    m = re.search(r"\((\d{4}-\d{2}-\d{2})", note)
    return f"In app - added {m.group(1)}" if m else "In app - added"


def contract_state(e):
    end = e.get("contractEndDate")
    if not end:
        return "-"
    y, m, d = map(int, end.split("-"))
    return "Expired" if date(y, m, d) < AS_OF else "Active"


linked = {}
for c in customers:
    if c.get("parentBusinessId"):
        linked.setdefault(c["parentBusinessId"], []).append(c)
subs = {}
for e in enterprise:
    if e.get("parentAccountId"):
        subs.setdefault(e["parentAccountId"], []).append(e["enterpriseAccountId"])

EBU_ROLES = [p for p in personas if "EBU" in p["businessUnits"]]
SEARCH_KEYS = ("workspace.customer-search", "workspace.customer360-view")
ENT_KEYS = [f["key"] for f in features if f["key"].startswith("enterprise.")]
LEVELS = ["View", "Create", "Edit", "Approve", "Full"]


def grants(p):
    return {g["key"]: g["level"] for g in p["features"]}


def roles_for_primary(e):
    out = []
    for p in EBU_ROLES:
        g = grants(p)
        if all(k in g for k in SEARCH_KEYS):
            out.append(p["staffId"])
    return ", ".join(out)


# --------------------------------------------------------------------------
header_font = Font(bold=True, color="FFFFFF", name="Calibri")
header_fill = PatternFill("solid", fgColor=RED)
fill_seeded = PatternFill("solid", fgColor="E8F5E9")
fill_warn = PatternFill("solid", fgColor="FFF8E1")
thin = Side(style="thin", color="DDDDDD")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")


def sheet(wb, title, header, rows, widths=None, tint=None):
    ws = wb.create_sheet(title)
    ws.append(header)
    for c in ws[1]:
        c.font, c.fill, c.border = header_font, header_fill, border
        c.alignment = Alignment(wrap_text=True, vertical="center")
    for r in rows:
        ws.append(list(r))
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment, c.border = wrap, border
    for i, h in enumerate(header, start=1):
        ws.column_dimensions[get_column_letter(i)].width = (widths or {}).get(h, min(max(len(str(h)) + 2, 12), 28))
    ws.row_dimensions[1].height = 32
    if tint:
        for row in ws.iter_rows(min_row=2):
            fill = tint(row)
            if fill:
                for c in row:
                    c.fill = fill
    return ws


wb = Workbook()
wb.remove(wb.active)

# ---- Customers (one row per enterprise account)
rows = []
ents = sorted(enterprise, key=lambda e: e["enterpriseAccountId"])
cust_rows = []
for n, e in enumerate(ents, start=1):
    eid = e["enterpriseAccountId"]
    cat = category(e)
    users = linked.get(eid, [])
    auth = [a for a in auth_contacts if eid in (a.get("accountId"), a.get("parentAccountId"))]
    sc, journeys, outcome = SCENARIOS.get(eid) or CATEGORY_TEXT.get(cat) or ("-", "-", "-")
    emp = [c for c in b2b2c_contacts if c.get("employerAccountId") == eid]
    cust_rows.append([
        f"EC-{n:03d}", eid, origin(e), cat, e["name"], e.get("level"), e.get("parentAccountId") or "-",
        ", ".join(subs.get(eid, [])) or "-", e.get("businessType"), e.get("crType") or "-", e.get("crNumber") or "-",
        e.get("agentId") or "-", e.get("creditLimit") if e.get("creditLimit") is not None else "-",
        "Yes" if e.get("creditLimitNeedsFinanceApproval") else ("No" if "creditLimitNeedsFinanceApproval" in e else "-"),
        "Yes" if e.get("contactsOnly") else ("No" if "contactsOnly" in e else "-"),
        e.get("contractStartDate") or "-", e.get("contractEndDate") or "-", contract_state(e),
        e.get("accountManagerName") or "-", e.get("accountManagerMobile") or "-", e.get("accountManagerEmail") or "-",
        len(users),
        "; ".join(f"{u['customerId']} {u['name']} ({u.get('billingResponsibility', '?')}){' [' + consumer_tc[u['customerId']] + ']' if u['customerId'] in consumer_tc else ''}" for u in users) or "-",
        "; ".join(f"{a['authorisedPersonId']} {a['name']} ({', '.join(a.get('roles', []))})" for a in auth) or "-",
        "; ".join(f"{c['contactId']} {c['employeeName']} ({c.get('employeeCustomerId', '-')})" for c in emp) or "-",
        sum(1 for i in iot if i.get("accountId") == eid), sum(1 for v in volumetric if v.get("accountId") == eid),
        sum(1 for i in invoices if i.get("accountId") == eid),
        sc, journeys, outcome, roles_for_primary(e),
        (e.get("_ebuNote") or e.get("_note") or "").strip() or "-",
    ])
CUST_HEADER = [
    "Test ID", "Business / account ID (use for lookup)", "Status in app", "Category", "Business name", "Level", "Parent account",
    "Sub-accounts", "Business type", "CR type", "CR number", "Agent ID", "Credit limit (QAR)", "Credit limit needs Finance approval",
    "Contacts only", "Contract start", "Contract end", "Contract status", "Account manager", "Account manager mobile",
    "Account manager email", "# linked users", "Linked users (billing responsibility) [consumer Test ID]", "Authorised contacts",
    "Employer contact link (b2b2c)", "# IoT SIMs", "# volumetric discounts", "# invoices", "Scenario", "Journeys to run", "Expected outcome",
    "Roles that can run the primary journey", "Seed notes / evidence",
]
sheet(wb, "Customers", CUST_HEADER, cust_rows,
      widths={"Business name": 32, "Scenario": 48, "Journeys to run": 48, "Expected outcome": 52, "Seed notes / evidence": 60,
              "Linked users (billing responsibility) [consumer Test ID]": 52, "Authorised contacts": 40, "Roles that can run the primary journey": 34},
      tint=lambda row: fill_seeded if str(row[2].value).startswith("In app - added 2026-10-02") else None)

# ---- Linked Users
lu_rows = []
for eid, users in sorted(linked.items()):
    biz = next(e for e in enterprise if e["enterpriseAccountId"] == eid)
    for c in sorted(users, key=lambda c: c["customerId"]):
        lu_rows.append([
            consumer_tc.get(c["customerId"], "-"), c["customerId"], c["name"], c.get("nationality"), c.get("idType"), c.get("qid"),
            c.get("segment"), c.get("billingResponsibility") or "-", "Company" if c.get("billingResponsibility") == "COMPANY" else "User",
            c.get("phone"), c.get("email"), acc_of_cust.get(c["customerId"], "-"), eid, biz["name"], c.get("companyName") or "-",
        ])
sheet(wb, "Linked Users",
      ["Consumer Test ID", "Customer ID", "Full name", "Nationality", "ID type", "ID number (use for lookup)", "Segment in app",
       "Billing responsibility", "Bill goes to", "Mobile", "Email", "Billing account", "Business ID", "Business name", "Company name on record"],
      lu_rows, widths={"Full name": 32, "Business name": 30})

# ---- Authorised Contacts
ac_rows = [[a["authorisedPersonId"], a["name"], a.get("jobTitle"), ", ".join(a.get("roles", [])), "Yes" if a.get("isChooser") else "No",
            a.get("email"), a.get("emailType"), a.get("mobile"), a.get("accountId"), a.get("parentAccountId"),
            "Yes" if a.get("accountAffiliationApproved") else "No", a.get("affiliationFormAttached") or "-",
            "Yes" if a.get("webSelfCareAccess") else "No", "Yes" if a.get("offBoarded") else "No"] for a in auth_contacts]
sheet(wb, "Authorised Contacts",
      ["Authorised person ID", "Name", "Job title", "Roles", "Chooser", "Email", "Email type", "Mobile", "Account", "Parent account",
       "Affiliation approved", "Affiliation form", "Web self-care", "Off-boarded"], ac_rows, widths={"Name": 32, "Email": 34})

# ---- Service & Billing Data (IoT, volumetric, invoices)
sb = []
for i in iot:
    sb.append(["IoT SIM", i["iotSimId"], i.get("accountId"), f"{i.get('serviceType')} - {i.get('number')} ({i.get('enterpriseSegment')})",
               f"SIM {i.get('sim')}; device {i.get('deviceIdentifier')}; platform {i.get('activationPlatform')}"])
for v in volumetric:
    sb.append(["Volumetric discount", v["discountId"], v.get("accountId"), f"{v.get('flavour')}, level {v.get('level')}",
               f"{v.get('connectedCount')} connected; applied slab {v.get('appliedSlabDiscountPercent')}%"])
for i in invoices:
    sb.append(["Enterprise invoice", i["id"], i.get("accountId"), f"Period {i.get('invoicePeriod')} - {', '.join(i.get('formats', []))}",
               f"{i.get('lineItemCount')} line items; tax {i.get('taxNumber')}"])
sheet(wb, "Service & Billing Data", ["Kind", "ID", "Account", "What", "Detail"], sb, widths={"What": 52, "Detail": 60})

# ---- Scenario Coverage
cov = {}
for r in cust_rows:
    cov.setdefault(r[3], []).append(r)
sc_rows = [[k, len(v), "; ".join(f"{x[0]} ({x[1]})" for x in v[:8]) + ("; ..." if len(v) > 8 else "")] for k, v in sorted(cov.items())]
sc_rows += [
    ["With linked users", sum(1 for r in cust_rows if r[21]), "; ".join(f"{r[0]} ({r[1]}: {r[21]})" for r in cust_rows if r[21])],
    ["With sub-accounts", sum(1 for r in cust_rows if r[7] != "-"), "; ".join(f"{r[0]} ({r[1]})" for r in cust_rows if r[7] != "-")],
    ["Contract expired", sum(1 for r in cust_rows if r[17] == "Expired"), "; ".join(f"{r[0]} ({r[1]})" for r in cust_rows if r[17] == "Expired")],
    ["Contract active", sum(1 for r in cust_rows if r[17] == "Active"), "; ".join(f"{r[0]} ({r[1]})" for r in cust_rows if r[17] == "Active")],
    ["With authorised contacts", sum(1 for r in cust_rows if r[23] != "-"), "; ".join(f"{r[0]} ({r[1]})" for r in cust_rows if r[23] != "-")],
]
sheet(wb, "Scenario Coverage", ["Scenario", "# accounts", "Accounts"], sc_rows, widths={"Scenario": 44, "Accounts": 110})

# ---- Roles & Login (EBU roles)
sheet(wb, "Roles & Login", ["Staff ID", "Role", "Persona group", "Business unit", "Approach", "Channel", "Demo password"],
      [[p["staffId"], p["name"], p["group"], p["businessUnitLabel"], p["approach"], p.get("channel"), password] for p in EBU_ROLES],
      widths={"Role": 40, "Channel": 34})

# ---- Journey Access by Role (EBU-relevant features)
keys = list(SEARCH_KEYS) + ENT_KEYS
names = {f["key"]: f["name"] for f in features}
sheet(wb, "Journey Access by Role", ["Staff ID", "Role"] + [names.get(k, k) for k in keys],
      [[p["staffId"], p["name"]] + [grants(p).get(k) for k in keys] for p in EBU_ROLES], widths={"Role": 40})

# ---- Open Questions (computed facts about the data)
oq = []
no_cr = [r[1] for r in cust_rows if r[10] == "-"]
oq.append(["Q1", "Accounts without a CR number",
           f"{len(no_cr)} of {len(cust_rows)} accounts carry no CR number or other registry fields (the company-search list supplied names only; none were invented).",
           "Real registry fields from VFQ Business if these accounts must be searchable by CR number.", f"{no_cr[0]} ... {no_cr[-1]}" if no_cr else "-"])
unresolved = sorted({e.get("agentId") for e in enterprise if e.get("agentId") and e["agentId"] not in agents})
oq.append(["Q2", "Agent IDs that resolve to no user",
           f"agentId values {', '.join(unresolved) or 'none'} are not in users-agents.json (user ids there are USR-*). The account manager name/mobile/email on some accounts were added as app-level demo data instead.",
           "The agent directory for AGT-* ids, or confirmation they are a separate namespace.", ", ".join(e["enterpriseAccountId"] for e in enterprise if e.get("agentId") in unresolved)])
alone = [r[1] for r in cust_rows if r[3].startswith("B2B2C") and r[21] == 0]
oq.append(["Q3", "B2B2C employers with no linked users",
           f"{len(alone)} employer accounts have no individual linked to them, so Business 360 shows an empty user list for them.",
           "Linked consumers for these employers if Business 360 needs a populated scenario beyond ENT-ACC-7705, 8201 and 8202.", f"{alone[0]} ... {alone[-1]}" if alone else "-"])
exp = [r[1] for r in cust_rows if r[17] == "Expired"]
oq.append(["Q4", "Expired contract", f"{', '.join(exp) or 'None'} has a contract end date before {AS_OF.isoformat()}; the app shows the date but nothing in the data says it is blocked.", "Business rule: what an expired EBU contract blocks, if anything.", ", ".join(exp) or "-"])
oq.append(["Q5", "Contract dates and account manager",
           "contractStartDate/EndDate and accountManager* exist only on ENT-ACC-7701 and 7702 (and the account manager on 7701); both are app-level demo additions (2026-09-28), not evidenced source data.",
           "Evidenced contract and account-manager source data.", "ENT-ACC-7701, ENT-ACC-7702"])
sheet(wb, "Open Questions", ["#", "Topic", "Finding", "Needs", "Affected accounts"], oq, widths={"Finding": 90, "Needs": 50, "Affected accounts": 50})

# ---- README (first sheet)
rd = wb.create_sheet("README", 0)
lines = [
    "Vodafone Qatar DXP - EBU Customer Inventory (test data)",
    "Generated by reference/scripts/build_ebu_customer_inventory.py. Do not hand-edit; change the script (or the mock data) and re-run.",
    "",
    f"{len(cust_rows)} enterprise accounts, ALL loaded in the running app ({sum(1 for r in cust_rows if r[2] == 'In app - original')} original, "
    f"{sum(1 for r in cust_rows if r[2] == 'In app - added 2026-10-02')} added 2026-10-02 by the consumer inventory's seed, "
    f"{sum(1 for r in cust_rows if r[2] not in ('In app - original', 'In app - added 2026-10-02'))} added in other app-level changes).",
    f"{len(lu_rows)} individuals are linked to businesses (Linked Users); {len(auth_contacts)} authorised contacts; {len(iot)} IoT SIMs, "
    f"{len(volumetric)} volumetric discounts, {len(invoices)} enterprise invoices.",
    "",
    "How to find a business in the app: Customer Search by its ENT-ACC id (or business name) opens Business 360 at /customer/<ENT-ACC id>.",
    "A linked user (sheet Linked Users) opens the individual's Customer 360; their segment follows who pays the bill (COMPANY -> Enterprise (EBU), USER -> consumer).",
    "",
    "Sheets: Customers (one row per account; the primary sheet) | Linked Users | Authorised Contacts | Service & Billing Data |",
    "        Scenario Coverage | Roles & Login (EBU roles) | Journey Access by Role (EBU-relevant features) | Open Questions.",
    "Rows shaded green were added by the 2026-10-02 consumer-inventory seed (ENT-ACC-8201, ENT-ACC-8202 among them).",
    f"Roles are those whose business unit includes EBU ({len(EBU_ROLES)}); the demo password is read from staffIdRoleMap.ts and is the same for every role.",
    "Consumer customers are in Customer-Inventory.xlsx; the [TC-xxx] tags on linked users point at their rows there.",
    f"Contract status is evaluated as of {AS_OF.isoformat()}.",
]
for i, text in enumerate(lines, start=1):
    rd.cell(i, 1, text)
rd.column_dimensions["A"].width = 150
rd["A1"].font = Font(bold=True, size=16, color=RED)
for i in (4, 5, 7, 8):
    rd.cell(i, 1).alignment = Alignment(wrap_text=True)

for ws in wb:
    ws.freeze_panes = "C2" if ws.title == "Customers" else ("A2" if ws.title != "README" else None)

wb.save(OUT)

from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines

format_file(OUT)
print(f"Wrote {OUT}")
print(f"  accounts: {len(cust_rows)}  linked users: {len(lu_rows)}  authorised contacts: {len(auth_contacts)}  roles: {len(EBU_ROLES)}")
for k, v in sorted(cov.items()):
    print(f"  {k}: {len(v)}")
