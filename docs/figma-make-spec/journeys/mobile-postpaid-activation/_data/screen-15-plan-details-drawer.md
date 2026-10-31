# MPA-SCR-15 — Plan Details Drawer

Component: `Drawer` instance inside `PostpaidPlanAddonsStep.tsx:830-870`.

## 15.1 Purpose
Show the full fact sheet for one catalogue plan (monthly charge, data/voice/speed allowances, commitment term, product code, benefits) without leaving the Plan & Add-ons step or changing the current selection.

## 15.2 Entry / exit conditions
- **Entry:** click the chevron/details button on any plan card (separate from the card's own selection control, deliberately — clicking the chevron must not select the plan, per the component's own comment: "a DIV with a label+radio and a separate details button... to prevent selection on chevron click").
- **Exit:** close the drawer; the plan being viewed (`detailPlan`) is independent of the plan actually selected (`selectedProductId`) — viewing details never changes selection.

## 15.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-15-ST01 | Open, plan with benefits | View details for PROD-104 "Postpaid Red 350 Promotion" (has 2 benefits) |
| MPA-SCR-15-ST02 | Open, plan with no benefits array | View details for a plan lacking `benefits` (if any exists — verify against `products.json` in Phase 13) |

## 15.4 UI elements and content
- **Drawer title:** the plan's own name (`detailPlan?.name`), falling back to "Plan details" if none
- **`<dl>` definition list**, six rows, each `label ↔ value`:
  1. Monthly charge — `QAR {mrcQAR}/mo`
  2. Data — `{dataAllowanceGB} GB` or `Unlimited` if `dataAllowanceGB` is falsy
  3. Voice — `{minutesAllowance}`
  4. Speed — `{speedTier}`
  5. Commitment — `{commitmentMonths} months` or `No commitment`
  6. Product code — `{productId}`
- **Benefits section** (only if `benefits.length > 0`, rendered separately below the `<dl>`, not inside it — per a 2026-09-28 code comment explaining benefits are a list, not a label/value pair): heading "Included benefits", then a `<ul>` with a checkmark icon per item

## 15.5 Field specifications
None — entirely read-only display, no inputs.

## 15.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-15-001 | Drawer close | Tertiary | Always | Closes (`setDetailPlan(null)`) |
| MPA-BTN-15-002 | Chevron/details trigger (on each plan card, MPA-SCR-04) | Tertiary | Always, one per visible plan card | Opens this drawer for that plan (`setDetailPlan(plan)`) — documented here for completeness; visually lives on MPA-SCR-04 |

## 15.7 User interactions
Read-only; no interaction beyond open/close.

## 15.8 Business rules
None specific — a pure formatted read of the same `products.json` catalogue fields the plan card itself already reads.

## 15.9 Conditional display rules
Benefits section renders only if the plan has 1+ entries in its `benefits` array; otherwise the `<dl>` is the entire drawer content.

## 15.10 Validation and error handling
None — no inputs.

## 15.11 Integration trigger points
None — uses the same in-memory `products` list already fetched for the Plan & Add-ons step (no separate fetch on open).

## 15.12 Navigation behaviour
Non-navigating overlay; closing returns to MPA-SCR-04 with selection state unchanged.

## 15.13 Related edge cases
None beyond the general plan catalogue (MPA-SCN entries already covering MPA-SCR-04).

## 15.14 Persona-specific behaviour
None found.

## 15.15 Accessibility
To be completed live in Phase 12.

## 15.16 Source references
- `PostpaidPlanAddonsStep.tsx:830-870` (full drawer markup)
- `PostpaidPlanAddonsStep.tsx:444-571` (plan card, chevron trigger separate from selection control)
