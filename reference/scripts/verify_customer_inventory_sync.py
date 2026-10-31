#!/usr/bin/env python3
"""Checks that reference/outputs/02 Customer-Inventory.xlsx and the app's mock data agree.

The workbook is the test-data contract: every customer on its 'Customers' sheet must be
findable in the running app (public/mock-data) with the same details, and every customer the
app can find must be on the sheet. Exits 1 and prints each difference when they drift.

    python3 reference/scripts/verify_customer_inventory_sync.py
"""
import json, re, sys
from pathlib import Path
import openpyxl

APP = Path(__file__).resolve().parents[2]
MOCK = APP / "public/mock-data"
XLSX = APP / "reference/outputs/02 Customer-Inventory.xlsx"


def load(n):
    return json.loads((MOCK / f"{n}.json").read_text())


customers = {c["customerId"]: c for c in load("customers")}
docs = {}
for d in load("identity-documents"):
    docs.setdefault(d["customerId"], []).append(d)
contacts = {}
for c in load("customer-contacts"):
    # A customer can have several contact records (a second contact person); the customer's own
    # is the one carrying their first name.
    contacts.setdefault(c["customerId"], []).append(c)
nas = {n["nasRecordId"]: n for n in load("nas-records")}
accounts = load("accounts")
assets = load("installed-assets")
acct_owner = {a["accountId"]: a["customerId"] for a in accounts}


def home_internet(cid):
    """GigaHome fibre services Customer 360 lists for a customer: their GigaHome subscriptions plus Active
    broadband / fibre / home installed assets on their accounts."""
    n = sum(1 for g in load("gigahome-osntv-subscriptions") if g["customerId"] == cid)
    for a in assets:
        nm = a.get("productServiceName", "")
        if acct_owner.get(a.get("accountId")) == cid and a.get("status") == "Active" and not re.search(r"prepaid|postpaid|mobile|sim|iptv|osn|\btv\b|fixed[ -]?(voice )?line|landline", nm, re.I) and re.search(r"broadband|fibre|fiber|gigahome|home", nm, re.I):
            n += 1
    return n


def other_services(cid):
    """Fixed Line + TV + IoT services Customer 360 lists for a customer (by installed-asset name, IPTV bundle or smart device)."""
    n = 0
    for a in assets:
        nm = a.get("productServiceName", "")
        if acct_owner.get(a.get("accountId")) == cid and a.get("status") in ("Active", "Suspended") and re.search(r"fixed[ -]?(voice )?line|landline|iptv|osn|\btv\b|^iot ", nm, re.I):
            n += 1
    n += sum(1 for b in load("iptv-stb-bundles") if acct_owner.get(b.get("accountId")) == cid and not b.get("removedByCustomer"))
    n += sum(1 for d in load("smart-devices") if d.get("customerId") == cid)
    return n


def lines_shown(c):
    """Mobile lines the app lists for a customer (customerServicesEngine.listCustomerServices): their own number
    when they have a lineType, plus every Active mobile installed asset on one of their accounts."""
    shown = {"Postpaid": 0, "Prepaid": 0}
    if c.get("lineType") and c.get("phone"):
        shown[c["lineType"]] += 1
    for a in assets:
        name = a.get("productServiceName", "")
        if a.get("serviceId") == c.get("phone"):
            continue  # the own number's plan record; the engine lists the own number from the customer, not from this asset
        if acct_owner.get(a.get("accountId")) == c["customerId"] and a.get("status") in ("Active", "Suspended") and re.search(r"postpaid|mobile|sim|prepaid", name, re.I):
            shown["Prepaid" if re.search("prepaid", name, re.I) else "Postpaid"] += 1
    return shown

ws = openpyxl.load_workbook(XLSX, data_only=True)["Customers"]
header = [c.value for c in ws[1]]
rows = [dict(zip(header, [c.value for c in r])) for r in ws.iter_rows(min_row=2) if r[0].value]

problems = []

# Original demo data that contradicts itself on mobile lines. Reported, not "fixed": which side is right is a product-data
# decision (see the notes), and inferring it would invent evidence. Each entry is the customer whose Customer 360 listing
# differs from the declared counts.
OPEN_LINE_ITEMS = {
    "CUST-1001": "installed assets IA-9004/IA-9005 are two Active prepaid lines on ACC-5001, but the customer declares 0 prepaid lines",
    "CUST-1003": "installed asset IA-9002 is an Active postpaid mobile plan on ACC-5003 (the GigaHome fixed-line account), but the customer declares 0 mobile lines",
    "CUST-2001": "installed asset IA-9003 (SIM Card - Postpaid) hangs off ACC-5004, which accounts.json assigns to this enterprise parent; no line counts are declared",
}


def iso(v):
    """The workbook shows dates as dd/mm/yyyy; the app's data is ISO."""
    return re.sub(r"\b(\d{2})/(\d{2})/(\d{4})\b", r"\3-\2-\1", v) if isinstance(v, str) else v


def check(cid, field, expected, actual):
    expected = iso(expected)
    if str(expected if expected is not None else "").strip() != str(actual if actual is not None else "").strip():
        problems.append(f"{cid}  {field}: workbook={expected!r}  app={actual!r}")


seen = set()
for r in rows:
    cid = r["Customer / NAS ID"]
    seen.add(cid)
    if cid in nas:
        # A person who is not yet a customer: the app finds them through NAS, not customers.json.
        n = nas[cid]
        check(cid, "name", r["Full name"], n["name"])
        check(cid, "ID number", r["ID number (use for lookup)"], n["documentNumber"])
        check(cid, "ID expiry", r["ID expiry"], n.get("expiryDate"))
        continue
    c = customers.get(cid)
    if not c:
        problems.append(f"{cid}  on the workbook but not in the app (customers.json)")
        continue
    ct = next((x for x in contacts.get(cid, []) if x.get("firstName") == c.get("firstName")), {})
    check(cid, "name", r["Full name"], c["name"])
    check(cid, "first name", r["First name"], c.get("firstName"))
    check(cid, "middle name(s)", r["Middle name(s)"], c.get("middleName"))
    check(cid, "last name", r["Last name"], c.get("lastName"))
    check(cid, "nationality", r["Nationality"], c["nationality"])
    check(cid, "segment", r["Segment"], c["segment"])
    check(cid, "date of birth", r["Date of birth"], c.get("dob"))
    check(cid, "mobile", r["Mobile"], c.get("phone"))
    pp, pre = c.get("activePostpaidLines") or 0, c.get("activePrepaidLines") or 0
    check(cid, "postpaid lines", r["Postpaid lines"] or 0, pp)
    check(cid, "prepaid lines", r["Prepaid lines"] or 0, pre)
    check(cid, "home internet", r["Home internet"] or 0, home_internet(cid))
    check(cid, "other services", r["Other services"] or 0, other_services(cid))
    check(cid, "total lines", r["Total lines"] or 0, pp + pre + home_internet(cid) + other_services(cid))
    if cid not in OPEN_LINE_ITEMS:
        shown = lines_shown(c)
        check(cid, "postpaid lines listed in Customer 360", pp, shown["Postpaid"])
        check(cid, "prepaid lines listed in Customer 360", pre, shown["Prepaid"])
    check(cid, "gender", r["Gender"], ct.get("gender"))
    check(cid, "language", r["Language"], ct.get("preferredLanguage"))
    # The lookup value must resolve to this customer through an identity document.
    wanted = str(r["ID number (use for lookup)"])
    wanted_any = [w.strip() for w in wanted.split(" / ")]  # a customer may list several documents
    match = [d for d in docs.get(cid, []) if str(d["documentNumber"]) in wanted_any]
    if len(match) < len(wanted_any):
        have = ", ".join(str(d["documentNumber"]) for d in docs.get(cid, [])) or "none"
        problems.append(f"{cid}  ID number {wanted} is not fully an identity document of this customer (app has: {have})")
    else:
        types = [t.strip() for t in str(r["ID type"]).split(" / ")]
        expiries = [e.strip() for e in ("" if r["ID expiry"] is None else str(r["ID expiry"])).split(" / ")]
        for i, w in enumerate(wanted_any):
            d = next(d for d in match if str(d["documentNumber"]) == w)
            check(cid, f"ID type ({w})", types[min(i, len(types) - 1)], d["documentType"])
            check(cid, f"ID expiry ({w})", expiries[min(i, len(expiries) - 1)], d.get("expiryDate"))

for cid in customers:
    if cid not in seen:
        problems.append(f"{cid}  in the app (customers.json) but missing from the workbook")

for cid, why in OPEN_LINE_ITEMS.items():
    print(f"open item  {cid}: {why}")
print(f"{len(rows)} workbook customers, {len(customers)} app customers")
if problems:
    print(f"\n{len(problems)} difference(s):")
    print("\n".join(problems))
    sys.exit(1)
print("In sync.")
