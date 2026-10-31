# RBAC Matrix (Phase 18)

> ## ⚠ SUPERSEDED AT RUNTIME — 2026-09-24
>
> This document describes the **66-persona model**, which no longer drives the
> application. The app now runs on **26 operational roles** whose access comes
> from explicit feature grants in `public/config/personas.json`, expanded
> through `public/config/feature-catalogue.json`.
>
> | Looking for | Go to |
> |---|---|
> | Who can do what **today** | `reference/Persona_Feature_Applicability_Matrix_Reference.xlsx` (the SSOT) |
> | Staff IDs / password / approach | that workbook → **Roles & Credentials** |
> | 66 → 26 mapping | that workbook → **Legacy Crosswalk**, or `legacyPersonaIds` on each role in `personas.json` |
> | The archived 66-persona records | `reference/blueprint/legacy/` |
>
> The 145 rows below survive verbatim as `public/config/rbac-legacy-66.json` and
> are still loaded at runtime — but **display-only**, feeding the collapsed
> "Source evidence" panel in Administration → Roles & Access. They grant
> nothing; see `configEngine.getLegacyRbacForRole()`.
>
> **The access stance inverted.** Here, absence of a row means *not evidenced*
> and is treated as hidden. Under the 26 roles, grants are exhaustive, so
> absence means *deliberately not granted*. Do not carry conclusions from this
> document into the current model without checking the workbook.
>
> Retained because it is the only place the per-row evidence quotes and source
> slugs live, and the workbook's evidence panel joins back to it.

Role → Permission → Screen Access → Action Access, derived strictly from each persona's accessible_screens/accessible_actions/restricted_features/permissions text in `personas.md` cross-referenced against `screens.md`. Personas with no RBAC entries below had no screen/action-level evidence to normalize (their general responsibilities are still documented in `personas.md`).

**Canonical items:** 145

**Confidence:** high 76 · medium 44 · low 25
**Classification:** Explicit 99 · Inferred 25 · Assumed 21

Every item cites its source document slug(s) and evidence quote(s); open `.knowledge/docs/<slug>.md` for full context per `CLAUDE.md`.

---

## Coverage

61 of 66 personas have at least one normalized RBAC entry (145 entries total).

The remaining 5 are **not** a backfill gap in this matrix — they are the expected
output of the derivation rule stated above (no accessible_screens /
accessible_actions / permissions / restricted_features text to normalize). They
are recorded as open items below rather than inferred, because the alternative
is minting screen access the corpus does not support. See the next section.

---

## Open items — personas with no normalized RBAC entry (5)

Each row below was catalogued in `personas.md` from a single passing mention in
the source corpus — enough to establish that the role *exists*, not enough to
establish which screens or actions it may reach. Three of the five additionally
have **no candidate screen in `screens.md`** to point an entry at, and two are
described by the corpus as working *outside* the CRM/DXP entirely (manual
reconciliation, on-site survey). Assigning them screen access would not be a
documentation-only act: `personaEngine.ts` derives module visibility from
`rbac.json` screen IDs, so an invented row grants real navigation access in the
running application.

**Resolution owner:** VFQ Security / Business Process owners — the same open
question as OI-AGN-06/11/13 (no confirmed privilege matrix). These items should
be closed by confirmation, not inference.

| ID | Persona | Why no entry exists | What would close it |
|---|---|---|---|
| RBAC-OI-01 | PERSONA-013 EBU PM (Project Manager) | Corpus places it as a node in an approval chain ("account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN"), not at a screen. No DAPN / enterprise contract-document screen exists in `screens.md`. | Confirm whether EBU PM transacts in the DXP at all, or only receives documents off-system. If in-DXP, the screen must be catalogued first. |
| RBAC-OI-02 | PERSONA-045 DSA / Store / Field Engineer (sales channel attribution) | Evidenced only as "checkboxes for DSA / Store / Field Engineer" — an **attribution field on a signed bilingual paper form**, not a logged-in actor. SCR-066/SCR-018 exist but are paper/PDF artefacts and no persona holds RBAC on either. | Confirm whether this is a system role at all, or purely a provenance field on the Acceptance Form. If the latter, reclassify in `personas.md` as an attribution value, not a persona. |
| RBAC-OI-03 | PERSONA-053 Care / Telesales & Retention / Complaints / Direct Sales / Mass Market / Mini Store / Retail & Franchise (role families) | A list of functional areas read out in one workshop; `personas.md` records "not itemized per role in this transcript". It bundles many distinct roles, so any single entry would span dozens of screens arbitrarily. | Split into discrete personas per role family, then derive per-role entries. Requires a dedicated extraction pass against the source workshop. |
| RBAC-OI-04 | PERSONA-054 Sales / Fulfilment (VFID-KID mapping team) | Corpus states the corner cases are "handled **manually** by sales plus fulfillment". No VFID/KID mapping screen exists in `screens.md`; `mock-data/vodafone-ids.json` carries the mapping fields (`mappedKidIds`, `mappingType`) but is loaded only by `mockDataEngine` with no UI consuming it. | Confirm whether manual reconciliation is expected to move into the DXP. If yes, catalogue the screen first, then derive the entry. |
| RBAC-OI-05 | PERSONA-055 Field Survey Team | Maps VFIDs to KIDs **on-site, in UIM** — outside the DXP. Same absence of a candidate screen as RBAC-OI-04. | Confirm whether any DXP surface is in scope for field survey, or whether this role stays UIM-only (in which case it needs no RBAC entry, and that should be stated). |

---

## PERSONA-001: Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) (20 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-001 | SCR-040 CRM Open UI Desktop Home Page | View | Navigate home page tile grid to launch guided journeys |  |
| RBAC-002 | SCR-041 Cross Sales — Contact/QID entry | Conditional | Look up customer by QID for cross-sell | Cannot re-enter/change QID once carried over from Cross Sales (read-only) |
| RBAC-003 | SCR-042 QID Offers grid | Conditional | Accept campaign offer | Cannot select a plan on cross-sell order (auto-applied); no editable add-on/discount control on cross-sell order |
| RBAC-004 | SCR-046 New Fixed Line wizard — Plan step | Create | Customize complex product configuration, add products to catalog cart, validate order |  |
| RBAC-005 | SCR-048 New Fixed Line wizard — Number Selection step | Create | Reserve number |  |
| RBAC-006 | SCR-049 Book Appointment modal (Fixed Line) | Create | Book appointment |  |
| RBAC-007 | SCR-058 CAF preview modal (with e-signature pad) | Create | Attach CAF, capture signature, sign contract |  |
| RBAC-008 | SCR-059 My Sales Orders / My Pending Approval Orders queue | View | Submit order/save-and-finish, resubmit rejected orders |  |
| RBAC-009 | SCR-064 Order Correction wizard | Edit | Resubmit rejected orders |  |
| RBAC-010 | SCR-117 Product Promotions admin — More Info tab | View | View Product Promotions area |  |
| RBAC-011 | SCR-119 Agent Home / App Launcher | View | Launch Guided Process wizard steps |  |
| RBAC-012 | SCR-114 MNP Postpaid Plan Step / Promotion Detail Modal | Conditional | Validate order, reserve numbers | Can edit Smart Limit/Bill Limit down to but not below Agent Minimum Value without System Administrator override |
| RBAC-013 | SCR-126 MNP wizard step: Donor Details | Create | Capture donor/porting details |  |
| RBAC-014 | SCR-128 Mobile Number Portability Application Form (MNP contract) | Create | Attach CAF, resubmit rejected orders, sign contract |  |
| RBAC-015 |  Order confirmation | View | Submit order/save-and-finish |  |
| RBAC-016 |  Do Not Disturb contact flag action | Edit | Set Do Not Disturb on contact who refused service |  |
| RBAC-017 | SCR-043 New Fixed Line wizard — Contact step | Conditional | Upload ID photos | Cannot manually enter ID details (only re-scan); cannot manually enter KID, only search |
| RBAC-018 | SCR-093 Serial Number Check Screen (Dual Play) | Create | Verify device serial, scan SIM/CPE for FWA |  |
| RBAC-019 | SCR-033 ZSP Entry Screen | Create | ZSP entry |  |
| RBAC-020 | SCR-137 Account Summary | Conditional | Can rename billing profile name; can edit Smart Limit/Bill Limit down to but not below Agent Minimum Value without System Administrator override | Retail cannot change primary contact; cannot enroll/cancel AutoPay or see card details |

<details><summary>RBAC-001 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Home page tile grid' as an entry screen
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`

</details>

<details><summary>RBAC-002 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens names 'Cross Sales QID entry'; restricted_features says QID becomes read-only once carried over
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`

</details>

<details><summary>RBAC-003 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'QID Offers grid'; accessible_actions includes 'Accept campaign offer'; restricted_features denies plan/add-on editing on cross-sell orders
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`

</details>

<details><summary>RBAC-004 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens includes 'New Fixed Line/FWA/Postpaid wizard steps'; accessible_actions includes add-to-cart, customize complex product, validate order
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`, `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-005 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions includes 'reserve number'/'reserve numbers' within wizard steps
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`

</details>

<details><summary>RBAC-006 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions explicitly includes 'book appointment'
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-007 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'CAF preview/signature pad'; accessible_actions includes attach CAF, capture signature, sign contract
- **Source slugs:** `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`

</details>

<details><summary>RBAC-008 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'My Sales Orders'; accessible_actions includes submit order and resubmit rejected orders
- **Source slugs:** `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`

</details>

<details><summary>RBAC-009 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Order Correction journey'; accessible_actions includes resubmit rejected orders
- **Source slugs:** `guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`

</details>

<details><summary>RBAC-010 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Product Promotions area (view)' explicitly as view-only
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-011 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Guided Process wizard steps'
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-012 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Plan detail modal'; permissions text describes Bill Limit/Smart Limit edit floor at Agent Minimum Value
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-013 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Donor Details'
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-014 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'MNP/CAF forms'
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-015 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_screens explicitly names 'Order confirmation' (matches Completion popup concept, no single exact catalogue match)
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`

</details>

<details><summary>RBAC-016 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions explicitly lists this action; no dedicated screen named in catalogue
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-017 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions includes 'upload ID photos'; restricted_features/permissions explicitly bar manual ID/KID entry, only re-scan/search allowed
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-018 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions includes 'verify device serial' and 'scan SIM/CPE for FWA'
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-019 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions explicitly lists 'ZSP entry'
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-020 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona permissions text describes billing profile rename and limit editing plus explicit restriction on primary contact change and AutoPay/card visibility, tied to account-level screens
- **Source slugs:** `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`

</details>

## PERSONA-002: Account Manager (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-021 | SCR-011 MS Dynamics Discount Approval Hierarchy Screen | Approve | Approve account affiliation forms | Does not have CRM access, served via 117 support channel instead |
| RBAC-022 |  Account affiliation approval (no dedicated screen in catalogue) | Approve | Approve account affiliation forms; grants sub-account privileges/Web Self-Care access | Do not have CRM access, served via 117 support channel instead |

<details><summary>RBAC-021 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona permissions state 'Approval authority in EBU discount hierarchy'; catalogue screen SCR-011 explicitly lists 'Account Manager' as persona_access for the discount approval hierarchy screen
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`, `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`

</details>

<details><summary>RBAC-022 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_actions/permissions text directly; no matching screen found in catalogue
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`

</details>

## PERSONA-003: Account Manager / Channel Partner (External enterprise) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-023 |  CRM (no screen access) | Restricted-No-Access |  | Do not have CRM access, served via 117 support channel instead |

<details><summary>RBAC-023 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona restricted_features states explicit CRM access denial for this external persona
- **Source slugs:** `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`

</details>

## PERSONA-004: Fulfilment Agent / Fulfilment Team (3 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-024 | SCR-017 Siebel Order Creation Screen (MNP) | Create | Create order, select MNP category/porting details, attach documents, enter ECR Details |  |
| RBAC-025 | SCR-007 Account Creation Screen | Create | Order creation and validation |  |
| RBAC-026 | SCR-010 DSP Bulk Activation Templates (Target State) | Create | Order creation and validation |  |

<details><summary>RBAC-024 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens names 'Siebel order creation screen'; matches catalogue SCR-017 persona_access='Fulfilment Agent'; accessible_actions list order creation, MNP category/porting, document attach, ECR entry
- **Source slugs:** `vfq-fibre-brsd-v1-2-068eebe3`, `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`

</details>

<details><summary>RBAC-025 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Catalogue SCR-007 lists persona_access='Fulfilment Agent'; persona permissions text broadly covers 'Order creation and validation'
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`

</details>

<details><summary>RBAC-026 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Catalogue SCR-010 lists persona_access='Fulfilment Agent' matching persona's back-office order processing type and general order creation/validation permission
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`

</details>

## PERSONA-005: Back Office Fulfilment Agent (Siebel Responsibility) (4 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-027 | SCR-053 Siebel Web Call Center Home page (tile grid) | View | Navigate tile grid modules (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Ava |  |
| RBAC-028 | SCR-043 New Fixed Line wizard — Contact step | Create | Reserve numbers, book appointments, submit CAF, submit order |  |
| RBAC-029 | SCR-051 Account Orders view (Account 360) | View | View account orders/profile and order history |  |
| RBAC-030 | SCR-052 Sales Order detail — header and Line Items tab | Edit | ECR Details field marked 'To be filled by Fulfillment team only' |  |

<details><summary>RBAC-027 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly enumerates the full home page tile grid module list matching SCR-053
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-028 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'New Fixed Line wizard'; accessible_actions includes reserve numbers, book appointments, submit CAF, submit order
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-029 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Account Orders (Account 360 View)' matching SCR-051 name/purpose directly
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

<details><summary>RBAC-030 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Order detail (Line Items)' matching SCR-052; accessible_actions describes the ECR Details field restricted to Fulfillment team only, i.e. this persona has edit rights on that field
- **Source slugs:** `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`

</details>

## PERSONA-006: Credit Control / Collection & Credit Control (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-031 |  (no evidenced screen/action access) | Restricted-No-Access |  |  |

<details><summary>RBAC-031 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All persona fields (accessible_screens/accessible_actions/restricted_features/permissions) are empty in the source data; no access can be evidenced
- **Source slugs:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`, `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`, `vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`

</details>

## PERSONA-007: Business Finance (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-032 | SCR-007 Account Creation Screen | Approve | Approve credit limit |  |

<details><summary>RBAC-032 evidence</summary>

`Inferred` · confidence: `low`

- **Evidence:** Persona accessible_actions/permissions state 'Approve credit limit' and 'Credit limit approval authority for enterprise'; SCR-007 Account Creation Screen purpose includes 'credit limit' field, closest catalogue match though persona_access there is listed as Fulfilment Agent
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`

</details>

## PERSONA-008: IT Operations (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-033 |  Vanilla Siebel/BRM tabs (source-system tabs) | Full | Direct Siebel/BRM access (source-system tabs) retained exclusively for this persona |  |

<details><summary>RBAC-033 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens names 'Vanilla Siebel/BRM tabs'; permissions state this direct access is retained exclusively for IT Operations, with no matching discrete screen ID in the catalogue
- **Source slugs:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`

</details>

## PERSONA-009: Chooser (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-034 |  Enterprise request submission (no dedicated CRM screen) | Conditional | Submit requests on behalf of the company | Requests only accepted from chooser's registered email; no off-boarding process exists when a chooser leaves the company |

<details><summary>RBAC-034 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_actions/permissions/restricted_features text directly; no accessible_screens or catalogue match provided
- **Source slugs:** `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`, `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`

</details>

## PERSONA-010: Payment Support Contact (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-035 |  (no evidenced screen/action access) | Restricted-No-Access |  |  |

<details><summary>RBAC-035 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All persona fields are empty in the source data; no access can be evidenced
- **Source slugs:** `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`

</details>

## PERSONA-011: Technical Contact (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-036 |  Contact record (free-text only, no formal screen) | Restricted-No-Access |  | Cannot be captured as a formal contact with ID today, only free text, causing appointment notifications to go to the wrong person |

<details><summary>RBAC-036 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona restricted_features text directly states lack of formal capture capability; no accessible_screens/actions evidenced
- **Source slugs:** `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`

</details>

## PERSONA-012: EBU Operations (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-037 | SCR-141 Lead Details View | Create | Qualify leads |  |

<details><summary>RBAC-037 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's accessible_actions text states 'Qualify leads' with no accessible_screens named; matched to Lead Details View / lead qualification workflow as the closest evidenced screen for lead handling actions.
- **Source slugs:** `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`

</details>

## PERSONA-014: Business Care (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-038 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-038 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All fields (accessible_screens, accessible_actions, restricted_features, permissions) are empty for this persona in the source chunk; no evidenced access to report.
- **Source slugs:** `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`, `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`

</details>

## PERSONA-015: Customer (Consumer/Enterprise/B2B2C End User) (7 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-052 | SCR-070 Signature Capture Pad | Create | Sign form, sign CAF via signature pad |  |
| RBAC-053 | SCR-207 Contact Portal | View | send consent SMS, request Home Move/TON, make payments | Subject to disconnection/dunning ladder if unpaid; risk of suspension/blacklisting for offer abuse |
| RBAC-054 |   | Conditional | make payments, enter own parameters for self-serve activation | non-standard customers cannot use self-serve, get a Lead instead |
| RBAC-055 | SCR-199 FDO requests tab (in account summary) | Conditional | Can view/edit/cancel FDO request before point of no return |  |
| RBAC-056 | SCR-126 MNP wizard step: Donor Details | Conditional | must confirm MNP port via SMS |  |
| RBAC-057 | SCR-035 TON (Transfer of Number) Wizard | Conditional | request Home Move/TON |  |
| RBAC-058 | SCR-115 Book Appointment (Home Move) | Conditional | request Home Move/TON |  |

<details><summary>RBAC-052 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens names 'e-signature capture pad (agent-mediated)' and accessible_actions includes 'sign form'/'sign CAF via signature pad', matching directly to the Signature Capture Pad screen whose persona_access includes 'Customer'.
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`, `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`, `gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`, `vfq-stack-modernization-br-28jun-75f28727`, `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`, `consumer-postpaid-caf-v4-110525-editable-915fde96`, `250604-supplementary-form-reg-v2-final-475e97bb`, `guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `open-ui-desktop-agent-360-cti-view-8b495725`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`

</details>

<details><summary>RBAC-053 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens names 'Contact Portal' directly; matched to the catalogued Contact Portal screen, linked from Account Summary, consistent with customer self-service actions like consent SMS, Home Move/TON requests, and payments listed in accessible_actions.
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`, `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`, `gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`, `vfq-stack-modernization-br-28jun-75f28727`, `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`, `consumer-postpaid-caf-v4-110525-editable-915fde96`, `250604-supplementary-form-reg-v2-final-475e97bb`, `guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `open-ui-desktop-agent-360-cti-view-8b495725`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`

</details>

<details><summary>RBAC-054 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's accessible_screens names 'My Vodafone App' directly, matching the self-serve activation and payment actions in accessible_actions; restricted_features text explicitly states non-standard customers cannot use self-serve via this channel and are instead routed to a Lead. No dedicated 'My Vodafone App' screen exists in the catalogue, so recorded without a screen_id match.
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`, `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`, `gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`, `vfq-stack-modernization-br-28jun-75f28727`, `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`, `consumer-postpaid-caf-v4-110525-editable-915fde96`, `250604-supplementary-form-reg-v2-final-475e97bb`, `guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `open-ui-desktop-agent-360-cti-view-8b495725`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`

</details>

<details><summary>RBAC-055 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's permissions text explicitly grants ability to view/edit/cancel an FDO request before the point of no return, matching the FDO requests tab screen used for managing future-dated order requests on the account.
- **Source slugs:** `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`, `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-056 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's permissions text states the customer must confirm MNP port via SMS, an out-of-band confirmation step tied to the MNP wizard's donor/porting steps; no dedicated SMS-confirmation screen exists in the catalogue.
- **Source slugs:** `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`

</details>

<details><summary>RBAC-057 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's accessible_actions explicitly lists 'request Home Move/TON', matching the TON (Transfer of Number) Wizard's guided flow for processing Transfer of Number requests, including document collection and split payment steps.
- **Source slugs:** `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`

</details>

<details><summary>RBAC-058 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona's accessible_actions 'request Home Move/TON' also matches the Home Move Book Appointment screen used to schedule installation for a Home Move request initiated by the customer.
- **Source slugs:** `guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`

</details>

## PERSONA-016: Donor Operator (Ooredoo/QTEL) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-039 | SCR-017 Siebel Order Creation Screen (MNP) | Approve | Accept/reject/conditionally-accept port requests |  |
| RBAC-040 |   | Create | Initiate dunning |  |

<details><summary>RBAC-039 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_actions explicitly grants ability to accept/reject/conditionally-accept port requests, corresponding to the MNP order creation/validation screen used to process port-in orders.
- **Source slugs:** `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`

</details>

<details><summary>RBAC-040 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's accessible_actions explicitly grants ability to initiate dunning as an external donor-operator action tied to the porting process; no specific dunning screen exists in the catalogue, so treated as a distinct action group.
- **Source slugs:** `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`

</details>

## PERSONA-017: Manager/Approver (Delegation of Authority / DOA hierarchy) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-041 | SCR-001 Bulk Adjustment Portal (DXP, Target State) | Approve | Approve/reject adjustment requests |  |
| RBAC-042 | SCR-002 PowerApps Bulk Adjustment Portal (Current State) | Approve | Approve/reject adjustment requests |  |

<details><summary>RBAC-041 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_actions and permissions state approve/reject authority for adjustment requests per DOA level, matching the target-state Bulk Adjustment Portal's role-based access and the current-state PowerApps portal's offline approval step.
- **Source slugs:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`

</details>

<details><summary>RBAC-042 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Same DOA-based adjustment approval authority also evidenced against the current-state PowerApps Bulk Adjustment Portal, which the persona's source document describes as using offline/manual approval prior to the target-state DXP redesign.
- **Source slugs:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`

</details>

## PERSONA-018: Presenter (Enterprise Knowledge Base SME) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-043 | SCR-013 Enterprise Process Knowledge Base Dashboard | View |  |  |
| RBAC-044 |   | View |  |  |

<details><summary>RBAC-043 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens text 'Knowledge base dashboard' matches directly to the Enterprise Process Knowledge Base Dashboard, whose persona_access field names 'Presenter/internal SME'.
- **Source slugs:** `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`

</details>

<details><summary>RBAC-044 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona's accessible_screens text also lists 'process list', which is not a distinct catalogued screen but is part of the Knowledge Base Dashboard's link-out purpose ('links to drawings and step-by-step docs'); recorded as a separate action group since no dedicated process-list screen ID exists.
- **Source slugs:** `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`

</details>

## PERSONA-019: Manager (Approver/Bypass/System Admin role, general) (3 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-045 | SCR-117 Product Promotions admin — More Info tab | Full | Override/bypass QID number entry; approve manually-added fees; raise/lower Agent Minimum Value thresholds constraining Sales agents; elevated configuration access to override Agent Minimum settings |  |
| RBAC-046 | SCR-118 Product Promotions admin — Bill Limit Mapping / Spend Limit Mapping tab | Full | Raise/lower Agent Minimum Value thresholds; elevated configuration access to override Agent Minimum settings |  |
| RBAC-047 | SCR-167 Order Validation dialogs | Approve | Can override/bypass QID number entry; approves manually-added fees |  |

<details><summary>RBAC-045 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens explicitly names 'Product Promotions admin screen (More Info tab, Bill Limit Mapping / Spend Limit Mapping applet)', matched to the two Product Promotions admin screens whose persona_access is 'Admin'; permissions text grants elevated override/bypass/approval authority over agent-facing guardrails configured on these screens.
- **Source slugs:** `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`, `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`, `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`

</details>

<details><summary>RBAC-046 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens explicitly names the 'Bill Limit Mapping / Spend Limit Mapping applet', matched to the dedicated Bill Limit Mapping / Spend Limit Mapping tab screen where Agent Min Value / SL List Price / SL Min Value / SL Default Value are configured per promotion.
- **Source slugs:** `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`, `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`, `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`

</details>

<details><summary>RBAC-047 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona's permissions text describes bypassing QID entry and approving manually-added fees as guardrail-override actions surfaced through order validation; matched to the Order Validation dialogs screen where Bill Limit/Credit Limit/Agent Minimum guardrail notices and overrides surface.
- **Source slugs:** `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`, `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`, `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`

</details>

## PERSONA-020: Billing Team / Billing Role (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-048 |   | Conditional |  | Restricted permission to change bill cycle |

<details><summary>RBAC-048 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's permissions field states 'Restricted permission to change bill cycle' with no accessible_screens named; treated as a distinct action group (bill cycle change) since no dedicated bill-cycle-change screen exists in the catalogue, though it functionally relates to billing profile/account management.
- **Source slugs:** `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`

</details>

## PERSONA-021: Collection/Credit Control Team (Manual Suspension via Taurus) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-049 |   | Restricted-No-Access |  | Manual suspension restricted to specific roles, not exposed as retail journey |

<details><summary>RBAC-049 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona's restricted_features text states manual suspension (via Taurus, an external/back-office system not in the catalogued CRM screen list) is restricted to specific roles and explicitly not exposed as a retail journey/screen; no matching catalogued screen, recorded as a restricted action group.
- **Source slugs:** `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`

</details>

## PERSONA-022: Retention Agent / Retention Team (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-050 | SCR-023 Orders page | Approve |  |  |
| RBAC-051 | SCR-210 Ticket Homepage | Approve | Ticket closure authority for disconnection tickets |  |

<details><summary>RBAC-050 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona's permissions text grants 'Ticket closure authority for disconnection tickets'; matched to the Orders page, whose purpose explicitly requires a ticket to be closed with a specific resolution code before a disconnection order can be submitted, directly implicating this persona's ticket-closure authority.
- **Source slugs:** `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`, `vodafone-process-overview-290626-ec-1ed338b9`

</details>

<details><summary>RBAC-051 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona's permissions text also maps to the general Ticket Homepage, which is described as a central page for viewing/managing a ticket with fields segmented by responsible role, consistent with a Retention Agent's disconnection-ticket closure authority.
- **Source slugs:** `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`, `vodafone-process-overview-290626-ec-1ed338b9`

</details>

## PERSONA-023: CDM Team / Customer Data Management (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-059 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-059 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields (accessible_screens, accessible_actions, restricted_features, permissions) empty; no screen or action evidence to base an entry on.
- **Source slugs:** `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`, `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`

</details>

## PERSONA-024: Supervisor (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-060 |  Cross-agent ticket view (not implemented) | Restricted-No-Access |  | Currently no supervisor cross-agent ticket view exists |

<details><summary>RBAC-060 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** restricted_features text explicitly states no supervisor cross-agent ticket view exists today, indicating this capability/screen is absent for the Supervisor persona.
- **Source slugs:** `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`

</details>

## PERSONA-025: Field Technician / Field Engineer (WFM/OFS/OFSC) (8 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-061 | SCR-091 OFS My Route (Technician) | View | view Next Activity |  |
| RBAC-062 | SCR-092 OFS Activity Details / Start-End Activity | Edit | Start, Start Activity, End Activity, Assess Activity |  |
| RBAC-063 | SCR-093 Serial Number Check Screen (Dual Play) | Create | Submit Serial Number Check |  |
| RBAC-064 | SCR-094 Installation Checklist Screen | Create | Submit Installation Checklist |  |
| RBAC-065 |  Siebel (system access) | Restricted-No-Access |  | No Siebel access |
| RBAC-066 |  Combo box password (system access) | Restricted-No-Access |  | no access to combo box password today (decision made to change this) |
| RBAC-067 | SCR-090 Inventory Management — Non-Serialized Inventory Transfer | Edit | move/transfer inventory to self |  |
| RBAC-068 |  Activation request submission (action group) | Create | submit activation requests, complete checklists |  |

<details><summary>RBAC-061 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens lists 'My Route' matching OFS My Route (Technician); accessible_actions includes viewing next activity from this route list.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-062 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens lists 'Activity details', 'Start activity', 'Assess Activity', 'End activity' matching OFS Activity Details / Start-End Activity; accessible_actions confirms Start and End Activity.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-063 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens lists 'Serial Number Check' matching this screen; accessible_actions explicitly includes 'Submit Serial Number Check'.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-064 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens lists 'Installation Checklist' matching this screen; accessible_actions explicitly includes 'Submit Installation Checklist'.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-065 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** restricted_features text explicitly states 'No Siebel access' for this persona.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-066 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** restricted_features text explicitly notes no access to combo box password today, with a decision recorded to change this going forward.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-067 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** permissions text states technician 'Can move/transfer inventory to self', matching the inventory transfer screen used by field techs/dispatchers.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-068 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** permissions text states technician can 'submit activation requests, complete checklists', an action group not tied to one single catalogued screen beyond the Serial Number Check/Installation Checklist screens already captured.
- **Source slugs:** `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`, `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`, `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`, `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

## PERSONA-026: Rollout Team (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-069 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-069 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`

</details>

## PERSONA-027: Sales Team (Win-back) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-070 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-070 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`

</details>

## PERSONA-028: Managing Queue / CDM / BOQ / QATQ (routing queues) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-071 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-071 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`

</details>

## PERSONA-029: MOI (Ministry of Interior, external system/authority) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-072 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-072 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`

</details>

## PERSONA-030: Store Agent (TON) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-073 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-073 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`

</details>

## PERSONA-031: Business Analyst (Rana) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-074 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-074 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-032: Solution/Financial Architect (Marishi) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-075 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data |

<details><summary>RBAC-075 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has all access-relevant fields empty; no screen or action evidence to base an entry on.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-033: Retail Agent (Retail Operations Stakeholder - Giri) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-076 |  Primary contact change (action) | Restricted-No-Access |  | Retail cannot change primary contact (per CRM Journeys workbook comment) |

<details><summary>RBAC-076 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** restricted_features text explicitly states Retail cannot change primary contact, per CRM Journeys workbook comment; no matching catalogued screen name given, recorded as an action-level restriction.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-034: Authorized Officer (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-077 |   | Approve | Flag an account to override the max mobility line cap (CRA rule) |  |

<details><summary>RBAC-077 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona permissions text states this role 'Can flag an account to override the max mobility line cap (CRA rule)' - an account-level override/approval authority not tied to a named screen in the catalogue.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-035: Credit Control / Billing Stakeholder (Anwar Mishra) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-078 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-078 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All of accessible_screens, accessible_actions, restricted_features, and permissions are empty for this persona - no evidenced access to report.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-036: Security Stakeholder (Ali) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-079 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-079 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All of accessible_screens, accessible_actions, restricted_features, and permissions are empty for this persona - no evidenced access to report.
- **Source slugs:** `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`

</details>

## PERSONA-037: Qatar Visa Center (QVC) Staff (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-080 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-080 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All of accessible_screens, accessible_actions, restricted_features, and permissions are empty for this persona - no evidenced access to report.
- **Source slugs:** `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`

</details>

## PERSONA-038: Offshore Airport Staff / Third-Party Partner (Offshore Prepaid Activation) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-081 |   | Full | Manual activation authority for offshore prepaid sales only |  |

<details><summary>RBAC-081 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona permissions text grants 'Manual activation authority for offshore prepaid sales only' - a scoped functional authority not mapped to a specific catalogued screen.
- **Source slugs:** `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`, `vodafone-process-overview-290626-ec-1ed338b9`

</details>

## PERSONA-039: Fulfilment Manager Sign-off (Fixed & Mobile Fulfilment and Technical Support) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-082 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-082 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All of accessible_screens, accessible_actions, restricted_features, and permissions are empty for this persona - no evidenced access to report.
- **Source slugs:** `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`

</details>

## PERSONA-040: GTM & Channel Operations (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-083 |   | Restricted-No-Access |  |  |

<details><summary>RBAC-083 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** All of accessible_screens, accessible_actions, restricted_features, and permissions are empty for this persona - no evidenced access to report.
- **Source slugs:** `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`

</details>

## PERSONA-041: Team Manager / Approver / Manager (Order Approval, Test Manager) (10 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-084 | SCR-107 Manager Home Screen (Test Manager) | Full |  |  |
| RBAC-085 | SCR-060 TM SR Queue View — Order Activities Queue | Full |  |  |
| RBAC-086 | SCR-061 Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs) | Approve | Approve, Reject - Correction, Reject - Drop Order, Assign To Me, ReAssign To Queue |  |
| RBAC-087 | SCR-062 Reject Order modal | Reject | Reject - Correction (only offered before first correction round), Reject - Drop Order | After one correction round, Reject - Correction option no longer offered on re-review |
| RBAC-088 | SCR-063 Approve Order modal | Approve | Approve |  |
| RBAC-089 | SCR-144 Manage Leads - My Team's Leads | Full |  |  |
| RBAC-090 | SCR-144 Manage Leads - My Team's Leads | View |  |  |
| RBAC-091 |   | View |  |  |
| RBAC-092 | SCR-146 Lead Owner reassignment picker | Edit | Lead Owner reassignment via picker |  |
| RBAC-093 |   | Restricted-No-Access |  | Cannot access full sales/order-creation modules available to front-line agents; menu limited to Home/Order Approval (+/- Manage Leads, Leads Queue), distinct from field-agent tablet menu |

<details><summary>RBAC-084 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Manager home dashboard (Home, Order Approval, Manage Leads, Leads Queue)' as an accessible screen entry point/dashboard for this role.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`, `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`, `guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`, `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`, `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`

</details>

<details><summary>RBAC-085 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'TM SR Queue View' as an accessible screen - manager queue of order-approval activities awaiting assignment.
- **Source slugs:** `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`

</details>

<details><summary>RBAC-086 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Order Approval detail (Attachments, Order Details, Activities, Agents Details tabs)' as accessible screen with actions Approve, Reject - Correction, Reject - Drop Order, Assign To Me, ReAssign To Queue.
- **Source slugs:** `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`

</details>

<details><summary>RBAC-087 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona explicitly names the 'Reject Order modal' and notes the conditional restriction that 'After one correction round, the Reject - Correction option is no longer offered on re-review'.
- **Source slugs:** `guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`

</details>

<details><summary>RBAC-088 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona explicitly names the 'Approve Order modal' as an accessible screen for this role.
- **Source slugs:** `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`

</details>

<details><summary>RBAC-089 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Manage Leads' as an accessible screen alongside Home/Order Approval in the restricted manager menu.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`

</details>

<details><summary>RBAC-090 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists "My Team's Leads" explicitly as an accessible screen for this Manager/Approver role.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`

</details>

<details><summary>RBAC-091 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Leads Queue' explicitly as one of the accessible screens in the manager menu (Home, Order Approval, Manage Leads, Leads Queue).
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`

</details>

<details><summary>RBAC-092 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Lead Details (Approver applet)' as accessible screen with permissions text 'Lead Owner reassignment via picker'.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`

</details>

<details><summary>RBAC-093 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** restricted_features text explicitly states this role 'Cannot access full sales/order-creation modules available to front-line agents' - a broad exclusion group covering the full-agent module set (e.g. Sales Order, Mobile Postpaid wizards).
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`, `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`, `guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`, `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`, `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`, `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`

</details>

## PERSONA-042: Retention Team (FDO Disconnection Cancellation) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-094 | SCR-199 FDO requests tab (in account summary) | Full | Cancel Disconnection FDO | Restricted to this team only (other roles cannot cancel disconnection FDOs) |

<details><summary>RBAC-094 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona permissions text: 'Cancel Disconnection FDO (restricted to this team only)', tied to the FDO requests area of the account.
- **Source slugs:** `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`

</details>

## PERSONA-043: Retail Agent (Lead Owner, reassignment target) (3 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-095 | SCR-142 My Leads list | View |  |  |
| RBAC-096 | SCR-141 Lead Details View | Edit |  |  |
| RBAC-097 |   | Full | Standard agent menu access: Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, Lead, SIM Swap, New Lead Tablet, My L |  |

<details><summary>RBAC-095 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'My Leads' as an accessible screen for this Frontline/Retail agent role.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-096 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Lead Details View' as an accessible screen for this role.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-097 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona permissions text lists the full standard agent tile/menu set this role can access, spanning multiple modules (Contacts, Sales Order, MNP Tablet, New Fixed Line Tablet, New Prepaid Tablet, SIM Swap, New Lead Tablet, New FWA Tablet, etc).
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

## PERSONA-044: Back Office / Admin (broad org-wide access) (6 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-098 | SCR-147 All Leads across Org | Full |  |  |
| RBAC-099 | SCR-141 Lead Details View | Full |  |  |
| RBAC-100 | SCR-061 Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs) | Approve | Reject, Retire on leads; Assign To Me, Send SMS, Product Recommendations, Validate, Submit actions on Lead Details |  |
| RBAC-101 |   | Full |  |  |
| RBAC-102 |   | Full |  |  |
| RBAC-103 |   | Full | Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments,  |  |

<details><summary>RBAC-098 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'All Leads across Org' as an accessible screen, indicating org-wide back-office visibility beyond a single agent's leads.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-099 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'full 3-column Lead Details layout' as accessible screen - an expanded/admin variant of the Lead Details screen.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-100 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona lists 'Order Approval' as an accessible screen and permissions text grants 'Reject, Retire on leads; Assign To Me, Send SMS, Product Recommendations, Validate, Submit actions on Lead Details'.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-101 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona explicitly lists 'IDM Management' as an accessible menu item in the admin/back-office menu ('Welcome back KARTHIKK KARTHIKK!' menu).
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-102 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona explicitly lists 'Static Data Business' as an accessible menu item in the admin/back-office menu.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

<details><summary>RBAC-103 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona's accessible_screens text lists a much larger admin/back-office menu ('Welcome back KARTHIKK KARTHIKK!') spanning modules across Assets, Trouble Tickets, Contacts, Accounts, Sales Order, MNP, Numbers, Payments, Fixed Line, FDO Requests, New FWA, etc, evidencing broad org-wide access beyond front-line agent modules.
- **Source slugs:** `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`

</details>

## PERSONA-046: Dispatcher/Back-Office WFM User (3 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-104 | SCR-110 WFM Activity Details — Admin/Technician View | Edit | Move (reassign technician) |  |
| RBAC-105 | SCR-089 Move Dialog (Technician Reassignment) | Edit | Move (reassign technician) |  |
| RBAC-106 | SCR-090 Inventory Management — Non-Serialized Inventory Transfer | Create | Add To Transfer List, Start Transfer |  |

<details><summary>RBAC-104 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_screens lists 'WFM Activity details (dispatcher view)' and accessible_actions lists 'Move (reassign technician)'; matched to WFM Activity Details screen used for dispatcher/technician activity management.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-105 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly lists 'Move dialog'; screen catalogue SCR-089 persona_access field directly names 'Dispatcher/Back-Office WFM user' as having access, and accessible_actions confirms 'Move (reassign technician)'.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

<details><summary>RBAC-106 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly lists 'Inventory Management > Non-Serialized Inventory Transfer' with accessible_actions 'Add To Transfer List, Start Transfer'; SCR-090 persona_access field directly names 'Dispatcher/Back-Office WFM user'.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`

</details>

## PERSONA-047: CSR / Desktop Agent (Vanilla channel) (8 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-107 | SCR-137 Account Summary | View |  |  |
| RBAC-108 | SCR-096 Installed Assets Grid (Account 360, FWA) | Edit | Modify, Disconnect |  |
| RBAC-109 | SCR-097 FMS CPE Bundle Configuration / Modify Screen (Equipment tab) | Edit | Modify |  |
| RBAC-110 |  GetPINPUK action (no dedicated screen matched) | Conditional | GetPINPUK |  |
| RBAC-111 | SCR-095 Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View | Edit | End Data Session |  |
| RBAC-112 |  TON initiation action (no dedicated screen matched to this persona) | Conditional | Initiate TON |  |
| RBAC-113 |  CTI Portal handoff action | Conditional | Go to CTI Portal |  |
| RBAC-114 |  OTP send action | Conditional | Send OTP |  |

<details><summary>RBAC-107 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_screens lists 'Customer Portal / Account Summary' as accessible for the Vanilla-channel CSR/Desktop Agent.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-108 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens lists 'Installed Assets grid' and accessible_actions include 'Modify, Disconnect'; SCR-096 purpose matches 'Lists active installed assets on an account with Modify/Disconnect/etc actions'.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-109 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly lists 'FMS CPE Bundle modify screen'; matched directly to SCR-097 which shares the same source_slug.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-110 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_actions lists 'GetPINPUK' as an allowed action; no specific screen in the catalogue names this action, so recorded as an action-group entry.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-111 evidence</summary>

`Inferred` · confidence: `low`

- **Evidence:** Persona accessible_actions lists 'End Data Session', an action tied to the customer's billing/usage/session state; loosely matched to the Customer Portal billing/usage screen since no more specific data-session screen exists in the catalogue.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-112 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_actions lists 'Initiate TON'; the TON Wizard (SCR-035) exists in the catalogue but has no persona_access match to this source_slug, so left unmatched per instructions rather than force-linking.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-113 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_actions lists 'Go to CTI Portal'; no distinct CTI Portal screen entry exists in the catalogue to match against.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

<details><summary>RBAC-114 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** Persona accessible_actions lists 'Send OTP'; no dedicated OTP screen exists in the catalogue to match against.
- **Source slugs:** `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`

</details>

## PERSONA-048: Fulfillment Team (ECR Details - inferred) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-115 | SCR-170 CAF & Additional Attachments step (B2B2C) | Restricted-No-Access |  | ECR Details field is fulfillment-team-only; front-line agents should not fill it |

<details><summary>RBAC-115 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona restricted_features states 'Field marked as fulfillment-team-only, implying front-line agents should not fill it', inferred from the B2B2C new postpaid tablet journey document which includes CAF/Attachments and ECR-related steps.
- **Source slugs:** `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`

</details>

## PERSONA-049: System Administrator (Product Promotions admin) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-116 | SCR-117 Product Promotions admin — More Info tab | View |  |  |
| RBAC-117 | SCR-118 Product Promotions admin — Bill Limit Mapping / Spend Limit Mapping tab | Edit | Raise/lower Agent Minimum Value thresholds |  |

<details><summary>RBAC-116 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly lists 'Product Promotions admin screen (More Info tab...)'; SCR-117 persona_access field lists 'Admin' matching this persona type.
- **Source slugs:** `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`

</details>

<details><summary>RBAC-117 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** Persona accessible_screens explicitly lists 'Bill Limit Mapping / Spend Limit Mapping applet' and permissions state 'Can raise/lower Agent Minimum Value thresholds that constrain what Sales agents can enter'; SCR-118 purpose matches exactly ('Configure Agent Min Value...') and persona_access lists 'Admin'.
- **Source slugs:** `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`

</details>

## PERSONA-050: System user SADMIN (backend/system account) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-118 | SCR-179 Migration Offer tab (Complex Asset List Applet) | Full | System-level order creation |  |
| RBAC-119 | SCR-183 Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet) | Full | System-level order creation |  |

<details><summary>RBAC-118 evidence</summary>

`Inferred` · confidence: `low`

- **Evidence:** Persona permissions state 'System-level order creation distinct from human agent-created orders', within the Pre-to-Post Autobase migration journey whose primary screens are Migration Offer tab and Base Management wizard; SADMIN account performs the automated order creation underlying this flow.
- **Source slugs:** `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`

</details>

<details><summary>RBAC-119 evidence</summary>

`Inferred` · confidence: `low`

- **Evidence:** Persona permissions state 'System-level order creation distinct from human agent-created orders'; SCR-183 is the backend bulk migration job monitoring screen from the same source document, consistent with a system/automated account driving bulk order creation.
- **Source slugs:** `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`

</details>

## PERSONA-051: Channel Manager (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-120 | SCR-061 Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs) | Approve | Approve partner-submitted tablet orders |  |
| RBAC-121 | SCR-063 Approve Order modal | Approve | Approve partner-submitted tablet orders |  |

<details><summary>RBAC-120 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona permissions state 'Order approval gate for partner-submitted tablet orders'; matched to the generic Order Approval detail screen used for approving/rejecting submitted orders, as no channel-partner-specific approval screen exists in the catalogue.
- **Source slugs:** `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`

</details>

<details><summary>RBAC-121 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona permissions state 'Order approval gate for partner-submitted tablet orders'; matched to Approve Order modal used to confirm order approvals across tablet guided journeys.
- **Source slugs:** `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`

</details>

## PERSONA-052: Offshore Retailer / Channel Partner (VSA/BSA) (3 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-122 | SCR-142 My Leads list | Restricted-No-Access |  | Visibility restricted to own orders/leads only |
| RBAC-123 | SCR-059 My Sales Orders / My Pending Approval Orders queue | Restricted-No-Access |  | Visibility restricted to own orders/leads only |
| RBAC-124 | SCR-147 All Leads across Org | Restricted-No-Access |  | Visibility restricted to own orders/leads only (explicitly excluded from org-wide lead visibility) |

<details><summary>RBAC-122 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona restricted_features states 'Visibility restricted to own orders/leads only'; matched to 'My Leads list' which by definition scopes leads to the logged-in agent/partner.
- **Source slugs:** `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`

</details>

<details><summary>RBAC-123 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona restricted_features states 'Visibility restricted to own orders/leads only'; matched to 'My Sales Orders' queue which scopes order visibility to the submitting agent/partner rather than org-wide.
- **Source slugs:** `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`

</details>

<details><summary>RBAC-124 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** Persona restricted_features explicitly states visibility is restricted to own orders/leads only, which by direct implication excludes this persona from the org-wide 'All Leads across Org' screen (persona_access: Back Office/Admin only).
- **Source slugs:** `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`

</details>

## PERSONA-056: Network Team (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-125 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona |

<details><summary>RBAC-125 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has empty accessible_screens/accessible_actions/restricted_features/permissions fields; no evidenced screen or action access exists to map
- **Source slugs:** `it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`

</details>

## PERSONA-057: Business/Strategy Team (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-126 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona |

<details><summary>RBAC-126 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has empty accessible_screens/accessible_actions/restricted_features/permissions fields; no evidenced screen or action access exists to map
- **Source slugs:** `it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`

</details>

## PERSONA-058: Agent viewing Open UI Desktop (Account 360, Care Agent) (5 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-127 | SCR-202 Account Summary (Account 360, CTI View) | View |  |  |
| RBAC-128 | SCR-203 Asset Summary (CTI View) | Conditional | Change Limit, Manage Add Ons, Upgrade Promotion, Get Due Amount, Get Usages, End Data Session |  |
| RBAC-129 | SCR-205 Communications Modal / Real Time Balance | Conditional | Send SMS, Get RTB (Real Time Balance) |  |
| RBAC-130 | SCR-206 Contact History Tab | View |  |  |
| RBAC-131 | SCR-205 Communications Modal / Real Time Balance | View |  |  |

<details><summary>RBAC-127 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens lists Account Summary as a viewable screen in the Account 360 / Care Agent CTI view
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

<details><summary>RBAC-128 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens lists Asset Summary and Asset detail cards; permissions text names asset-scoped actions (Change Limit, Manage Add Ons, Upgrade Promotion, Get Usages, End Data Session, Get Due Amount) exercised from these screens
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

<details><summary>RBAC-129 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names the Communications/Contact History modal; permissions text lists Send SMS and Get RTB as actions available from this modal context
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

<details><summary>RBAC-130 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names the Contact history sub-tab within the Communications/Contact History modal
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

<details><summary>RBAC-131 evidence</summary>

`Explicit` · confidence: `medium`

- **Evidence:** accessible_screens names further sub-tabs of the Communications/Contact History modal (Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead) not individually catalogued as separate screens; grouped here as the modal's remaining sub-tab content
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

## PERSONA-059: Complaints Team (Mobile and Fixed) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-132 | SCR-210 Ticket Homepage | Edit | Field-level write access to fields designated for the Complaints Team; authority to raise tickets on the customer's behalf |  |

<details><summary>RBAC-132 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names Ticket Homepage; permissions grant field-level write access to Complaints-Team-designated fields plus authority to raise tickets on the customer's behalf
- **Source slugs:** `tt-hashtags-and-actual-issue-8d8ccaa5`, `vodafone-process-overview-290626-ec-1ed338b9`

</details>

## PERSONA-060: Back Office (generic activity channel) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-133 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona |

<details><summary>RBAC-133 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has empty accessible_screens/accessible_actions/restricted_features/permissions fields; source document only references Back Office as an activity channel label, no access detail evidenced
- **Source slugs:** `open-ui-desktop-agent-360-cti-view-8b495725`

</details>

## PERSONA-061: Product Team (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-134 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona |

<details><summary>RBAC-134 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has empty accessible_screens/accessible_actions/restricted_features/permissions fields; no evidenced screen or action access exists to map
- **Source slugs:** `vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`

</details>

## PERSONA-062: Solution Architect / Business Owner / IT Owner / Track Lead / Test Manager / Delivery Manager (Governance) (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-135 |   | Restricted-No-Access |  | No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona |

<details><summary>RBAC-135 evidence</summary>

`Assumed` · confidence: `low`

- **Evidence:** Persona record has empty accessible_screens/accessible_actions/restricted_features/permissions fields; no evidenced screen or action access exists to map
- **Source slugs:** `vfq-fibre-brsd-v1-2-068eebe3`

</details>

## PERSONA-063: Agent (in DXP) (6 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-136 | SCR-021 Customer 360 | View | Retrieves aggregated customer data |  |
| RBAC-137 | SCR-021 Customer 360 | Full | Initiates and submits modify orders; changes customer plan (Base<->Park) |  |
| RBAC-138 | SCR-021 Customer 360 | View | Retrieves aggregated customer data |  |
| RBAC-139 | SCR-021 Customer 360 | View | Retrieves aggregated customer data |  |
| RBAC-140 | SCR-021 Customer 360 | View | Retrieves aggregated customer data |  |
| RBAC-141 | SCR-021 Customer 360 | View | Retrieves aggregated customer data |  |

<details><summary>RBAC-136 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names Customer 360 Overview section, matched to the Customer 360 dashboard; permissions include retrieving aggregated customer data
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-137 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names the Order section of Customer 360; permissions text explicitly grants initiating/submitting modify orders and changing customer plan (Base<->Park) from this section
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-138 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** accessible_screens names Trouble Tickets section within Customer 360, part of the aggregated customer data the persona can retrieve
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-139 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** accessible_screens names Installed Assets section within Customer 360, part of the aggregated customer data the persona can retrieve
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-140 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** accessible_screens names Billing Profile section within Customer 360, part of the aggregated customer data the persona can retrieve
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

<details><summary>RBAC-141 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** accessible_screens names Credit Risk section within Customer 360, part of the aggregated customer data the persona can retrieve
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

## PERSONA-064: Assisted Care Agent (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-142 | SCR-021 Customer 360 | View | Search and retrieve aggregated customer data across multiple sources |  |

<details><summary>RBAC-142 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens lists the Customer 360 UI sections (Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk); permissions text grants search/retrieve of aggregated customer data across multiple sources, with no order-modification authority evidenced (unlike PERSONA-063)
- **Source slugs:** `vfq-stack-modernization-br-28jun-75f28727`

</details>

## PERSONA-065: MNP Team (1 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-143 | SCR-210 Ticket Homepage | Approve | Manual validation authority over MNP port-out ticket activities |  |

<details><summary>RBAC-143 evidence</summary>

`Inferred` · confidence: `medium`

- **Evidence:** permissions text grants manual validation authority over MNP port-out ticket activities; no specific screen named in accessible_screens, so mapped as an action-group entry against the Ticket Homepage where ticket activities are managed
- **Source slugs:** `vodafone-process-overview-290626-ec-1ed338b9`

</details>

## PERSONA-066: FL Agents (Front Line Agents) (2 entries)

| ID | Screen | Permission | Allowed | Restricted |
|---|---|---|---|---|
| RBAC-144 | SCR-210 Ticket Homepage | Conditional | Field-level write access to certain Ticket Homepage fields | Cannot fill fields designated "Filled By Complaints Team" |
| RBAC-145 | SCR-213 Open UI Tickets Fields (per-issue-type template) | Edit | Field-level write access to Open UI Tickets Fields templates | Cannot fill fields designated "Filled By Complaints Team" |

<details><summary>RBAC-144 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens names Ticket Homepage; permissions grant field-level write access to fields differentiated from Complaints Team fields, and restricted_features explicitly blocks writing to fields designated "Filled By Complaints Team"
- **Source slugs:** `vodafone-process-overview-290626-ec-1ed338b9`

</details>

<details><summary>RBAC-145 evidence</summary>

`Explicit` · confidence: `high`

- **Evidence:** accessible_screens explicitly names Open UI Tickets Fields (templates) as a second accessible screen distinct from Ticket Homepage, with the same field-level write access and Complaints-Team-field restriction applying
- **Source slugs:** `vodafone-process-overview-290626-ec-1ed338b9`

</details>
