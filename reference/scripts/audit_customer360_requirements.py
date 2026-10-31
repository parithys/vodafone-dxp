#!/usr/bin/env python3
"""Audit the Customer 360 module against the persona requirements in 'Customer 360.xlsx'.

For every requirement mapped to a persona (access 'Real Time' / 'Drill Down or Select'; the Telesales sheet maps every
row) it records whether the module shows it, using the on-screen labels of the current header and tab pages:
  F  displayed   - a field with the same meaning, with its own label, on the main page or a tab
  P  partial     - shown differently (different data, shared field, label without a value, behind a link only)
  M  missing     - not on screen
Outputs
  public/config/customer360-field-access.json   per persona -> {requirement: real-time|drill-down} (absent = hidden) plus the
                                                 page -> on-screen label -> requirements map the app uses to enforce it
  public/config/customer360-requirement-coverage.json   per persona -> {page: [labels]} the app colours pink
  reference/outputs/Customer_360_Requirements_Coverage_Reference.xlsx   copy of the workbook, F rows green
Run:  python3 reference/scripts/audit_customer360_requirements.py [path/to/Customer 360.xlsx]
Pages: header (main page) and the tab keys overview, account-info, products-services, billing, offers-leads,
contact-identity, orders, tickets-support, activities, alerts-risks, address-service.
"""
import json, os, re, sys, zipfile, warnings
warnings.filterwarnings("ignore")
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Desktop/Customer 360.xlsx")
OUT_XLSX = os.path.join(ROOT, "reference/outputs/Customer_360_Requirements_Coverage_Reference.xlsx")
OUT_JSON = os.path.join(ROOT, "public/config/customer360-requirement-coverage.json")
OUT_ACCESS = os.path.join(ROOT, "public/config/customer360-field-access.json")
PERSONAS = {  # sheet -> persona id (personas.json)
    "Retail Sales": "ROLE-01", "Telesales": "ROLE-02", "Direct Sales": "ROLE-03", "Customer Care": "ROLE-10",
    "Business Care": "ROLE-11", "Premium": "ROLE-12", "Credit Control": "ROLE-19", "Complaints": "ROLE-26"}
GREEN = "FF92D050"

H, OV, AI, PS, BP, OL, CI, OR, TS, AC, AR, AD = ("header", "overview", "account-info", "products-services", "billing", "offers-leads",
    "contact-identity", "orders", "tickets-support", "activities", "alerts-risks", "address-service")
F, P, M = "F", "P", "M"
# requirement (details text) -> (status, [(page, on-screen label)], note)
REQ = {
 "Primary MSISDN": (F, [(H, "Primary MSISDN"), (AI, "Primary MSISDN"), (CI, "Primary MSISDN")], ""),
 "AM name": (F, [(AI, "AM name")], ""),
 "AM mobile": (F, [(AI, "AM mobile")], ""),
 "AM Email": (F, [(AI, "AM Email")], ""),
 "Manager Email": (M, [], "No manager email on screen"),
 "Availability/escalation contact": (M, [], "Not on screen"),
 "Segment": (F, [(H, "Segment"), (OV, "Segment"), (AI, "Segment"), (CI, "Segment")], ""),
 "Service Type Number of Connections": (F, [(AI, "Connections by Service Type"), (PS, "Service Types"), (H, "Total connections")], ""),
 "Account Hierarchy": (F, [(AI, "Account Hierarchy"), (OV, "Account Hierarchy")], ""),
 "Billing Email ID": (F, [(AI, "Billing Email ID"), (BP, "Bill Email")], "One billing email on file for this customer"),
 "Postpaid - Monthly Recurring Charge": (P, [], "'Monthly Revenue' shows the latest bill total, not the monthly recurring charge"),
 "Postpaid - Average Bill/Spend": (F, [(AI, "Average Revenue (Last 6 Months)")], ""),
 "Prepaid - Monthly Recharge Amount": (M, [], "Only the last recharge is shown (Overview), not a monthly recharge amount"),
 "Prepaid - Top Recharge Type": (F, [(AI, "Top Recharge Type")], "Demo value (violet) where the customer has no recharge data"),
 "Recent Milestones or Interactions": (F, [(AI, "Recent Milestones or Interactions"), (OV, "Recent Activity")], ""),
 "Latest Bill": (F, [(BP, "Latest Bill"), (OV, "Latest Bill")], ""),
 "Outstanding Balance": (F, [(BP, "Outstanding Amount"), (OV, "Outstanding Amount"), (OV, "Total Due"), (AI, "Outstanding Amount")], ""),
 "Unbilled Usage": (F, [(BP, "Unbilled Usage"), (OV, "Unbilled Usage")], ""),
 "Due Date": (F, [(BP, "Due Date"), (OV, "Due Date")], ""),
 "Last Payment & Channel": (F, [(BP, "Last Payment"), (OV, "Last Payment")], ""),
 "Current Dunning Stage": (F, [(AI, "Dunning Stage"), (BP, "Current Dunning Stage")], ""),
 "OG/IC Barring Dates": (F, [(BP, "OG Barring Date"), (BP, "IC Barring Date"), (AR, "OG Barring Date"), (AR, "IC Barring Date")], "Demo value (violet) - the app holds no barring dates"),
 "Amount Required to Pay": (F, [(BP, "Amount Required to Avoid Barring"), (AR, "Amount Required to Avoid Barring")], "Demo value (violet) when not about to be barred"),
 "About to OG/IC Bar (Y/N)": (F, [(AR, "About to be Barred")], ""),
 "PTP Eligible (Y/N)": (F, [(BP, "Eligible for PTP"), (OV, "PTP Eligible")], ""),
 "Credit Limit": (F, [(H, "Credit limit"), (OV, "Credit Limit"), (AI, "Credit Limit")], ""),
 "Overdue TT": (F, [(TS, "Overdue Tickets")], "Shown as the Overdue Tickets count (Tickets & Support); no longer in the header"),
 "All Orders": (F, [(AI, "All Orders"), (OR, "All Orders")], ""),
 "All Trouble Tickets": (F, [(AI, "All Trouble Tickets"), (TS, "All Tickets")], ""),
 "All Billing Profiles": (F, [(AI, "All Billing Profiles"), (BP, "Billing Profile(s)"), (OV, "Billing Profiles")], ""),
 "Installed Assets": (F, [(AI, "Installed Assets"), (PS, "Installed Assets"), (OV, "Installed Assets")], ""),
 "Contact Hierarchy": (F, [(AI, "Contact Hierarchy"), (CI, "Contact Hierarchy"), (OV, "Contact Hierarchy")], ""),
 "Bell Icon/Bulk Notes": (F, [(AR, "Notifications / Notes"), (OV, "Alerts & Risks")], "Bulk notes shown under Notifications / Notes"),
 "Audit Trail (Orders, Contact, Account, Activity, TT)": (F, [(AC, "Activities")], "Orders, tickets, account changes and interactions in one list"),
 "MSISDN Status (Active, Suspended, Barred)": (F, [(PS, "Service Status")], ""),
 "Pending Discounts": (P, [], "Only a 'Discount' row on the selected service; pending discounts are not listed"),
 "Existing Discounts Expiry Date": (P, [], "'Discount' row can show its expiry; no separate expiry date field"),
 "Plan and Add-ons Benefits": (M, [], "Not on screen"),
 "Any Barring Flags": (F, [(PS, "Barrings")], ""),
 "MSISDN Activation Date": (P, [(PS, "Activation Date")], "One 'Activation Date' stands for MSISDN, postpaid and plan activation"),
 "Postpaid Activation Date": (P, [(PS, "Activation Date")], "One 'Activation Date' stands for MSISDN, postpaid and plan activation"),
 "Plan Activation Date": (P, [(PS, "Activation Date")], "One 'Activation Date' stands for MSISDN, postpaid and plan activation"),
 "Repeat Call Flag (Y/N)": (M, [], "Not on screen"),
 "Plan Name": (F, [(PS, "Plan Name")], ""),
 "Bill Limit": (F, [(PS, "Bill Limit")], ""),
 "Active Add-on": (F, [(PS, "Add-ons")], ""),
 "Active Discount": (P, [], "Only a 'Discount' row on the selected service"),
 "Usage Behaviour": (P, [(OV, "Usage & Behaviour")], "Usage & Behaviour (Overview) shows usage figures, not a High Data / Roaming / Call classification"),
 "Blacklisted ID Status": (F, [(CI, "Blacklist Status"), (AR, "Blacklist Status"), (OV, "Blacklist View")], ""),
 "Account Number": (F, [(AI, "Account Number"), (OV, "Account Number")], ""),
 "Total amount": (P, [], "Outstanding Amount is shown (Billing); there is no Blacklist View 'Total amount'"),
 "Bill Period": (F, [(BP, "Bill Period")], ""),
 "Bill Number": (F, [(BP, "Bill Number")], ""),
 "MSISDNs": (F, [(PS, "MSISDN / Service ID"), (OV, "Connections & Services")], "All of the customer's lines are listed"),
 "ID Number": (F, [(CI, "ID Number")], ""),
 "ID Status (Blacklisted/Whitelisted)": (F, [(CI, "ID Status"), (CI, "Blacklist Status")], ""),
 "Preferred Language": (F, [(H, "Preferred Language"), (CI, "Preferred Language")], ""),
 "Tennure": (F, [(CI, "Contact Since")], "Shown as 'Contact Since' (e.g. 4 years)"),
 "First Name & Last Name (Full Name)": (F, [(CI, "Full Name")], ""),
 "Email": (F, [(H, "Email"), (CI, "Email")], ""),
 "DOB": (F, [(H, "Date of Birth"), (CI, "Date of Birth")], ""),
 "Notification MSISDN": (P, [], "Only a 'Notification Contact' row in Contact Hierarchy; no Notification MSISDN field"),
 "Authorized person(s)": (F, [(CI, "Authorized Person(s)")], ""),
 "Authorized Role": (P, [], "'Account Role' / 'Contact Role' labels show '-'; the role appears only inside the hierarchy row"),
 "Authorized Mobile": (P, [], "Mobile appears only inside the hierarchy row, with no label"),
 "Authorized email": (P, [], "Email appears only inside the hierarchy row, with no label"),
 "Total Number of Connections": (F, [(H, "Total connections"), (CI, "Total Number of Connections"), (AI, "Total Connections")], ""),
 "CVM/targeted offers": (F, [(OL, "Eligible Offers")], ""),
 "Eligible Discount": (F, [(OL, "Eligible Discounts")], ""),
 "Next Best Offer": (F, [(OL, "Next Best Offer"), (OV, "Next Best Offer")], ""),
 "DOI Eligibility": (F, [(OL, "DOI Eligibility")], ""),
 "Fixed Line Offer": (F, [(OV, "Fixed Line Offer")], "On Overview only; Offers & Leads lists it as an offer type"),
 "Last Recharge Amount": (F, [(OV, "Last Recharge Amount")], ""),
 "Last Recharge Type": (F, [(OV, "Last Recharge Type")], ""),
 "App Recent/Last Login (Date & Time)": (F, [(OV, "App Last Login"), (PS, "Last Login")], ""),
 "App Active User (Y/N)": (F, [(PS, "App User")], ""),
 "App Digital Adoption %": (F, [(OV, "Digital Adoption")], ""),
 "App Version": (F, [(OV, "App Version"), (PS, "App Version")], ""),
 "Phone Version": (P, [], "Phone OS appears inside the 'App Version' value, not as its own field"),
 "Registered Email ID": (P, [], "The customer email is shown (header, Contact & Identity) but not as an app-registered email"),
 "Current Balance (Data,Voice, Text, Primary Balance)": (F, [(PS, "Current Balance"), (OV, "Current Balance"), (PS, "Primary Balance"), (OV, "Usage & Behaviour")], ""),
 "10 Recent Usages (Data, Calls, Text, OOB)": (F, [(PS, "Usage History"), (OV, "Recent Usage")], "Behind the Usage History / Recent Usage sub-tabs"),
 "Zone": (F, [(AD, "Zone")], ""),
 "Street": (F, [(AD, "Street")], ""),
 "Building": (F, [(AD, "Building")], ""),
 "RFS Flag (Y/N)": (M, [], "No RFS flag on screen (RFS / Service Check cannot run)"),
 "QCB Check": (F, [(CI, "QCB Check")], ""),
 "DOI Handset Type": (M, [(OV, "Existing DOI View")], "Only DOI Eligibility is shown; no handset details"),
 "DOI Price": (M, [], "Not on screen"),
 "DOI Remaining Amount": (M, [], "Not on screen"),
 "DOI Tennure": (M, [], "Not on screen"),
 "Existing Customer New Activation or Migration Journey": (P, [], "An 'Add Service' button starts New Connection for this customer; the Cross Sales / Sales App / AutoBase / Migration / Happy Offer trigger choices are not shown"),
 "Lead Type": (F, [(OL, "Lead Type"), (OV, "Lead Type")], ""),
 "MSISDN": (F, [(OL, "MSISDN"), (OV, "MSISDN")], ""),
 "Created By": (F, [(OL, "Created By"), (OV, "Created By")], ""),
 "Comments": (F, [(OV, "Comments")], "On Overview (Lead Information) only"),
 "Lead Status": (F, [(OL, "Status"), (OV, "Lead Status")], ""),
 "Star number Penalty": (P, [(OV, "Penalty View")], "Lock-in & Penalties (Products & Services) lists commitment penalties, not a Star number penalty"),
 "Device Penalty (Fiber & 5G)": (P, [(OV, "Penalty View")], "Lock-in & Penalties lists commitment penalties, not a device penalty"),
 "Pending TON requests": (F, [(AI, "Pending TON Requests")], ""),
 "Lifestyle Benifits": (M, [], "Not on screen"),
 "Cross sale offers flag": (F, [(CI, "Cross Sale Offers Flag")], ""),
 "Pending Adjustments": (F, [(AI, "Pending Adjustments")], ""),
 "Pending Sim swap": (F, [(AI, "Pending SIM Swap")], ""),
 "Notifications & SMS": (P, [], "SMS / email messages appear as System Activity rows (Activities); no Notifications & SMS section"),
 "ID Type": (F, [(CI, "ID Type")], ""),
 "Sim serial": (F, [(PS, "SIM Serial Number")], "Demo value (violet) where no SIM serial is on file"),
 "Star number value": (M, [], "Not on screen"),
 "Activity (last 5)": (F, [(AI, "Recent Milestones or Interactions"), (OV, "Recent Activity")], ""),
 "Last 5 Orders": (F, [(OR, "All Orders")], "Orders tab lists all orders"),
 "Autobase elegibility flag": (F, [(OL, "AutoBase Eligibility")], ""),
 "Sales enhansment offers": (F, [(CI, "Sales Enhancement Offers Flag")], ""),
 "Special Management": (F, [(AR, "Special Management"), (AR, "Special Management Flag")], "Demo value (violet)"),
 "Employer": (F, [(CI, "Employer")], ""),
 "NAS/Address": (P, [(OV, "NAS / Address")], "Address shown (Address & Service); the NAS Lookup tool is disabled"),
 "Credit Score": (F, [(CI, "Credit Score")], "Shown as a rating word, not a number"),
 "Contract start and end date": (P, [], "'Contract End Date' label exists on Products & Services but shows '-'; no start date"),
 "Product wise revenue split": (M, [], "Not on screen"),
 "ZSB to be mandatory for business activations and data to be imported from Dynamics": (M, [], "Requirement note, not a screen field"),
}
TOPIC_TABS = {  # Customer 360 topic -> pages it unlocks
    "Account Information": [OV, AI, OR, TS], "Assets": [PS], "Billing & Payments": [BP], "Contact/Assets Information": [OL],
    "Account/Contact Lead": [OL], "Contact Information": [CI], "Audit Trail": [AC], "Alerts & Risks": [AR], "Account Address": [AD]}


def norm(t):
    return re.sub(r"\s+", " ", t or "").strip()

def key(detail):
    d = norm(detail)
    if d.startswith("Existing Customer New Activation or Migration Journey"):
        return "Existing Customer New Activation or Migration Journey"
    d = re.sub(r"\s*\(Y/N\)$", " (Y/N)", d)
    for cand in (d, d.replace("DOI  ", "DOI ")):
        if cand in REQ:
            return cand
    if d.startswith("Billing Email ID"):
        return "Billing Email ID"
    if d.startswith("Service Type Number of Connections"):
        return "Service Type Number of Connections"
    if d.startswith("Recent Milestones or Interactions"):
        return "Recent Milestones or Interactions"
    if d.startswith("Usage Behaviour"):
        return "Usage Behaviour"
    raise KeyError(d)

def access_of(sheet, r):
    return "Real Time" if sheet == "Telesales" else (norm(r[5]) if len(r) > 5 and r[5] else "")

def access_cell(v):
    return "drill-down" if v == "Drill Down or Select" else "real-time"

def label_requirements():
    """page -> lower-cased on-screen label -> requirement keys, from the F / P locations in REQ."""
    out = {}
    for rk, (status, locs, _n) in REQ.items():
        for pg, lb in locs:
            out.setdefault(pg, {}).setdefault(re.sub(r"\s*\(\d+\)$", "", lb.lower()), []).append(rk)
    return out

def visible_pages(persona_id):
    cfg = json.load(open(os.path.join(ROOT, "public/config/customer360-fields.json")))
    rows = cfg if isinstance(cfg, list) else cfg.get("fields", cfg)
    pj = json.load(open(os.path.join(ROOT, "public/config/personas.json")))
    ps = pj if isinstance(pj, list) else pj.get("personas", pj)
    staff = next(p["staffId"] for p in ps if p["id"] == persona_id)
    dep = json.load(open(os.path.join(ROOT, "public/config/customer360-department-mapping.json")))["staffIdToDepartment"][staff]
    pages = {H}
    for topic, tabs in TOPIC_TABS.items():
        if any(r["topic"] == topic and r["departments"].get(dep) in ("real-time", "drill-down") for r in rows):
            pages.update(tabs)
    return pages

def main():
    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    results, coverage, acc_by_persona = {}, {}, {}
    for sheet, pid in PERSONAS.items():
        ws, pages, items = wb[sheet], visible_pages(pid), []
        for i, r in enumerate(ws.iter_rows(min_row=2, max_row=130, values_only=True), start=2):
            detail = norm(r[4]) if len(r) > 4 and r[4] else ""
            if not detail:
                continue
            access = norm(r[5]) if len(r) > 5 and r[5] else ""
            if sheet != "Telesales" and access not in ("Real Time", "Drill Down or Select"):
                continue
            rk = key(detail)
            mode = access_cell(access_of(sheet, r))
            if acc_by_persona.setdefault(pid, {}).get(rk) != "real-time":
                acc_by_persona[pid][rk] = mode
            status, locs, note = REQ[rk]
            kept = [(pg, lb) for pg, lb in locs if pg in pages]
            if status == F and not kept:
                status, note = M, (note + "; " if note else "") + "only on a page this persona does not see"
            items.append(dict(row=i, detail=detail, status=status, locs=kept, note=note))
        results[sheet] = items
        cov = {}
        for it in items:
            if it["status"] == F:
                for pg, lb in it["locs"]:
                    cov.setdefault(pg, set()).add(lb)
        coverage[pid] = {pg: sorted(v) for pg, v in cov.items()}
    json.dump({"_note": "Generated by reference/scripts/audit_customer360_requirements.py. 'personas': requirement -> access for each persona (a requirement not listed is not granted). 'labels': page -> on-screen label -> requirements it satisfies.",
               "labels": label_requirements(), "personas": acc_by_persona}, open(OUT_ACCESS, "w"), indent=1)
    json.dump({"_note": "Generated by reference/scripts/audit_customer360_requirements.py - labels shown pink on Customer 360 when a requirement mapped to the persona is displayed.", "personas": coverage},
              open(OUT_JSON, "w"), indent=1)
    json.dump(results, open(os.path.join(os.environ.get("TMPDIR", "/tmp"), "c360_audit_results.json"), "w"), indent=1)
    patch_workbook(results)
    for sheet, items in results.items():
        c = {s: sum(1 for x in items if x["status"] == s) for s in "FPM"}
        print(f"{sheet}: mapped {len(items)}  displayed {c['F']}  partial {c['P']}  missing {c['M']}")

def patch_workbook(results):
    zin = zipfile.ZipFile(SRC)
    wbx = zin.read("xl/workbook.xml").decode("utf8")
    rels = zin.read("xl/_rels/workbook.xml.rels").decode("utf8")
    rid = {}
    for m in re.finditer(r"<Relationship [^>]*>", rels):
        t = m.group(0)
        rid[re.search(r'Id="([^"]+)"', t).group(1)] = re.search(r'Target="([^"]+)"', t).group(1)
    path = {m.group(1): "xl/" + rid[m.group(2)] for m in re.finditer(r'<sheet [^>]*?name="([^"]+)"[^>]*?r:id="([^"]+)"', wbx)}
    styles = zin.read("xl/styles.xml").decode("utf8")
    fm = re.search(r"(<fills\b[^>]*>)(.*?)(</fills>)", styles, re.S)
    fills = re.findall(r"<fill>.*?</fill>|<fill/>", fm.group(2), re.S)
    new_fill = f'<fill><patternFill patternType="solid"><fgColor rgb="{GREEN}"/><bgColor indexed="64"/></patternFill></fill>'
    fill_id = len(fills)
    xm = re.search(r"(<cellXfs\b[^>]*>)(.*?)(</cellXfs>)", styles, re.S)
    xfs = re.findall(r"<xf\b[^>]*?/>|<xf\b[^>]*?>.*?</xf>", xm.group(2), re.S)
    new_xfs, cache = [], {}
    def green(s):
        if s not in cache:
            x = re.sub(r'fillId="\d+"', f'fillId="{fill_id}"', xfs[s])
            x = x.replace("<xf ", '<xf applyFill="1" ', 1) if "applyFill=" not in x else re.sub(r'applyFill="0"', 'applyFill="1"', x)
            new_xfs.append(x); cache[s] = len(xfs) + len(new_xfs) - 1
        return cache[s]
    patched = {}
    for sheet, items in results.items():
        p = path[sheet]; x = zin.read(p).decode("utf8")
        for it in items:
            if it["status"] != F:
                continue
            for col in "ABCDEF":
                m = re.search(r'<c r="' + col + str(it["row"]) + r'"([^>]*?)(/?)>', x)
                if not m:
                    continue
                sm = re.search(r'\bs="(\d+)"', m.group(1)); s = int(sm.group(1)) if sm else 0
                attrs = re.sub(r'\bs="\d+"', f's="{green(s)}"', m.group(1)) if sm else m.group(1) + f' s="{green(s)}"'
                x = x[:m.start()] + f'<c r="{col}{it["row"]}"{attrs}{m.group(2)}>' + x[m.end():]
        patched[p] = x
    fills_new = re.sub(r'count="\d+"', f'count="{fill_id + 1}"', fm.group(1) + fm.group(2) + new_fill + fm.group(3), count=1)
    xfs_new = re.sub(r'count="\d+"', f'count="{len(xfs) + len(new_xfs)}"', xm.group(1) + xm.group(2) + "".join(new_xfs) + xm.group(3), count=1)
    styles = styles[:fm.start()] + fills_new + styles[fm.end():]
    xm2 = re.search(r"(<cellXfs\b[^>]*>)(.*?)(</cellXfs>)", styles, re.S)
    styles = styles[:xm2.start()] + xfs_new + styles[xm2.end():]
    with zipfile.ZipFile(OUT_XLSX, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            data = zin.read(info.filename)
            if info.filename == "xl/styles.xml": data = styles.encode("utf8")
            elif info.filename in patched: data = patched[info.filename].encode("utf8")
            zout.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)
    from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines
    format_file(OUT_XLSX)

if __name__ == "__main__":
    main()
