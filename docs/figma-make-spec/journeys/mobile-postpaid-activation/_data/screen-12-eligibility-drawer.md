# MPA-SCR-12 — Eligibility Checks Drawer

Component: `EligibilityChecksLink` + `Drawer` (`src/components/domain/EligibilityGateStep.tsx:148-174`), `Drawer` primitive (`src/components/primitives/Drawer.tsx`).

## 12.1 Purpose
Let the agent review the full 7-check eligibility report (including checks that passed silently) at any time after it has run, since a clean pass renders nothing inline on the Contact step.

## 12.2 Entry / exit conditions
- **Entry:** click MPA-BTN-01-002 ("View eligibility checks"), visible only once `eligibility` is set.
- **Exit:** close the drawer (returns to Contact step underneath, unaffected).

## 12.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-12-ST01 | Open, clean pass | After CUST-1001 (QID `28456701234`) resolves — shows all 7 checks as passed + the non-HRN advisory row |
| MPA-SCR-12-ST02 | Open, mixed outcomes | After CUST-9001 (under-18) resolves — shows the Age Check as approval-routing alongside the other 6 passing |

## 12.4 UI elements and content
- **Drawer title (verbatim):** "Eligibility Checks"
- **Trigger link text (verbatim):** "View eligibility checks" (underlined, accent color, caption size)
- **Body:** `EligibilityChecksList` component rendering `buildEligibilityRows()` output — one row per check (all 7, regardless of pass/fail) plus the HRN advisory row (non-HRN wording for every reachable customer in this journey, since the one HRN fixture is unreachable via this journey's Contact step)
- Each row shows: check label, outcome badge (Passed/Failed/Blocked/Approval required/For information — see MPA-SCR-01's badge table), and the check's message text

## 12.5 Field specifications
None — read-only display surface.

## 12.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-12-001 | Drawer close (×) | Tertiary | Always | Closes drawer, returns focus to the triggering link (standard Drawer behavior, not independently re-verified) |

## 12.7 User interactions
Opens on click of the footer-left link; does not re-run the eligibility evaluation — reuses the cached `EligibilityResult` already computed on Contact.

## 12.8 Business rules
Same rule set as MPA-SCR-01 (§1.8) — this is purely a display of that same result.

## 12.9 Conditional display rules
Drawer content is static once `eligibility` is set; no further conditional branching beyond what's documented for the Contact step's own panel logic.

## 12.10 Validation and error handling
None.

## 12.11 Integration trigger points
None new — reuses MPA-INT-002 (eligibility evaluation)'s already-computed result; no re-fetch occurs on open.

## 12.12 Navigation behaviour
None — this is a non-navigating overlay.

## 12.13 Related edge cases
None beyond MPA-SCR-01's own eligibility scenarios (MPA-SCN-001 through MPA-SCN-007) — this drawer is a pure view of those same outcomes.

## 12.14 Persona-specific behaviour
None found.

## 12.15 Accessibility
To be completed live in Phase 12.

## 12.16 Source references
- `EligibilityGateStep.tsx:148-174` (EligibilityChecksLink)
- `EligibilityGateStep.tsx:89-111` (buildEligibilityRows)
