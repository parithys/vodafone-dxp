# MPA-SCR-13 — Billing Profile Setup Drawer

Component: `BillingProfileSetupDrawer` (`src/components/patterns/BillingAccountStep.tsx:153-203`), `Drawer` primitive.

## 13.1 Purpose
Collect the three fields (Profile Name, Bill Media, Billing Schedule) needed to finalise a newly-created billing account, in a focused sub-form separate from the larger create-new form.

## 13.2 Entry / exit conditions
- **Entry:** click MPA-BTN-03 "+ Add" inside the Billing Profile step's create-new form (only reachable via Path B — creating a new billing account).
- **Exit:** "Save" (validates, patches parent form state, closes) — no explicit Cancel/close-without-saving button documented beyond the Drawer's own generic close affordance.

## 13.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-13-ST01 | Open, empty | Click "+ Add" for the first time on a fresh create-new form |
| MPA-SCR-13-ST02 | Open, prefilled from a prior save | Reopen after already saving once (fields retain their last-saved values) |
| MPA-SCR-13-ST03 | Save disabled (empty name) | Clear Billing Profile Name |

## 13.4 UI elements and content
- **Drawer title (verbatim):** "Billing Profile Setup"
- Three-field vertical form (`space-y-4`), then a Save button

## 13.5 Field specifications
| ID | Label | Type | Mandatory | Default | Validation |
|---|---|---|---|---|---|
| MPA-FLD-13-001 | Billing Profile Name | Text input | Yes | `value.profileName ?? ''` | Save disabled while `profileName.trim()` is empty |
| MPA-FLD-13-002 | Bill Media | Select | No (has default) | `value.billMedia ?? 'Email'` | Options: Email, Paper Bill, SMS |
| MPA-FLD-13-003 | Billing Schedule | Select | No (has default) | `value.billingSchedule ?? 'Immediate'` | Options: Immediate, Next Cycle |

Placeholder for Profile Name (verbatim): "e.g. My Account"

## 13.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-13-001 | "Save" | Primary | `profileName.trim()` is non-empty | Calls `onSave({ profileName: trimmed, billMedia, billingSchedule })`, then closes the drawer |

## 13.7 User interactions
Standard form fill; Save is the only action that commits — there is no separate "Cancel" button distinct from the Drawer's own dismiss affordance (closing without Save discards the three local `useState` values, since they aren't lifted until Save fires).

## 13.8 Business rules
None specific — values feed into MPA-SCR-03's `isBillingAccountValid()` gate (the parent step's Continue is blocked until `profileName` is set via this drawer at least once).

## 13.9 Conditional display rules
Only reachable when creating a new billing account (Path B); never shown when selecting an existing account (Path A).

## 13.10 Validation and error handling
Save-button disablement is the only validation surfaced (no separate inline error message for an empty Profile Name — the button simply stays disabled).

## 13.11 Integration trigger points
None — purely local state, patched into the parent step's in-memory form values on Save.

## 13.12 Navigation behaviour
None — non-navigating overlay.

## 13.13 Related edge cases
MPA-SCN-056 — reopening the drawer after a prior save shows the previously-saved values (state is preserved on the parent, re-hydrated into the drawer's local `useState` on each open via its own initializer reading `value.profileName` etc.).

## 13.14 Persona-specific behaviour
None found.

## 13.15 Accessibility
To be completed live in Phase 12.

## 13.16 Source references
- `BillingAccountStep.tsx:153-203` (full drawer component)
- `BillingAccountStep.tsx:135-144` (BILL_MEDIA_OPTIONS, BILLING_SCHEDULE_OPTIONS constants)
