#!/usr/bin/env python3
"""Seeds DEMO data for the Telesales (CBU) Customer 360 sections that had nothing behind them.

Idempotent: safe to re-run. Every added record carries a `_note` saying it is a demo seed, and the
UI shows it with the demo-only styling where it surfaces. Nothing here is evidence from the BRSDs.

    python3 reference/scripts/seed_telesales_demo_data.py

What it adds:
  billing-profiles.json   collectionStage, derived from the profile's own collectionScenario
  bills.json              dueDate (the 14th of the month after the bill period)
  leads.json              leads whose mobileNumber matches inventory customers, with comments
  authorised-contacts.json  a mobile number on each, plus a few on consumer accounts
  digital-engagement.json (new) last recharge and app login / adoption per customer
  customer-overview-extras.json (new) about-to-bar flag, eligible discount, phone version, voice / SMS allowance
  customer-overview-demo.json (new)   per-customer rows for the Overview page sections (key contacts, recharge
                                      history, usage trend, address history, lead activities, audit rows ...)
  telesales-demo-catalog.json (new)   shared offer catalogue shown in the Offers sections
"""
import hashlib
import json
from datetime import date
from pathlib import Path

MOCK = Path(__file__).resolve().parents[2] / "public" / "mock-data"
NOTE = "Demo seed (2026-10-03) for the Telesales Customer 360 - not sourced from a BRSD."


def load(n):
    return json.loads((MOCK / f"{n}.json").read_text())


def save(n, data):
    (MOCK / f"{n}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


customers = load("customers")
accounts = load("accounts")
by_cust_acc = {}
for a in accounts:
    by_cust_acc.setdefault(a["customerId"], []).append(a)

# 1. Dunning stage: the profile already says which scenario it is in; the stage is that scenario.
bp = load("billing-profiles")
for p in bp:
    if not p.get("collectionStage"):
        scen = p.get("collectionScenario")
        p["collectionStage"] = "No dunning" if not scen or scen == "None" else scen
save("billing-profiles", bp)

# 2. Bill due dates.
bills = load("bills")
for b in bills:
    if not b.get("dueDate"):
        y, m = (int(x) for x in b["billPeriod"].split("-"))
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)
        b["dueDate"] = date(y, m, 14).isoformat()
save("bills", bills)

# 3. Leads matching real customers.
leads = load("leads")
have = {l["leadId"] for l in leads}
LEADS = [
    ("LEAD-20301", "CUST-1001", "Home", "New", "Asked about GigaHome Fibre for a second address; call back after the weekend."),
    ("LEAD-20302", "CUST-1003", "MNP", "Callback Scheduled", "Considering porting a family line from another operator."),
    ("LEAD-20303", "CUST-3001", "Home", "Contacted", "Interested in a fibre upgrade; waiting on coverage check."),
    ("LEAD-20304", "CUST-3011", "Mobile", "New", "Wants a plan for a second SIM; sent offer details."),
    ("LEAD-20305", "CUST-1004", "Device", "Qualified", "Asked about a handset instalment plan."),
]
cmap = {c["customerId"]: c for c in customers}
for lid, cid, svc, status, comment in LEADS:
    if lid in have or cid not in cmap:
        continue
    leads.append({"leadId": lid, "serviceNeeded": svc, "status": status, "ownerId": "AGENT-VINODHINIR",
                  "createdVia": "Tele-sales call", "mobileNumber": cmap[cid]["phone"], "comments": comment, "_note": NOTE})
save("leads", leads)

# 4. Authorised persons: a mobile on each existing one, and a few on consumer accounts.
auth = load("authorised-contacts")
for i, a in enumerate(auth):
    a.setdefault("mobile", f"+97455580{(i + 1):03d}")
have = {a["authorisedPersonId"] for a in auth}
for pid, cid, name, role, email, mobile in [
    ("AUTH-3201", "CUST-1001", "Noora Ahmed Al-Sulaiti", "Spouse", "noora.alsulaiti@example.qa", "+97455580101"),
    ("AUTH-3202", "CUST-1003", "Saud Hamad Al-Kuwari", "Parent", "saud.alkuwari@example.qa", "+97455580102"),
    ("AUTH-3203", "CUST-3001", "Jassim Hamad Al-Thani", "Sibling", "jassim.althani@example.qa", "+97455580103"),
]:
    acc = by_cust_acc.get(cid)
    if pid in have or not acc:
        continue
    auth.append({"authorisedPersonId": pid, "accountId": acc[0]["accountId"], "name": name, "email": email,
                 "emailType": "personal", "jobTitle": role, "roles": [role.lower()], "isChooser": False,
                 "accountAffiliationApproved": True, "webSelfCareAccess": False, "offBoarded": False,
                 "mobile": mobile, "_note": NOTE})
save("authorised-contacts", auth)

# 5. Digital engagement and last recharge, deterministic per customer.
prepaid_customers = {a["customerId"] for a in accounts if "Prepaid" in a.get("accountType", "")}
rows = []
for c in customers:
    h = int(hashlib.sha256(c["customerId"].encode()).hexdigest(), 16)
    prepaid = c["customerId"] in prepaid_customers
    rows.append({
        "customerId": c["customerId"],
        "lastRechargeAmountQar": [10, 25, 50, 100][h % 4] if prepaid else None,
        "lastRechargeType": ["Voucher", "Card", "Wallet"][(h >> 3) % 3] if prepaid else None,
        "lastRechargeAt": f"2026-09-{(h % 27) + 1:02d}T10:15:00+03:00" if prepaid else None,
        "appActiveUser": (h >> 5) % 5 != 0,
        "appLastLoginAt": f"2026-09-{((h >> 7) % 27) + 1:02d}T19:40:00+03:00" if (h >> 5) % 5 != 0 else None,
        "appDigitalAdoptionPct": 20 + (h >> 9) % 76,
        "appVersion": ["5.2.1", "5.3.0", "5.3.4"][(h >> 13) % 3],
        "appUserSince": f"{2019 + (h >> 17) % 6}-{(h >> 20) % 12 + 1:02d}-{(h >> 24) % 28 + 1:02d}",
        "_note": NOTE,
    })
save("digital-engagement", rows)
# 6. Overview extras. About-to-bar follows the profile's own collection scenario; the eligible discount
# is the app's Loyalty discount (15%), which only an existing postpaid customer qualifies for.
scenario = {}
for prof in bp:
    scenario[prof["accountId"]] = prof.get("collectionScenario")
extras = []
for c in customers:
    h = int(hashlib.sha256(("x" + c["customerId"]).encode()).hexdigest(), 16)
    scen = next((scenario.get(a["accountId"]) for a in by_cust_acc.get(c["customerId"], []) if scenario.get(a["accountId"])), None)
    extras.append({
        "customerId": c["customerId"],
        "aboutToBar": "Yes" if scen in ("Pre-Collection", "Standard Collection") else "No",
        "eligibleDiscount": "Loyalty 15%" if c.get("activePostpaidLines", 0) > 0 else None,
        "phoneVersion": ["iOS 17.5", "iOS 18.0", "Android 14", "Android 15"][h % 4],
        "voiceAllowanceMin": 500,
        "smsAllowance": 500,
        "smsRemaining": 100 + h % 400,
        "_note": NOTE,
    })
save("customer-overview-extras", extras)

# 7. Per-customer rows for the Overview page sections. The app's own data is thin for these (a handful of
# audit rows, three CDRs ...), so each customer gets a deterministic demo set; the UI prefers real records
# and falls back to these, and says so on screen.
def person(h, last, i):
    first = ["Salman", "Mariam", "Nayef", "Hessa", "Rashid", "Noora", "Khalid", "Sara"][(h >> (i * 3)) % 8]
    return first, f"{first} {last}"


def ts(day, hour, minute):
    return f"2026-09-{day:02d}T{hour:02d}:{minute:02d}:00+03:00"


demo = []
for c in customers:
    h = int(hashlib.sha256(("d" + c["customerId"]).encode()).hexdigest(), 16)
    last = (c.get("lastName") or c["name"].split()[-1]).replace(" ", "")
    am_first, am = person(h, "Al-Kuwari", 0)
    esc_first, esc = person(h, "Al-Mannai", 1)
    fam_first, fam = person(h, last, 2)
    not_first, notif = person(h, last, 3)
    slug = last.lower().replace("-", "")
    email = c.get("email") or f"{slug}@example.qa"
    mobile = c.get("phone") or "+97455500000"
    n = lambda k: 55000000 + (h >> k) % 999999
    demo.append({
        "customerId": c["customerId"],
        "keyContacts": [
            {"role": "Account Manager", "name": am, "mobile": f"+974{n(1)}", "email": f"{am_first.lower()}.kuwari@vodafone.qa"},
            {"role": "Manager Email", "name": None, "mobile": None, "email": f"manager.{slug}@vodafone.qa"},
            {"role": "Availability / Escalation Contact", "name": esc, "mobile": f"+974{n(5)}", "email": f"{esc_first.lower()}.mannai@vodafone.qa"},
        ],
        "billingEmails": [email, f"billing.{slug}@example.qa", f"accounts.{slug}@example.qa", f"finance.{slug}@example.qa"],
        "otherContacts": [
            {"name": notif, "relation": "Notification Contact", "mobile": f"+974{n(9)}", "email": f"{not_first.lower()}@example.qa"},
            {"name": fam, "relation": "Family Member", "mobile": f"+974{n(13)}", "email": f"{fam_first.lower()}.{slug}@example.qa"},
        ],
        "commPrefs": {"emailForBilling": True, "marketing": bool(h & 1), "sms": True, "emailNotifications": True},
        "contactMeta": {"tenure": f"{2 + h % 9} years", "employer": ["Qatar Airways", "Ooredoo", "QatarEnergy", "Hamad Medical", "Self-employed"][h % 5], "creditScore": ["Good", "Excellent", "Fair"][(h >> 2) % 3]},
        "contactActivities": [
            {"at": ts(28, 16, 12), "activity": "Updated email address", "by": "Telesales"},
            {"at": ts(21, 9, 40), "activity": "Added authorised person", "by": "Telesales"},
            {"at": ts(12, 14, 15), "activity": "Changed notification number", "by": "System"},
            {"at": ts(5, 11, 30), "activity": "Updated communication preferences", "by": "System"},
            {"at": ts(1, 11, 20), "activity": "Updated communication preferences", "by": "Telesales"},
        ],
        "recharges": [
            {"at": ts(25, 10, 0), "amountQar": 50, "type": "Voucher", "channel": "MyVodafone App"},
            {"at": ts(10, 10, 0), "amountQar": 100, "type": "Credit Card", "channel": "Website"},
            {"at": ts(2, 10, 0), "amountQar": 50, "type": "Voucher", "channel": "Store"},
            {"at": ts(1, 9, 0), "amountQar": 30, "type": "Credit Card", "channel": "MyVodafone App"},
            {"at": ts(1, 8, 0), "amountQar": 50, "type": "Voucher", "channel": "Retail Partner"},
        ],
        "usageTrend": [
            {"month": m, "dataRegular": 18 + (h >> i) % 14, "dataOut": 4 + (h >> (i + 2)) % 8,
             "voiceRegular": 200 + (h >> i) % 250, "voiceOut": 20 + (h >> (i + 3)) % 60,
             "smsRegular": 80 + (h >> i) % 120, "smsOut": 5 + (h >> (i + 1)) % 25}
            for i, m in enumerate(["Apr", "May", "Jun", "Jul", "Aug", "Sep"])
        ],
        "serviceability": {"Mobile Coverage": "Available", "Fixed Line": "Available", "Fibre (Home)": "Available", "TV Service": "Available", "5G Coverage": "Available", "Remarks": "Serviceable for all products"},
        "addressType": {"addressType": "Residential", "usageType": "Primary", "validFrom": "2020-01-12", "validTo": None, "isMailing": True, "isBilling": True},
        "addressHistory": [
            {"type": "Residential", "zone": "Zone 56", "street": "Al Waab Street", "building": "Building 12", "rfs": True, "from": "2020-01-12", "to": None, "status": "Current", "by": "Telesales", "on": "2020-01-12T10:24:00+03:00"},
            {"type": "Residential", "zone": "Zone 55", "street": "Al Sadd Street", "building": "Building 08", "rfs": True, "from": "2018-06-10", "to": "2020-01-11", "status": "Previous", "by": "System", "on": "2018-06-10T09:15:00+03:00"},
            {"type": "Office", "zone": "Zone 61", "street": "West Bay", "building": "Tower 2", "rfs": False, "from": "2016-02-05", "to": "2018-06-09", "status": "Previous", "by": "Retail Agent", "on": "2016-02-05T16:20:00+03:00"},
        ],
        "leadActivities": [
            {"at": ts(30, 10, 24), "activity": "Lead created", "by": "Telesales"},
            {"at": ts(28, 16, 30), "activity": "Status updated to In Progress", "by": "Telesales"},
            {"at": ts(25, 11, 15), "activity": "Converted to Order", "by": "System"},
            {"at": ts(16, 14, 20), "activity": "Follow-up scheduled", "by": "Telesales"},
            {"at": ts(10, 9, 45), "activity": "Lead created", "by": "Retail Agent"},
        ],
        "offerHistory": [
            {"at": "2026-09-28", "offer": "Roaming Pack", "status": "Purchased", "channel": "App"},
            {"at": "2026-09-12", "offer": "Add-on Discount", "status": "Purchased", "channel": "Telesales"},
            {"at": "2026-09-01", "offer": "Device (DOI)", "status": "In Progress", "channel": "Store"},
            {"at": "2026-08-15", "offer": "International Pack", "status": "Expired", "channel": "App"},
            {"at": "2026-07-01", "offer": "RED Plus", "status": "Purchased", "channel": "Telesales"},
        ],
        "auditRows": [
            {"at": ts(30, 10, 24), "module": "Order", "action": "Created", "field": "Order Number", "old": None, "new": "ORD-987654", "by": "Telesales", "channel": "Telesales", "ref": "ORD-987654"},
            {"at": ts(29, 9, 12), "module": "Account", "action": "Updated", "field": "Credit Limit", "old": "QAR 3,000", "new": "QAR 5,000", "by": "System", "channel": "System", "ref": "ACC-123456"},
            {"at": ts(28, 14, 30), "module": "Contact", "action": "Updated", "field": "Email", "old": "old.email@...", "new": email, "by": "Telesales", "channel": "Telesales", "ref": "CON-567890"},
            {"at": ts(28, 16, 15), "module": "Trouble Ticket", "action": "Status Changed", "field": "Status", "old": "Open", "new": "Resolved", "by": "Back Office", "channel": "System", "ref": "TT-123456"},
            {"at": ts(25, 11, 3), "module": "Account", "action": "Updated", "field": "Dunning Stage", "old": "Stage 3", "new": "Stage 2", "by": "System", "channel": "System", "ref": "ACC-123456"},
            {"at": ts(21, 9, 40), "module": "Order", "action": "Status Changed", "field": "Order Status", "old": "In Progress", "new": "Completed", "by": "Telesales", "channel": "App", "ref": "ORD-987653"},
            {"at": ts(18, 14, 15), "module": "Contact", "action": "Added", "field": "Authorised Person", "old": None, "new": "Fatima Al-Sulaiti", "by": "Telesales", "channel": "Telesales", "ref": "CON-567889"},
            {"at": ts(15, 10, 20), "module": "Activity", "action": "Added", "field": "Activity Note", "old": None, "new": "Customer requested roaming pack", "by": "Telesales", "channel": "Telesales", "ref": "ACT-445566"},
            {"at": ts(12, 15, 18), "module": "Trouble Ticket", "action": "Priority Changed", "field": "Priority", "old": "Low", "new": "High", "by": "Customer Care", "channel": "Call Center", "ref": "TT-123455"},
            {"at": ts(10, 11, 5), "module": "Order", "action": "Cancelled", "field": "Order Number", "old": None, "new": "ORD-987652", "by": "Telesales", "channel": "Telesales", "ref": "ORD-987652"},
        ],
        "_note": NOTE,
    })
save("customer-overview-demo", demo)

catalog = [{
    "catalogId": "TS-DEMO-CATALOG",
    "nextBestOffers": [
        {"badge": "Recommended", "name": "RED Unlimited+", "tagline": "More data. More possibilities.", "benefits": ["Unlimited Local Data", "Unlimited Local Calls", "100 International Minutes", "Free Roaming in GCC"], "personalised": True},
        {"badge": "Popular", "name": "RED Plus", "tagline": "Great value for everyday.", "benefits": ["50 GB Local Data", "Unlimited Local Calls", "50 International Minutes", "Free Social Apps"], "personalised": False},
    ],
    "otherEligible": [
        {"name": "Family Share", "sub": "Add a line for your loved ones", "icon": "user"},
        {"name": "Roaming Pack", "sub": "Stay connected worldwide", "icon": "globe"},
        {"name": "International Minutes Pack", "sub": "More minutes, less limits", "icon": "phone"},
        {"name": "Device Upgrade (DOI)", "sub": "Latest devices, flexible payments", "icon": "card"},
        {"name": "GigaHome Fibre", "sub": "Superfast home internet", "icon": "globe"},
        {"name": "TV Entertainment", "sub": "More of what you love", "icon": "grid"},
    ],
    "eligibleDiscounts": [
        {"name": "Loyalty Discount", "sub": "20% on monthly rental"},
        {"name": "Multi-line Discount", "sub": "15% for 3+ lines"},
        {"name": "eBill Discount", "sub": "QAR 10 per month"},
    ],
    "additionalOpportunities": [
        {"name": "Migration Offer", "sub": "Migrate to RED and get more", "status": "Targeted"},
        {"name": "AutoBase Opportunity", "sub": "Eligible for AutoBase plan", "status": "Eligible"},
        {"name": "Happy Offer", "sub": "Exclusive offer for valued customers", "status": "Eligible"},
    ],
    "crossSell": [
        {"service": "Fixed Line", "offer": "Home Fibre 1Gbps", "benefit": "Superfast internet", "eligibility": "Eligible"},
        {"service": "TV", "offer": "TV Entertainment", "benefit": "200+ channels", "eligibility": "Eligible"},
        {"service": "GigaHome", "offer": "Smart Home Bundle", "benefit": "Internet + TV + WiFi", "eligibility": "Eligible"},
        {"service": "Additional Line", "offer": "RED Plus", "benefit": "Special rate for family", "eligibility": "Eligible"},
    ],
    "salesEnhancement": [
        {"offer": "Add-on Discount", "type": "Usage based", "validTill": "2027-01-12", "status": "Eligible"},
        {"offer": "International Pack", "type": "Targeted", "validTill": "2026-11-30", "status": "Eligible"},
        {"offer": "Device Trade-in", "type": "Campaign", "validTill": "2026-12-31", "status": "Eligible"},
        {"offer": "Roaming Discount", "type": "Segment based", "validTill": "2027-01-15", "status": "Eligible"},
    ],
    "usageInsights": [
        {"name": "High Data User", "sub": "Uses more data than 80% of similar customers"},
        {"name": "High Roaming User", "sub": "Frequent international roaming usage"},
        {"name": "High Local Calls", "sub": "Above average local call usage"},
        {"name": "High International Calls", "sub": "Above average international call usage"},
    ],
    "_note": NOTE,
}]
save("telesales-demo-catalog", catalog)
# 8. Orders carried no date; give the seeded ones a deterministic created date so the Orders tables can show it.
orders = load("orders")
for i, o in enumerate(orders):
    if not o.get("createdAt"):
        o["createdAt"] = f"2026-09-{(i * 3) % 27 + 1:02d}T10:{(i * 7) % 60:02d}:00+03:00"
save("orders", orders)
print(f"seeded: {len(LEADS)} leads, authorised contacts now {len(auth)}, digital-engagement rows {len(rows)}")
