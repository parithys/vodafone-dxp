# Mobile Prepaid Activation: requirement coverage and open items

Source: `VFQ_Mobile_Prepaid_Activation_BRSD_V0.1.xlsx` (sheet 04_Requirements, use case MOB_PRE_ACT_001, 38 requirements) and
`Mobile_Prepaid_Activation_Process_Flow.html`. Journey: `/mobile-prepaid/new-prepaid` (SCR-190), one journey for Web and
Tablet (`src/modules/mobile-prepaid/screens/`). Reference implementation for UX and patterns: New Connection (Postpaid).

Precedence applied: Prepaid BRSD (business) > Prepaid process flow (sequence) > Postpaid journey (UX, patterns, reuse).

Status: **Built** = implemented and covered by `tests/prepaid.test.mjs` or a browser run; **Reused** = the BRSD says "refer to
Postpaid" and the shared capability is used; **Not built** = see open items.

## Requirement trace

| Req ID | Requirement | Status | Where |
|---|---|---|---|
| JSM_01 | Customer interaction (General BRSD) | Not built | Qnomy interaction ticket has no implementation anywhere in the app (see O-07) |
| KYC_01 | Permitted ID types QID, Diplomatic, GCC, Passport | Built | `data/idTypes.ts` preset `prepaid`; `eligibilityEngine.ts` (no ID-type routing for the four) |
| CAM_01 | Customer search and matching / create or update | Reused | `customerQualificationStep`; `EligibilityGateStep` resolves the customer. A NAS-only new customer is not created as a customer record, as in Postpaid |
| CAM_02 | No credit limit or billing account populated | Built | `submitPrepaidOrder.ts` creates the prepaid account with neither; no Billing step; no Special Discounts |
| CAM_03 | Derive HRN flag, store on the customer account | Built | `account.hrnFlag` written at submit; derived by `isHrnNationality` |
| CAM_04 | No HRN advance-payment message | Built | HRN row hidden for prepaid; no HRN approval route (was removed) |
| ECC_01 | Customer eligibility validation | Reused | `EligibilityGateStep` with `journeyType: 'prepaid'`; collections block no longer stops prepaid |
| ECC_02 | Product selection only after eligibility passes | Built | Eligibility lives in step 1; Continue is gated on it |
| ECC_03 | No credit limit created, amended or displayed | Built | No credit-limit row or record |
| BAM_01 | No billing account created or assigned | Built | As CAM_02 |
| QPC_01 | Product selection | Reused | `planSelectionStep({ kind: 'prepaid' })` |
| QPC_02 | Plans filtered by eligibility and segment | Built | `PrepaidPlanStep` filters on `eligibleSegments` (placeholder data, O-03) |
| QPC_03 | Prepaid-specific discount selectable per plan | Built | Discount radio per pack |
| NUM_01 | Number selection | Reused | `numberSelectionStep` |
| NUM_02 | Bypass number selection for a Pre-Paired SIM, MSISDN read-only | Built | `prePairedOption` on the Number step; MSISDN shown read-only at the SIM step |
| SIM_01 | SIM selection | Reused | `simTypeStep` |
| SIM_02 | Scan a Pre-Paired SIM; show SIM and MSISDN | Built | `SimTypeStep` `prePaired`, `SimSerialScanner` `inventory="pre-paired"` |
| CVC_01 | Cart validation | Built | `isCartValid` (one finished subscription, no repeated number or SIM); checkout read-back |
| CVC_02 | Starter pack and initial recharge in the payment request | Built (see O-02) | `prepaidCartModel.ts` `priceLine` / `cartTotals` |
| CVC_03 | Payment summary and total payable before payment | Built | `prepaidCheckoutStep` |
| CAF_01 | CAF generation | Reused | `cafSignatureStep({ variant: 'full' })`: agree checkbox, inline pad, lock after signing |
| CAF_02 | Prepaid T&Cs / Key Information | Built | `tnc-summary-bullets.json` scenarios `prepaid-*`; `tnc-full-text.json` sections scoped `journey: 'prepaid'` (sample wording, O-05) |
| CAF_03 | Prepaid CAF template | Built | `CafSignatureCapture` `journey: 'prepaid'`: prepaid form title and rows (mobile numbers, SIM serials) |
| PAY_01 | Payment | Reused | `paymentStep({ submitOnPaid: true })` |
| PAY_02 | SIM card charge by ID type | Built (see O-01) | `data/prepaidSimCharge.ts`: QID 10, Passport 40; BR-348 reads it |
| PAY_03 | Physical / Printed eSIM depleted on payment | Built | `submitPrepaidOrder.ts`: stocked SIMs marked Issued; Printed eSIM = a scanned serial whose stock type is "Printed eSIM" |
| PAY_04 | Virtual eSIM depleted at fulfilment | Built | Recorded in the order's fulfilment events |
| ORD_01 | Submit only after payment succeeds | Built | Payment is the last step and auto-submits when paid |
| ORD_02 | Order submission (Postpaid) | Reused | Same order field set, attachments, approval routing and activity as New Connection |
| NET_01 | Create prepaid service; remove barring for Pre-Paired SIM | Built (simulated) | `installed-assets` row with MSISDN, SIM; `barringStatus: 'Removed'` for Pre-Paired |
| NET_02 | Charging System account / balance / plan | Built (simulated) | `in-platform-balances` row; no balance figure invented |
| NET_03 | Activate plan and benefits | Built (simulated) | Fulfilment event listing the discount and add-ons |
| NET_04 | Sync outcome to CRM order status | Built | Order moves Open -> In Progress -> Complete |
| NET_05 (P2) | Welcome / activation lifecycle trigger | Built | OSB welcome SMS record |
| NOT_01 | Notification (Postpaid) | Reused | Shared confirmation email plus the OSB record; all-MSISDN recipient list not built (O-08) |
| CRS_001_QPC_01 (CBU) | Cross-sales offers | Reused | `offersStep({ journey: 'new-prepaid' })`; New Prepaid offers seeded |
| DOB_001_ECC_01 (CBU) | Direct Operator Billing eligibility flag | Not built | Postpaid has no implementation to reuse (O-06) |
| TPV_001_ECC_01 (CBU) | 3rd party VAS eligibility flag | Not built | As DOB (O-06) |

Process-flow loop #8.1 "Add another subscription?": built (`prepaidCartStep`, cart of 1..n subscriptions).

## Decisions taken (2026-10-13, with the user)
- SIM card charge amounts: **QID 10 QAR, Passport 40 QAR are the charges** (BRSD PAY_02). GCC and Diplomatic ID: no charge.
- Pre-Paired SIM is chosen on the Number step ("Use a Pre-Paired SIM").
- Multi-subscription loop is built for Prepaid.
- HRN: flag stored, no message, no approval routing.
- The line cap (BR-347) still routes the order for approval (existing behaviour, BR-003 in the older prepaid BRSD is marked Open).

## Open items (not invented)
| # | Item | What is needed from VFQ |
|---|---|---|
| O-01 | Recharge limit per ID type below which the SIM card charge applies | The BRSD gives the charge amounts but not the limit. `MINIMUM_RECHARGE_QAR` in `data/prepaidSimCharge.ts` is a placeholder (QID 10, Passport 40). |
| O-02 | Source of the cart's "recharge amount" | No recharge field or options are defined. The net starter-pack charge is treated as the recharge, as before. |
| O-03 | Segment rules for the plan filter (QPC_02) | Which segments may buy which packs. `PROD-304` (Premium only) is a demo seed; a pack with no `eligibleSegments` is offered to everyone. |
| O-04 | Add-on pricing on prepaid | Add-ons come from `addons-discounts.json` rows with `category: 'Paid Add-on'` on the chosen pack, charged once at activation. Whether they are one-time or recurring is not stated. |
| O-05 | Approved prepaid T&C wording and Key Information text | Both are sample wording (marked "SAMPLE TEXT" on screen). The blank Consumer Prepaid CAF V2 shows a Store/Retailer ID and Registration type, which the app has no data for, so they are not on the form. |
| O-06 | DOB and 3rd party VAS eligibility flags (CBU) | The BRSD refers to Postpaid behaviour that does not exist in the app. |
| O-07 | JSM_01 customer interaction (Qnomy ticket) | No journey creates a Q-ticket today. |
| O-08 | NOT_01 "all active MSISDNs on the QID" recipient list | Needs a cross-line directory the schema does not have; the welcome message targets the activated numbers. |
| O-09 | Whether a SIM card charge applies to a Virtual eSIM | Applied to every SIM type today; the BRSD does not say. |
| O-10 | eSIM QR for a multi-subscription order | The confirmation shows the first eSIM subscription's activation code only. |
| O-11 | Line cap outcome | ECC_02 says product selection follows "line count eligibility validations", which could mean a hard stop; the app routes the order for approval (BR-347). |
| O-12 | Draft resume drops the eligibility result (inherited from the shared Postpaid step) | Pre-existing; not changed here. |

## Mock data added (demo seeds, annotated in the files)
`sims.json` (two Pre-Paired SIMs with MSISDN, one Available Printed eSIM), `products.json` (`PROD-304`), `cross-sales-offers.json`
(two `new-prepaid` offers for CUST-1001), `tnc-full-text.json` / `tnc-summary-bullets.json` (prepaid sections), and a corrected
`addons-discounts.json` row (`ADO-7104`, IPTV add-on that had been attached to the SIM-only prepaid product).

## Shared capability changes (all additive; defaults keep Postpaid unchanged)
`CustomerQualification` (`journeyType`, `manualEntry`), `EligibilityGate` and `eligibilityEngine` (`journeyType`), `CrossSellOffers`
(`journey`), `NumberSelection` (`prePairedOption`), `SimType` / `SimSerialScanner` (`prePaired`, `inventory`, `device`),
`CheckoutSummary` (`prepaidCartStep`, `prepaidCheckoutStep`), `CafSignature` (`journey`, `formDetails`, `keyInformationScenario`).
One fix applies to Postpaid on a touch device too: the full CAF now needs the signature for Touch Screen as well as Digital
(before, a Touch Screen CAF counted as signed without one).

## Where Prepaid sits now: one New Connection journey (2026-10-13)
Prepaid is no longer a wizard of its own. `/mobile/start-connection` (New Connection) is one journey for Postpaid, Prepaid,
Fixed Line (including 5G Home / FWA) and MNP: Customer Identification once, then **Product Selection**, then that product's
steps in the same wizard (same draft, customer lock and title; no exit or restart). Entry points still work: SCR-190, the Fixed
Line, FWA and MNP routes open New Connection with the product already chosen (the product step passes itself over; Back returns
to it). Code: `src/modules/new-connection/` (`connectionSteps.tsx`, `products.ts`, `steps/ProductSelection.tsx`).
- Eligibility is judged in two scopes: Identification reports the checks common to every product (hard stops); the product step
  re-judges for the chosen product (prepaid rules for Prepaid and MNP-onto-prepaid). A postpaid collections soft-stop offers
  "Switch to Prepaid" in place.
- Billing account (Postpaid, Fixed Line, MNP-postpaid): an existing one is selected; otherwise a new one is **created and set as the
  default** at submit (`persistBillingAccount`: an `accounts` row and a `billing-profiles` row, `isDefault`). Prepaid has none.
- Open items added: O-13 a customer known only to NAS (no customer record) gets the billing rows keyed by ID number, so Customer 360
  does not list them yet. O-14 In the "new customer" flow (Agent 360 / Mobile) Customer Identification treats the person as new for
  every product, so a Prepaid order from there carries no `customerId` (no prepaid account or line-count update); the Customer 360
  (existing) flow and offers use the matched customer. O-15 Identification is the Postpaid one (scan, verify, Fetch) for every
  product, so Prepaid's web typed-first ID entry is now the capability option `manualEntry` but is not switched on.

## New Home Connection (2026-10-13)
New Home Connection is its own continuous journey, same shape as New Connection: Customer Identification once, then Product
Selection with four options (**Fibre, Fixed-Line, FWA, 5G Home**), then the home steps in the same wizard (own draft id
`new-home-connection`). SCR-043 and the FWA routes open it (FWA with FWA preselected). New Connection also keeps a New Fixed Line
product whose "Connection type" sub-choice is the same four. Open items: O-16 the BRSD and business rules do not say which
Installation Address service type (Fibre, FWA Indoor, FWA Outdoor) applies to which of the four products, so none is assumed and the
agent still chooses it; O-17 no product-specific rules are defined for Fixed-Line and 5G Home yet, so all four run the same home
steps; O-18 recommended offers are shown in New Connection only, not in New Home Connection.

**Update (business rule given 2026-10-13): service types by home product.** New Fibre Connection: none shown (it runs on the Fiber
service underneath, set automatically, so the fibre-readiness check applies); New Fixed-Line Connection: none; New FWA Connection:
FWA Indoor or FWA Outdoor; New 5G Home Connection: none. This replaces the earlier interim handling; O-16 is closed. O-17 (other
product-specific rules for Fixed-Line and 5G Home, e.g. devices and plan catalogue) and O-18 stand.
