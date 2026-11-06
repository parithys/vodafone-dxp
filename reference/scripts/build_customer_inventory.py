#!/usr/bin/env python3
"""Generate reference/outputs/02 Customer-Inventory.xlsx - the test-customer inventory.

Two kinds of row. "In app - original" rows are PARSED from public/mock-data
(customers.json, identity-documents.json, nas-records.json, ...). "In app -
added" rows are defined in PROPOSED below and written into public/mock-data by
`--seed` (idempotent: existing ids are skipped). Run `--seed` first, then run
without flags to (re)generate the workbook.

Role / feature-grant data is parsed from public/config/personas.json; the demo
password from src/auth/staffIdRoleMap.ts. Nothing is hand-typed twice.

Run:  python3 reference/scripts/build_customer_inventory.py --seed   # once / after editing PROPOSED
      python3 reference/scripts/build_customer_inventory.py          # workbook
"""
import json, re, sys
from datetime import date
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

APP = Path(__file__).resolve().parents[2]
MOCK = APP / "public" / "mock-data"
OUT = APP / "reference" / "outputs" / "02 Customer-Inventory.xlsx"
AS_OF = date(2026, 10, 2)
SEED_TAG = "Customer-Inventory seed (2026-10-02)"
ORIG, ADDED = "In app - original", "In app - added 2026-10-02"


def load(name):
    return json.loads((MOCK / f"{name}.json").read_text())


customers = {c["customerId"]: c for c in load("customers")}
docs = load("identity-documents")
nas = load("nas-records")
accounts = {a["customerId"]: a for a in load("accounts")}
personas = json.loads((APP / "public/config/personas.json").read_text())
_routing_src = (APP / "src/data/approvalRouting.ts").read_text()
SALES_MANAGER = re.search(r"SALES_MANAGER_ROLE\s*=\s*'([^']+)'", _routing_src).group(1)
ALL_TO_MANAGER = set(re.findall(r"'(ROLE-\d+)'", re.search(r"ALL_POSTPAID_APPROVALS_TO_MANAGER[^=]*=\s*new Set\(\[([^\]]*)\]", _routing_src).group(1)))
MANAGER_OF = set(re.findall(r"'(ROLE-\d+)': SALES_MANAGER_ROLE", _routing_src))
password = re.search(r"DEMO_LOGIN_PASSWORD\s*=\s*'([^']+)'", (APP / "src/auth/staffIdRoleMap.ts").read_text()).group(1)
retiree_ids = set(load("govt-retiree-registry")["retiredIdNumbers"])


def age(dob):
    y, m, d = map(int, dob.split("-"))
    return AS_OF.year - y - ((AS_OF.month, AS_OF.day) < (m, d))


# --------------------------------------------------------------------------
# Scenario annotations for the SEEDED records (keyed by customerId / NAS id).
# Only scenario text lives here - every data field comes from the JSON.
# --------------------------------------------------------------------------
SEED = {
    "CUST-1001": dict(cat="1 Qatari postpaid", scen="Qatari, 1 active postpaid line, existing customer (loyalty-eligible). Registry-retiree ID. Has a pending disconnection penalty (PEN-8101) and a ported-in line (MNP-11003).",
        disc="Loyalty (existing customer); Retired (scan ID 28456701234 is in the govt retiree registry)", mnp="Port-in history MNP-11003 (QTEL, postpaid); port-out POUT-17001 accepted",
        journeys="New Postpaid (add 2nd line); Customer 360; commitment-penalty view; port-out", expected="Eligibility: all 7 checks pass. Line cap: 1/5 (Qatari). Loyalty -15% offered on Red plans. Retired check passes only on the scan ID, not the customers.json QID.",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-1002": dict(cat="3 Discounts & eligibility", scen="Nepalese expat on a Passport, sponsored by Acme Trading (B2B2C employee). NOT HRN (Nepal is not on the VFQ list - was HRN before 2026-10-02). 1 postpaid + 1 prepaid; partially barred (overdue); promise-to-pay active.",
        disc="B2B2C (employer Acme Trading Qatar W.L.L., CONT-3001, plan Postpaid Extra Promotion)", mnp="MNP-11002 port-in submitted to NPASS; port-out POUT-17002 auto-rejected (name mismatch, code 4)",
        journeys="New Connection (B2B2C route); MNP; Customer 360 barring view", expected="Passport -> exception-routed to Back Office Fulfilment approval (ID Type check). No HRN advance (non-HRN; credit limit 1,000). Prepaid cap 2 (has 1: pass-at-edge). B2B2C order -> Submitted for Approval, Proof of Employment mandatory (BR-169/263).",
        jk=["workspace.customer-search", "mnp.port-in-wizard"]),
    "CUST-1003": dict(cat="5 Existing - no mobile line", scen="Qatari with a GigaHome fixed-line account only (0 mobile lines). Existing customer, two draft orders, FNP port-in in progress.",
        disc="Loyalty (existing customer)", mnp="FNP-12001 (Ooredoo donor validation); POUT-17003 FNP conditional accept",
        journeys="New Postpaid for an existing fixed-line customer; Fixed Line; FNP", expected="Identifies as EXISTING customer even with 0 active lines. All eligibility checks pass.",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-1004": dict(cat="6 Eligibility gates", scen="Qatari, collections-blacklisted (outstanding dues above threshold). Postpaid blocked, prepaid still offered.",
        disc="None", mnp="MNP-11002 donor conditional-accept (billed due over QAR 100)", journeys="New Postpaid (soft-stop); New Prepaid; MNP",
        expected="Collections Check = soft-stop: 'Postpaid cannot be issued. Prepaid is available on this QID.' (BR-113: blacklist only, never the balance).",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-2001": dict(cat="3 Discounts & eligibility", scen="Enterprise employer contact (Acme Trading), EBU segment, 'Other ID'. Owns the FWA 5G order and the B2B2C employer account.",
        disc="N/A - this is the employer, not a sponsored consumer", mnp="FNP-12002 conditional acceptance (QAR 245.50 due)", journeys="Enterprise / Business Care; FWA; Customer 360",
        expected="Other ID is exception-routed. Penalty PEN-8102 blocksNewConnection=true -> Deals Check hard-stop on new connections.",
        jk=["workspace.customer-search", "workspace.customer360-view"]),
    "CUST-1005": dict(cat="2 Expat postpaid (GCC)", scen="Emirati (GCC ID), 2 postpaid + 2 prepaid lines.",
        disc="None", mnp="-", journeys="New Postpaid; New Prepaid", expected="GCC ID is exception-routed (Back Office Fulfilment approval) on postpaid; prepaid permits GCC ID outright (BRSD KYC_01). Postpaid: non-Qatari with 2 lines -> BR-288 cap reached -> approval task. Prepaid: GCC cap 2, has 2 -> line limit reached, order routed for approval (BR-347).",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-1006": dict(cat="6 Eligibility gates", scen="French diplomat, Diplomatic ID EXPIRED 2025-08-31, security-blacklisted.",
        disc="None", mnp="-", journeys="Any new connection", expected="ID Validity hard-stop (expired) AND Security Check hard-stop. No agent override.",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-9001": dict(cat="6 Eligibility gates", scen="QA test user, Qatari, age 16 (under 18). Holds both a QID and a Passport document.",
        disc="None", mnp="-", journeys="Any new connection", expected="Age Check = HARD STOP for an under-18 applicant (2026-10-02): the connection cannot proceed without Apply for Exception (Court Type Order). As a Secondary Contact, the first under-18 Qatari the demo scan presents ('Scan Below 18').",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
    "CUST-1007": dict(cat="6 Eligibility gates", scen="Swedish resident whose customers.json idType is QID but whose only document is a valid Diplomatic ID (to 2030-04-30).",
        disc="None", mnp="-", journeys="New Postpaid", expected="Document type governs: Diplomatic ID is exception-routed to Back Office Fulfilment approval.",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard"]),
}
SEED_NAS = {
    "NAS-7001": dict(cat="4 New customer / MNP", scen="NOT a Vodafone customer (NAS identity record only). Qatari, valid QID. Canonical 'new customer' + port-in-as-new-connection candidate.",
        disc="None until becoming a customer", mnp="Port-in candidate from Ooredoo/QTEL", journeys="New Postpaid; Port-In as New Connection; New Prepaid",
        expected="Contact step shows masked NAS email; ID lookup resolves with no customerId -> NOT an existing customer.",
        jk=["workspace.customer-search", "postpaid.new-postpaid-wizard", "mnp.port-in-wizard"]),
}

# --------------------------------------------------------------------------
# Customer names: (first, middle, last). Middle = EVERY name between the first
# and the family name (may be several), per VFQ's naming convention. `name` in
# the data is always " ".join of the three. Single source for the app data
# (applied by --seed) and for the workbook.
# --------------------------------------------------------------------------
NAMES = {
    # original demo customers
    "CUST-1001": ("Ahmed", "Abdulla Hassan", "Al-Sulaiti"),
    "CUST-1002": ("Bimal", "Bahadur", "Thapa"),
    "CUST-1003": ("Fatima", "Saud Hamad", "Al-Kuwari"),
    "CUST-1004": ("Mohammed", "Rashid Khalid", "Al-Emadi"),
    "CUST-2001": ("Layla", "Hassan Ibrahim", "Al-Naimi"),
    "CUST-1005": ("Khalid", "Saeed Rashid", "Al-Mazrouei"),
    "CUST-1006": ("Sophie", "Marie", "Laurent"),
    "CUST-9001": ("Rashid", "Nasser Hamad", "Al-Naimi"),
    "CUST-1007": ("Henrik", "Lars", "Lindqvist"),
    "NAS-7001": ("Noora", "Abdulrahman Saeed", "Al-Mannai"),
    # added by the inventory
    "CUST-3001": ("Hamad", "Jassim Hamad", "Al-Thani"),
    "CUST-3002": ("Maryem", "Rashid Hamad Jassim", "Al-Kuwari"),
    "CUST-3003": ("Jassim", "Rashid Nasser", "Al-Marri"),
    "CUST-3004": ("Faisal", "Mansoor Khalid Abdullah", "Al-Marri"),
    "CUST-3011": ("Rajesh", "Kumar", "Pillai"),
    "CUST-3012": ("Maria", "Cristina Santos", "Reyes"),
    "CUST-3013": ("Ahmed", "Fathy Ibrahim", "El-Sayed"),
    "CUST-3014": ("Sunil", "Chandana Kumara", "Perera"),
    "CUST-3015": ("Hasan", "Mahmoud Ali", "Al-Khatib"),
    "CUST-3016": ("Wei", "Ming", "Chen"),
    "CUST-3017": ("Peter", "Kamau", "Mwangi"),
    "CUST-3021": ("Salma", "Nasser Khalifa", "Al-Kuwari"),
    "CUST-3022": ("Abdullah", "Khalid Mansoor", "Al-Kuwari"),
    "CUST-3023": ("Hussain", "Ali Mubarak", "Al-Dosari"),
    "CUST-3024": ("Nasser", "Mohammed Saad", "Al-Hajri"),
    "CUST-3025": ("Priya", "Suresh", "Nair"),
    "CUST-3026": ("Imran", "Ahmed Khan", "Qureshi"),
    "CUST-3027": ("Fahad", "Saeed Ali", "Al-Ansari"),
    "CUST-3028": ("Karim", "Elias Youssef", "Haddad"),
    "CUST-3029": ("Fatima", "Hassan Ali", "Al-Marri"),
    "CUST-3031": ("Dina", "Abdulaziz Khalid", "Al-Mahmoud"),
    "CUST-3032": ("Lakshmi", "Venkat", "Iyer"),
    "CUST-3033": ("Tariq", "Mahmood Aziz", "Malik"),
    "CUST-3041": ("Omar", "Samer Khalil", "Al-Hamwi"),
    "CUST-3042": ("Nadia", "Hany Farouk", "Mansour"),
    "CUST-3043": ("Ravi", "Shankar", "Menon"),
    "CUST-3044": ("Saeed", "Abdullah Nasser", "Al-Mohannadi"),
    "CUST-3045": ("Eva", "Maria", "Mueller"),
    "CUST-3046": ("Bilal", "Ahmed Raza", "Siddiqui"),
    "CUST-3051": ("Tamer", "Mahmoud Hosni", "Abdelaziz"),
    "CUST-3052": ("Aisha", "Mohammed", "Al-Suwaidi"),
    "CUST-3053": ("Faisal", "Hamad Saud", "Al-Rumaihi"),
    "CUST-3054": ("Zainab", "Ibrahim Khalid", "Al-Hashemi"),
    "CUST-3061": ("Mizanur", "Abdul Karim", "Rahman"),
    "CUST-3062": ("Samuel", "Okello", "Mugisha"),
    "CUST-3063": ("Zahid", "Mehmood", "Butt"),
    "CUST-3064": ("Kyaw", "Zin", "Htet"),
    "CUST-3068": ("Sokha", "Vannak", "Chea"),
    "CUST-3069": ("Khamla", "Somphone", "Vongsa"),
    "CUST-3070": ("Sipho", "Themba", "Dlamini"),
    "CUST-3071": ("Khalifa", "Abdullah Saeed", "Al-Mohannadi"),
    "CUST-3072": ("Rohan", "Vikram", "Mehta"),
    "CUST-3073": ("Walid", "Nabil Hassan", "Al-Zoubi"),
    "CUST-3081": ("Khalifa", "Hamad Saeed", "Al-Naimi"),
    "CUST-3082": ("Noora", "Jassim Ali", "Al-Mannai"),
    "CUST-3083": ("Abdulla", "Nasser Rashid", "Al-Sada"),
    "CUST-3084": ("Aisha", "Mohammed Khalid", "Al-Kuwari"),
    "CUST-3085": ("Rashid", "Saud Abdulla", "Al-Hajri"),
    "CUST-3090": ("Maryam", "Ahmed Abdulla", "Al-Sulaiti"),
    "CUST-3101": ("Hessa", "Jassim", "Al-Thani"),
    "CUST-3102": ("Abdulaziz", "Khalid", "Al-Sulaiti"),
    "CUST-3103": ("Sheikha", "Nasser", "Al-Naimi"),
    "CUST-3065": ("Abdulrahman", "Jassim Hamad", "Al-Kubaisi"),
    "CUST-3066": ("Maha", "Rashid Saeed", "Al-Ghanim"),
    "CUST-3067": ("Mohamed", "Nabil Ibrahim", "Soliman"),
    "NAS-7002": ("Yousef", "Khalifa Hamad", "Al-Khulaifi"),
    "NAS-7003": ("Anil", "Ramesh", "Sharma"),
    "NAS-7004": ("Mustafa", "Salem Ali", "Al-Baker"),
    "NAS-7006": ("Farhan", "Aslam Javed", "Chaudhry"),
}
# Non-customer-table people that are still customer-side contacts. Keyed by
# (file, old full name) -> (first, middle, last).
CONTACT_NAMES = {
    "Mariam Al-Sulaiti": ("Mariam", "Khalid Saeed", "Al-Sulaiti"),          # customer-contacts CTC-4002
    "Mohammed Al-Kubaisi": ("Mohammed", "Rashid Ali", "Al-Kubaisi"),       # authorised-contacts
    "Aisha Al-Sulaiti": ("Aisha", "Abdulla Saeed", "Al-Sulaiti"),
    "Rashid Al-Marri": ("Rashid", "Saud Hamad", "Al-Marri"),               # authorised contact + billing contact BILL-7004
    "Ahmed Al-Kuwari": ("Ahmed", "Saud Hamad", "Al-Kuwari"),               # gigahome acceptance forms
    "Fatima Al-Sulaiti": ("Fatima", "Ali Rashid", "Al-Sulaiti"),
    "Rashid Al-Mannai": ("Rashid", "Khalid Saeed", "Al-Mannai"),
    "Ahmed Hassan Al-Sulaiti": ("Ahmed", "Hassan Khalid", "Al-Sulaiti"),   # MNP application form
    "Layla Mahmoud": ("Layla", "Mahmoud Ibrahim", "Saleh"),
}


def full(t):
    return " ".join(t)


# --------------------------------------------------------------------------
# PROPOSED customers. Synthetic IDs/phones, checked below for collisions.
# --------------------------------------------------------------------------
def P(cid, name, nat, grp, idt, idn, exp, dob, sex, seg, lang, pp, pre, cat, scen, disc, mnp, journeys, expected, *,
      bl="", hrn=False, emp="", status="Customer (Siebel)", jk=None, req="", extra="", sub="", hi=0):
    return dict(cid=cid, name=name, nat=nat, grp=grp, idt=idt, idn=idn, exp=exp, dob=dob, sex=sex, seg=seg, lang=lang, pp=pp, pre=pre,
                cat=cat, scen=scen, disc=disc, mnp=mnp, journeys=journeys, expected=expected, bl=bl, hrn=hrn, emp=emp, status=status,
                jk=jk or ["workspace.customer-search", "postpaid.new-postpaid-wizard"], req=req, extra=extra, sub=sub, hi=hi)

PP = ["workspace.customer-search", "postpaid.new-postpaid-wizard"]
PRE = ["workspace.customer-search", "prepaid.new-prepaid-wizard"]
MNP = ["workspace.customer-search", "mnp.port-in-wizard"]
C360 = ["workspace.customer-search", "workspace.customer360-view"]

PROPOSED = [
    # ---- 1. Qatari postpaid line counts
    P("CUST-3001", "Hamad Al-Thani", "Qatari", "Qatari", "QID", "27911063400001", "2030-03-31", "1979-11-06", "Male", "Consumer", "Arabic", 2, 0, "1 Qatari postpaid",
      "Qatari with 2 active postpaid lines.", "Loyalty (existing)", "-", "New Postpaid (3rd line); Customer 360",
      "Qatari cap is 5 postpaid lines: 2/5 -> Active Lines passes, no line-cap approval. The 2+ postpaid credit-control warning (VAL-375/BR-266) still applies.",
      jk=PP, req="Qatari 2 lines"),
    P("CUST-3002", "Mariam Al-Naimi", "Qatari", "Qatari", "QID", "28203063400002", "2030-08-31", "1982-03-14", "Female", "Consumer", "Arabic", 5, 0, "1 Qatari postpaid",
      "Qatari with 5 active postpaid lines = AT the Qatari cap.", "Loyalty (existing)", "-",
      "New Postpaid (6th line); Order Approval Queue; Customer 360",
      "Cap of 5 reached -> Active Lines = approval-routing; the 6th line proceeds only once approved. Enforced by BR-288 (message 'Qatari cap of 5 postpaid mobile lines reached (5 active)').",
      jk=PP, req="Qatari 5 lines (at cap)"),
    P("CUST-3004", "Khalifa Al-Attiyah", "Qatari", "Qatari", "QID", "27705063400004", "2030-06-30", "1977-05-09", "Male", "Consumer", "Arabic", 6, 0, "1 Qatari postpaid",
      "Qatari with 6 active postpaid lines; the 6th was obtained through workflow approval (approved order on file).", "Loyalty (existing)", "-",
      "New Postpaid (7th line); Order Approval Queue",
      "Over the cap of 5 -> approval-routing again for any further line. Same BR-288 path as CUST-3002.",
      jk=PP, req="Qatari 6 lines (approved above cap)"),
    P("CUST-3003", "Jassim Al-Marri", "Qatari", "Qatari", "QID", "29005063400003", "2029-12-31", "1990-05-20", "Male", "Consumer", "English", 0, 2, "1 Qatari postpaid",
      "Qatari with prepaid lines only (2 prepaid, 0 postpaid) - candidate for prepaid-to-postpaid migration.", "Prepaid Welcome (-10% on Red 25/50/100)", "-", "Pre-to-Post Migration; New Postpaid",
      "Existing customer. Qatari -> no prepaid cap (BR-347). Eligible for migration journey.",
      jk=["workspace.customer-search", "migration.pre-to-post-wizard"], req="Qatari prepaid-only"),
    # ---- 2. Expat postpaid line counts
    P("CUST-3011", "Rajesh Kumar", "Indian", "Expat (QID)", "QID", "28508035600011", "2029-09-30", "1985-08-02", "Male", "Consumer", "English", 1, 0, "2 Expat postpaid",
      "Expat QID holder with 1 active postpaid line.", "Loyalty (existing)", "-", "New Postpaid (2nd line)",
      "BR-288: 1/2 postpaid lines used -> Active Lines check passes (message '1/2 ... used').", jk=PP, req="Expat 1 line"),
    P("CUST-3012", "Maria Santos", "Filipino", "Expat (QID)", "QID", "29112060800012", "2030-01-31", "1991-02-27", "Female", "Consumer", "English", 2, 0, "2 Expat postpaid",
      "Expat QID holder with 2 active postpaid lines (AT the expat cap of 2).", "Loyalty (existing)", "-", "New Postpaid (3rd line)",
      "Expat cap of 2 reached (BR-288) -> Active Lines = approval-routing: 'An approval task has been raised'. Order proceeds once approved. No in-journey override (BR-111).", jk=PP, req="Expat 2 lines"),
    P("CUST-3013", "Ahmed Fathy", "Egyptian", "Expat (QID)", "QID", "28409081800013", "2029-06-30", "1984-09-09", "Male", "Consumer", "Arabic", 3, 0, "2 Expat postpaid",
      "Expat QID holder with 3 active postpaid lines; the 3rd was granted through workflow approval (approval-granted order on file).", "Loyalty (existing)", "-", "New Postpaid (4th line); Order Approval Queue",
      "Cap exceeded (3 >= 2) -> approval-routing again; credit-control warning shown. Approver role per approval-matrix: Back Office Fulfilment.", jk=PP, req="Expat 3 lines + approval"),
    P("CUST-3014", "Sunil Perera", "Sri Lankan", "Expat (QID)", "QID", "28710014400014", "2030-05-31", "1987-10-11", "Male", "Consumer", "English", 2, 3, "2 Expat postpaid",
      "Expat QID with 2 postpaid + 3 prepaid = 5 combined mobile lines (system technical cap).", "Loyalty (existing)", "-", "New Prepaid; New Postpaid",
      "Prepaid: BR-347 QID cap 5 combined reached -> blocked. Postpaid: BR-288 cap reached -> approval.", jk=PRE, req="Expat combined 5-line cap"),
    P("CUST-3015", "Hasan Mahmoud", "Jordanian", "Expat (QID)", "QID", "28806040000015", "2029-11-30", "1988-06-21", "Male", "Consumer", "Arabic", 1, 1, "2 Expat postpaid",
      "Expat QID, 1 postpaid + 1 prepaid; clean boundary customer (3 lines of headroom on combined cap).", "Loyalty (existing)", "-", "New Prepaid; New Postpaid",
      "Both caps pass: 2/5 combined; 1/2 postpaid.", jk=PRE, req="Expat mixed lines"),
    P("CUST-3016", "Chen Wei", "Chinese", "Expat (Passport)", "Passport", "E58321097", "2031-02-28", "1993-12-30", "Male", "Consumer", "English", 0, 2, "2 Expat postpaid",
      "Expat Passport holder (no QID), 2 prepaid lines = Passport prepaid cap.", "None", "-", "New Prepaid (blocked); New Connection",
      "Passport is not offered for New Postpaid; Prepaid cap 2 reached -> line limit reached, order routed for approval (BR-347); BR-108 limits Passport-only expats to prepaid.", jk=PRE, req="Expat passport at prepaid cap"),
    P("CUST-3017", "Ali Reza", "Iranian", "Expat (QID)", "QID", "28904036400017", "2029-10-31", "1989-04-03", "Male", "Consumer (HRN)", "English", 0, 0, "2 Expat postpaid",
      "High-risk-nationality expat on a valid QID, no lines yet - HRN advance and QAR 50 credit limit apply.", "None", "-", "New Postpaid",
      "HRN: 'Customer needs to pay advance payment of QR 100' (BR-187/VAL-360); credit limit 50 (BR-076); order sub-type HRN.", hrn=True, jk=PP, req="HRN customer"),
    # ---- 3. Discounts & eligibility
    P("CUST-3021", "Salma Al-Kuwari", "Qatari", "Qatari", "QID", "27610063400021", "2030-04-30", "1976-10-22", "Female", "Consumer", "Arabic", 1, 0, "3 Discounts & eligibility",
      "Qatari with a MADA card, 1 active postpaid line. MADA-eligible on Postpaid Red 350 (PROD-104).", "MADA (-25%, ADO-7112) + Loyalty (-15%) - max ONE discount per order", "-", "New Postpaid; New Connection (customer type = MADA)",
      "MADA/B2B2C discount requires a supporting ID AND proof document (MADA card/reference number). Plan change retires the discount. Loyalty and MADA are mutually exclusive on one order.", jk=PP, req="MADA eligible",
      extra="MADA reference no. for the proof field: MADA-2026-0041021"),
    P("CUST-3022", "Abdullah Al-Sada", "Qatari", "Qatari", "QID", "27409063400022", "2030-09-30", "1974-07-15", "Male", "Consumer", "Arabic", 1, 0, "3 Discounts & eligibility",
      "Retired Qatari - ID is in the govt retiree registry (needs a registry entry).", "Retired (validated against govt registry)", "-", "New Connection (customer type = Retired)",
      "Office-ID scan -> ID number sent to registry -> 'Retired status validated with the government system.' Step valid only when the check passes.", jk=PP, req="Retired person discount",
      extra="Add ID 27409063400022 to govt-retiree-registry.json"),
    P("CUST-3023", "Hussain Al-Dosari", "Qatari", "Qatari", "QID", "27307063400023", "2029-08-31", "1973-01-30", "Male", "Consumer", "Arabic", 1, 0, "3 Discounts & eligibility",
      "Qatari aged 53 claiming retirement but NOT in the registry - negative control.", "Retired (claimed) -> FAILS validation", "-", "New Connection (customer type = Retired)",
      "'This ID number could not be validated as a retired customer with the government system.' Journey cannot continue on the Retired path.", jk=PP, req="Retired - validation failure"),
    P("CUST-3024", "Nasser Al-Hajri", "Qatari", "Qatari", "QID", "28105063400024", "2030-02-28", "1981-12-09", "Male", "Consumer", "English", 2, 0, "3 Discounts & eligibility",
      "Qatari holding BOTH a MADA card and a sponsoring employer (Gulf Logistics W.L.L.): eligible for MADA and B2B2C. 2 postpaid lines.", "MADA (ADO-7112) AND B2B2C (ADO-7113) - one per order; plan decides (Red 350 -> MADA, Red 500 -> B2B2C)", "-",
      "New Postpaid on Red 350 then Red 500", "Combination test: each discount exists only on its own plan; switching plan retires the other. B2B2C route -> manager approval + Proof of Employment.", emp="Gulf Logistics W.L.L.", jk=PP, req="MADA + B2B2C both eligible"),
    P("CUST-3025", "Priya Nair", "Indian", "Expat (QID)", "QID", "29302035600025", "2030-06-30", "1993-02-14", "Female", "Consumer", "English", 1, 0, "3 Discounts & eligibility",
      "Expat employee sponsored by Gulf Logistics W.L.L. (B2B2C), 1 postpaid line, no pre-existing Special Management flag.", "B2B2C (-25% on Red 500, ADO-7113)", "-", "New Postpaid; FWA; Fixed Line",
      "BR-264: B2B2C on an account WITHOUT Special Management completes automatically. Proof of Employment + CAF mandatory.", emp="Gulf Logistics W.L.L.", jk=PP, req="B2B2C type discount"),
    P("CUST-3026", "Imran Qureshi", "Pakistani", "Expat (QID)", "QID", "28707058600026", "2029-12-31", "1987-07-07", "Male", "Consumer", "English", 1, 0, "3 Discounts & eligibility",
      "B2B2C employee whose account ALREADY carries a Special Management value.", "B2B2C", "-", "New Postpaid; FWA", "Account carries Special Management (stored on the account). INTENDED per BR-265: prompt 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C?'. The app has no such prompt yet; BR-266: Pending approval.",
      emp="Doha Contracting Co.", jk=PP, req="B2B2C + Special Management"),
    P("CUST-3027", "Fahad Al-Ansari", "Qatari", "Qatari", "QID", "26904063400027", "2031-01-31", "1969-04-25", "Male", "Consumer", "Arabic", 1, 0, "3 Discounts & eligibility",
      "Retired Qatari who also holds a MADA card (registry-listed).", "Retired AND MADA - pick one customer type per journey", "-", "New Connection (Retired path, then MADA path)",
      "Customer-type step is single-choice (None/B2B2C/Retired/MADA): run twice to confirm each path validates independently.", jk=PP, req="Retired + MADA",
      extra="Add ID 26904063400027 to govt-retiree-registry.json"),
    P("CUST-3028", "Karim Haddad", "Lebanese", "Expat (QID)", "QID", "28404042200028", "2029-07-31", "1984-11-12", "Male", "Consumer", "English", 1, 1, "3 Discounts & eligibility",
      "Existing expat customer, long tenure, eligible for 6-month retention/loyalty discount; also holds a prepaid line.", "Loyalty (-15%) on Red 350/500/Unlimited/Extra; Prepaid Welcome", "-", "New Postpaid; Retention journey",
      "Loyalty applies to existing Vodafone customers (ADO-7105..7108). NOTE: the app does not gate Loyalty on customer history - it is offered on the plan.", jk=PP, req="Existing customer further discount"),
    P("CUST-3029", "Reem Al-Obaidly", "Qatari", "Qatari", "QID", "29506063400029", "2030-10-31", "1995-06-01", "Female", "Consumer", "Arabic", 0, 0, "3 Discounts & eligibility",
      "Control: Qatari existing-customer record with NO discount entitlement, no lines.", "None", "-", "New Postpaid", "Standard price, no discount offered as eligible. Baseline for pricing assertions.", jk=PP, req="No-discount control"),
    # ---- 4. New customer / MNP
    P("NAS-7002", "Yousef Al-Khulaifi", "Qatari", "Qatari", "QID", "29207063400101", "2030-07-31", "1992-07-19", "Male", "Consumer", "Arabic", 0, 0, "4 New customer / MNP",
      "NEW Qatari customer (NAS only) porting a postpaid number from Ooredoo.", "None", "MNP postpaid port-in, donor Ooredoo, clean path", "Port-In as New Connection (MNP)",
      "Resolves via NAS, no customerId. Port-in order raised with NPASS; SMS action window 2h (extendable 24h).", status="New (NAS record only)", jk=MNP, req="New customer MNP"),
    P("NAS-7003", "Anil Sharma", "Indian", "Expat (QID)", "QID", "29108035600102", "2030-03-31", "1991-08-08", "Male", "Consumer", "English", 0, 0, "4 New customer / MNP",
      "NEW expat QID customer (NAS only), porting a PREPAID number from QTEL/Ooredoo.", "Prepaid Welcome (-10%)", "MNP prepaid port-in", "New Prepaid; Port-In as New Connection",
      "New customer; prepaid path ignores B2B2C (NewMnpWizard).", status="New (NAS record only)", jk=MNP, req="New expat MNP"),
    P("NAS-7004", "Mustafa Al-Baker", "Qatari", "Qatari", "QID", "28909063400103", "2030-09-30", "1989-09-03", "Male", "Consumer", "Arabic", 0, 0, "4 New customer / MNP",
      "NEW customer whose port-in will be auto-rejected: name on the donor line does not match the QID (NPASS reject code 4).", "None", "MNP port-in - rejection path", "Port-In as New Connection",
      "Mirrors POUT-17002: customerNameMatch=false -> auto-rejected. Test rejection handling and re-submission.", status="New (NAS record only)", jk=MNP, req="MNP rejection"),
    P("CUST-3031", "Dina Al-Mahmoud", "Qatari", "Qatari", "QID", "28603063400031", "2030-12-31", "1986-03-23", "Female", "Consumer", "Arabic", 1, 0, "4 New customer / MNP",
      "EXISTING customer porting a SECOND number in from another operator (postpaid), conditional-accept path: donor dues over QAR 100.", "Loyalty (existing)", "MNP port-in with donor conditional acceptance (billed due > QAR 100, clearance window)", "MNP Port-In",
      "Mirrors MNP-11002: conditionalAcceptanceTriggered=true; order waits for dues clearance.", jk=MNP, req="Existing customer MNP / conditional accept"),
    P("CUST-3032", "Lakshmi Iyer", "Indian", "Expat (Passport)", "Passport", "Z4455671", "2030-11-30", "1992-01-17", "Female", "Consumer", "English", 0, 2, "4 New customer / MNP",
      "Expat Passport holder switching TWO prepaid numbers (multi-number switch) from Ooredoo - mirrors MNP-FORM-90005-01.", "None", "MNP multi-number prepaid port-in (2 numbers)", "MNP Port-In (Multi Number)",
      "Multi Number switching table with both numbers on the same Passport; Passport cap 2 prepaid.", jk=MNP, req="MNP multi-number passport"),
    P("CUST-3033", "Tariq Aziz", "Pakistani", "Expat (QID)", "QID", "28605058600033", "2029-10-31", "1986-05-12", "Male", "Consumer", "English", 1, 0, "4 New customer / MNP",
      "B2B2C employee (Doha Contracting Co.) porting a postpaid number in - MNP + B2B2C combined.", "B2B2C", "MNP postpaid port-in, B2B2C", "MNP Port-In (B2B2C route)",
      "NewMnpWizard: orderSubType B2B2C, status 'Submitted for Approval'; MNP category approver = Sales Manager (approval-matrix).", emp="Doha Contracting Co.", jk=MNP, req="MNP + B2B2C"),
    # ---- 6. Eligibility gates
    P("CUST-3041", "Omar Khalil", "Syrian", "Expat (QID)", "QID", "28808076000041", "2025-12-31", "1988-08-30", "Male", "Consumer", "Arabic", 1, 0, "6 Eligibility gates",
      "Expat whose QID EXPIRED on 2025-12-31.", "None", "-", "Any new connection", "ID Validity hard-stop: 'This ID expired on 31/12/2025. Please request a valid, unexpired ID to continue.'", jk=PP, req="Expired ID"),
    P("CUST-3042", "Nadia Farouk", "Egyptian", "Expat (QID)", "QID", "29210081800042", "", "1992-10-10", "Female", "Consumer", "Arabic", 0, 0, "6 Eligibility gates",
      "Expat whose identity document has NO expiry date on file.", "None", "-", "Any new connection", "ID Validity = approval-routing (manual validity check). Not a pass - the app never confirms an ID it cannot verify.", jk=PP, req="No expiry on file"),
    P("CUST-3043", "Ravi Menon", "Indian", "Expat (QID)", "QID", "28912035600043", "2030-04-30", "1989-12-15", "Male", "Consumer", "English", 0, 0, "6 Eligibility gates",
      "Expat on the corporate SECURITY blacklist.", "None", "-", "Any new connection", "Security Check hard-stop; interaction ends at the counter (no prepaid fallback).", bl="security", jk=PP, req="Security blacklist (expat)"),
    P("CUST-3044", "Saeed Al-Mohannadi", "Qatari", "Qatari", "QID", "30806063400044", "2031-03-31", "2008-06-01", "Male", "Consumer", "Arabic", 0, 0, "6 Eligibility gates",
      "Qatari aged 18 (turned 18 on 2026-06-01) - age boundary.", "None", "-", "New Postpaid", "Age Check passes at 18 ('Customer's age is 18 years'); under 18 is a hard stop.", jk=PP, req="Age boundary"),
    P("CUST-3045", "Eva Muller", "German", "Diplomatic", "Diplomatic ID", "DIP-QA-005100", "2030-12-31", "1980-03-18", "Female", "Consumer", "English", 0, 0, "6 Eligibility gates",
      "German diplomat, valid Diplomatic ID, clean record.", "None", "-", "New Postpaid", "Diplomatic ID is exception-routed -> Back Office Fulfilment approval workflow; no other block.", jk=PP, req="Diplomatic ID (valid)"),
    P("CUST-3046", "Bilal Siddiqui", "Pakistani", "Expat (QID)", "QID", "28311058600046", "2030-02-28", "1983-11-11", "Male", "Consumer", "English", 1, 0, "6 Eligibility gates",
      "Expat with a collections blacklist (dues) - postpaid blocked, prepaid available.", "None", "-", "New Postpaid (soft-stop); New Prepaid", "Collections Check soft-stop (same shape as CUST-1004 for an expat).", bl="collections", jk=PP, req="Collections blacklist (expat)"),
    # ---- 7. Existing-service journeys
    P("CUST-3051", "Tamer Hosni", "Egyptian", "Expat (QID)", "QID", "28506081800051", "2030-05-31", "1985-06-06", "Male", "Consumer", "Arabic", 1, 0, "7 Existing-service journeys",
      "Existing postpaid customer needing a SIM swap (lost SIM - chargeable) and an eSIM line.", "None", "-", "SIM Swap queue; Customer 360 Mobile section", "BR-056: Lost SIM is chargeable; eSIM-to-eSIM free; damaged SIM free. ID verification adds a third MOI-match step.",
      jk=["workspace.customer-search", "numbers.sim-swap-queue"], req="SIM swap"),
    P("CUST-3052", "Sara Al-Qahtani", "Qatari", "Qatari", "QID", "28707063400052", "2030-08-31", "1987-07-25", "Female", "Consumer", "Arabic", 1, 0, "7 Existing-service journeys",
      "Postpaid customer with a device instalment (Galaxy S24, 12 months) and 8 months of the 12-month lock-in completed.", "Loyalty (existing)", "-", "Customer 360; Disconnection / penalty view; Device Installment",
      "Lock-in not complete -> disconnection fee = QR 80 x remaining months (lock-in rule in ruleEngine.ts).", jk=C360, req="Lock-in penalty / device installment"),
    P("CUST-3053", "Faisal Al-Rumaihi", "Qatari", "Qatari", "QID", "28808063400053", "2030-03-31", "1988-08-19", "Male", "Consumer", "Arabic", 1, 0, "7 Existing-service journeys",
      "Qatari with a GigaHome 5G FWA outdoor line plus 1 postpaid line (cross-sell target).", "Loyalty (existing)", "-", "FWA; Fixed Line; Customer 360", "Existing multi-product customer; FWA appointment booking and serial-number check apply.",
      jk=["workspace.customer-search", "fwa.new-fwa-wizard"], req="FWA / multi-product"),
    P("CUST-3054", "Zainab Al-Hashemi", "Qatari", "Qatari", "QID", "29108063400054", "2030-11-30", "1991-08-14", "Female", "Consumer", "English", 3, 1, "7 Existing-service journeys",
      "High-value Qatari with multi-SIM / iWatch lines; high-value retention target.", "Loyalty (existing)", "-", "Retention; Customer 360; Multi-SIM", "Premium / Retention journeys; multi-SIM sequence numbers and monthly fees apply.", jk=C360, req="Premium / retention"),
    # ---- 8. Risk class (HRN) and ID-class additions
    P("CUST-3061", "Mizanur Rahman", "Bangladeshi", "Expat (Passport)", "Passport", "BN7721045", "2031-04-30", "1990-03-08", "Male", "Consumer (HRN)", "English", 0, 2, "8 HRN & ID classes",
      "HRN expat on a Passport with 2 prepaid lines = Passport prepaid cap.", "None", "-", "New Prepaid (blocked); New Connection",
      "Prepaid cap 2 reached (BR-347) -> line limit reached, order routed for approval; Passport is permitted on prepaid (KYC_01) so there is no ID-type routing there. HRN: on prepaid the flag is only stored (no QAR 100 advance, no message, no approval - CAM_03/CAM_04); on postpaid the QAR 100 advance and credit limit 50 apply. Passport is not offered for New Postpaid.",
      hrn=True, jk=PRE, req="HRN passport at prepaid cap", extra="Nationality chosen for realism - the app reads only the HRN flag, not a nationality list."),
    P("CUST-3062", "Dipak Rai", "Nepalese", "Expat (QID)", "QID", "29207052400062", "2030-09-30", "1992-07-04", "Male", "Consumer (HRN)", "English", 1, 0, "8 HRN & ID classes",
      "HRN expat sponsored by Gulf Logistics W.L.L. (HRN + B2B2C), 1 postpaid line.", "B2B2C (-25% on Red 500)", "-", "New Postpaid; FWA; Fixed Line",
      "Both apply: HRN advance QAR 100 AND B2B2C route (Submitted for Approval, Proof of Employment mandatory). B2B2C wins the order sub-type (orderSubType = B2B2C).",
      hrn=True, emp="Gulf Logistics W.L.L.", jk=PP, req="HRN + B2B2C"),
    P("CUST-3063", "Waleed Al-Qahtani", "Saudi", "GCC", "GCC ID", "784199012345632", "2030-01-31", "1990-09-21", "Male", "Consumer (HRN)", "Arabic", 0, 1, "8 HRN & ID classes",
      "EDGE CASE: GCC ID holder carrying the HRN flag, to prove the app reads the flag independent of ID type. Unlikely in production (GCC ID holders are GCC citizens).", "None", "-", "New Prepaid; New Connection",
      "GCC ID exception-routed on postpaid (permitted on prepaid); HRN advance QAR 100 on postpaid only (prepaid stores the flag, no advance); prepaid cap 2 (1/2 used).", hrn=True, jk=PRE, req="HRN on GCC ID"),
    P("CUST-3064", "Osman Idris", "Sudanese", "Expat (QID)", "QID", "28809072900064", "2029-11-30", "1988-09-12", "Male", "Consumer (HRN)", "Arabic", 2, 0, "8 HRN & ID classes",
      "HRN expat QID with 2 postpaid lines (AT the expat cap).", "Loyalty (existing)", "-", "New Postpaid (3rd line)",
      "Two independent gates: expat cap of 2 -> approval task, AND HRN QAR 100 advance. Both must clear.", hrn=True, jk=PP, req="HRN at expat line cap"),
    P("CUST-3065", "Abdulrahman Al-Kubaisi", "Qatari", "Qatari (Sawfa)", "QID", "28402063400065", "2030-05-31", "1984-02-17", "Male", "Consumer", "Arabic", 1, 2, "8 HRN & ID classes",
      "Qatari in the Sawfa category (BR-347: no prepaid restriction). 1 postpaid + 2 prepaid.", "Loyalty (existing)", "-", "New Prepaid; New Postpaid",
      "No prepaid cap; postpaid 1/5. DATA ONLY: the app stores customerSubType but does not branch on Sawfa - Qatari rules already apply.", jk=PRE, req="Sawfa", sub="Sawfa"),
    P("CUST-3066", "Maha Al-Ghanim", "Qatari", "Qatari (Sawfa Plus)", "QID", "28704063400066", "2030-07-31", "1987-04-26", "Female", "Consumer", "Arabic", 0, 7, "8 HRN & ID classes",
      "Qatari in the Sawfa Plus category with 7 prepaid lines - well past any expat cap.", "Prepaid Welcome (-10%)", "-", "New Prepaid",
      "Qatari: prepaid cap not applied (BR-347), so an 8th prepaid line passes. DATA ONLY for the Sawfa Plus label (Q9).", jk=PRE, req="Sawfa Plus", sub="Sawfa Plus"),
    P("CUST-3067", "Mohamed Nabil", "Egyptian", "Expat (Other ID)", "Other ID", "RES-8812045", "2030-03-31", "1986-12-20", "Male", "Consumer", "Arabic", 1, 0, "8 HRN & ID classes",
      "Expat holding a resident-permit style 'Other ID' (no QID), 1 postpaid line.", "Loyalty (existing)", "-", "Customer 360; New Postpaid",
      "Other ID is exception-routed to Back Office Fulfilment approval. NOTE: the ID-type selector does not offer 'Other ID', so find this customer by Mobile/name in Customer Search, not by ID scan.",
      jk=PP, req="Other ID", extra="Look up via Customer Search (mobile/name); the ID selector has no Other ID option."),
]

# HRN is DERIVED from nationality (VFQ list, 2026-10-02). The set is parsed from
# the app's own rule so the workbook cannot disagree with the code.
_hrn_src = (APP / "src/engines/hrnConfiguration.ts").read_text()
_hrn_map = _hrn_src[_hrn_src.index("export const NATIONALITY_HRN_CATEGORIES"):]
_hrn_map = _hrn_map[:_hrn_map.index("\n};")]
HRN_SET = set(re.findall(r"([a-z]+): \[", _hrn_map))


def is_hrn(nationality):
    return bool(nationality) and nationality.strip().lower() in HRN_SET


PROPOSED += [
    P("CUST-3068", "x", "Cambodian", "Expat (QID)", "QID", "29506011600068", "2030-02-28", "1995-06-14", "Male", "Consumer", "English", 0, 0, "8 HRN & ID classes",
      "Cambodian expat on a valid QID, no lines - HRN nationality coverage.", "None", "-", "New Postpaid", "HRN (Cambodia is on the list): QAR 100 advance and credit limit 50.", req="HRN Cambodia"),
    P("CUST-3069", "x", "Laotian", "Expat (QID)", "QID", "28910041800069", "2029-12-31", "1989-10-02", "Female", "Consumer", "English", 0, 0, "8 HRN & ID classes",
      "Laotian expat on a valid QID, no lines - HRN nationality coverage.", "None", "-", "New Postpaid", "HRN (Laos is on the list): QAR 100 advance and credit limit 50.", req="HRN Laos"),
    P("CUST-3070", "x", "Swazi", "Expat (QID)", "QID", "29103074800070", "2030-08-31", "1991-03-19", "Male", "Consumer", "English", 0, 0, "8 HRN & ID classes",
      "Swazi (Eswatini) expat on a valid QID, no lines - HRN nationality coverage.", "None", "-", "New Postpaid", "HRN (Eswatini is on the list): QAR 100 advance and credit limit 50.", req="HRN Eswatini"),
    # ---- 9. Number reservations
    P("CUST-3071", "x", "Qatari", "Qatari", "QID", "27801063400071", "2031-06-30", "1978-01-14", "Male", "Consumer", "Arabic", 1, 0, "9 Reserved numbers",
      "Qatari with TWO numbers reserved for them (+97433001001 at 09:15 and +97455610140 at 14:35 on 04 Oct 2026), both held by the Retail Sales demo login.", "Loyalty (existing)", "-", "New Postpaid (Number Selection)",
      "Number Selection opens on the Reserved Numbers tab. Both holds show their reservation date and time, newest first, and the most recent (+97455610140, 14:35) is selected by default.", jk=PP, req="Two reserved numbers"),
    # ---- 6b. Eligibility gates added 2026-10-04 - the two outcomes no customer could reach
    P("CUST-3072", "x", "Indian", "Expat (QID)", "QID", "28504042200072", "2030-09-30", "1985-04-04", "Male", "Consumer", "English", 5, 0, "6 Eligibility gates",
      "Indian expat on a valid QID already holding 5 active postpaid lines - the expat absolute maximum.", "None", "-", "New Postpaid",
      "Active Lines HARD STOP (BR-288): 'Expat maximum of 5 postpaid mobile lines reached (5 active)'. Every other check passes; the order cannot proceed (no approval route, unlike the Qatari 5+ case).",
      jk=PP, req="Expat line-cap hard stop (5/5)"),
    P("CUST-3073", "x", "Jordanian", "Expat (QID)", "QID", "28509034500073", "2030-06-30", "1985-09-03", "Male", "Consumer", "Arabic", 1, 0, "6 Eligibility gates",
      "Expat flagged on the collections blacklist but owing QAR 0 (no unpaid bill on file) - the flag alone is not a block.", "None", "-", "New Postpaid",
      "Collections Check PASSES ('No collections block on this account'): a collections block needs an outstanding balance above QAR 0 (VFQ business, 2026-10-02). Contrast CUST-3046, same flag with an unpaid bill -> soft-stop.",
      bl="collections", jk=PP, req="Collections flag, zero balance"),
    # ---- 10. High line counts (no-cap / approval-only paths). Home internet has no cap in any source.
    P("CUST-3081", "Khalifa Al-Naimi", "Qatari", "Qatari", "QID", "27807063400081", "2031-01-31", "1978-07-14", "Male", "Consumer", "Arabic", 12, 15, "10 High line counts",
      "Qatari family account holder with 12 postpaid + 15 prepaid mobile lines and 4 GigaHome fibre lines (31 lines in total).", "Loyalty (existing)", "-", "Customer 360; New Postpaid; New Prepaid",
      "Postpaid is past the Qatari limit of 5, so a further postpaid line routes for approval with no maximum (BR-288); prepaid has no cap (BR-347). Home internet has no rule.", jk=C360, req="High line counts (12 / 15 / 4)", hi=4),
    P("CUST-3082", "Noora Al-Mannai", "Qatari", "Qatari", "QID", "28509063400082", "2030-09-30", "1985-09-03", "Female", "Consumer", "Arabic", 20, 0, "10 High line counts",
      "Qatari with 20 postpaid lines and nothing else - postpaid far beyond the limit of 5.", "Loyalty (existing)", "-", "Customer 360; New Postpaid",
      "Postpaid 20/5: approval routing, never a hard stop for a Qatari (BR-288). The 2+ postpaid credit-control warning applies.", jk=PP, req="Postpaid far above the Qatari limit", hi=0),
    P("CUST-3083", "Abdulla Al-Sada", "Qatari", "Qatari", "QID", "29203063400083", "2030-12-31", "1992-03-21", "Male", "Consumer", "English", 0, 25, "10 High line counts",
      "Qatari with 25 prepaid lines and 2 GigaHome fibre lines.", "Prepaid Welcome (-10%)", "-", "Customer 360; New Prepaid",
      "No prepaid cap for a Qatari (BR-347): a 26th prepaid line passes.", jk=PRE, req="Prepaid with no cap", hi=2),
    P("CUST-3084", "Aisha Al-Kuwari", "Qatari", "Qatari", "QID", "28911063400084", "2030-06-30", "1989-11-09", "Female", "Consumer", "Arabic", 6, 10, "10 High line counts",
      "Qatari with 6 postpaid, 10 prepaid and 8 GigaHome fibre lines - home internet the largest group.", "Loyalty (existing)", "-", "Customer 360; Fixed Line; FWA",
      "Home internet has no cap in any source, so an 9th fibre line is not blocked by a rule.", jk=["workspace.customer-search", "fwa.new-fwa-wizard"], req="Many home internet lines", hi=8),
    P("CUST-3085", "Rashid Al-Hajri", "Qatari", "Qatari", "QID", "27604063400085", "2030-04-30", "1976-04-17", "Male", "Consumer", "Arabic", 0, 0, "10 High line counts",
      "Qatari with 6 GigaHome fibre lines and no mobile line at all (home-internet-only).", "Loyalty (existing)", "-", "Customer 360; Fixed Line",
      "No mobile line on file, so Active Lines is 0 while Home internet is 6; nothing caps fibre lines.", jk=C360, req="Home internet only", hi=6),
    # ---- 6. Eligibility gates: the actual user (secondary contact) of a postpaid line
    P("CUST-3090", "Maryam Al-Sulaiti", "Qatari", "Qatari", "QID", "31403153400090", "2030-03-31", "2014-03-15", "Female", "Consumer", "Arabic", 0, 0, "6 Eligibility gates",
      "Qatari aged 12 (under 18), no lines: a family member who can be added as the ACTUAL USER of a parent's postpaid line.", "None", "-", "New Postpaid (Actual User step)",
      "Under 18, so she CANNOT be added as the Secondary Contact through the standard flow (a Secondary Contact must be 18 or over; no other check is run for them). With a Qatari primary contact, 'Scan Below 18' on SIM Selection presents an under-18 Qatari (CUST-9001 or her); 'Apply for Exception' with the Court Type Order lets the order go on, held for manager approval.",
      jk=PP, req="Actual user (minor)"),
    # ---- 11. Restricted segments (Safwa, Safwa+, Royal): visible only to a role holding that segment's own grant
    P("CUST-3101", "Hessa Al-Thani", "Qatari", "Qatari", "QID", "27801013400101", "2031-03-31", "1978-01-10", "Female", "Safwa", "Arabic", 0, 0, "11 Restricted segments",
      "Qatari in the Safwa segment (VIP tag). A protected customer: only a role granted Safwa may see them.", "None", "-", "Customer Search; Customer 360; Customer Verification in any journey",
      "Premium (granted Safwa) sees the customer and continues; every other role is blocked with the access-restriction message and sees no name, ID, phone or segment.", jk=C360, req="Restricted segment: Safwa"),
    P("CUST-3102", "Abdulaziz Al-Sulaiti", "Qatari", "Qatari", "QID", "27505023400102", "2031-03-31", "1975-05-02", "Male", "Safwa+", "Arabic", 0, 0, "11 Restricted segments",
      "Qatari in the Safwa+ segment (VVIP tag). A protected customer, with its own grant independent of Safwa and Royal.", "None", "-", "Customer Search; Customer 360; Customer Verification in any journey",
      "Premium (granted Safwa+) sees the customer and continues; every other role is blocked with the access-restriction message and sees no customer information.", jk=C360, req="Restricted segment: Safwa+"),
    P("CUST-3103", "Sheikha Al-Naimi", "Qatari", "Qatari", "QID", "28203033400103", "2031-03-31", "1982-03-03", "Female", "Royal", "Arabic", 0, 0, "11 Restricted segments",
      "Qatari in the Royal segment. A protected customer, with its own grant independent of Safwa and Safwa+.", "None", "-", "Customer Search; Customer 360; Customer Verification in any journey",
      "Premium (granted Royal) sees the customer and continues; every other role is blocked with the access-restriction message and sees no customer information.", jk=C360, req="Restricted segment: Royal"),
    P("NAS-7006", "Farhan Chaudhry", "Pakistani", "Expat (QID)", "QID", "29303051200106", "2030-10-31", "1993-03-05", "Male", "Consumer", "English", 0, 0, "4 New customer / MNP",
      "NEW HRN customer (NAS only, Pakistani). The New Customer journey's demo scan always returns this person, so a demo New Customer is HRN-category.", "None", "-", "New Postpaid; New Prepaid",
      "Resolves via NAS, no customerId. HRN: QAR 100 advance, QAR 50 default credit limit, no limit choice (hrnConfiguration). The scanned card, the number read and the MOI result are this one person, so ID reconciliation passes. A Family Plan (Ahli) order for them is held for approval and, on submission, creates their Customer 360 record (customer, ID document, contact) so Add Another Connection is available there.", status="New (NAS record only)", jk=PP, req="New HRN customer (demo scan)"),
]

# --------------------------------------------------------------------------
# Family Plan scenarios (2026-11-04): one dedicated Qatari customer per Family Package composition. The lines, orders and package are written by --seed
# (seed_family_packages); the 'Family Plan Scenarios' sheet is read back from that data. Lines: (role, sequence, plan or None for the package plan, order approval).
# Plans: PROD-142..145 = Ahli / Ahli Pro / Ahli Premium / Ahli Platinum; PROD-311 = the Supplementary plan; PROD-310 = Ahli Lite (Kids Plan); PROD-312 = Ahli Net (Data-only Plan).
# --------------------------------------------------------------------------
APPROVED, PENDING = "Approved", "Pending Approval"
FAMILY_SCENARIOS = [
    dict(n=1, label="Primary Line only", cid="CUST-3201", name=("Hamda", "Saeed Khalid", "Al-Dosari"), dob="1988-03-14", sex="Female", plan="PROD-142",
         lines=[("Primary", 1, None, APPROVED)], note="Package with Primary Line 1 only, approved: Primary Line 2 is the next connection (same package and plan, included)."),
    dict(n=2, label="Both Primary Lines (Primary Line 1 and 2)", cid="CUST-3202", name=("Nasser", "Hamad Jassim", "Al-Attiyah"), dob="1984-07-22", sex="Male", plan="PROD-144",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED)], note="Both Primary Lines are active (2 of 2 used): the next connection is an additional one, by the plan the agent selects."),
    dict(n=3, label="Primary Line 1 active, Primary Line 2 awaiting approval", cid="CUST-3203", name=("Moza", "Rashid Ali", "Al-Kaabi"), dob="1991-11-05", sex="Female", plan="PROD-143",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, PENDING)], note="Primary Line 2 is on record but not active: it cannot be added again and no additional connection opens until it is approved (Add Another Connection says so)."),
    dict(n=4, label="Both Primary Lines and a Secondary Line (Kids Plan)", cid="CUST-3204", name=("Yousef", "Mansoor Saeed", "Al-Ghanim"), dob="1987-02-18", sex="Male", plan="PROD-143",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Secondary", 1, "PROD-310", APPROVED)], note="Both Primary Lines are active; the Secondary line is on Ahli Lite (Kids Plan). Supplementary (2 of 2 left) and both Secondary plans are still offered."),
    dict(n=5, label="Both Primary Lines and two Secondary Lines (Kids and Data-only)", cid="CUST-3205", name=("Latifa", "Khalifa Nasser", "Al-Suwaidi"), dob="1990-09-09", sex="Female", plan="PROD-145",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Secondary", 1, "PROD-310", APPROVED), ("Secondary", 2, "PROD-312", APPROVED)], note="Secondary has no limit: Kids Plan and Data-only Plan lines side by side. The Supplementary plan is still offered (0 of 2 used)."),
    dict(n=6, label="Both Primary Lines and two Supplementary Lines (Supplementary limit reached)", cid="CUST-3206", name=("Abdulrahman", "Salem Hamad", "Al-Ali"), dob="1983-12-01", sex="Male", plan="PROD-142",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Supplementary", 1, "PROD-311", APPROVED), ("Supplementary", 2, "PROD-311", APPROVED)], note="Two Supplementary lines (Supplementary limit reached): the Family-equivalent plan is no longer offered, only the Secondary plans (Ahli Lite and Ahli Net)."),
    dict(n=7, label="Both Primary Lines and a Supplementary Line", cid="CUST-3207", name=("Shaikha", "Jassim Rashid", "Al-Mohannadi"), dob="1986-06-27", sex="Female", plan="PROD-144",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Supplementary", 1, "PROD-311", APPROVED)], note="Mixed package: both Primary Lines are active, so the Family-equivalent plan (1 of 2 Supplementary left) and the Secondary plans are offered."),
    dict(n=8, label="All limits reached except Secondary (Primary x2, Supplementary x2, Secondary)", cid="CUST-3208", name=("Hamad", "Khalid Saeed", "Al-Bakri"), dob="1979-04-30", sex="Male", plan="PROD-145",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Supplementary", 1, "PROD-311", APPROVED), ("Supplementary", 2, "PROD-311", APPROVED), ("Secondary", 1, "PROD-312", APPROVED)],
         note="Only Secondary can still be added. Five mobile lines: the owner is at the Qatari postpaid cap, so a further line also meets the line-count eligibility check."),
    dict(n=9, label="Primary Line awaiting approval (package locked)", cid="CUST-3209", name=("Reem", "Abdulla Nasser", "Al-Jaber"), dob="1993-08-16", sex="Female", plan="PROD-143",
         lines=[("Primary", 1, None, PENDING)], note="Primary Line 1's order is not approved yet: nothing else opens and Add Another Connection says so."),
    dict(n=10, label="Both Primary Lines and a Supplementary Line awaiting approval", cid="CUST-3210", name=("Ghanim", "Ali Mubarak", "Al-Sulaiti"), dob="1981-01-19", sex="Male", plan="PROD-144",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED), ("Supplementary", 1, "PROD-311", PENDING)], note="A line awaiting approval still counts toward its limit and numbering: the next Supplementary is Supplementary Line 2."),
]
FAMILY_PLAN_NAMES = {"PROD-142": "Ahli", "PROD-143": "Ahli Pro", "PROD-144": "Ahli Premium", "PROD-145": "Ahli Platinum", "PROD-311": "Supplementary plan", "PROD-310": "Ahli Lite (Kids Plan)", "PROD-312": "Ahli Net (Data-only Plan)"}
for _i, _sc in enumerate(FAMILY_SCENARIOS):
    NAMES[_sc["cid"]] = _sc["name"]
    _yy, _mm, _dd = _sc["dob"][2:4], _sc["dob"][5:7], _sc["dob"][8:10]
    _sc["idn"] = f"2{_yy}{_mm}{_dd}3400{201 + _i:03d}"
    PROPOSED.append(P(_sc["cid"], full(_sc["name"]), "Qatari", "Qatari", "QID", _sc["idn"], "2031-03-31", _sc["dob"], _sc["sex"], "Consumer", "English", len(_sc["lines"]), 0, "12 Family Plan",
        f"Family Plan scenario {_sc['n']}: {_sc['label']}. Package on {FAMILY_PLAN_NAMES[_sc['plan']]}; lines: " + ", ".join(f"{r} Line {q}" + (" (awaiting approval)" if a == PENDING else "") for r, q, _p, a in _sc["lines"]) + ".",
        "None", "-", "Customer 360 (Family Package panel, Actions menu); Add Another Connection; New Postpaid (Family Plan)",
        _sc["note"] + " The Family Owner's ID must be validated for every line; all lines share one billing account.",
        jk=["workspace.customer-search", "workspace.customer360-view", "postpaid.new-postpaid-wizard"], req=f"Family Plan: {_sc['label']}"))

# --------------------------------------------------------------------------
# Mobile Postpaid Activation coverage additions (2026-11-04)
# --------------------------------------------------------------------------
# Family Plan scenarios for an expat owner (the Family Owner's own line-count limit applies to the package's lines).
FAMILY_SCENARIOS += [
    dict(n=11, label="Expat owner at the expat line cap (Primary Line 1 and 2)", cid="CUST-3211", name=("Vikram", "Anand Rao", "Iyengar"), dob="1985-05-12", sex="Male", nat="Indian", plan="PROD-143",
         lines=[("Primary", 1, None, APPROVED), ("Primary", 2, None, APPROVED)], note="Indian expat with 2 postpaid lines = AT the expat cap of 2 (BR-288): any further Family connection meets the owner's line-count check and is routed for approval."),
    dict(n=12, label="HRN owner, Primary Line only", cid="CUST-3212", name=("Naveed", "Iqbal Ahmed", "Chaudhry"), dob="1989-10-03", sex="Male", nat="Pakistani", plan="PROD-142",
         lines=[("Primary", 1, None, APPROVED)], note="Pakistani (HRN) owner: every added line carries the HRN rules (QAR 100 advance, credit limit 50) and the owner's line-count check."),
]
for _i, _sc in enumerate(FAMILY_SCENARIOS):
    if _sc["cid"] in NAMES:
        continue
    NAMES[_sc["cid"]] = _sc["name"]
    _yy, _mm, _dd = _sc["dob"][2:4], _sc["dob"][5:7], _sc["dob"][8:10]
    _sc["idn"] = f"2{_yy}{_mm}{_dd}3400{201 + _i:03d}"
    _nat = _sc.get("nat", "Qatari")
    PROPOSED.append(P(_sc["cid"], full(_sc["name"]), _nat, "Qatari" if _nat == "Qatari" else "Expat (QID)", "QID", _sc["idn"], "2031-03-31", _sc["dob"], _sc["sex"], "Consumer", "English", len(_sc["lines"]), 0, "12 Family Plan",
        f"Family Plan scenario {_sc['n']}: {_sc['label']}. Package on {FAMILY_PLAN_NAMES[_sc['plan']]}; lines: " + ", ".join(f"{r} Line {q}" + (" (awaiting approval)" if a == PENDING else "") for r, q, _p, a in _sc["lines"]) + ".",
        "None", "-", "Customer 360 (Family Package panel, Actions menu); Add Another Connection; New Postpaid (Family Plan)",
        _sc["note"] + " The Family Owner's ID must be validated for every line; all lines share one billing account.",
        jk=["workspace.customer-search", "workspace.customer360-view", "postpaid.new-postpaid-wizard"], req=f"Family Plan: {_sc['label']}"))

# Minors (under 18): one per nationality, so "Scan Below 18" on SIM Selection presents an under-18 of the primary contact's nationality whatever that is.
MINORS = [  # nationality, first, middle, last, dob, sex
    ("Indian", "Aarav", "Suresh", "Menon", "2011-04-09", "Male"), ("Egyptian", "Youssef", "Ahmed Hassan", "Mahmoud", "2010-08-21", "Male"),
    ("Pakistani", "Ayaan", "Ali Raza", "Khan", "2012-01-15", "Male"), ("Jordanian", "Zaid", "Khalil Omar", "Haddad", "2009-11-30", "Male"),
    ("Nepalese", "Anish", "Bahadur", "Gurung", "2011-06-18", "Male"), ("Emirati", "Saeed", "Rashid Ali", "Al-Nuaimi", "2010-03-07", "Male"),
    ("French", "Lucas", "Henri", "Dubois", "2012-09-12", "Male"), ("Swedish", "Elias", "Erik", "Johansson", "2011-12-02", "Male"),
    ("Filipino", "Mateo", "Santos", "Cruz", "2010-05-25", "Male"), ("Sri Lankan", "Dinuka", "Chaminda", "Silva", "2012-07-19", "Male"),
    ("Chinese", "Wei", "Jun", "Zhang", "2011-10-08", "Male"), ("Kenyan", "Brian", "Otieno", "Kamau", "2010-02-14", "Male"),
    ("Lebanese", "Karim", "Georges", "Khoury", "2009-09-23", "Male"), ("Syrian", "Omar", "Bassam", "Al-Jabri", "2012-04-27", "Male"),
    ("German", "Jonas", "Peter", "Weber", "2011-01-31", "Male"), ("Bangladeshi", "Rahim", "Abdul Karim", "Hossain", "2010-12-16", "Male"),
    ("Ugandan", "Joshua", "Moses", "Ssemakula", "2012-06-05", "Male"), ("Myanmar", "Aung", "Zaw", "Win", "2011-03-22", "Male"),
    ("Cambodian", "Dara", "Vichea", "Sok", "2010-10-11", "Male"), ("Laotian", "Somsak", "Khamphou", "Phommachanh", "2012-02-28", "Male"),
    ("Swazi", "Lwazi", "Sipho", "Nkosi", "2011-08-14", "Male"),
]
for _i, (_nat, _f, _m, _l, _dob, _sex) in enumerate(MINORS):
    _cid = f"CUST-{3301 + _i}"
    NAMES[_cid] = (_f, _m, _l)
    PROPOSED.append(P(_cid, f"{_f} {_l}", _nat, "Expat (QID)", "QID", f"3{_dob[2:4]}{_dob[5:7]}{_dob[8:10]}3400{301 + _i:03d}", "2031-03-31", _dob, _sex, "Consumer", "English", 0, 0, "13 Minors (Secondary Contact)",
        f"{_nat} aged {age(_dob)} (under 18), no lines: the under-18 person 'Scan Below 18' presents when the primary contact is {_nat}.", "None", "-", "New Postpaid (Secondary Contact on SIM Selection); any new connection as the applicant",
        "As the applicant: Age Check = HARD STOP unless Apply for Exception (Court Type Order). As a Secondary Contact: refused through the standard flow (must be 18 or over); Apply for Exception with the Court Type Order lets the order go on, held for manager approval. The Family Plan lines of a primary contact of this nationality use this person for the demo.",
        jk=PP, req="Minor (Secondary Contact)"))

NAMES.update({"CUST-3047": ("Hesham", "Mahmoud", "Fouad"), "CUST-3401": ("Dana", "Khalid", "Al-Thani")})
PROPOSED += [
    P("CUST-3047", "Hesham Mahmoud Fouad", "Egyptian", "Expat (QID)", "QID", "29107013400047", "2030-07-31", "1991-07-01", "Male", "Consumer", "English", 0, 0, "6 Eligibility gates",
      "Expat on a valid QID who is blacklisted with NO category recorded (neither collections nor security).", "None", "-", "New Postpaid; New Prepaid",
      "Blacklist Check (unclassified) = HARD STOP: the blacklist cannot be classed as collections or security, so no postpaid or prepaid connection can proceed.", bl="unclassified", req="Unclassified blacklist"),
    P("CUST-3401", "Dana Khalid Al-Thani", "Qatari", "Qatari", "QID", "28806013400401", "2031-03-31", "1988-06-01", "Female", "Consumer", "Arabic", 2, 0, "14 Billing variations",
      "Qatari with 2 postpaid lines and TWO postpaid billing accounts (a personal one and a second one), so the journey has to choose between them.", "Loyalty (existing)", "-", "New Postpaid (Billing Profile)",
      "The Billing Profile step selects an existing postpaid billing account automatically (the first on file) and never asks; the agent can go back and pick the other. A Family Package line is always billed on the package's own account.", req="Two postpaid billing accounts"),
]

# Scenario rewrites forced by the nationality rule (the nationalities originally
# picked for these rows are not on the list).
OVERRIDES = {
    "CUST-3017": dict(nat="Kenyan", scen="HRN expat (Kenyan) on a valid QID, no lines yet - HRN advance and credit limit 50 apply."),
    "CUST-3062": dict(nat="Ugandan", scen="HRN expat (Ugandan) sponsored by Gulf Logistics W.L.L. (HRN + B2B2C), 1 postpaid line."),
    "CUST-3064": dict(nat="Myanmar", scen="HRN expat (Myanmar) QID with 2 postpaid lines (AT the expat cap)."),
    "CUST-3063": dict(nat="Pakistani", grp="Expat (Other ID)", idt="Other ID", idn="RES-9930471",
                      scen="HRN expat (Pakistani) holding an 'Other ID' (resident permit) with 1 prepaid line - HRN together with an exception-routed ID type.",
                      journeys="New Prepaid; Customer Search", expected="Other ID exception-routed to Back Office Fulfilment approval (also on prepaid: it is not one of the four permitted prepaid ID types); HRN is only stored on prepaid (no QAR 100 advance); prepaid cap not an expat-QID cap. Find by mobile/name - the ID selector has no Other ID option.",
                      req="HRN on Other ID", extra="Look up via Customer Search (mobile/name); the ID selector has no Other ID option."),
}
for _p in PROPOSED:
    _p.update(OVERRIDES.get(_p["cid"], {}))
    _p["hrn"] = is_hrn(_p["nat"])
    if _p["hrn"] and _p["seg"] == "Consumer":
        _p["seg"] = "Consumer (HRN)"
    if not _p["hrn"] and _p["seg"] == "Consumer (HRN)":
        _p["seg"] = "Consumer"
    if _p["hrn"] and "HRN" not in _p["scen"]:
        _p["scen"] += " HRN: nationality is on the VFQ list -> QAR 100 advance, credit limit 50."

for _p in PROPOSED:
    _p["first"], _p["middle"], _p["last"] = NAMES[_p["cid"]]
    _p["name"] = full(NAMES[_p["cid"]])

# --------------------------------------------------------------------------
# --seed : write the PROPOSED customers into public/mock-data (idempotent)
# --------------------------------------------------------------------------
def apply_hrn(rd, wr):
    """Make hrnAdvancePaymentRequired / segment / credit limits agree with nationality for every customer."""
    cust = rd("customers")
    hrn_of = {}
    for c in cust:
        h = is_hrn(c.get("nationality"))
        hrn_of[c["customerId"]] = h
        if h:
            c["hrnAdvancePaymentRequired"] = True
            if c.get("segment") == "Consumer":
                c["segment"] = "Consumer (HRN)"
        else:
            c.pop("hrnAdvancePaymentRequired", None)
            if c.get("segment") == "Consumer (HRN)":
                c["segment"] = "Consumer"
    wr("customers", cust)
    acct = {a["accountId"]: a["customerId"] for a in rd("accounts")}
    bp = rd("billing-profiles")
    for b in bp:
        cid = acct.get(b["accountId"])
        if cid is None or cid not in hrn_of:
            continue
        if hrn_of[cid]:
            b["creditLimitQAR"] = 50; b["hrnAdvancePaymentQAR"] = 100
        elif b.get("hrnAdvancePaymentQAR") is not None or SEED_TAG in str(b.get("_note", "")):
            b.pop("hrnAdvancePaymentQAR", None); b["creditLimitQAR"] = 1000
    wr("billing-profiles", bp)
    crl = rd("credit-limits")
    for r in crl:
        cid = r.get("customerId")
        if cid in hrn_of:
            r["isHrn"] = hrn_of[cid]
            if not hrn_of[cid] and r.get("creditLimitQar") == 50:
                r["creditLimitQar"] = 1000; r["customerSegment"] = "Expat New Account"
    wr("credit-limits", crl)


def benefits_from(disc):
    """Structured benefit eligibility parsed from a customer's 'Discount eligibility' note (the workbook column).

    Tokens: retired | mada | b2b2c | loyalty | prepaid-welcome. 'Retired (claimed) -> FAILS validation' still lists
    `retired`: the customer claims it and the government-registry check in the journey decides. An employer row
    ('N/A - this is the employer...') carries no benefit.
    """
    d = (disc or "")
    if d.startswith("N/A") or d.startswith("None"):
        return []
    out = []
    for token, needle in (("retired", "Retired"), ("mada", "MADA"), ("b2b2c", "B2B2C"), ("loyalty", "Loyalty"), ("prepaid-welcome", "Prepaid Welcome")):
        if needle in d:
            out.append(token)
    return out


def apply_benefits(rd, wr):
    """Write `benefitEligibility` (see benefits_from) onto every customer, so the app reads it instead of parsing free text."""
    disc_of = {cid: s["disc"] for cid, s in SEED.items()}
    disc_of.update({p["cid"]: p["disc"] for p in PROPOSED})
    cust = rd("customers")
    for c in cust:
        if c["customerId"] in disc_of:
            c["benefitEligibility"] = benefits_from(disc_of[c["customerId"]])
    wr("customers", cust)


def refresh_seeded(rd, wr):
    """Re-sync records THIS script created (tagged SEED_TAG) with PROPOSED - so a changed nationality/ID flows through."""
    by = {p["cid"]: p for p in PROPOSED}
    cust = rd("customers")
    for c in cust:
        p = by.get(c["customerId"])
        if p and SEED_TAG in str(c.get("_note", "")):
            c.update({"nationality": p["nat"], "idType": p["idt"], "qid": p["idn"], "segment": p["seg"],
                      "email": f"{full(NAMES[p['cid']]).lower().replace(' ', '.').replace('-', '')}@example.qa"})
    wr("customers", cust)
    docs_ = rd("identity-documents")
    for d in docs_:
        p = by.get(d["customerId"])
        if p and SEED_TAG in str(d.get("_note", "")):
            d["documentType"], d["documentNumber"] = p["idt"], p["idn"]
            d["validationPath"] = "MOI Validation" if p["idt"] in ("QID", "Diplomatic ID") else "Capture/Validate Details"
            d.pop("issuingCountry", None)
            if p["idt"] == "Passport":
                d["issuingCountry"] = p["nat"]
            elif p["idt"] == "Other ID":
                d["issuingCountry"] = "Qatar"
    wr("identity-documents", docs_)
    # Billing-profile contact email follows the customer's (it is what an existing customer's email now comes from).
    emails = {c["customerId"]: c["email"] for c in cust}
    acct_cust = {x["billingProfileId"]: x["customerId"] for x in rd("accounts")}
    bps = rd("billing-profiles")
    for b in bps:
        cid = acct_cust.get(b["billingProfileId"])
        if cid in by and SEED_TAG in str(b.get("_note", "")):
            b["billingContactEmail"] = emails[cid]
    wr("billing-profiles", bps)


def apply_names(rd, wr):
    """Set first/middle/last + composed `name` on EVERY customer/NAS record in NAMES, then carry the new names through every file that repeats them."""
    def with_parts(rec, t):
        out = {}
        for k, v in rec.items():
            if k in ("firstName", "middleName", "lastName"):
                continue
            out[k] = v
            if k == "name":
                out["firstName"], out["middleName"], out["lastName"] = t
        out["name"] = full(t)
        return out

    cust = rd("customers"); old = {c["customerId"]: c["name"] for c in cust}
    wr("customers", [with_parts(c, NAMES[c["customerId"]]) if c["customerId"] in NAMES else c for c in cust])
    nas_ = rd("nas-records")
    wr("nas-records", [with_parts(n, NAMES[n["nasRecordId"]]) if n["nasRecordId"] in NAMES else n for n in nas_])

    cc = rd("customer-contacts"); out = []
    for r in cc:
        t = CONTACT_NAMES.get(f"{r['firstName']} {r['lastName']}") or next(
            (NAMES[r["customerId"]] for _ in [0] if r["customerId"] in NAMES and NAMES[r["customerId"]][0] == r["firstName"] and NAMES[r["customerId"]][2] == r["lastName"]), None)
        if t:
            r = {k: v for k, v in r.items() if k not in ("middleName",)}
            new = {}
            for k, v in r.items():
                new[k] = t[0] if k == "firstName" else t[2] if k == "lastName" else v
                if k == "firstName":
                    new["middleName"] = t[1]
            r = new
        out.append(r)
    wr("customer-contacts", out)

    acct = {a["accountId"]: a["customerId"] for a in rd("accounts")}
    bp = rd("billing-profiles")
    for b in bp:
        cid = acct.get(b["accountId"])
        if cid in NAMES and old.get(cid):
            for k in ("name", "billingContactName"):
                if isinstance(b.get(k), str) and b[k].startswith(old[cid]):
                    b[k] = full(NAMES[cid]) + b[k][len(old[cid]):]
        if b.get("billingContactName") in CONTACT_NAMES:
            b["billingContactName"] = full(CONTACT_NAMES[b["billingContactName"]])
    wr("billing-profiles", bp)

    for fname, key in (("contacts-b2b2c", None), ("authorised-contacts", "name"), ("gigahome-acceptance-forms", "customerName"), ("mnp-application-forms", "applicantName")):
        data = rd(fname)
        for r in data:
            if fname == "contacts-b2b2c":
                if r.get("employeeCustomerId") in NAMES:
                    r["employeeName"] = full(NAMES[r["employeeCustomerId"]])
            elif r.get(key) in CONTACT_NAMES:
                r[key] = full(CONTACT_NAMES[r[key]])
        wr(fname, data)


LINES_TAG = "Customer-Inventory mobile lines (2026-10-11)"
HOME_TAG = "Customer-Inventory home internet lines (2026-10-11)"
LINE_PLANS = {"Postpaid": ("Postpaid Mobile Plan - Red 150", "PROD-200", 150), "Prepaid": ("Prepaid Red 25", "PROD-301", 25)}


def seed_mobile_lines(rd, wr):
    """Gives every customer the mobile lines their activePostpaidLines / activePrepaidLines claim.

    The app lists a customer's lines from the primary number (customer.lineType + phone) plus the Active installed
    assets on the customer's accounts, so a count of 3 postpaid + 1 prepaid with only the primary line on file showed
    as 1 connection. This adds the missing ones: one installed asset per extra line (serviceId = its MSISDN), on an
    account of the matching type (created, with a billing profile, when the customer has none). Idempotent: the line
    ids and numbers are derived from the customer id, and a customer that already has enough lines is skipped.
    """
    custs, accts, bps, assets = rd("customers"), rd("accounts"), rd("billing-profiles"), rd("installed-assets")
    by_cust = {}
    for a in accts:
        by_cust.setdefault(a["customerId"], []).append(a)
    acct_owner = {a["accountId"]: a["customerId"] for a in accts}
    n_acc = max(int(a["accountId"][4:]) for a in accts) + 1
    n_bill = max(int(b["billingProfileId"][5:]) for b in bps) + 1
    n_ia = max(int(a["installedAssetId"][3:]) for a in assets) + 1
    used = {c.get("phone") for c in custs} | {a["serviceId"] for a in assets}
    next_msisdn = 55520001
    new_accts, new_bps, new_assets, touched = [], [], [], []
    for c in custs:
        cid = c["customerId"]
        want = {"Postpaid": c.get("activePostpaidLines") or 0, "Prepaid": c.get("activePrepaidLines") or 0}
        if not any(want.values()) or not c.get("lineType"):
            continue
        want[c["lineType"]] -= 1  # the primary line is the customer's own number
        have = {"Postpaid": 0, "Prepaid": 0}
        for a in assets:
            if a["serviceId"] == c.get("phone"):
                continue  # the primary line's own plan record (seed_primary_line_plans) is not an extra line
            if acct_owner.get(a["accountId"]) == cid and a["status"] in ("Active", "Suspended") and re.search(r"mobile|sim|prepaid|postpaid", a["productServiceName"], re.I):
                have["Prepaid" if re.search("prepaid", a["productServiceName"], re.I) else "Postpaid"] += 1
        for kind in ("Postpaid", "Prepaid"):
            for _ in range(max(0, want[kind] - have[kind])):
                mine = [a for a in by_cust.get(cid, []) if kind in a["accountType"] and "Mobile" in a["accountType"]]
                if not mine:
                    aid, bid = f"ACC-{n_acc}", f"BILL-{n_bill}"
                    n_acc += 1; n_bill += 1
                    src = next((b for b in bps if b["accountId"] in {a["accountId"] for a in by_cust.get(cid, [])}), bps[0])
                    acct = {"_note": LINES_TAG, "accountId": aid, "customerId": cid, "accountType": f"Consumer Mobile {kind}", "status": "Active",
                            "billingProfileId": bid, "barringStatus": "Not Barred", "barringType": None, "barringReason": None}
                    bp = {k: v for k, v in src.items() if not k.startswith("_")}
                    bp.update({"_note": LINES_TAG, "billingProfileId": bid, "accountId": aid, "name": f"{c['name']} - {kind}"})
                    new_accts.append(acct); new_bps.append(bp)
                    by_cust.setdefault(cid, []).append(acct); acct_owner[aid] = cid
                    mine = [acct]
                while f"+974{next_msisdn}" in used:
                    next_msisdn += 1
                msisdn = f"+974{next_msisdn}"; used.add(msisdn)
                name, prod, price = LINE_PLANS[kind]
                new_assets.append({"_note": LINES_TAG, "installedAssetId": f"IA-{n_ia}", "accountId": mine[0]["accountId"],
                                   "billingProfileId": mine[0]["billingProfileId"], "productServiceName": name, "serviceId": msisdn, "status": "Active",
                                   "effectiveFrom": "2026-06-01", "effectiveTo": None, "serviceAccount": f"SA-{n_ia}", "price": price,
                                   "billingProfile": mine[0]["billingProfileId"], "promotion": prod, "orderDate": "2026-05-28",
                                   "orderNumber": f"ORD-{n_ia}", "orderType": "New Connection"})
                assets.append(new_assets[-1]); n_ia += 1; touched.append(cid)
    if new_assets:
        wr("accounts", accts + new_accts); wr("billing-profiles", bps + new_bps); wr("installed-assets", assets)
    print(f"mobile lines: +{len(new_assets)} lines on {len(set(touched))} customers, +{len(new_accts)} accounts")


PRIMARY_PLANS = {"Postpaid": ["PROD-107", "PROD-108", "PROD-109", "PROD-111", "PROD-112"], "Prepaid": ["PROD-301", "PROD-302", "PROD-303"]}
PRIMARY_TAG = "Customer-Inventory primary-line plans (2026-10-11)"


def seed_primary_line_plans(rd, wr):
    """Gives each customer's own number (customer.phone) a real plan: an Active installed asset whose serviceId is the
    number, so Customer 360 shows a catalogue plan name (products.json) instead of the generic 'Postpaid mobile line'.
    The plan is chosen from the catalogue by customer order - test data, not evidence of what the customer holds.
    customerServicesEngine skips this asset when listing lines (the own number is already listed from the customer)."""
    custs, accts, bps, assets, prods = rd("customers"), rd("accounts"), rd("billing-profiles"), rd("installed-assets"), {p["productId"]: p for p in rd("products")}
    n_ia = max(int(a["installedAssetId"][3:]) for a in assets) + 1
    have = {a["serviceId"] for a in assets}
    new, k = [], {"Postpaid": 0, "Prepaid": 0}
    for c in custs:
        kind = c.get("lineType")
        if not kind or not c.get("phone"):
            continue
        i = k[kind]; k[kind] += 1
        if c["phone"] in have:
            continue
        mine = [a for a in accts if a["customerId"] == c["customerId"]]
        acct = next((a for a in mine if kind in a["accountType"] and "Mobile" in a["accountType"]), mine[0] if mine else None)
        if not acct:
            continue
        pr = prods[PRIMARY_PLANS[kind][i % len(PRIMARY_PLANS[kind])]]
        new.append({"_note": PRIMARY_TAG, "installedAssetId": f"IA-{n_ia}", "accountId": acct["accountId"], "billingProfileId": acct["billingProfileId"],
                    "productServiceName": pr["name"], "serviceId": c["phone"], "status": "Active", "effectiveFrom": "2026-06-01", "effectiveTo": None,
                    "serviceAccount": f"SA-{n_ia}", "price": pr.get("mrcQAR", 0), "billingProfile": acct["billingProfileId"], "promotion": pr["productId"],
                    "orderDate": "2026-05-28", "orderNumber": f"ORD-{n_ia}", "orderType": "New Connection"})
        n_ia += 1
    if new:
        wr("installed-assets", assets + new)
    print(f"primary-line plans: +{len(new)}")


def backfill_postpaid_activation(rd, wr):
    """Postpaid lines the generator created carry postpaidActivationDate (= effectiveFrom), like the original demo postpaid assets."""
    assets = rd("installed-assets")
    n = 0
    for a in assets:
        if str(a.get("_note", "")).startswith("Customer-Inventory") and re.search("postpaid", a["productServiceName"], re.I) and not a.get("postpaidActivationDate"):
            a["postpaidActivationDate"] = a["effectiveFrom"]; n += 1
    if n:
        wr("installed-assets", assets)
    print(f"postpaid activation dates: +{n}")


LEADS_TAG = "Customer-Inventory leads (2026-10-11)"
# (customer, lead id, service needed, status, created via, comments). Customer 360 joins a lead to a customer by mobile number, so the
# number is read from customers.json rather than written here.
LEADS = [
    ("CUST-3081", "LEAD-20401", "Home", "New", "Tele-sales call", "Wants a fifth fibre line for a second residence; coverage check requested."),
    ("CUST-3081", "LEAD-20402", "Mobile", "Contacted", "Tablet Lead Creation", "Asked to review 12 postpaid lines for a family plan; sent plan comparison."),
    ("CUST-3081", "LEAD-20403", "Device", "Qualified", "Tele-sales call", "Handset instalment plan for two family members."),
    ("CUST-3082", "LEAD-20404", "Mobile", "Callback Scheduled", "Tele-sales call", "Considering moving 20 postpaid lines to one plan; call back Sunday."),
    ("CUST-3083", "LEAD-20405", "Home", "New", "New Lead Mobile", "Interested in GigaHome fibre for the two existing fibre addresses."),
    ("CUST-3084", "LEAD-20406", "Home", "Contacted", "Tele-sales call", "Fibre speed upgrade across 8 home lines; waiting on a quote."),
    ("CUST-3085", "LEAD-20407", "Mobile", "New", "Tablet Lead Creation", "Home-internet-only customer asking about a first mobile line."),
    ("CUST-3054", "LEAD-20408", "Device", "Qualified", "Tele-sales call", "Retention call: wants a handset upgrade on the postpaid line."),
]


def seed_leads(rd, wr):
    """Active (non-closed) leads for a few customers, so the Customer 360 Active Leads panel has something to show."""
    phone = {c["customerId"]: c.get("phone") for c in rd("customers")}
    leads = rd("leads")
    have = {l["leadId"] for l in leads}
    new = [{"leadId": lid, "serviceNeeded": svc, "status": st, "ownerId": "AGENT-VINODHINIR", "createdVia": via, "mobileNumber": phone[cid], "comments": cm, "_note": LEADS_TAG}
           for cid, lid, svc, st, via, cm in LEADS if lid not in have and phone.get(cid)]
    if new:
        wr("leads", leads + new)
    print(f"leads: +{len(new)}")


OVERVIEW_TAG = "Customer-Inventory overview details (2026-10-11)"
OVERVIEW_CID = "CUST-3081"


def seed_overview_details(rd, wr):
    """Fills every Customer 360 Overview panel for CUST-3081 (the 12 postpaid / 15 prepaid / 4 home-internet customer): a suspended
    line, a credit limit, two bills (one unpaid) and the payment that settled the first, open tickets (one past its SLA) and recent
    activity. Idempotent by record id. Everything is test data, not evidence of what a real account holds."""
    cid = OVERVIEW_CID
    accts = [a for a in rd("accounts") if a["customerId"] == cid]
    post = next((a for a in accts if "Postpaid" in a["accountType"]), None)
    if not post:
        return
    done = {}

    def add(name, key, recs):
        data = rd(name)
        have = {r.get(key) for r in data}
        new = [r for r in recs if r[key] not in have]
        if new:
            wr(name, data + new)
        done[name] = len(new)

    bp = post["billingProfileId"]
    add("bills", "billId", [
        {"_note": OVERVIEW_TAG, "billId": "BILL-9301", "type": "bill", "accountId": post["accountId"], "billingProfileId": bp, "customerId": cid, "billPeriod": "2026-07",
         "mrc": 2700, "vas": 0, "vat": 0, "totalAmount": 1180.0, "status": "billed", "isTaxInvoice": True, "currentChargesQAR": 0, "dueDate": "2026-08-14"},
        {"_note": OVERVIEW_TAG, "billId": "BILL-9302", "type": "bill", "accountId": post["accountId"], "billingProfileId": bp, "customerId": cid, "billPeriod": "2026-08",
         "mrc": 2700, "vas": 0, "vat": 0, "totalAmount": 1260.0, "status": "billed", "isTaxInvoice": True, "currentChargesQAR": 312.5, "dueDate": "2026-09-18"},
    ])
    add("payments", "paymentId", [
        {"_note": OVERVIEW_TAG, "paymentId": "PAY-8301", "orderId": None, "customerId": cid, "paymentMethod": "Credit Card", "captureChannel": "MyVodafone App",
         "receiptNumber": "RCPT-330301", "chargeType": "Monthly Bill", "amountQar": 1180.0, "status": "Authorized", "capturedAt": "2026-08-12T10:15:00+03:00"},
    ])
    add("credit-limits", "id", [
        {"_note": OVERVIEW_TAG, "id": "CRL-4301", "accountId": post["accountId"], "customerId": cid, "customerSegment": "Qatari Premium", "creditLimitQar": 5000,
         "isHrn": False, "setByAgentId": "AGT-8801", "restrictionApplied": False, "lastUpdated": "2026-06-15"},
    ])
    tpl = {k: v for k, v in rd("trouble-tickets")[0].items() if not k.startswith("_")}
    def ticket(tid, status, cat, area, issue, prio, created, due, queue):
        t = dict(tpl)
        t.update({"_note": OVERVIEW_TAG, "ticketId": tid, "customerId": cid, "status": status, "category": cat, "area": area, "actualIssue": issue, "priority": prio,
                  "createdAt": created, "slaDueAt": due, "queue": queue, "hashtags": [], "assignedTo": None, "assignedAt": None, "escalations": [], "activities": [], "attachments": [], "publicNotes": []})
        return t
    add("trouble-tickets", "ticketId", [
        ticket("TT-40301", "Not Solved", "Mobile Complaints", "Data", "Slow data on one of the postpaid lines", "2-High", "2026-09-09T09:00:00+03:00", "2026-09-10T09:00:00+03:00", "FL Agents"),
        ticket("TT-40302", "Assigned", "Billing", "Bill Query", "Customer disputes the August roaming charge", "3-Medium", "2026-09-12T11:30:00+03:00", "2026-09-17T11:30:00+03:00", "Complaints Team"),
    ])
    acts = rd("customer-activities")
    tplA = {k: v for k, v in acts[0].items() if not k.startswith("_")}
    def act(n, date, journey, topic, sub, comments):
        a = dict(tplA)
        a.update({"_note": OVERVIEW_TAG, "activityNumber": n, "accountId": post["accountId"], "orderId": None, "transactionDate": date, "journey": journey, "topic": topic,
                  "subTopic": sub, "comments": comments, "msisdn": next((c["phone"] for c in rd("customers") if c["customerId"] == cid), None), "customerType": "Postpaid", "customerSegment": "Premium", "status": "Solved"})
        return a
    add("customer-activities", "activityNumber", [
        act("ACT-93001", "2026-09-10", "Billing Enquiry", "Billing", "Bill Explanation", "Explained the August invoice across the 12 postpaid lines."),
        act("ACT-93002", "2026-09-03", "Plan Review", "Plan Change", "Family Plan", "Reviewed plan options for the postpaid lines; customer to decide."),
        act("ACT-93003", "2026-08-20", "SIM Support", "SIM", "SIM Replacement", "Replaced a damaged SIM on a prepaid line."),
    ])
    # One prepaid line is suspended (still a held line, but not Active).
    assets = rd("installed-assets")
    owner = {a["accountId"]: a["customerId"] for a in rd("accounts")}
    pre = [a for a in assets if owner.get(a["accountId"]) == cid and re.search("prepaid", a["productServiceName"], re.I)]
    changed = 0
    if pre and pre[-1]["status"] != "Suspended":
        pre[-1]["status"] = "Suspended"; changed = 1
        wr("installed-assets", assets)
    # Fixed Line, TV and IoT services on the customer's home (GigaHome) account, plus a few smart devices.
    home = next((a for a in accts if "Fixed Line" in a["accountType"]), None)
    if home:
        n_ia = max(int(a["installedAssetId"][3:]) for a in rd("installed-assets")) + 1
        have = {a["serviceId"] for a in rd("installed-assets")}
        # (serviceId, product / service name, plan code): Customer 360 sorts a service into Fixed Line / TV / IoT by its NAME,
        # and lists its plan add-ons by the plan code, so each kind gets its own plan code (and its own add-on below).
        lines = [("+97444083101", "Fixed Voice Line - Home", "PROD-FXL", 60), ("+97444083102", "Fixed Voice Line - Home", "PROD-FXL", 60),
                 ("OSNTV-3081-1", "OSNtv Premium", "PROD-OSN", 90), ("OSNTV-3081-2", "OSNtv Premium", "PROD-OSN", 90),
                 ("IOT-3081-1", "IoT Smart Plug", "PROD-IOT", 25), ("IOT-3081-2", "IoT Indoor Tracker", "PROD-IOT", 25), ("IOT-3081-3", "IoT Smart Plug", "PROD-IOT", 25)]
        extra = []
        for sid, nm, promo, price in lines:
            if sid in have:
                continue
            extra.append({"_note": OVERVIEW_TAG, "installedAssetId": f"IA-{n_ia}", "accountId": home["accountId"], "billingProfileId": home["billingProfileId"], "productServiceName": nm,
                          "serviceId": sid, "status": "Active", "effectiveFrom": "2026-06-01", "effectiveTo": None, "serviceAccount": f"SA-{n_ia}", "price": price,
                          "billingProfile": home["billingProfileId"], "promotion": promo, "orderDate": "2026-05-28", "orderNumber": f"ORD-{n_ia}", "orderType": "New Connection"})
            n_ia += 1
        all_assets = rd("installed-assets") + extra
        for a_ in all_assets:  # keep the plan code in step with the list above (an earlier run used PROD-201 for the fixed lines)
            for sid, _nm, promo, _price in lines:
                if a_["serviceId"] == sid and a_["promotion"] != promo:
                    a_["promotion"] = promo
        wr("installed-assets", all_assets)
    # Plan-level paid add-ons for the plans this customer's lines are on (Customer 360 lists a line's add-ons by its plan).
    ADD = {"PROD-107": ("Roaming Pass 5GB", "Roaming Add-on", 40), "PROD-108": ("Extra 100GB Data Booster", "Data Add-on", 30), "PROD-109": ("Multi SIM", "Multi SIM Add-on", 25),
           "PROD-111": ("International 100 Add-on", "International Add-on", 90), "PROD-112": ("Caller Tune Plus", "Value Added Service", 10), "PROD-200": ("Extra 100GB Data Booster", "Data Add-on", 30),
           "PROD-301": ("Roaming Pass 5GB", "Roaming Add-on", 40), "PROD-201": ("Extra Giga Wi-Fi Hub", "Wi-Fi Add-on", 10),
           "PROD-FXL": ("Voice Mail Plus", "Value Added Service", 10), "PROD-OSN": ("OSNtv Sports Pack", "IPTV Add-on", 40), "PROD-IOT": ("IoT Data Pack 1GB", "Data Add-on", 15)}
    add("addons-discounts", "addonDiscountId", [
        {"_note": OVERVIEW_TAG, "addonDiscountId": f"ADO-73{i:02d}", "addonType": ty, "name": nm, "description": f"{nm} on this plan", "price": pr, "category": "Paid Add-on",
         "durationMonths": None, "planId": pid, "isLockedReadOnly": False}
        for i, (pid, (nm, ty, pr)) in enumerate(ADD.items(), 1)])
    add("commitment-penalties", "penaltyId", [
        {"_note": OVERVIEW_TAG, "penaltyId": "PEN-8301", "accountId": post["accountId"], "customerId": cid, "actionType": "disconnection", "calculatedValue": 480, "currency": "QAR",
         "valueStoredPersistently": False, "calculationSource": "lock-in: QR 80 x 6 remaining months", "orderId": None, "quoteRequiresOrder": True, "calculatedAt": "2026-09-10T10:15:00+03:00",
         "status": "Pending", "blocksNewConnection": False},
        {"_note": OVERVIEW_TAG, "penaltyId": "PEN-8302", "accountId": post["accountId"], "customerId": cid, "actionType": "plan downgrade", "calculatedValue": 150, "currency": "QAR",
         "valueStoredPersistently": False, "calculationSource": "guided journey - plan change", "orderId": None, "quoteRequiresOrder": True, "calculatedAt": "2026-08-22T14:00:00+03:00",
         "status": "Applied", "blocksNewConnection": False},
    ])
    print(f"overview details: {done} suspended line +{changed}")


def seed_home_internet(rd, wr):
    """Gives each PROPOSED customer the GigaHome fibre lines their `hi` count claims: one Active installed asset per line on a
    'Consumer Fixed Line (GigaHome)' account (created with a billing profile when missing). Idempotent by line id."""
    custs, accts, bps, assets = rd("customers"), rd("accounts"), rd("billing-profiles"), rd("installed-assets")
    have_c = {c["customerId"] for c in custs}
    n_acc = max(int(a["accountId"][4:]) for a in accts) + 1
    n_bill = max(int(b["billingProfileId"][5:]) for b in bps) + 1
    n_ia = max(int(a["installedAssetId"][3:]) for a in assets) + 1
    done = {a["serviceId"] for a in assets}
    new_a, new_b, new_i = [], [], []
    for p in PROPOSED:
        if not p["hi"] or p["cid"] not in have_c:
            continue
        acct = next((a for a in accts + new_a if a["customerId"] == p["cid"] and "Fixed Line" in a["accountType"]), None)
        if not acct:
            aid, bid = f"ACC-{n_acc}", f"BILL-{n_bill}"
            n_acc += 1; n_bill += 1
            src = next((b for b in bps if b["accountId"] in {a["accountId"] for a in accts if a["customerId"] == p["cid"]}), bps[0])
            acct = {"_note": HOME_TAG, "accountId": aid, "customerId": p["cid"], "accountType": "Consumer Fixed Line (GigaHome)", "status": "Active",
                    "billingProfileId": bid, "barringStatus": "Not Barred", "barringType": None, "barringReason": None}
            bp = {k: v for k, v in src.items() if not k.startswith("_")}
            bp.update({"_note": HOME_TAG, "billingProfileId": bid, "accountId": aid, "name": f"{p['name']} - Home"})
            new_a.append(acct); new_b.append(bp)
        for k in range(1, p["hi"] + 1):
            sid = f"GHSVC-{p['cid'][5:]}-{k}"
            if sid in done:
                continue
            new_i.append({"_note": HOME_TAG, "installedAssetId": f"IA-{n_ia}", "accountId": acct["accountId"], "billingProfileId": acct["billingProfileId"],
                          "productServiceName": "GigaHome Fiber 1Gbps", "serviceId": sid, "status": "Active", "effectiveFrom": "2026-06-01", "effectiveTo": None,
                          "serviceAccount": f"SA-{n_ia}", "price": 290, "billingProfile": acct["billingProfileId"], "promotion": "PROD-201",
                          "orderDate": "2026-05-28", "orderNumber": f"ORD-{n_ia}", "orderType": "New Connection"})
            n_ia += 1
    if new_i:
        wr("accounts", accts + new_a); wr("billing-profiles", bps + new_b); wr("installed-assets", assets + new_i)
    print(f"home internet: +{len(new_i)} lines, +{len(new_a)} accounts")


def seed_extra_billing_account(rd, wr):
    """CUST-3401 gets a SECOND postpaid billing account (account + billing profile), so the Billing Profile step has two to choose between. Idempotent."""
    accts, bps = rd("accounts"), rd("billing-profiles")
    cid = "CUST-3401"
    mine = [a for a in accts if a["customerId"] == cid and "Postpaid" in a["accountType"]]
    if len(mine) != 1:
        return
    src_b = next(b for b in bps if b["billingProfileId"] == mine[0]["billingProfileId"])
    aid, bid = "ACC-5890", "BILL-7390"
    if any(a["accountId"] == aid for a in accts):
        return
    accts.append({"_note": SEED_TAG, "accountId": aid, "customerId": cid, "accountType": "Consumer Mobile Postpaid", "status": "Active", "billingProfileId": bid, "barringStatus": "Not Barred", "barringType": None, "barringReason": None})
    nb = {k: v for k, v in src_b.items() if not k.startswith("_")}
    nb.update({"_note": SEED_TAG, "billingProfileId": bid, "accountId": aid, "name": "Dana Al-Thani - Second account", "isDefault": False})
    bps.append(nb)
    wr("accounts", accts); wr("billing-profiles", bps)
    print("extra billing account: +1 for CUST-3401")


def seed_family_packages(rd, wr):
    """Family Package data for the Family Plan scenario customers (FAMILY_SCENARIOS): each line's order (Complete + Approved, or Submitted for Approval +
    Pending Approval) billed on the customer's postpaid billing account, and the package's lines. A line's number is the customer's own number for the first
    line and the customer's extra postpaid lines (seed_mobile_lines) for the rest. Also puts the two original customers' Primary Line 1 on their own numbers.
    Idempotent: ids are derived from the customer id; existing records are skipped."""
    custs = {c["customerId"]: c for c in rd("customers")}
    accts, assets = rd("accounts"), rd("installed-assets")
    owner = {a["accountId"]: a["customerId"] for a in accts}
    new_orders, new_lines = [], []
    for sc in FAMILY_SCENARIOS:
        cid = sc["cid"]
        c = custs[cid]
        acct = next(a for a in accts if a["customerId"] == cid and "Postpaid" in a["accountType"])
        extras = sorted(a["serviceId"] for a in assets if owner.get(a["accountId"]) == cid and a["serviceId"] != c.get("phone") and a["status"] == "Active")
        numbers = [c["phone"]] + extras
        if len(numbers) < len(sc["lines"]):
            print(f"WARNING {cid}: {len(numbers)} numbers for {len(sc['lines'])} family lines")
        for i, (role, seq, plan, approval) in enumerate(sc["lines"]):
            plan_id = plan or sc["plan"]
            oid = f"ORD-FAM-{cid[5:]}-{i + 1}"
            done = approval == APPROVED
            new_orders.append({"_note": "Family Plan scenario seed (2026-11-04).", "orderId": oid, "orderType": "New Postpaid Activation", "orderSubType": "Consumer",
                               "status": "Complete" if done else "Submitted for Approval", "customerId": cid, "customerName": c["name"], "accountId": acct["accountId"],
                               "billingProfileId": acct["billingProfileId"], "productId": plan_id, "productIds": [plan_id], "msisdn": numbers[i] if i < len(numbers) else None,
                               "approvalStatus": approval, "createdBy": "USR-1101", "sourceChannel": "Retail Store", "createdAt": f"2026-11-0{1 + (i % 3)}T10:00:00+03:00"})
            line = {"lineId": f"FPL-{cid[5:]}-{role[:3]}{seq}", "packageId": f"FPK-{cid}", "customerId": cid, "role": role, "sequence": seq, "planId": plan_id,
                    "orderId": oid, "msisdn": numbers[i] if i < len(numbers) else None}
            if role != "Primary":
                line["tierPlanId"] = sc["plan"]
            new_lines.append({k: v for k, v in line.items() if v is not None})
    o, l = rd("orders"), rd("family-package-lines")
    have_o, have_l = {x["orderId"] for x in o}, {x["lineId"] for x in l}
    o += [x for x in new_orders if x["orderId"] not in have_o]
    l += [x for x in new_lines if x["lineId"] not in have_l]
    # The two original customers' Primary Line 1 sits on their own number (so it is also one of their listed services).
    own = {"FPL-1001-P1": ("ORD-FAM-1001", custs["CUST-1001"]["phone"]), "FPL-3084-P1": ("ORD-FAM-3084", custs["CUST-3084"]["phone"])}
    for x in l:
        if x["lineId"] in own:
            x["msisdn"] = own[x["lineId"]][1]
    for x in o:
        for _lid, (oid, phone) in own.items():
            if x["orderId"] == oid:
                x["msisdn"] = phone
    wr("orders", o); wr("family-package-lines", l)
    print(f"family packages: +{len([x for x in new_lines if x['lineId'] not in have_l])} lines, +{len([x for x in new_orders if x['orderId'] not in have_o])} orders")


def seed():
    def rd(n): return json.loads((MOCK / f"{n}.json").read_text())
    def wr(n, d): (MOCK / f"{n}.json").write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
    added = {}

    def add(name, key, recs):
        data = rd(name)
        have = {r.get(key) for r in data}
        new = [r for r in recs if r[key] not in have]
        if new:
            wr(name, data + new)
        added[name] = len(new)

    custs, ndocs, nrecs, accts, bills, orders, aprs, conts, retire = [], [], [], [], [], [], [], [], []
    employers = {}
    n_doc, n_acc, n_bill, n_ord, n_cont, n_apr = 5601, 5601, 7101, 91001, 3101, 3401
    # The Family Plan customers (2026-11-04) take ids from their own ranges: the main counters run into ids the later seed steps give to other customers' lines.
    fam_cids = {sc['cid'] for sc in FAMILY_SCENARIOS} | {p_['cid'] for p_ in PROPOSED if p_['cat'] in ('13 Minors (Secondary Contact)', '14 Billing variations') or p_['cid'] == 'CUST-3047'}
    n_fdoc, n_facc, n_fbill = 5801, 5801, 7301
    tpl = rd("billing-profiles")[0]
    for i, p in enumerate(PROPOSED):
        email = f"{p['name'].lower().replace(' ', '.').replace('-', '')}@example.qa"
        ph = f"+974{55513001 + i}"
        if p["status"].startswith("New"):
            nrecs.append({"_note": SEED_TAG, "nasRecordId": p["cid"], "documentType": p["idt"], "documentNumber": p["idn"], "expiryDate": p["exp"],
                          "name": p["name"], "firstName": p["first"], "middleName": p["middle"], "lastName": p["last"], "dob": p["dob"], "nationality": p["nat"], "gender": p["sex"], "email": email})
            continue
        c = {"_note": SEED_TAG, "customerId": p["cid"], "qid": p["idn"], "idType": p["idt"], "name": p["name"],
             "firstName": p["first"], "middleName": p["middle"], "lastName": p["last"], "dob": p["dob"], "nationality": p["nat"],
             "segment": p["seg"], "email": email, "phone": ph, "preferredLanguage": p["lang"], "blacklisted": bool(p["bl"]),
             "moiValidationStatus": "Verified", "activePostpaidLines": p["pp"], "activePrepaidLines": p["pre"], "age": age(p["dob"]), "gender": p["sex"]}
        if p["pp"] or p["pre"]:
            c["lineType"] = "Postpaid" if p["pp"] else "Prepaid"
        if p["bl"] and p["bl"] != "unclassified":
            c["blacklistCategory"] = p["bl"]
            c["blacklistReason"] = "Outstanding dues > threshold" if p["bl"] == "collections" else "Security restriction on new connections"
        if p.get("sub"):
            c["customerSubType"] = p["sub"]
        if p["hrn"]:
            c["hrnAdvancePaymentRequired"] = True
        if p["emp"]:
            c["companyName"] = p["emp"]
            employers.setdefault(p["emp"], None)
        custs.append(c)
        if p["cid"] in fam_cids:
            doc_id, n_fdoc = f"IDD-{n_fdoc}", n_fdoc + 1
        else:
            doc_id, n_doc = f"IDD-{n_doc}", n_doc + 1
        d = {"_note": SEED_TAG, "identityDocumentId": doc_id, "customerId": p["cid"], "documentType": p["idt"], "documentNumber": p["idn"]}
        if p["exp"]:
            d["expiryDate"] = p["exp"]
        d.update({"validationPath": "MOI Validation" if p["idt"] in ("QID", "Diplomatic ID") else "Capture/Validate Details", "status": "Validated", "scanCompleted": True,
                  "scannedAt": "2026-09-30T10:00:00+03:00", "docStatus": "Active", "uploadDateTime": "2026-09-30T10:00:00+03:00", "serviceReference": p["cid"]})
        if p["idt"] == "Passport":
            d["issuingCountry"] = p["nat"]
        ndocs.append(d)
        if "Retired" in p["disc"] and "FAILS" not in p["disc"]:
            retire.append(p["idn"])
        if p["pp"] or p["pre"]:
            if p["cid"] in fam_cids:
                aid, bid = f"ACC-{n_facc}", f"BILL-{n_fbill}"
                n_facc += 1; n_fbill += 1
            else:
                aid, bid = f"ACC-{n_acc}", f"BILL-{n_bill}"
                n_acc += 1; n_bill += 1
            acct = {"_note": SEED_TAG, "accountId": aid, "customerId": p["cid"], "accountType": "Consumer Mobile Postpaid" if p["pp"] else "Consumer Mobile Prepaid",
                    "status": "Active", "billingProfileId": bid, "barringStatus": "Not Barred", "barringType": None, "barringReason": None}
            if p["cid"] == "CUST-3026":
                acct["specialManagement"] = "B2B2C Consumer"
            accts.append(acct)
            b = {k: v for k, v in tpl.items() if not k.startswith("_")}
            b.update({"_note": SEED_TAG, "billingProfileId": bid, "accountId": aid, "name": f"{p['name']} - Personal", "autoPayStatus": "Not Enrolled",
                      "billingContactName": p["name"], "billingContactPhone": ph, "billingContactEmail": email,
                      "billingLanguage": p["lang"], "paymentMethod": "Invoice", "creditLimitQAR": 50 if p["hrn"] else 1000, "billingAddress": "Doha, Qatar"})
            bills.append(b)
            if p["cid"] in ("CUST-3004", "CUST-3013"):
                oid = f"ORD-{n_ord}"; n_ord += 1
                orders.append({"_note": SEED_TAG, "orderId": oid, "orderType": "New Postpaid Activation", "orderSubType": "Consumer", "status": "Complete",
                               "customerId": p["cid"], "accountId": aid, "billingProfileId": bid, "productIds": ["PROD-100"], "totalQAR": 250, "mrcTotalQAR": 250,
                               "nrcTotalQAR": 0, "approvalStatus": "Approved", "createdBy": "USR-1101", "sourceChannel": "Retail Store"})
                aprs.append({"_note": SEED_TAG, "activityId": f"APR-{n_apr}", "orderId": oid, "approvalStatus": "Approved", "activityStatus": "Done", "owner": "USR-1103",
                             "channel": "Retail Store", "type": "Order Approval", "topic": "New Connection", "subTopic": "Postpaid Mobile", "area": "Sales",
                             "journeyName": "New Postpaid Connection", "mobileNumber": ph, "serviceAccount": f"SA-{n_apr}",
                             "orderApprovalStatus": "Approved", "orderCreatedDate": "2026-09-15"})
                n_apr += 1
        if p["emp"]:
            conts.append({"_note": SEED_TAG, "contactId": f"CONT-{n_cont}", "employer": p["emp"], "employeeName": p["name"], "employeeQid": p["idn"], "b2b2cEligible": True,
                          "planEligibility": "Postpaid Red 500 Promotion", "employeeCustomerId": p["cid"]})
            n_cont += 1
    ent = rd("enterprise-accounts")
    names = {e["name"] for e in ent}
    new_emp = []
    for k, emp in enumerate(sorted(employers)):
        if emp in names:
            continue
        new_emp.append({"_note": SEED_TAG, "enterpriseAccountId": f"ENT-ACC-82{k + 1:02d}", "level": "parent", "name": emp, "crType": "Commercial Registration",
                        "crId": f"CR-7{k + 1}1005", "crNumber": f"CR-7{k + 1}1005", "agentId": "AGT-2201", "businessType": "B2B2C", "creditLimit": None,
                        "creditLimitNeedsFinanceApproval": True, "parentAccountId": None, "contactsOnly": False})
    for c in conts:
        c["employerAccountId"] = next((e["enterpriseAccountId"] for e in ent + new_emp if e["name"] == c["employer"]), None)
    add("customers", "customerId", custs); add("identity-documents", "identityDocumentId", ndocs); add("nas-records", "nasRecordId", nrecs)
    add("accounts", "accountId", accts); add("billing-profiles", "billingProfileId", bills); add("orders", "orderId", orders)
    add("order-approvals", "activityId", aprs); add("contacts-b2b2c", "contactId", conts); add("enterprise-accounts", "enterpriseAccountId", new_emp)
    acc = {a["customerId"]: a["accountId"] for a in rd("accounts")}
    add("device-installments", "id", [{"_note": SEED_TAG, "id": "DOI-3101", "accountId": acc["CUST-3052"], "qid": "28707063400052", "deviceName": "Samsung Galaxy S24",
        "devicePriceQar": 3200, "downPaymentQar": 500, "installmentMonths": 12, "monthlyInstallmentQar": 225, "eligibilityListMembership": "Eligible",
        "qcbCreditCheckStatus": "Passed", "stockReservationStatus": "Reserved", "accountStanding": "Good Standing", "status": "Approved",
        "colourOptions": ["Onyx Black"], "storageOptions": ["128 GB", "256 GB"], "catalogStockStatus": "In Stock", "catalogStockNote": "In stock - same-day store pickup", "tradeInBonusQar": None}])
    add("commitment-penalties", "penaltyId", [{"_note": SEED_TAG, "penaltyId": "PEN-8201", "accountId": acc["CUST-3052"], "customerId": "CUST-3052", "actionType": "disconnection",
        "calculatedValue": 320, "currency": "QAR", "valueStoredPersistently": False, "calculationSource": "guided journey - disconnection (8 of 12 lock-in months done)",
        "orderId": None, "quoteRequiresOrder": True, "calculatedAt": "2026-09-30T10:15:00+03:00", "status": "Pending", "blocksNewConnection": False}])
    # Two reservations for CUST-3071 (made at different times); the picker shows the time and selects the newest.
    nums = rd("numbers")
    for n_ in nums:
        if n_.get("msisdn") == "+97433001001":
            n_["reservedAt"] = "2026-10-04T09:15:00+03:00"
            n_["reservedForQid"] = "27801063400071"
    wr("numbers", nums)
    add("numbers", "msisdn", [{"_note": SEED_TAG, "msisdn": "+97455610140", "category": "Free", "status": "Reserved", "reservedBy": "Fatima Al-Kuwari", "priceQAR": 0, "reservedAt": "2026-10-04T14:35:00+03:00", "reservedForQid": "27801063400071"}])
    add("sims", "simSerial", [{"_note": SEED_TAG, "simSerial": "8974412009900130001", "iccid": "8974412009900130001", "type": "Physical", "stockStatus": "Issued", "swapStatus": "Original"},
                              {"_note": SEED_TAG, "simSerial": "8974412009900130002", "iccid": "8974412009900130002", "type": "Printed eSIM", "stockStatus": "Issued", "swapStatus": "Original"}])
    # Every customer needs a contact record (Customer 360 Contact Information, billing contact
    # picker) and cross-sales offers keyed to it, or the New Connection Offers step shows
    # "No cross-sales offer available". Three postpaid offers each; existing records untouched.
    all_c = rd("customers")
    docs_by = {}
    for d in rd("identity-documents"):
        docs_by.setdefault(d["customerId"], []).append(d)
    have_contact = {c["customerId"] for c in rd("customer-contacts")}
    new_contacts, new_offers = [], []
    for c in all_c:
        cid = c["customerId"]
        if cid in have_contact:
            continue
        own = docs_by.get(cid, [])
        d = next((x for x in own if x["documentType"] == "QID"), own[0] if own else None)
        ctc = f"CTC-{cid}"
        new_contacts.append({"_note": SEED_TAG, "contactRecordId": ctc, "customerId": cid, "firstName": c.get("firstName", ""), "middleName": c.get("middleName", ""),
                             "lastName": c.get("lastName", ""), "idType": d["documentType"] if d else c.get("idType", ""), "idNumber": d["documentNumber"] if d else c.get("qid", ""),
                             "idExpirationDate": d.get("expiryDate") if d else None, "nationality": c["nationality"], "dob": c["dob"], "gender": c.get("gender", ""),
                             "preferredLanguage": c.get("preferredLanguage", "English"), "cellNumber": c.get("phone", ""), "workPhone": None, "employerEmail": None})
        for n, (name, prod, rent, desc) in enumerate([
            ("Postpaid Red 500 Welcome Offer", "PROD-105", 500, "Open a new Postpaid Red 500 line with the welcome bundle"),
            ("Postpaid Max Switch-On Offer", "PROD-109", 180, "Open a new Postpaid Max line with a free first-month add-on"),
            # The one Ahli Family Plan offer shown under Recommended Offers > New Postpaid (2026-11-04); its offerId ends -AHLI in the data.
            ("Postpaid Ahli Family Offer", "PROD-142", 375, "Open a new Ahli Family Plan with 50GB full speed local data and unlimited local minutes & SMS"),
        ], 1):
            new_offers.append({"_note": SEED_TAG, "offerId": f"OFR-{cid}-{n}" if n < 3 else f"OFR-{cid}-AHLI", "offerType": "Cross Sell", "offerName": name, "monthlyRental": rent, "offerDescription": desc,
                               "campaignCode": "CMP-NEW-0930", "priorityCode": f"P{n}", "serviceIdentifier": c.get("phone", ""), "status": "Offered", "treatmentCode": f"TRT-0{n}",
                               "channel": "Guided Journey", "promotionId": f"PROMO-90{n}5", "price": rent, "addOnMonthly": 0, "linkedProductIds": [prod], "contactId": ctc,
                               "serviceJourney": "new-postpaid"})
    # An unpaid bill is what turns the collections flag into a Collections Check soft-stop: the
    # eligibility step sums every non-Paid bill for the customer and a QAR 0 balance does not block.
    # (CUST-3073 deliberately has none.) Without these, CUST-1004 / CUST-3046 passed the check.
    add("bills", "billId", [
        {"_note": SEED_TAG, "billId": f"BILL-91{n:02d}", "type": "bill", "accountId": acc.get(cid), "customerId": cid, "billPeriod": "2026-08",
         "totalAmount": amt, "status": "overdue", "dueDate": "2026-09-14", "isTaxInvoice": True,
         "note": "Overdue balance seeded so the Collections Check soft-stop is reachable for this collections-blacklisted customer."}
        for n, (cid, amt) in enumerate([("CUST-1004", 450.0), ("CUST-3046", 310.5)], 1)
    ])
    add("customer-contacts", "contactRecordId", new_contacts)
    add("cross-sales-offers", "offerId", new_offers)
    reg = rd("govt-retiree-registry")
    reg["retiredIdNumbers"] = sorted(set(reg["retiredIdNumbers"]) | set(retire))
    wr("govt-retiree-registry", reg)
    refresh_seeded(rd, wr)
    apply_names(rd, wr)
    apply_hrn(rd, wr)
    apply_benefits(rd, wr)
    seed_mobile_lines(rd, wr)
    seed_home_internet(rd, wr)
    seed_primary_line_plans(rd, wr)
    seed_extra_billing_account(rd, wr)
    seed_family_packages(rd, wr)
    backfill_postpaid_activation(rd, wr)
    seed_leads(rd, wr)
    seed_overview_details(rd, wr)
    print("seeded:", {k: v for k, v in added.items() if v}, "| retiree registry now", len(reg["retiredIdNumbers"]))


if "--seed" in sys.argv:
    seed()
    sys.exit(0)


# --------------------------------------------------------------------------
# Assemble rows
# --------------------------------------------------------------------------
HDR = ["Test ID", "Customer / NAS ID", "Status in app", "Category", "Full name", "First name", "Middle name(s)", "Last name", "Nationality", "Nationality group", "ID type", "ID number (use for lookup)",
       "ID expiry", "Date of birth", "Age", "Gender", "Segment", "Language", "Mobile", "Total lines", "Postpaid lines", "Prepaid lines", "Home internet", "Other services",
       "Blacklist", "Risk class", "Employer (B2B2C)", "Discount eligibility", "MNP / porting", "Scenario", "Journeys to run", "Expected outcome", "Roles that can run the primary journey", "Seed notes / evidence"]
rows = []
roles_feat = {r["staffId"]: {f["key"] for f in r["features"]} for r in personas}


def roles_for(jk):
    return ", ".join(sid for sid, fs in roles_feat.items() if all(k in fs for k in jk))


doc_by_cust = {}
for d in docs:
    doc_by_cust.setdefault(d["customerId"], []).append(d)
used_phones = set()

PROP_IDS = {p["cid"] for p in PROPOSED}
for cid, c in customers.items():
    if cid in PROP_IDS:
        continue
    a = SEED[cid]
    ds = doc_by_cust.get(cid, [])
    # prefer the document the app's lookup resolves on; list all if several
    # Same document order for type, number and expiry, so the three columns line up one-to-one.
    idt = " / ".join(d["documentType"] for d in ds) or c.get("idType", "")
    idn = " / ".join(d["documentNumber"] for d in ds) or c.get("qid", "")
    exp = " / ".join(d.get("expiryDate", "") for d in ds)
    nat = c["nationality"]
    grp = "Qatari" if nat == "Qatari" else ("GCC" if c.get("idType") == "GCC ID" else "Expat")
    bl = (c.get("blacklistCategory") or "uncategorised") if c.get("blacklisted") else ""
    note = []
    if c.get("qid") and c["qid"] not in idn:
        note.append(f"customers.json qid {c['qid']} differs from the identity-document number(s); the app looks up by the document number.")
    if c.get("qid") in retiree_ids or any(d["documentNumber"] in retiree_ids for d in ds):
        note.append("An ID of this customer is in govt-retiree-registry.json.")
    note.append("Original demo data: customers.json" + (", identity-documents.json" if ds else ""))
    used_phones.add(c.get("phone"))
    rows.append(["", cid, ORIG, a["cat"], c["name"], c.get("firstName", ""), c.get("middleName", ""), c.get("lastName", ""), nat, grp, idt, idn, exp, c.get("dob", ""), age(c["dob"]) if c.get("dob") else "", c.get("gender", ""),
                 c.get("segment", ""), c.get("preferredLanguage", ""), c.get("phone", ""), c.get("activePostpaidLines", ""), c.get("activePrepaidLines", ""),
                 (c.get("activePostpaidLines", 0) + c.get("activePrepaidLines", 0)) if "activePostpaidLines" in c else "",
                 bl or ("(blacklisted)" if c.get("blacklisted") else "No"), "HRN" if is_hrn(c.get("nationality")) else "Standard", c.get("companyName", ""),
                 a["disc"], a["mnp"], a["scen"], a["journeys"], a["expected"], roles_for(a["jk"]), " ".join(note)])
_passports_on_file = {d["documentNumber"] for d in docs if d["documentType"] == "Passport"}
for n in nas:
    if n["nasRecordId"] in PROP_IDS:
        continue
    # A QID whose linked Passport is already a customer's is that customer (CUST-1002 for NAS-7005), not a second person: no row of its own.
    if n.get("linkedPassportNumber") in _passports_on_file:
        continue
    a = SEED_NAS[n["nasRecordId"]]
    rows.append(["", n["nasRecordId"], ORIG + " (NAS only)", a["cat"], n["name"], n.get("firstName", ""), n.get("middleName", ""), n.get("lastName", ""), n["nationality"], "Qatari" if n["nationality"] == "Qatari" else "Expat", n["documentType"],
                 n["documentNumber"], n["expiryDate"], n["dob"], age(n["dob"]), n["gender"], "Not a customer", "", "", 0, 0, 0, "No", "HRN" if is_hrn(n["nationality"]) else "Standard", "", a["disc"], a["mnp"],
                 a["scen"], a["journeys"], a["expected"], roles_for(a["jk"]), "Original demo data: nas-records.json (no customers.json row)"])

for i, p in enumerate(PROPOSED):
    ph = f"+974{55513001 + i}"
    new = p["status"].startswith("New")
    rows.append(["", p["cid"], ADDED, p["cat"], p["name"], p["first"], p["middle"], p["last"], p["nat"], p["grp"], p["idt"], p["idn"], p["exp"], p["dob"], age(p["dob"]), p["sex"],
                 "Not a customer" if new else p["seg"], p["lang"], "" if new else ph, "" if new else p["pp"], "" if new else p["pre"], 0 if new else p["pp"] + p["pre"],
                 p["bl"] or "No", "HRN" if p["hrn"] else "Standard", p["emp"], p["disc"], p["mnp"], p["scen"], p["journeys"], p["expected"], roles_for(p["jk"]),
                 ("Synthetic record. " + p["extra"]).strip()])


# Home internet = the customer's GigaHome fibre services, counted the way Customer 360 lists them
# (customerServicesEngine.listCustomerServices, category 'GigaHome Fibre'): their GigaHome subscriptions plus Active
# installed assets on their accounts whose product name is broadband / fibre / GigaHome / home (not TV, not mobile).
_acct_owner = {a["accountId"]: a["customerId"] for a in load("accounts")}
_home = {}
for g in load("gigahome-osntv-subscriptions"):
    _home[g["customerId"]] = _home.get(g["customerId"], 0) + 1
for a in load("installed-assets"):
    nm = a.get("productServiceName", "")
    if a.get("status") == "Active" and not re.search(r"prepaid|postpaid|mobile|sim|iptv|osn|\btv\b|fixed[ -]?(voice )?line|landline", nm, re.I) and re.search(r"broadband|fibre|fiber|gigahome|home", nm, re.I):
        o = _acct_owner.get(a["accountId"])
        _home[o] = _home.get(o, 0) + 1
# Row layout from the builders above is [... Mobile, Postpaid, Prepaid, Total mobile]; re-shape to
# [... Mobile, Total lines, Postpaid, Prepaid, Home internet]. Total lines = postpaid + prepaid + home internet.
# Other services = Fixed Line + TV + IoT, counted as Customer 360 lists them (see customerServicesEngine.listCustomerServices).
_other = {}
for a in load("installed-assets"):
    nm = a.get("productServiceName", "")
    if a.get("status") in ("Active", "Suspended") and re.search(r"fixed[ -]?(voice )?line|landline|iptv|osn|\btv\b|^iot ", nm, re.I):
        _other[_acct_owner.get(a["accountId"])] = _other.get(_acct_owner.get(a["accountId"]), 0) + 1
for b in load("iptv-stb-bundles"):
    if not b.get("removedByCustomer"):
        _other[_acct_owner.get(b["accountId"])] = _other.get(_acct_owner.get(b["accountId"]), 0) + 1
for d in load("smart-devices"):
    _other[d["customerId"]] = _other.get(d["customerId"], 0) + 1
_i = HDR.index("Mobile")
for r in rows:
    pp, pre = r[_i + 1], r[_i + 2]
    hi = _home.get(r[1], 0)
    ot = _other.get(r[1], 0)
    r[_i + 1:_i + 4] = [(pp or 0) + (pre or 0) + hi + ot, pp, pre]
    r.insert(_i + 4, hi)
    r.insert(_i + 5, ot)

# collision check (only meaningful before --seed has written the records)
blob = "".join(f.read_text() for f in MOCK.glob("*.json"))
if SEED_TAG not in blob:
    for r in rows:
        if r[2] == ADDED:
            for v in (r[HDR.index("ID number (use for lookup)")], r[HDR.index("Mobile")]):
                if v and v in blob:
                    sys.exit(f"ABORT: synthetic value {v} for {r[1]} already exists in mock-data")
ids = [r[1] for r in rows]
if len(ids) != len(set(ids)):
    sys.exit("ABORT: duplicate customer ids")
rows.sort(key=lambda r: (r[3], r[1]))
for i, r in enumerate(rows, 1):
    r[0] = f"TC-{i:03d}"

# --------------------------------------------------------------------------
# Workbook
# --------------------------------------------------------------------------
RED, DARK = "E60000", "262626"
hfont = Font(bold=True, color="FFFFFF", name="Calibri")
hfill = PatternFill("solid", fgColor=RED)
thin = Side(style="thin", color="D9D9D9")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
FILL_SEEDED = PatternFill("solid", fgColor="E8F5E9")
FILL_PROP = PatternFill("solid", fgColor="FFF8E1")


ISO_DATE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})\b")


def dmy(v):
    """Every date the workbook shows is dd/mm/yyyy (the app's one date format). The mock-data files keep ISO, so the 'Seeded Records'
    sheet - which quotes values to type into those files - is left as is."""
    return ISO_DATE.sub(r"\3/\2/\1", v) if isinstance(v, str) else v


def sheet(wb, title, header, data, widths=None, first=False, wrap_cols=()):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.append(header)
    for r in data:
        ws.append([dmy(x) for x in r])
    for c in ws[1]:
        c.font, c.fill, c.border = hfont, hfill, border
        c.alignment = Alignment(wrap_text=True, vertical="center")
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.border = border
            c.alignment = Alignment(wrap_text=True, vertical="top")
    for i, h in enumerate(header, 1):
        ws.column_dimensions[get_column_letter(i)].width = (widths or {}).get(h, min(max(len(str(h)) + 2, 12), 28))
    ws.freeze_panes = "E2" if len(header) > 6 else "A2"
    ws.auto_filter.ref = ws.dimensions
    ws.sheet_view.zoomScale = 90
    return ws


wb = Workbook()

# Rows whose expected outcome ends in an approval: say who approves when the order is raised by Retail Sales (every Mobile Postpaid order of theirs that needs approval goes to the manager).
_ei = HDR.index("Expected outcome")
for _r in rows:
    _e = str(_r[_ei] or "")
    if re.search(r"approval|approve|approver|routed", _e, re.I) and SALES_MANAGER not in _e:
        _r[_ei] = _e.rstrip() + f" Raised by Retail Sales, the approval goes to the {SALES_MANAGER} (Manager/Approver); the confirmation page names the team."

# README
n_seed = sum(r[2].startswith(ORIG) for r in rows)
n_prop = len(rows) - n_seed
# Customers
W = {"Test ID": 9, "Customer / NAS ID": 13, "Status in app": 16, "Category": 22, "Full name": 34, "First name": 13, "Middle name(s)": 24, "Last name": 14, "Nationality": 12, "Nationality group": 14, "ID type": 14,
     "ID number (use for lookup)": 24, "ID expiry": 12, "Date of birth": 12, "Age": 6, "Gender": 8, "Segment": 14, "Language": 10, "Mobile": 14,
     "Total lines": 9, "Postpaid lines": 9, "Prepaid lines": 9, "Home internet": 9, "Other services": 10, "Blacklist": 11, "Risk class": 11, "Employer (B2B2C)": 20, "Discount eligibility": 34, "MNP / porting": 30,
     "Scenario": 50, "Journeys to run": 32, "Expected outcome": 60, "Roles that can run the primary journey": 34, "Seed notes / evidence": 40}
ws = sheet(wb, "Customers", HDR, rows, W, first=True)
for row in ws.iter_rows(min_row=2):
    f = FILL_SEEDED if str(row[2].value).startswith(ORIG) else FILL_PROP
    for c in row[:4]:
        c.fill = f

# Scenario coverage
tc = {r[1]: r[0] for r in rows}
reqmap = {}
for p in PROPOSED:
    if p["req"]:
        reqmap.setdefault(p["req"], []).append(p["cid"])
cov = [
    ("Qatari - single active postpaid line", "Requested", ["CUST-1001"]),
    ("Qatari - 2 active postpaid lines", "Requested", reqmap["Qatari 2 lines"]),
    ("Qatari - 5 lines (at cap); 6th line needs approval", "Requested", reqmap["Qatari 5 lines (at cap)"] + reqmap["Qatari 6 lines (approved above cap)"]),
    ("Expat - 1 postpaid line", "Requested", reqmap["Expat 1 line"]),
    ("Expat - 2 postpaid lines", "Requested", reqmap["Expat 2 lines"]),
    ("Expat - 3 active lines (3rd obtained via approval; cap 2)", "Requested", reqmap["Expat 3 lines + approval"]),
    ("Existing customer eligible for further (loyalty) discounts", "Requested", ["CUST-1001", "CUST-1003"] + reqmap["Existing customer further discount"]),
    ("Customer with two reserved numbers (reservation time, newest selected by default)", "Added", reqmap["Two reserved numbers"]),
    ("MADA discount eligible", "Requested", reqmap["MADA eligible"] + ["CUST-3024 (MADA or B2B2C, by plan)", "CUST-3027 (Retired or MADA, one per journey)"]),
    ("Retired-person discount eligible", "Requested", ["CUST-1001 (via scan ID)"] + reqmap["Retired person discount"] + reqmap["Retired + MADA"]),
    ("Retired - validation FAILS (negative)", "Added", reqmap["Retired - validation failure"]),
    ("B2B2C type discount", "Requested", ["CUST-1002"] + reqmap["B2B2C type discount"]),
    ("Both MADA and B2B2C eligible", "Requested", reqmap["MADA + B2B2C both eligible"]),
    ("B2B2C with pre-existing Special Management", "Added", reqmap["B2B2C + Special Management"]),
    ("New customer (not in Siebel)", "Requested", ["NAS-7001", "NAS-7002", "NAS-7003", "NAS-7004", "NAS-7006"]),
    ("Mobile Number Portability - new customer", "Requested", ["NAS-7001", "NAS-7002", "NAS-7003"]),
    ("MNP - existing customer / conditional accept", "Added", ["CUST-1004 (seeded MNP-11002)"] + reqmap["Existing customer MNP / conditional accept"]),
    ("MNP - rejection (name mismatch)", "Added", reqmap["MNP rejection"]),
    ("MNP - multi-number (Passport)", "Added", reqmap["MNP multi-number passport"]),
    ("MNP + B2B2C", "Added", reqmap["MNP + B2B2C"]),
    ("Port-out / FNP", "Added", ["CUST-1001 (POUT-17001)", "CUST-1002 (POUT-17002)", "CUST-1003 (POUT-17003, FNP-12001)"]),
    ("HRN customer (QR 100 advance)", "Added", ["CUST-1002"] + reqmap["HRN customer"] + reqmap["HRN passport at prepaid cap"] + reqmap["HRN on Other ID"]),
    ("HRN combined with B2B2C / with expat line cap", "Added", reqmap["HRN + B2B2C"] + reqmap["HRN at expat line cap"]),
    ("HRN nationality list coverage (each listed country)", "Added", ["CUST-3026 (Pakistan)", "CUST-3061 (Bangladesh)", "CUST-3068 (Cambodia)", "CUST-3064 (Myanmar)", "CUST-3069 (Laos)", "CUST-3017 (Kenya)", "CUST-3062 (Uganda)", "CUST-3070 (Eswatini)"]),
    ("Sawfa / Sawfa Plus (Qatari categories)", "Added", reqmap["Sawfa"] + reqmap["Sawfa Plus"]),
    ("Other ID (resident-permit style)", "Added", ["CUST-2001"] + reqmap["Other ID"]),
    ("Expat combined 5-line cap / Passport prepaid cap / GCC cap", "Added", ["CUST-1005"] + reqmap["Expat combined 5-line cap"] + reqmap["Expat passport at prepaid cap"]),
    ("Blacklist - collections (soft stop) / security (hard stop)", "Added", ["CUST-1004", "CUST-1006"] + reqmap["Collections blacklist (expat)"] + reqmap["Security blacklist (expat)"]),
    ("ID problems - expired / no expiry / under 18 / age 18", "Added", ["CUST-1006", "CUST-9001"] + reqmap["Expired ID"] + reqmap["No expiry on file"] + reqmap["Age boundary"]),
    ("Expat 5-line absolute maximum (Active Lines hard stop)", "Added", reqmap["Expat line-cap hard stop (5/5)"]),
    ("Collections flag with QAR 0 balance (not a block)", "Added", reqmap["Collections flag, zero balance"]),
    ("Exception-routed ID types (Passport / GCC / Diplomatic / Other)", "Added", ["CUST-1002", "CUST-1005", "CUST-1007", "CUST-2001"] + reqmap["Diplomatic ID (valid)"]),
    ("Family Plan - every package composition (Primary Line 1 only, + Primary Line 2, + Supplementary, + Secondary, mixed, Supplementary limit reached, awaiting approval at Primary Line 1 / Primary Line 2 / an additional line)", "Added", [p["cid"] for p in PROPOSED if p["cat"] == "12 Family Plan"] + ["CUST-1001 (Family overlay: Primary Line 1 only, approved)", "CUST-3084 (Family overlay: Primary Line 1 awaiting approval)"]),
    ("Under-18 people for the Secondary Contact (one per nationality)", "Added", reqmap["Minor (Secondary Contact)"] + ["CUST-3090", "CUST-9001"]),
    ("Blacklisted with no category (unclassified)", "Added", reqmap["Unclassified blacklist"]),
    ("Two postpaid billing accounts", "Added", reqmap["Two postpaid billing accounts"]),
    ("Prepaid-only customer / pre-to-post migration", "Added", reqmap["Qatari prepaid-only"]),
    ("SIM swap / lock-in penalty / device instalment / FWA / premium", "Added", reqmap["SIM swap"] + reqmap["Lock-in penalty / device installment"] + reqmap["FWA / multi-product"] + reqmap["Premium / retention"]),
]
covrows = []
for s, origin, ids_ in cov:
    refs = []
    for x in ids_:
        base = x.split(" ")[0]
        refs.append(f"{tc[base]} ({x})" if base in tc else x)
    covrows.append([s, origin, len(ids_), "; ".join(refs)])
sheet(wb, "Scenario Coverage", ["Scenario", "Requested / Added", "# customers", "Test customers"], covrows, {"Scenario": 55, "Requested / Added": 14, "# customers": 11, "Test customers": 110})


# Family Plan Scenarios: read back from the seeded data (family-package-lines.json, orders.json), not from the definitions above, so the sheet is what the app holds.
def _family_options(lines, orders):
    """What Add Another Connection should do next, from the package's state (written here independently of the app's engine): the agent is never asked for a connection type.
    Nothing until Primary Line 1's order is approved ('Approved', or 'Not Required' on a Complete order); then Primary Line 2 alone (the same package and plan, included - no charge)
    while it is not on record; Primary Line 2 on record but not approved: nothing yet; both Primary Lines active: the agent SELECTS A PLAN - the Family-equivalent plan (while
    Supplementary is below its limit of 2) makes a Supplementary line, either Secondary plan (no limit) makes a Secondary line. Prices are the catalogue's."""
    def approved(o): return bool(o) and (o.get("approvalStatus") == "Approved" or (o.get("approvalStatus") == "Not Required" and o.get("status") == "Complete"))
    find = lambda role, seq: next((l for l in lines if l["role"] == role and l["sequence"] == seq), None)
    order_of = lambda l: next((o for o in orders if l and o["orderId"] == l["orderId"]), None)
    p1, p2 = find("Primary", 1), find("Primary", 2)
    if not p1:
        return "None - no package"
    if not approved(order_of(p1)):
        return "Nothing yet - Primary Line 1 awaiting approval"
    if not p2:
        return "Primary Line 2 (same package and plan; included, no charge) - no connection type is asked for"
    if not approved(order_of(p2)):
        return "Nothing yet - Primary Line 2 awaiting approval (it cannot be added again)"
    n = {r: sum(1 for l in lines if l["role"] == r) for r in ("Supplementary", "Secondary")}
    price = lambda pid: f"QAR {_fmrc.get(pid, 0):g}/mo"
    out = []
    if n["Supplementary"] < 2: out.append(f"{_fprod_name('PROD-311')} ({price('PROD-311')}) -> Supplementary Line {n['Supplementary'] + 1}")
    for pid in ("PROD-310", "PROD-312"):
        out.append(f"{_fprod_name(pid)} ({price(pid)}) -> Secondary Line {n['Secondary'] + 1}")
    return "Select a plan: " + "; ".join(out) + ("" if n["Supplementary"] < 2 else " (Supplementary limit reached: the Family-equivalent plan is not offered)")


_flines, _forders = load("family-package-lines"), {o["orderId"]: o for o in load("orders")}
_fprod = {p["productId"]: p["name"] for p in load("products")}
_fmrc = {p["productId"]: p.get("mrcQAR", 0) for p in load("products")}
_fprod_name = lambda pid: _fprod.get(pid, pid)
_fcust = {c["customerId"]: c for c in load("customers")}
_fscen = {sc["cid"]: sc for sc in FAMILY_SCENARIOS}
fam_rows = []
for cid in sorted({l["customerId"] for l in _flines if l.get("customerId")}):
    mine = sorted([l for l in _flines if l.get("customerId") == cid], key=lambda l: (["Primary", "Supplementary", "Secondary"].index(l["role"]), l["sequence"]))
    sc = _fscen.get(cid)
    p1 = next((l for l in mine if l["role"] == "Primary" and l["sequence"] == 1), None)
    orders_ = [_forders[l["orderId"]] for l in mine if l["orderId"] in _forders]
    p1o = _forders.get(p1["orderId"]) if p1 else None
    desc = "; ".join(f"{l['role']} Line {l['sequence']} - {_fprod.get(l['planId'], l['planId'])} - {l.get('msisdn', '-')} - " + ("approved" if _forders.get(l["orderId"], {}).get("approvalStatus") in ("Approved", "Not Required") else "awaiting approval") for l in mine)
    fam_rows.append([sc["n"] if sc else "-", sc["label"] if sc else ("Family overlay on an original customer: Primary Line 1 only" if len(mine) == 1 else "Family overlay on an original customer"), tc.get(cid, ""), cid, _fcust[cid]["name"], _fcust[cid].get("qid", ""),
                     _fprod.get(p1["planId"], "") if p1 else "", mine[0]["packageId"], desc, "Yes" if p1o and p1o.get("approvalStatus") in ("Approved", "Not Required") else "No (awaiting approval)", _family_options(mine, orders_),
                     (sc["note"] if sc else "Original customer given a Family Package so the package can be seen on a customer with other services.") + " The Family Owner's ID must be validated for every added line; all lines are billed on one billing account.",
                     "Add Another Connection (from the New Connection confirmation page, or by selecting a Family Plan for this customer in New Postpaid): the dialog shows the next connection; the plan, never a type, is what the agent selects"])
fam_rows.sort(key=lambda r: (r[0] == "-", r[0] if r[0] != "-" else 0, r[3]))
sheet(wb, "Family Plan Scenarios", ["Scenario #", "Scenario", "Test ID", "Customer ID", "Customer", "ID number (use for lookup)", "Family Plan (package)", "Package ID", "Lines (type - plan - number - order)",
      "Primary Line 1 approved", "Next connection (derived from the package state)", "Notes", "Where to test"], fam_rows,
      {"Scenario #": 10, "Scenario": 46, "Test ID": 9, "Customer ID": 12, "Customer": 30, "ID number (use for lookup)": 20, "Family Plan (package)": 30, "Package ID": 18, "Lines (type - plan - number - order)": 90,
       "Primary Line 1 approved": 16, "Next connection (derived from the package state)": 90, "Notes": 80, "Where to test": 50}, wrap_cols=("Scenario", "Lines (type - plan - number - order)", "Next connection (derived from the package state)", "Notes", "Where to test"))


# Postpaid Journey Coverage: every condition of the Mobile Postpaid Activation journey, step by step, with the customers that exercise it. The customer lists are COMPUTED from the
# same rows as the Customers sheet and from mock-data (never typed twice); a condition no customer can exercise says so on its row, so a gap cannot hide.
R = [dict(zip(HDR, r)) for r in rows]
_nm = {r["Customer / NAS ID"]: r["Full name"] for r in R}


def _ids(pred):
    return [r["Customer / NAS ID"] for r in R if pred(r)]


def _num(v):
    return v if isinstance(v, (int, float)) else 0


_today = AS_OF
_orders = load("orders")
_by_status = {}
for _o in _orders:
    if _o.get("orderType") == "New Postpaid Activation" and _o.get("customerId"):
        _by_status.setdefault(_o["status"], set()).add(_o["customerId"])
_nat_promos = {}
for _p_ in load("products"):
    for _n in _p_.get("eligibleNationalities", []):
        _nat_promos.setdefault(_n, []).append(_p_["productId"])
_flines2 = load("family-package-lines")
_forders2 = {o["orderId"]: o for o in _orders}
_acc = load("accounts")
_postpaid_accts = {}
for _a in _acc:
    if "Postpaid" in _a["accountType"]:
        _postpaid_accts[_a["customerId"]] = _postpaid_accts.get(_a["customerId"], 0) + 1


def _family_comp(cid):
    ls = [l for l in _flines2 if l.get("customerId") == cid]
    n = {r: sum(1 for l in ls if l["role"] == r) for r in ("Primary", "Supplementary", "Secondary")}
    p1 = next((l for l in ls if l["role"] == "Primary" and l["sequence"] == 1), None)
    o1 = _forders2.get(p1["orderId"]) if p1 else None
    return n, bool(o1 and o1.get("approvalStatus") in ("Approved", "Not Required"))


_fam_ids = sorted({l["customerId"] for l in _flines2 if l.get("customerId")})
_fam = {c: _family_comp(c) for c in _fam_ids}
_isexp = lambda r: bool(r["ID expiry"]) and str(r["ID expiry"]) < _today.isoformat()
_qat = lambda r: r["Nationality"] == "Qatari"
_new = lambda r: str(r["Customer / NAS ID"]).startswith("NAS")
_live = lambda r: not _new(r)
_bl = lambda r: r["Blacklist"] not in ("No", "", None)
_hrn = lambda r: is_hrn(r["Nationality"])
_adult = lambda r: _num(r["Age"]) >= 18

COV = [
    # (step, condition, customers, how to test / expected)
    ("1 Customer Verification - ID", "Qatari QID", _ids(lambda r: _qat(r) and r["ID type"] == "QID" and _live(r) and not _bl(r) and _num(r["Age"]) >= 18)[:14], "Scan or type the QID; MOI validates; the customer is an existing Qatari. Eligibility passes unless the row says otherwise."),
    ("1 Customer Verification - ID", "Expat QID", _ids(lambda r: not _qat(r) and r["ID type"] == "QID" and _live(r) and _num(r["Age"]) >= 18)[:14], "Expat on a QID: validated; expat line cap (2) and HRN rules apply."),
    ("1 Customer Verification - ID", "Passport (exception-routed ID type)", _ids(lambda r: r["ID type"] in ("Passport", "QID / Passport")), "Passport is routed for approval on postpaid (the submitting agent's manager); a QID linked to the Passport can update the record."),
    ("1 Customer Verification - ID", "GCC ID (exception-routed)", _ids(lambda r: r["ID type"] == "GCC ID"), "GCC ID is exception-routed (Credit Control approval) on postpaid."),
    ("1 Customer Verification - ID", "Diplomatic ID", _ids(lambda r: r["ID type"] == "Diplomatic ID"), "Diplomatic ID is exception-routed; valid, expired and customer-type-mismatch cases are all present."),
    ("1 Customer Verification - ID", "Other ID (resident permit; not in the ID selector)", _ids(lambda r: r["ID type"] == "Other ID"), "Find via Customer Search by mobile or name; exception-routed."),
    ("1 Customer Verification - ID", "Customer record says QID but the only document is a Diplomatic ID", ["CUST-1007"], "Document type governs: Diplomatic ID rules apply."),
    ("1 Customer Verification - ID", "Not a Vodafone customer yet (registry / NAS only): Qatari, expat, HRN", _ids(_new), "ID lookup resolves with no customer id: new-customer journey (start cards instead of Recommended Offers); NAS email and mobile are masked."),
    ("1 Customer Verification - ID", "ID known to no registry (manual entry / create the customer)", [], "Use an ID that is in no row of this workbook (e.g. a QID 29999999999999): the agent types the identity; Store Manager approval is required for a manually entered identity."),
    ("2 Identity validity and age", "ID expired", _ids(_isexp), "ID Validity = HARD STOP."),
    ("2 Identity validity and age", "No expiry date on file", _ids(lambda r: _live(r) and not r["ID expiry"]), "ID Validity = approval routing."),
    ("2 Identity validity and age", "Under 18 (applicant): hard stop, Apply for Exception (Court Type Order)", _ids(lambda r: _live(r) and 0 < _num(r["Age"]) < 18), "Age Check = HARD STOP; Apply for Exception attaches the Court Type Order and the order is held for manager approval."),
    ("2 Identity validity and age", "Exactly 18 (boundary)", _ids(lambda r: _live(r) and _num(r["Age"]) == 18), "Passes the age check."),
    ("3 Blacklist and deals", "Collections blacklist with an unpaid balance (soft stop)", _ids(lambda r: r["Blacklist"] == "collections" and sum((b.get("totalAmount") or 0) for b in load("bills") if b.get("customerId") == r["Customer / NAS ID"] and b.get("status") != "Paid") > 0), "Postpaid cannot be issued; prepaid is offered (Proceed to Payment / switch to prepaid)."),
    ("3 Blacklist and deals", "Collections flag but QAR 0 owed (not a block)", _ids(lambda r: r["Blacklist"] == "collections" and sum((b.get("totalAmount") or 0) for b in load("bills") if b.get("customerId") == r["Customer / NAS ID"] and b.get("status") != "Paid") == 0), "Passes: the flag alone never blocks."),
    ("3 Blacklist and deals", "Security blacklist (hard stop)", _ids(lambda r: r["Blacklist"] == "security"), "Security Check = HARD STOP, no override."),
    ("3 Blacklist and deals", "Blacklisted with no category (hard stop)", _ids(lambda r: r["Blacklist"] in ("uncategorised", "unclassified")), "Blacklist Check (unclassified) = HARD STOP."),
    ("3 Blacklist and deals", "A pending deal / penalty blocks new connections", ["CUST-2001"], "Deals Check = HARD STOP on new connections."),
    ("4 Line count (Active Lines)", "Qatari, 0 postpaid lines", _ids(lambda r: _qat(r) and _num(r["Postpaid lines"]) == 0 and _live(r) and _num(r["Age"]) >= 18 and not _bl(r))[:10], "No postpaid lines: a first line; passes."),
    ("4 Line count (Active Lines)", "Qatari, 1-4 postpaid lines (below the cap of 5)", _ids(lambda r: _qat(r) and 1 <= _num(r["Postpaid lines"]) <= 4 and r["Category"] != "12 Family Plan")[:14], "Passes."),
    ("4 Line count (Active Lines)", "Qatari at the cap of 5", _ids(lambda r: _qat(r) and _num(r["Postpaid lines"]) == 5 and r["Category"] != "12 Family Plan"), "Approval routing for a 6th line (Credit Control)."),
    ("4 Line count (Active Lines)", "Qatari above the cap (6, 12, 20 lines)", _ids(lambda r: _qat(r) and _num(r["Postpaid lines"]) >= 6), "Approval routing, never a hard stop for a Qatari."),
    ("4 Line count (Active Lines)", "Expat, 0-1 postpaid lines (below the cap of 2)", _ids(lambda r: not _qat(r) and _live(r) and _num(r["Postpaid lines"]) <= 1 and _num(r["Age"]) >= 18 and not _bl(r) and r["ID type"] == "QID")[:12], "Passes (HRN rules aside)."),
    ("4 Line count (Active Lines)", "Expat at the cap of 2", _ids(lambda r: not _qat(r) and _num(r["Postpaid lines"]) == 2 and _live(r)), "Approval routing for a 3rd line."),
    ("4 Line count (Active Lines)", "Expat with 3-4 postpaid lines (approved earlier)", _ids(lambda r: not _qat(r) and 3 <= _num(r["Postpaid lines"]) <= 4 and _live(r)), "Approval routing; the earlier line's approval is in order history."),
    ("4 Line count (Active Lines)", "Expat at the absolute maximum of 5", _ids(lambda r: not _qat(r) and _num(r["Postpaid lines"]) >= 5 and _live(r)), "Active Lines = HARD STOP."),
    ("4 Line count (Active Lines)", "Prepaid-only customer (no postpaid line)", _ids(lambda r: _num(r["Postpaid lines"]) == 0 and _num(r["Prepaid lines"]) > 0 and _live(r)), "A first postpaid line; the prepaid lines do not count against the postpaid cap but count toward expat combined caps."),
    ("4 Line count (Active Lines)", "Home-internet-only / no mobile line", _ids(lambda r: _num(r["Postpaid lines"]) == 0 and _num(r["Prepaid lines"]) == 0 and _num(r["Home internet"]) > 0 and _live(r)), "Home internet is never capped; postpaid is a first line."),
    ("4 Line count (Active Lines)", "Mixed lines: postpaid + prepaid + home internet", _ids(lambda r: _num(r["Postpaid lines"]) > 0 and _num(r["Prepaid lines"]) > 0 and _num(r["Home internet"]) > 0), "Each line type is counted where its rule says."),
    ("4 Line count (Active Lines)", "Expat combined mobile cap (postpaid + prepaid)", _ids(lambda r: not _qat(r) and _num(r["Postpaid lines"]) > 0 and _num(r["Prepaid lines"]) >= 2 and _live(r)), "Combined mobile lines against the expat cap."),
    ("5 Nationality and risk class", "Qatari", _ids(lambda r: _qat(r))[:10], "Qatari rules (cap 5, no prepaid cap)."),
    ("5 Nationality and risk class", "GCC national (GCC ID)", _ids(lambda r: r["Nationality"] == "Emirati" and _adult(r)), "GCC rules (cap 2 prepaid)."),
    ("5 Nationality and risk class", "Expat, not HRN", _ids(lambda r: not _qat(r) and not _hrn(r) and r["Nationality"] != "Emirati" and _live(r) and _adult(r))[:14], "Expat rules; no advance payment."),
    ("5 Nationality and risk class", "HRN nationality (QAR 100 advance, credit limit 50, no limit choice)", _ids(lambda r: _hrn(r) and _live(r) and _num(r["Age"]) >= 18), "HRN advisory on the plan page; the advance is due today and the order is held for approval."),
    ("5 Nationality and risk class", "New HRN customer from the registry", _ids(lambda r: _hrn(r) and _new(r)), "The demo New Customer scan always returns this person."),
    ("6 Customer type and discounts", "Standard customer, no discount (control)", ["CUST-3029"], "No Special Discount; plain plan price."),
    ("6 Customer type and discounts", "Loyalty (existing customer)", _ids(lambda r: "Loyalty" in str(r["Discount eligibility"]) and _live(r))[:14], "Loyalty -15% is offered on the plan."),
    ("6 Customer type and discounts", "MADA card", _ids(lambda r: "MADA" in str(r["Discount eligibility"]) and "Retired" not in str(r["Discount eligibility"]) and "B2B2C" not in str(r["Discount eligibility"])), "Agent selects MADA, supplies the card and proof; Special Offers tab; order held for approval."),
    ("6 Customer type and discounts", "Retired person (registry-validated)", ["CUST-3022"], "ID is in the demo retiree registry: validation passes."),
    ("6 Customer type and discounts", "Retired claim that FAILS registry validation", ["CUST-3023"], "Negative case: validation fails."),
    ("6 Customer type and discounts", "B2B2C employee (Proof of Employment)", _ids(lambda r: "B2B2C" in str(r["Discount eligibility"]) and "MADA" not in str(r["Discount eligibility"])), "B2B2C routes to manager approval with Proof of Employment."),
    ("6 Customer type and discounts", "B2B2C on an account with Special Management", ["CUST-3026"], "Account already carries a Special Management value."),
    ("6 Customer type and discounts", "Eligible for two discount types (pick one per order)", ["CUST-3024", "CUST-3027"], "One Special Discount per order; changing plan retires the other."),
    ("7 Segments", "Consumer / Consumer (HRN)", _ids(lambda r: r["Segment"] in ("Consumer", "Consumer (HRN)") and _live(r))[:8], "Default credit limits by segment."),
    ("7 Segments", "Enterprise (EBU) contact", _ids(lambda r: str(r["Segment"]).startswith("Enterprise")), "Enterprise rules; Other ID."),
    ("7 Segments", "Protected segments: Safwa, Safwa+, Royal", _ids(lambda r: r["Segment"] in ("Safwa", "Safwa+", "Royal")), "Visible only to a role holding that segment's grant; everyone else is blocked with the access-restriction message."),
    ("8 Offers and plans", "Existing customer: Recommended Offers (New Postpaid: one Voice, one Broadband, one Family offer) plus standard offers for every type", _ids(lambda r: _live(r) and r["Category"] not in ("11 Restricted segments",))[:8], "Offers page shows each offer with its plan-type tag top-right; Select Offer / Interested work on every card."),
    ("8 Offers and plans", "New customer: the five start cards instead of Recommended Offers", _ids(_new), "New Postpaid first; no cross-sales offers."),
]
for _n, _pl in sorted(_nat_promos.items()):
    COV.append(("8 Offers and plans", f"Nationality promotion: {_n} ({', '.join(_pl)})", _ids(lambda r, n=_n: r["Nationality"] == n and _live(r) and _adult(r)), f"Plans {', '.join(_pl)} are offered only to {_n} customers; other nationalities never see them."))
COV += [
    ("8 Offers and plans", "No nationality promotion (control)", _ids(lambda r: r["Nationality"] not in _nat_promos and _live(r) and _adult(r))[:8], "Standard catalogue only."),
    ("8 Offers and plans", "Plans page tabs: Offers (3 Voice, 2 Broadband, 1 Family), Standard Plans, Special Offers (any Special Discount holder)", ["CUST-3021", "CUST-3022", "CUST-3025"], "Special Offers appears once a Special Discount is validated."),
    ("9 Add-ons", "Add-ons managed per plan (Customise Add-ons; plans on the Offers tab are pre-bundled)", ["CUST-3001", "CUST-3011"], "Any customer can open Customise Add-ons on a Standard plan; add-ons are limited to their plan family."),
    ("10 Number Selection", "Customer with numbers already reserved for them", ["CUST-3071"], "Two reservations, newest selected by default."),
    ("10 Number Selection", "Star numbers, Free numbers, Waive Off", ["CUST-3001"], "Star entitlement by plan; Waive Off holds the order for approval. Any customer reaches Number Selection."),
    ("11 SIM and Secondary Contact", "Adult Secondary Contact (any adult other than the primary customer)", ["CUST-3029", "CUST-3001"], "Tick Add Secondary Contact on SIM Selection: scan a different adult QID / Diplomatic ID."),
    ("11 SIM and Secondary Contact", "Under-18 Secondary Contact: one per nationality (Scan Below 18; Apply for Exception with the Court Type Order)", _ids(lambda r: r["Category"] == "13 Minors (Secondary Contact)") + ["CUST-3090", "CUST-9001"], "Refused through the standard flow; Apply for Exception lets the order go on, held for manager approval. Primary contact nationality decides which minor is presented."),
    ("11 SIM and Secondary Contact", "Secondary Contact who is the primary customer's own ID (refused)", ["CUST-3001"], "Scan the same ID on the Secondary Contact: refused as the primary's own ID."),
    ("12 Billing Profile", "Existing postpaid billing account (selected automatically)", _ids(lambda r: _live(r) and r["Customer / NAS ID"] in {c for c, n in _postpaid_accts.items() if n == 1})[:10], "The account is selected without asking; credit limit and bill limit read from it."),
    ("12 Billing Profile", "Two postpaid billing accounts", [c for c, n in _postpaid_accts.items() if n >= 2], "The first account is selected automatically; the agent can choose the other."),
    ("12 Billing Profile", "No postpaid billing account: a new account is created (prepaid-only, home-only, new customer)", _ids(lambda r: (_live(r) and r["Customer / NAS ID"] not in _postpaid_accts and r["Customer / NAS ID"].startswith("CUST")) or _new(r))[:12], "A new billing account is created with the segment's default credit limit and bill cycle."),
    ("13 Checkout, CAF and Payment", "Upfront payment due today (HRN advance QAR 100)", _ids(lambda r: _hrn(r) and _live(r) and _num(r["Age"]) >= 18)[:8], "Payment step takes the advance (WinCash or Proceed Without WinCash); order held for approval."),
    ("13 Checkout, CAF and Payment", "Nothing due today (zero-value receipt)", ["CUST-3001", "CUST-3029"], "Generate zero-value receipt, then Save & Finish."),
    ("14 Approval and order history", "Order raised by Retail Sales (VFQ12341) that needs approval, whatever held it (line cap, HRN advance, Passport / GCC / Other ID, discount proof, under-18 exception)", _ids(lambda r: _live(r) and _adult(r) and (_hrn(r) or r["ID type"] in ("Passport", "GCC ID", "Other ID") or (_qat(r) and _num(r["Postpaid lines"]) >= 5) or (not _qat(r) and _num(r["Postpaid lines"]) >= 2)))[:14], f"Routed to the {SALES_MANAGER}, i.e. the Manager/Approver persona; the confirmation page reads 'Order Submitted for Approval (Backoffice Fulfillment Team)' only for orders routed to Back Office Fulfilment, otherwise it names the routed role. Also applies to a postpaid Port-In, a postpaid plan change and a prepaid-to-postpaid migration."),
    ("14 Approval and order history", "Manager/Approver (VFQ12363): review and decide the order", [], "Sign in as VFQ12363 > Orders > Approval Requested > open the order: Order Details, Activities, Attachments; Approve (reason required), Reject (reason required) or Missing Information. A role other than the routed one, and the agent who raised the order, cannot decide it."),
    ("14 Approval and order history", "Postpaid order raised by a persona NOT routed to the manager keeps the reason's own route (Credit Control, Back Office Fulfilment, Sales Manager for a Passport)", _ids(lambda r: _live(r) and _adult(r) and r["ID type"] in ("Passport", "GCC ID", "Other ID"))[:6], "Raise it as another sales persona (for example Telesales); the approving team on the confirmation page is the routed role, else the approval matrix's."),
    ("14 Approval and order history", "Orders in the approval queue (Submitted for Approval)", sorted(_by_status.get("Submitted for Approval", [])), "Open in Order Management > approvals; approver role by order."),
    ("14 Approval and order history", "Order Rejected - Correction (Missing Information flow)", sorted(_by_status.get("Rejected - Correction", [])), "Creator reopens, adds the documents and resubmits."),
    ("14 Approval and order history", "Draft postpaid order (Save as Draft / resume)", sorted(_by_status.get("Draft", [])), "Resume the draft from the customer's tasks."),
    ("14 Approval and order history", "Completed / cancelled / pending postpaid orders (history)", sorted(_by_status.get("Complete", []) | _by_status.get("Cancelled", []) | _by_status.get("Pending", [])), "Order history on Customer 360."),
    ("15 Mobile Postpaid entry points", "Existing Customer flow (from Customer 360, ID locked to the customer) and New flow (from the dashboard)", ["CUST-3001", "NAS-7001"], "Start from Customer 360 > Actions > Start a New Connection, or from the dashboard."),
]
_comp_label = lambda n, ok: ", ".join(x for x in [f"Primary x{n['Primary']}" if n["Primary"] else "", f"Supplementary x{n['Supplementary']}" if n["Supplementary"] else "", f"Secondary x{n['Secondary']}" if n["Secondary"] else ""] if x) + ("" if ok else " (Primary Line 1 awaiting approval)")
_groups = {}
for _c, (_n, _ok) in _fam.items():
    _groups.setdefault(_comp_label(_n, _ok), []).append(_c)
for _lab, _cs in sorted(_groups.items()):
    COV.append(("16 Family Plan", f"Family Package: {_lab}", _cs, "Add Another Connection (confirmation page, or selecting a Family Plan for the customer); see 'Family Plan Scenarios'."))
COV.append(("16 Family Plan", "Family Owner rules: every added line needs the owner's ID; one common billing account; add-ons managed from Customer 360", _fam_ids[:4], "Add Another Connection > Continue; scan the owner's ID; the billing account is the package's, and Primary Line 2's plan is the package's."))
COV.append(("16 Family Plan", "Expat / HRN owner (line-count and HRN rules apply to added lines)", [c for c in _fam_ids if next((r for r in R if r["Customer / NAS ID"] == c), {}).get("Nationality") not in ("Qatari", None)], "A further line meets the owner's line-count check and HRN advance."))

_cov_rows, _gaps = [], []
for _step, _cond, _cs, _how in COV:
    if not _cs and "no registry" not in _cond.lower() and "known to no registry" not in _cond.lower() and "manager/approver (vfq12363)" not in _cond.lower():
        _gaps.append(_cond)
    _lk = {r_["Customer / NAS ID"]: str(r_["ID number (use for lookup)"]) for r_ in R}
    _show = "\n".join(f"{_lk[c]} ({c})" if c in _lk else c for c in dict.fromkeys(_cs)) if _cs else "(use an ID not in this workbook)" if "known to no registry" in _cond else "(no customer needed: sign in as the approver)" if "manager/approver (vfq12363)" in _cond.lower() else "NO CUSTOMER - GAP"
    _cov_rows.append([_step, _cond, len(_cs), _show, _how])
if _gaps:
    print("COVERAGE GAPS:", _gaps)
sheet(wb, "Postpaid Journey Coverage", ["Journey step", "Condition / variation", "# customers", "Test customers", "How to test / expected result"], _cov_rows,
      {"Journey step": 28, "Condition / variation": 70, "# customers": 11, "Test customers": 80, "How to test / expected result": 90}, wrap_cols=("Condition / variation", "Test customers", "How to test / expected result"))

# Retired / MADA quick reference: the QID to look up for each customer-type discount case, read from the
# Customers rows above so it can never drift from them.
_ix = {h: i for i, h in enumerate(HDR)}
_by_id = {r[_ix["Customer / NAS ID"]]: r for r in rows}
RM = [
    ("Retired - validation PASSES", "CUST-3022", "Office-ID scan -> ID sent to the retiree registry -> 'Retired status validated with the government'."),
    ("Retired - validation PASSES (registry holds the scan ID)", "CUST-1001", "The scan ID is in the registry; the customer-record QID differs."),
    ("Retired - validation FAILS", "CUST-3023", "'This ID number could not be validated as a retired customer with the government system.'"),
    ("MADA - agent validated", "CUST-3021", "Supporting ID and proof document required. MADA -25% and Loyalty -15% both apply: only one discount per order."),
    ("MADA or B2B2C - the plan decides", "CUST-3024", "Red 350 gives MADA, Red 500 gives B2B2C; switching plan retires the other."),
    ("Retired or MADA - one per journey", "CUST-3027", "The customer-type step is single choice: run twice to confirm each path."),
]
rm_rows = []
for case, cid, note in RM:
    r = _by_id.get(cid)
    if r:
        rm_rows.append([case, str(r[_ix["ID number (use for lookup)"]]), r[_ix["Full name"]], cid, note])
sheet(wb, "Retired & MADA QIDs", ["Case", "QID to look up", "Customer", "Customer ID", "What to expect"], rm_rows, {"Case": 48, "QID to look up": 18, "Customer": 38, "Customer ID": 12, "What to expect": 100})

# Eligibility coverage: which test customer lands on each outcome of the seven matrix checks.
# Parsed from the same data the app reads, applying the rules in src/engines/eligibilityEngine.ts and
# BR-288 (src/engines/ruleEngine.ts) - nothing is hand-assigned. A blank outcome row (no customer) is a
# coverage gap and is written as such.
_bills = load("bills")
_pens = load("commitment-penalties")
_owed = {}
for _b in _bills:
    if _b.get("status") != "Paid":
        _owed[_b["customerId"]] = _owed.get(_b["customerId"], 0) + (_b.get("totalAmount") or 0)
_blockers = {_x["customerId"] for _x in _pens if _x.get("blocksNewConnection")}
EXC_IDS = {"Passport", "GCC ID", "Other ID"}
_cov = {}


def _hit(check, outcome, cid, why):
    _cov.setdefault((check, outcome), []).append((cid, why))


for _cid, _c in customers.items():
    _d = (doc_by_cust.get(_cid) or [{}])[0]
    _ex = _d.get("expiryDate")
    if not _ex:
        _hit("ID Validity", "Approval routing", _cid, "No expiry date on file - manual validity check")
    elif _ex < AS_OF.isoformat():
        _hit("ID Validity", "Hard stop", _cid, f"ID expired {_ex}")
    else:
        _hit("ID Validity", "Pass", _cid, f"Valid through {_ex}")
    _a = age(_c["dob"]) if _c.get("dob") else None
    if _a is not None and _a < 18:
        _hit("Age Check", "Hard stop", _cid, f"Age {_a} (under 18)")
    elif _a == 18:
        _hit("Age Check", "Pass", _cid, "Age 18 - boundary, passes")
    if (_d.get("documentType") or _c.get("idType")) in EXC_IDS:
        _hit("ID Type", "Approval routing", _cid, f"{_d.get('documentType') or _c.get('idType')} is exception-routed to Back Office Fulfilment approval")
    if _c.get("blacklisted"):
        _cat = _c.get("blacklistCategory")
        if _cat == "collections":
            if _owed.get(_cid, 0) > 0:
                _hit("Collections Check", "Soft stop", _cid, f"Collections flag with QAR {_owed[_cid]:g} outstanding - postpaid blocked, prepaid offered")
            else:
                _hit("Collections Check", "Pass", _cid, "Collections flag but QAR 0 owed - the flag alone does not block")
        elif _cat == "security":
            _hit("Security Check", "Hard stop", _cid, "Corporate security blacklist - no further action at the counter")
        else:
            _hit("Blacklist Check (unclassified)", "Hard stop", _cid, "Blacklisted with no category recorded")
    if _cid in _blockers:
        _hit("Deals Check", "Hard stop", _cid, "A pending deal/penalty blocks new connections")
    _n = _c.get("activePostpaidLines") or 0
    _q = _c["nationality"] == "Qatari"
    if _q and _n >= 5:
        _hit("Active Lines", "Approval routing", _cid, f"Qatari at/over the 5-line cap ({_n} active) - no maximum")
    elif not _q and _n >= 5:
        _hit("Active Lines", "Hard stop", _cid, f"Expat absolute maximum of 5 reached ({_n} active)")
    elif not _q and _n >= 2:
        _hit("Active Lines", "Approval routing", _cid, f"Expat cap of 2 reached ({_n} active)")
    if is_hrn(_c["nationality"]):
        _hit("HRN advance payment", "Advisory only", _cid, f"{_c['nationality']} is on the HRN list - QAR 100 advance required")

_clean = [c for c in customers if c in {"CUST-1001", "CUST-3001"}]
_cov_order = [
    ("ID Validity", "Hard stop"), ("ID Validity", "Approval routing"), ("Age Check", "Hard stop"), ("Age Check", "Pass"),
    ("ID Type", "Approval routing"), ("Collections Check", "Soft stop"), ("Collections Check", "Pass"), ("Security Check", "Hard stop"),
    ("Deals Check", "Hard stop"), ("Active Lines", "Approval routing"), ("Active Lines", "Hard stop"), ("HRN advance payment", "Advisory only"),
]
cov_rows = []
for _chk, _out in _cov_order:
    _hits = _cov.get((_chk, _out), [])
    if not _hits:
        cov_rows.append([_chk, _out, "-", "-", "-", "-", "-", "GAP - no customer reaches this outcome"])
    for _cid, _why in _hits:
        _r = _by_id.get(_cid)
        if _r:
            cov_rows.append([_chk, _out, _r[_ix["Test ID"]], _cid, _r[_ix["Full name"]], _r[_ix["ID type"]], str(_r[_ix["ID number (use for lookup)"]]), _why])
sheet(wb, "Eligibility by Customer", ["Eligibility check", "Outcome", "Test ID", "Customer ID", "Customer", "ID type", "ID number (use for lookup)", "Why it lands here"], cov_rows,
      {"Eligibility check": 30, "Outcome": 18, "Test ID": 9, "Customer ID": 12, "Customer": 38, "ID type": 16, "ID number (use for lookup)": 26, "Why it lands here": 80})

# ---------------------------------------------------------------------------------------------------------------------------------------------------------
# Eligibility Coverage (2026-11-04): where each eligibility check runs in the Mobile Postpaid journey, page by page, whether it is a distinct check or the same check
# repeated, and the customers that reach each outcome. Read from the code (src/engines/eligibilityEngine.ts and where it is called: CustomerQualification,
# ProductEligibility, plan / add-ons / SIM steps, submitNewConnectionOrder); the customer lists are computed from the same data the app reads.
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
_lookup = {r[_ix["Customer / NAS ID"]]: str(r[_ix["ID number (use for lookup)"]]) for r in rows}


def _cust_lines(ids_):
    """One customer per line inside the cell: 'ID to look up (customer id)'."""
    seen, out = set(), []
    for i in ids_:
        if i in seen or i not in _lookup:
            continue
        seen.add(i)
        out.append(f"{_lookup[i]} ({i})")
    return "\n".join(out) if out else "-"


def _hits(check, outcome):
    return [c for c, _w in _cov.get((check, outcome), [])]


_pass_visa, _fail_visa = [], []
for _cid, _c in customers.items():
    _d = (doc_by_cust.get(_cid) or [{}])[0]
    if (_d.get("documentType") or _c.get("idType")) == "Passport":
        _v = _d.get("visa")
        (_pass_visa if _v and str(_v.get("expiryDate", "")) >= AS_OF.isoformat() else _fail_visa).append(_cid)
_with_pkg = sorted({l["customerId"] for l in load("family-package-lines") if l.get("customerId")})
_adult_live = [r["Customer / NAS ID"] for r in R if _live(r) and _adult(r)]
_nat_cust = {n: [r["Customer / NAS ID"] for r in R if r["Nationality"] == n and _live(r) and _adult(r)] for n in _nat_promos}

P_CONTACT = "Contact (Customer Verification)"
P_PRODUCT = "Recommended Offers (a new customer: the Offers & Plans start cards)"
P_PLAN = "Offers & Plans"
P_ADDONS = "Addons"
P_SIM = "SIM Selection"
P_SUBMIT = "Payment > Save & Finish (order submission)"
HIDDEN = "evaluated again, shown only if it stops the order"

EC = [
    # (check, kind, purpose, outcome, trigger, first page, later pages, repeated?, effect, customers)
    ("ID Validity", "Eligibility engine", "The identity document must be unexpired, and have an expiry on record.", "Hard stop", "The ID has expired.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice (Contact, then Recommended Offers); shown once, on the page where it stops.", "Journey cannot continue (no override).", _hits("ID Validity", "Hard stop")),
    ("ID Validity", "Eligibility engine", "As above.", "Approval routing", "No expiry date on the document record.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; shown once.", "Journey continues; the order is held for approval.", _hits("ID Validity", "Approval routing")),
    ("ID Validity", "Eligibility engine", "As above.", "Pass", "Valid, unexpired ID (including the 18th-birthday and expiry-date boundaries).", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; passes are not shown.", "None.", _ids(lambda r: _live(r) and _adult(r) and not _isexp(r) and bool(r["ID expiry"]))[:6]),
    ("Visa Validity (Passport only)", "Eligibility engine", "A Passport needs a valid visa returned by MOI; it is the proof of residence.", "Hard stop", "No valid visa for the Passport (none on record, or expired).", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; shown once.", "Journey cannot continue.", _fail_visa),
    ("Visa Validity (Passport only)", "Eligibility engine", "As above.", "Pass", "A Passport with an unexpired visa.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; passes are not shown.", "None.", _pass_visa),
    ("Age Check", "Eligibility engine", "The applicant must be 18 or over.", "Hard stop", "Under 18. The agent may Apply for Exception (Court Type Order) from the footer.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}; the exception chosen at Contact is carried, so it is not asked again.", "SAME check run twice; the exception is requested once.", "Journey cannot continue unless an Exception Request is submitted; then the order is held for the manager.", _hits("Age Check", "Hard stop")),
    ("Age Check", "Eligibility engine", "As above.", "Pass", "18 or over (the boundary: exactly 18 passes).", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; passes are not shown.", "None.", _hits("Age Check", "Pass")),
    ("ID Type (exception routing)", "Eligibility engine", "Passport, GCC ID and Other ID are not sold directly: they are diverted to an approver.", "Approval routing", "ID type is Passport, GCC ID or Other ID.", f"{P_CONTACT}: evaluated but not announced (the product, so the approver, is not known yet)", f"{P_PRODUCT}: announced here; submission routes the order (a Passport to the submitter's manager, GCC / Other ID to Credit Control; Retail Sales orders all go to the Sales Manager).", "DISTINCT in what the agent sees: announced once, on the product page. (Evaluated on both pages.)", "Journey continues; the order is held for approval.", _hits("ID Type", "Approval routing")),
    ("Collections Check", "Eligibility engine", "A customer owing money cannot be issued a new postpaid line.", "Soft stop", "Collections blacklist AND an unpaid balance above QAR 0.", f"{P_CONTACT}: shown, Continue stays open (prepaid is still possible)", f"{P_PRODUCT}: blocks Continue for postpaid; Switch to Prepaid is offered.", "SAME check run twice; shown on both pages, blocks on the product page.", "Postpaid is blocked; prepaid is offered.", _hits("Collections Check", "Soft stop")),
    ("Collections Check", "Eligibility engine", "As above.", "Pass (flag, QAR 0 owed)", "Collections flag but nothing owed: the flag alone never blocks.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice.", "None.", _hits("Collections Check", "Pass")),
    ("Security Check", "Eligibility engine", "A customer on the corporate security blacklist is restricted from new connections.", "Hard stop", "Security blacklist.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; shown once.", "Journey cannot continue; no override.", _hits("Security Check", "Hard stop")),
    ("Blacklist Check (unclassified)", "Eligibility engine", "A blacklisted customer whose category is neither collections nor security is withheld rather than guessed.", "Hard stop", "Blacklisted with no category recorded.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; shown once.", "Journey cannot continue.", _hits("Blacklist Check (unclassified)", "Hard stop")),
    ("Deals Check", "Eligibility engine", "An existing deal / penalty on the account can forbid a new connection.", "Hard stop", "A penalty with blocksNewConnection.", P_CONTACT, f"{P_PRODUCT}: {HIDDEN}.", "SAME check run twice; shown once.", "Journey cannot continue.", _hits("Deals Check", "Hard stop")),
    ("Active Lines (line count)", "Eligibility engine + rule engine (BR-288)", "Caps the mobile lines a customer may hold: Qatari 5, expat 2, absolute expat maximum 5; combined mobile caps.", "Approval routing", "Qatari at or above 5, expat at 2 to 4 postpaid lines (and combined mobile caps).", f"{P_CONTACT}: NOT judged (the connection type is not chosen yet)", f"{P_PRODUCT}: the only page where it runs; the Family Plan owner's lines count the same way.", "DISTINCT: runs once, on the product page.", "Journey continues; the order is held for approval (Credit Control).", _hits("Active Lines", "Approval routing")),
    ("Active Lines (line count)", "Eligibility engine + rule engine (BR-288)", "As above.", "Hard stop", "Expat at the absolute maximum of 5 lines.", f"{P_CONTACT}: NOT judged", f"{P_PRODUCT}: the only page where it runs.", "DISTINCT: runs once.", "Journey cannot continue.", _hits("Active Lines", "Hard stop")),
    ("Active Lines (line count)", "Eligibility engine + rule engine (BR-288)", "As above.", "Pass", "Below the cap (zero lines, or under the cap).", f"{P_CONTACT}: NOT judged", f"{P_PRODUCT}: the only page where it runs.", "DISTINCT: runs once.", "None.", _ids(lambda r: _live(r) and _adult(r) and not _bl(r) and ((_qat(r) and _num(r["Postpaid lines"]) <= 4) or (not _qat(r) and _num(r["Postpaid lines"]) <= 1)) and r["ID type"] == "QID")[:8]),
    ("HRN upfront payment", "Eligibility engine (advisory)", "Customers of listed nationalities pay a QAR 100 advance and get a QAR 50 credit limit.", "Advisory (QAR 100 advance); the order is held for approval", "Nationality is on the HRN list.", f"{P_CONTACT}: evaluated but not announced (journey not chosen yet)", f"{P_PLAN}: announced once. Order Summary: advance shown in Upfront Charges. Payment: the amount due. Submission: holds the order for approval.", "REPEATED display: announced on the plan page, then carried as an amount on Order Summary and Payment. One rule, one result.", "Journey continues; QAR 100 taken today; order held for approval.", [c for c in _hits("HRN advance payment", "Advisory only") if c in _adult_live]),
    ("Special Discount validation (MADA, Retired, B2B2C)", "Journey validation", "A Special Discount counts only once its proof is validated (card and document; retiree registry; employer).", "Validated / Rejected", "The agent selects a Special Discount type for the customer.", f"{P_CONTACT}: right under the eligibility panel, once eligibility clears", f"{P_PLAN}: Special Offers tab appears once validated. Submission: a MADA / B2B2C discount holds the order for approval (proof to verify).", "DISTINCT: validated once; its result is read by later pages.", "Eligible discounts and the Special Offers tab follow; the order is held for approval for MADA / B2B2C.", _ids(lambda r: _live(r) and any(k in str(r["Discount eligibility"]) for k in ("MADA", "Retired", "B2B2C")))),
    ("Family Plan start check", "Journey validation", "A Family Plan (Ahli) starts a Family Package: the customer must have cleared eligibility and hold no package yet.", "Blocked: already has a Family Package", "An Ahli plan is selected by a customer who already holds a Family Package.", P_PLAN, "Recommended Offers (accepted Family offer shows the plan page with the reason). Submission re-checks on the lines on record now.", "SAME rule evaluated on the plan page and again at submission (a stale draft cannot create a second Primary Line 1).", "Continue is disabled with the reason; submission refuses.", _with_pkg),
    ("Family Plan start check", "Journey validation", "As above.", "Allowed: Primary Line 1 of a new package", "An Ahli plan is selected by a customer with no package, eligibility cleared.", P_PLAN, "Order Summary and CAF show the Family Package row; submission creates the package line.", "SAME rule evaluated on the plan page and again at submission.", "The order is Primary Line 1.", _ids(lambda r: _live(r) and _adult(r) and not _bl(r) and r["Customer / NAS ID"] not in _with_pkg)[:6]),
    ("Family Owner / package check (Add Another Connection)", "Journey validation", "A line added to a package needs the Family Owner's ID and an approved Primary Line 1; then Primary Line 2 (the package's plan, included); only once both Primary Lines are active an additional line, on the plan the agent selects (the Family-equivalent plan -> Supplementary, Ahli Lite or Ahli Net -> Secondary) with room under that line type's limit.", "Allowed / Refused", "Add Another Connection from Customer 360 or the confirmation page; then the journey from Contact.", "Add Another Connection dialog (read on every opening and again on Continue)", f"{P_CONTACT} (the ID must be the owner's); {P_PLAN} (Primary Line 2's plan is the package's; an additional line's is the agent's selection from the eligible plans); Submission re-checks.", "SAME rule evaluated four times (dialog, dialog Continue, plan step, submission) so none can disagree.", "Only eligible plans are offered; the journey is refused with the reason when one is not.", _with_pkg),
    ("Plan eligibility by nationality", "Journey validation", "A nationality promotion plan is offered only to customers of that nationality.", "Offered / Not offered", "The customer's nationality matches the plan's list (Indian, Pakistani, Filipino, Bangladeshi).", P_PLAN, "-", "DISTINCT: one page.", "The promotion plans appear (or not) in the plan lists.", sum(_nat_cust.values(), [])),
    ("Add-on eligibility", "Journey validation", "An add-on is offered only on the plan families it is limited to (and to the customer types and ID types it names).", "Offered / Not offered", "The selected plan is in the add-on's plan list.", P_ADDONS, "Customer 360 Family Package add-ons (same rule, package plan).", "DISTINCT: one page in the journey.", "Ineligible add-ons are not listed.", _ids(lambda r: r["Customer / NAS ID"] in ("CUST-3001", "CUST-3011", "CUST-3029"))),
    ("Bill limit against the credit limit", "Journey validation", "The bill limit must meet the agent minimum and not exceed the customer's credit limit.", "Blocks Continue", "Limit below the minimum, or above the credit limit.", P_ADDONS, "Order Summary and Billing show the limits (not re-judged).", "DISTINCT: one page.", "Continue is disabled until the limit is valid.", _ids(lambda r: _hrn(r) and _live(r) and _adult(r))[:6] + ["CUST-3001"]),
    ("Secondary Contact eligibility (age and identity)", "Journey validation", "A Secondary Contact must be 18 or over and not the primary customer; a minor is allowed only through the Exception Request (Court Order).", "Refused / Exception route / Pass", "An under-18 person, or the primary's own ID, is identified as the Secondary Contact.", P_SIM, f"Submission: the order is held for manager approval when an exception was used.", "DISTINCT rule (a second age check, on a different person).", "Refused, or held for approval with the Court Order attached.", _ids(lambda r: r["Category"] == "13 Minors (Secondary Contact)") + ["CUST-3090", "CUST-9001", "CUST-3029"]),
    ("Eligibility present at submission", "Journey guard", "An order must carry the eligibility result of the customer it is for; the approval routing is built from it.", "Refused / Routed", "A resumed draft that skipped Contact has no result; any approval-routing result holds the order.", P_SUBMIT, "-", "A final, single guard: it does not re-run the checks, it reads the result they produced.", "Submission refuses with 'return to Customer Verification'; otherwise the approval reasons are listed and the order goes to the approver.", _ids(lambda r: r["Customer / NAS ID"] in ("CUST-1001", "CUST-3002", "CUST-3012"))),
]

ec_rows = []
for _n, (chk, kind, purpose, outcome, trig, first, later, rep, effect, ids_) in enumerate(EC, 1):
    ec_rows.append([_n, chk, kind, purpose, outcome, trig, first, later, rep, effect, len({i for i in ids_ if i in _lookup}), _cust_lines(ids_)])
ec_header = ["#", "Eligibility check", "Kind", "Purpose", "Outcome", "Triggering condition", "Page where it first runs", "Other pages where it runs", "Distinct or repeated across pages?", "Effect on the journey", "# customers", "Test customers"]
ec_widths = {"#": 5, "Eligibility check": 30, "Kind": 20, "Purpose": 48, "Outcome": 26, "Triggering condition": 44, "Page where it first runs": 38, "Other pages where it runs": 58, "Distinct or repeated across pages?": 46, "Effect on the journey": 44, "# customers": 11, "Test customers": 40}
ws = sheet(wb, "Eligibility Coverage", ec_header, ec_rows, ec_widths, wrap_cols=("Purpose", "Triggering condition", "Test customers"))

# ---- page-by-page map
_r0 = ws.max_row + 2
ws.cell(_r0, 2, "WHERE EACH CHECK RUNS - PAGE BY PAGE (Mobile Postpaid Activation journey)").font = Font(bold=True, size=14, color=RED)
_hdr = ["Page (journey step)", "Checks evaluated on this page", "Shown to the agent / blocks Continue when", "Routes the order to approval when"]
PM = [
    ("1. Contact (Customer Verification)", "ID Validity, Visa Validity (Passport), Age Check, ID Type (evaluated, not announced), Collections, Security, Blacklist (unclassified), Deals, HRN (evaluated, not announced). Active Lines is NOT judged here. Also: MOI validation freshness and ID reconciliation (scan against MOI), and Special Discount validation.", "Hard stops block Continue (expired ID, no visa, under 18 without an exception, security / unclassified blacklist, blocking deal). A collections soft stop is shown but Continue stays open. Under 18: Apply for Exception in the footer.", "No expiry date; an Exception Request for an under-18 applicant."),
    ("2. Address", "None.", "-", "-"),
    ("3. Recommended Offers (a new customer: Offers & Plans start cards)", "The same engine run AGAIN for the chosen product (postpaid): ID Validity, Visa, Age, Collections, Security, Unclassified, Deals are re-evaluated; ID Type and ACTIVE LINES (line count, BR-288) are judged here for the first time.", "Shown only when they matter: hard stops, the collections soft stop (Continue blocked; Switch to Prepaid), the Active Lines approval and the ID type's approval. Product eligibility must be clear before Continue.", "Active Lines at the cap; ID type Passport / GCC / Other ID."),
    ("4. Offers & Plans", "HRN advisory (announced once); plan eligibility by nationality; Special Offers tab (validated discount); Family Plan start check for an Ahli plan (cleared eligibility, no existing package); for an added line: the owner, type and plan check.", "A Family Plan check that fails disables Continue with the reason.", "-"),
    ("5. Addons", "Add-on eligibility by plan family; bill limit against the agent minimum and the credit limit.", "An invalid bill limit disables Continue.", "-"),
    ("6. Number Selection", "None (reservations and Star entitlement are not eligibility checks).", "-", "A Waive Off on a Star number holds the order."),
    ("7. SIM Selection", "Secondary Contact: age 18 or over, not the primary's own ID; Exception Request for a minor.", "Continue is disabled for an ineligible Secondary Contact.", "A Secondary Contact exception (Court Order)."),
    ("8. Billing / 9. Order Summary / 10. CAF & Signature", "None re-run. The HRN advance and the Family Package row are shown from earlier results.", "-", "-"),
    ("11. Payment > Save & Finish (submission)", "Guard: the order must carry an eligibility result; the Family Plan start / owner check is re-judged on the lines and orders on record now.", "Submission refuses with the reason.", "All routing reasons are gathered here: manual ID entry, B2B2C, HRN advance, any approval-routing check, Waive Off, MADA / B2B2C proof, an under-18 exception. Retail Sales orders all go to the Sales Manager."),
]
_h = _r0 + 1
for _j, _t in zip((2, 4, 6, 9), _hdr):
    _c = ws.cell(_h, _j, _t)
    _c.font, _c.fill, _c.border = hfont, hfill, border
    _c.alignment = Alignment(wrap_text=True, vertical="center")
for _k, (_pg, _ev, _sh, _rt) in enumerate(PM, 1):
    _row = _h + _k
    for _col, _val in zip((2, 4, 6, 9), (_pg, _ev, _sh, _rt)):
        _c = ws.cell(_row, _col, _val)
        _c.alignment = Alignment(wrap_text=True, vertical="top")
        _c.border = border
    ws.merge_cells(start_row=_row, start_column=4, end_row=_row, end_column=5)
    ws.merge_cells(start_row=_row, start_column=6, end_row=_row, end_column=8)
    ws.merge_cells(start_row=_row, start_column=9, end_row=_row, end_column=10)
ws.merge_cells(start_row=_h, start_column=4, end_row=_h, end_column=5)
ws.merge_cells(start_row=_h, start_column=6, end_row=_h, end_column=8)
ws.merge_cells(start_row=_h, start_column=9, end_row=_h, end_column=10)

_c0 = _h + len(PM) + 2
ws.cell(_c0, 2, "CONCLUSION - distinct checks or the same check repeated?").font = Font(bold=True, size=14, color=RED)
CONC = [
    "Both. The journey performs several DISTINCT checks (identity, age, blacklist, deals, ID type, line count, HRN, Special Discounts, Family Plan, add-ons, bill limit, Secondary Contact), and ONE set of them is genuinely repeated.",
    "REPEATED: the identity-level checks (ID Validity, Visa Validity, Age, Collections, Security, unclassified Blacklist, Deals) are evaluated on the Contact page and evaluated again, by the same engine, on the Recommended Offers page (or the start cards). The result of the first is not reused there because the second also judges the product (the line-count decision depends on it). The agent still sees each outcome once: a stop is shown on whichever page it stops.",
    "DISTINCT, run once, on the product page: Active Lines (line count) and the ID Type's approval, which the Contact page cannot judge because the connection type is not chosen yet (it is evaluated there but deliberately not announced).",
    "ONE RESULT, PRESENTED SEVERAL TIMES: HRN is a single rule whose result is announced on Offers & Plans and then carried as an amount on Order Summary and Payment; the Family Plan start / owner check is the same rule evaluated on the plan page and again at submission.",
    "NOT re-run after the plan page: Number Selection, Billing, Order Summary and CAF run no eligibility check. Submission only guards that a result exists and gathers the approval reasons.",
]
for _k, _t in enumerate(CONC, 1):
    _c = ws.cell(_c0 + _k, 2, _t)
    _c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells(start_row=_c0 + _k, start_column=2, end_row=_c0 + _k, end_column=10)
    ws.row_dimensions[_c0 + _k].height = 48

# the sheet sits right after the Postpaid Journey Coverage sheet
wb.move_sheet("Eligibility Coverage", offset=-(wb.sheetnames.index("Eligibility Coverage") - wb.sheetnames.index("Postpaid Journey Coverage") - 1))

# Roles & Login
def _route(r):
    if r["id"] in ALL_TO_MANAGER:
        return f"All Mobile Postpaid orders that need approval go to the {SALES_MANAGER} (Manager/Approver)"
    if r["id"] in MANAGER_OF:
        return f"A Passport order goes to the {SALES_MANAGER}; other reasons keep their own route (Credit Control, Back Office Fulfilment)"
    if any(f["key"] == "orders.approval-detail" and f["level"] == "Approve" for f in r["features"]):
        return f"Can decide orders routed to their role (job title {SALES_MANAGER if r['name'].startswith('Manager/Approver') else 'by user'})"
    return "-"


rl = [[r["staffId"], r["name"], r["group"], r["businessUnitLabel"], r["approach"], r["channel"], password, _route(r)] for r in personas]
sheet(wb, "Roles & Login", ["Staff ID", "Role", "Persona group", "Business unit", "Approach", "Channel", "Demo password", "Mobile Postpaid approval route"], rl,
      {"Staff ID": 11, "Role": 36, "Persona group": 38, "Business unit": 20, "Approach": 14, "Channel": 24, "Demo password": 16, "Mobile Postpaid approval route": 70}, wrap_cols=("Mobile Postpaid approval route",))

OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines
format_file(OUT)
print(f"wrote {OUT} - {len(rows)} customers ({n_seed} original, {n_prop} added)")
