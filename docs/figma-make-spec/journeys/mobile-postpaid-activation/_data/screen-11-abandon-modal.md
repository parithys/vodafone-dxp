# MPA-SCR-11 — Abandon Confirmation Modal

Component: `Modal` (`src/components/primitives/Modal.tsx`) instance inside `GuidedActivationWizard.tsx:707-725`.

## 11.1 Purpose
Confirm an irreversible, destructive action (discarding all entered data and deleting any persisted draft) before executing it.

## 11.2 Entry / exit conditions
- **Entry:** click MPA-BTN-00-005 (Abandon Order), available on every step from Contact through CAF & Signature (hidden from Payment onward).
- **Exit:** "Keep working" (closes, no side effect) or "Abandon Order" (confirms, executes abandonment, navigates away).

## 11.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-11-ST01 | Modal open | Click Abandon Order from any pre-Payment step |

## 11.4 UI elements and content
- Modal component, not a Drawer — per the codebase's own convention (comment at `GuidedActivationWizard.tsx:702-705`): Modal is "reserved for exactly this short confirmation," Drawer used for everything else in this journey (Eligibility Checks, Billing Profile Setup, Signature Pad, Plan Details).
- **Title (verbatim):** "Abandon this order?"
- **Body text (verbatim):** "Everything entered for this customer will be discarded and the saved draft deleted. This cannot be undone."

## 11.5 Field specifications
None — this surface has no input fields.

## 11.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-11-001 | "Keep working" | Ghost/tertiary | Always | Closes the modal, no side effect (`setAbandonOpen(false)`) |
| MPA-BTN-11-002 | "Abandon Order" | Primary/destructive | Always | Executes `abandonOrder()`: if `draftOrderId` exists, deletes that order record via `mockDataEngine.remove('orders', draftOrderId)`; clears in-memory draft; closes modal; calls `onAbandon()` → navigates to `POST_EXIT_DESTINATION` (`/`) |

## 11.7 User interactions
Standard modal focus trap expected (not yet confirmed live — see §11.15). Click-outside/Escape behavior depends on `Modal.tsx`'s own implementation, not read in this pass.

## 11.8 Business rules
None specific to this surface.

## 11.9 Conditional display rules
Modal visibility is a pure boolean (`abandonOpen` state), toggled only by MPA-BTN-00-005 and this surface's own two buttons.

## 11.10 Validation and error handling
None — no inputs to validate.

## 11.11 Integration trigger points
MPA-INT-022 — Draft order deletion (`mockDataEngine.remove('orders', draftOrderId)`). **Trigger point only — not a live integration in the current implementation.** Fires only if a draft was actually persisted (i.e., Save & Exit had been used at least once before Abandon); if the agent never saved, there is nothing to delete and this call is skipped implicitly (no `draftOrderId` to pass).

## 11.12 Navigation behaviour
MPA-NAV-023 — On confirm, navigates to `POST_EXIT_DESTINATION` (`'/'`), the same destination as Save & Exit — a named constant in `NewPostpaidWizard.tsx:31-38` explicitly flagged in a code comment as "Placeholder pending business confirmation... Do not assume Agent 360 as the destination."

## 11.13 Related edge cases
MPA-SCN-054 — Abandoning a journey that was never saved (no draft to delete, only in-memory state discarded). MPA-SCN-055 — Abandoning a journey with a persisted draft (draft order row deleted).

## 11.14 Persona-specific behaviour
None found.

## 11.15 Accessibility
To be completed live in Phase 12.

## 11.16 Source references
- `GuidedActivationWizard.tsx:473-478` (abandonOrder logic)
- `GuidedActivationWizard.tsx:700-725` (Modal markup, exact copy)
- `GuidedActivationWizard.tsx:667` (visibility condition, hideAbandonFrom)
