# Mobile Prepaid Activation: coverage against BRSD V0.3

Source: `VFQ_Mobile_Prepaid_Activation_BRSD_V0.3.xlsx`, sheet `04_Requirements` (65 requirement rows in 13 sections; "Payment from eWallet" appears twice).
Journey: `/mobile-prepaid/new-prepaid`, which is New Connection with Prepaid preselected (`src/modules/mobile-prepaid/screens/`).
This supersedes the V0.1 trace in `reference/outputs/Archived/VFQ_DXP_Mobile_Prepaid_Requirements_Coverage_Reference.md`.

Precedence: the Prepaid BRSD V0.3 decides business behaviour; New Postpaid is the reference for UI/UX and for the shared capabilities.

Status: **BUILT**, **REUSED** (shared with Postpaid), **PARTIAL**, **GAP**, **BACKEND** (an API, Unica, Qnomy or another system: not buildable in this demo).

## Decisions taken (2026-10-31, with the user)
| Topic | Decision |
|---|---|
| Credit limit / HRN for Prepaid ("Mandatory account attributes") | **Not applied.** Prepaid keeps no credit limit; HRN stays a stored flag with no message, charge or approval. The V0.3 row is read as carried over from Postpaid. |
| SIM card charge | **V0.3 grouping and thresholds adopted**, in `src/data/prepaidSimCharge.ts`: QID + Diplomatic ID waive at a recharge of 20; Passport + GCC ID waive at 35. The charge amounts (10 / 40) are placeholders: the BRSD does not state them. |
| Under-18 | **Exception journey built for Retail + QID, Prepaid only** (`src/data/under18Exception.ts`). New Postpaid keeps its hard stop. |
| Recharge selection | **Built with clearly-marked sample data** (`public/mock-data/recharge-products.json`), optional until a persona rule is given. |

## What changed in this update
- **SIM price discounting** - two ID-type groups with their own waiver level; judged on the chosen recharge, else on the net starter pack as before.
- **Prepaid Recharge Selection** - new shared capability `recharge-selection` (Flex / Combo / Credit / Data cards, SIM-charge note) and a Recharge step after Add-ons; the recharge is its own charge in the cart, checkout and order.
- **Star Number Additional Discount** - Waive Off enabled on the prepaid Number step (a fixed QAR amount off the number's price, with the supporting document); the order holds for approval as in Postpaid; list price, discount and customer-paid are shown in checkout and stored on the order.
- **Number step** - Refresh action, as New Postpaid.
- **Payment** - a zero-value receipt is issued when nothing is due.
- **SIM step** - the eSIM QR email is the contact email the agent confirmed, as in Postpaid (it used the raw MOI email).
- **Under-18 exception** - at Customer Verification a Retail agent with a QID applicant can choose Proceed With Exception; the age check then routes the order to the CDM queue, the Court Order document is required, and the order is recorded as an exception.

## Requirement trace
| BRSD V0.3 requirement | Status | Note |
|---|---|---|
| Agent Access Management | REUSED | Persona gate for the product: `new-connection/productAccess.ts`. |
| ID scan: QID / Diplomat ID / Passport / GCC ID | PARTIAL | Scan, MOI fetch and reconciliation are shared. Missing: persona/role capture options (a-d), device and scanner detection, Sponsor/Occupation on the contact, Passport visa details, MOI-timeout fallback to local data, GCC "citizens of that country only". |
| Any Different ID Scan | PARTIAL | Only the four permitted types can be chosen; no explicit "wrong document" error. |
| Government ID verification and reconciliation | BUILT / PARTIAL | QID and Diplomat built (`idReconciliation.ts`); Passport has no MOI verification other than the linked-QID case. |
| Re-scan on capture failure | PARTIAL | No configurable maximum capture attempts (BRSD: 2) leading to the manual-entry fallback. |
| Age Verification | BUILT (Prepaid) | Hard stop with the exception option below. |
| Age Verification Exception | PARTIAL | Built for Retail + QID: choice, approval to CDM, Court Order required. Not built: manual entry of all details, other supporting-document types. Only reachable when the journey starts as New Prepaid (Customer Verification is product-agnostic in the shared wizard). |
| Customer representative restriction | GAP | No "on behalf of" capture, representative ID or approval task. |
| MOI attributes displayed / Verified attributes non-editable / Expiry date | BUILT / PARTIAL | Shared; gender, middle-name concatenation and the validation timestamp are not all confirmed on screen. |
| MOI unavailability fallback | PARTIAL | Retry built; no fallback to local MOI data. |
| Special ID types | BUILT | Section shown; V0.3 calls it irrelevant for Prepaid offers (left as is). |
| Customer search and matching (QID / Passport / GCC) | PARTIAL | Match, new customer and Passport-to-QID link built; missing "QID account exists, stop and ask for the QID" and the Passport approval task. |
| Update of existing attributes; NAS retrieval | PARTIAL | Audit trail for profile changes exists; write-back of MOI attributes on activation not evidenced. |
| Blacklist check | BUILT / PARTIAL | Hard and soft stops built; multiple reasons per ID and "allowed with approval" not. |
| Blacklist Support (maintenance) | BACKEND | |
| Line count eligibility rules | CONFLICT | V0.3: expat 5 mobile lines (postpaid max 2, prepaid max 3), Qatari unlimited. Current engine caps expat prepaid at 5 and Passport/GCC at 2 (BR-347). **Needs a business answer.** |
| Cross Sales / Sales App / Standard offers | PARTIAL | Cross-sales offers seeded; no Sales App tier. Unica itself is BACKEND. |
| Prepaid Base Plan / Package Selection | BUILT | `PrepaidPlanStep`. |
| Prepaid Recharge Selection | BUILT (sample) | New capability; persona-based "recharge required" rule open; NBO+ is BACKEND. |
| SIM Price Discounting Rules | BUILT | Groups and waiver levels; charge amounts are placeholders. |
| SIM type selection | PARTIAL | Physical, printed eSIM, eSIM, Pre-Paired built; missing auto-picking a free MSISDN for an unpaired SIM and eSIM QR print/email after payment. |
| SIM and eSIM validation / Adding SIM to the order | PARTIAL | Serial, status and availability checks built; missing store-A/store-B check, reserve-on-select, release on cancel/expiry. |
| Number Selection: Paired SIM | BUILT | Read-only MSISDN. |
| Number Selection: Un-paired SIM | PARTIAL | Star / Free / Reserved built; missing the auto-selected default and Blocked-against-user-group. |
| Reserved number retrieval | BUILT | |
| Star / Free number search | PARTIAL | Pattern, price range, sort built; persona rule and configurable page size not verified. |
| Star Number Additional Discount | BUILT | See above. Port-out / TON restriction is BACKEND. |
| Number and upfront charge details | BUILT | List price, discount and customer-paid in checkout and on the order. |
| Blocked Number Selection | GAP | |
| SIM / Number Reservation (hours, days, unreserve rules) | PARTIAL | Cap of 2 per customer built; reservation timers and rules not (values unanswered). |
| Capture Address | BUILT | Auto-passes; no billing address for Prepaid. |
| Mandatory account attributes (credit limit) | CONFLICT | Decided: not applied to Prepaid. |
| Default primary contact | PARTIAL | Contact and language captured; "8 languages, English default" not verified. |
| Contact email and mobile capture / verification | PARTIAL | Personal email mandatory, work optional, masked NAS values; no unverified-email send block or verification link flow; no mobile verified flag. |
| Contact role assignment | GAP | |
| DND mapping | GAP | No DND / USSD push / DOB / VAS preference fields (defaults are given: DND No, USSD Yes). |
| Cart Validation | PARTIAL | Duplicate number/SIM check; compatibility and quantity limits come from product configuration. |
| Charge summary display | PARTIAL | Pack, add-ons, recharge, number, SIM charge, total. **VAT lines (exclusive, code, charge, inclusive, per item and total) are not built** - the VAT rate and which charges carry it are open. |
| Contract generation and signature (CAF) | PARTIAL | Full prepaid CAF with signature; missing paper CAF alternative, retake / re-signature, duplicate-screen display, template admin, CAF search from Customer 360. |
| Additional document upload / view and download | BUILT / PARTIAL | Persona-gated download not confirmed. |
| Payment processing | PARTIAL | WinCash hand-off, retry, submit on paid, zero-value receipt (now). Missing duplicate-payment guard, manual capture of WinCash details, non-Retail payment bypass, offline-receipt attachment. |
| Payment from eWallet | GAP | No eWallet / eTOP-up concept. Integration is BACKEND. |
| Approval Task | PARTIAL | Routing and approve / reject built; missing sequential multi-approver, Request More Information, auto-reject after X days, SLA / escalation, notifications. |
| Inflight modification | GAP | No return-to-agent flow. |
| Order visibility / Multiple activation / Interaction Activity | PARTIAL | Status events and cart of 1..n built; approval hierarchy display, activity at initiation and abandon-resolution not. |
| Lead creation of Fibre | REUSED | `ActivationComplete`. |
| ECR/VSA, QVC, Digital Channels APIs | BACKEND | |
| Notification triggers and templates | PARTIAL | Welcome SMS record and confirmation email; preferred-language rule, delivery statuses and secondary-contact templates not. |
| Feedback survey trigger | BACKEND | |

## Open business questions
1. **Line count**: does "Prepaid 3 max" apply to expat QID holders only; are the V0.1 Passport/GCC 2-line caps still in force; Qatari prepaid maximum (configured as TBC); approval or hard stop at the limit?
2. **SIM charge**: the real charge amounts per ID type and persona ("15+35" in the BRSD is unclear); whether it applies to a Virtual eSIM; waiver at "more than" or "at least" for Passport/GCC.
3. **Recharge**: the real catalogue, whether a recharge is required per persona, and what counts as the recharge when the pack includes one.
4. **VAT**: rate, code and which charges carry it.
5. **eWallet** (which personas, commission payload) and **payment bypass** (which personas, what offline receipt).
6. **Number reservation** timers (X hours, Y / Z / Z+ days) and which roles can unreserve; Star Number discount amounts per persona.
7. **Under-18 exception**: whether the manual-entry requirement means the MOI fields become editable, and whether the rule should also apply to Postpaid.
8. **Credit limit for Prepaid**: confirm the V0.3 row was not intended for Prepaid.
