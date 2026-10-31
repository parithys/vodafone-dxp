# Journey milestones - Mobile Postpaid Activation (MOB_POST_ACT_CBU_001)

A toast and a progress indicator each time a milestone is reached (BRSD v0.4, MPAR_001_QPC_09 "Milestone Saving", QPC_10 amendments).
English only: the app has no i18n layer, so the copy lives in one place, `src/modules/new-connection/milestones.ts`, keyed by milestone id.

| # | Milestone (id) | Reached when | Wired in |
|---|---|---|---|
| 1 | Customer verified (`identified`) | MOI result present, eligibility judged for this ID with no hard or soft stop (blacklist, collections, expired ID, failed MOI all block) | `evidence` in `milestones.ts`, from `values.contact` / `values.eligibility` |
| 2 | Billing profile ready (`billing`) | Existing profile selected, or a new one created with its profile name and bill cycle (Postpaid only). Collected before Recommended Offers, so it can be reached before a product is chosen | `values.billingAccount` (set by `BillingAccountAutoResolver`) |
| 3 | Cart checked out (`checkout`) | Plan, number, SIM and checkout totals complete AND the agent has moved past the Checkout step. Going Back to look keeps it; changing the cart drops it, and Continue past Checkout reaches it again | `values.productId/msisdn/simType/checkoutTotals`, position via `pastStep('checkout')` |
| 4 | CAF signed (`caf`) | CAF type set and signature captured | `values.caf` |
| 5 | Order submitted (`submitted`) | Event-driven: `onSubmit` of `NewConnectionWizard` succeeded after payment. Reached and logged, but no toast (`noToast`): the Order Submitted page already says it, so a toast would only repeat it there. A failed payment/submit never gets here | `reachMilestoneOnEvent` in `NewConnectionWizard.tsx` |

Billing profile ready is the one milestone whose toast is held: it is recorded when reached (the progress strip shows it) but neither the toast nor its flag in the Summary shows until Recommended Offers (`product`) loads (`announceAt`); once shown, the flag stays on later steps.

## How it works

- `src/engines/milestoneEngine.ts` (pure): `reconcileMilestones` and `reachOnEvent`.
  - **Once:** a reached milestone is never reached again (no repeat toast).
  - **Ordered:** reached only when every earlier one is; an out-of-order completion is a `console.warn`, not a toast.
  - **Amendments (QPC_10):** the evidence each milestone was reached on is stored. If it changes or goes (new customer, different profile, changed cart), that milestone and every later one is invalidated and re-announced when reached again.
  - **Restore:** `silent` re-establishes what a resumed draft already shows without announcing it.
- `src/components/patterns/wizard/useJourneyMilestones.ts`: runs the engine on every change of the draft values/position; the first evaluation after mount is silent. Toasts go through the existing `notificationStore` (success, keyed `milestone:<id>`, `autoDismissMs: 4000`, dismissible, polite `role="status"`). Each event is logged as one `console.info('[milestone]', {...})` line: the app has no logging/analytics layer.
- State is stored with the journey draft as `values.milestones`, so it persists with the draft (sessionStorage) and a saved draft order.
- Progress is shown in the Summary panel: the row of a step that reached its milestone (`stepKey`: Customer Identification, Billing Profile, Checkout, CAF & Signature) carries a flag in place of the tick. Order Submitted has no summary row. `GuidedActivationWizard` takes the milestones as the `milestones` prop; no flags in the customer pop-up or New Home Connection.
- Applies while the product is Postpaid or not yet chosen (`postpaidMilestonesApply`).

## Assumptions / not done

- Toast wording is the default copy from the brief; Arabic is not implemented (no i18n layer).
- Milestone 1 fires at Customer Identification, before a product is chosen; if the agent then picks another product, the milestones stop applying.
- Existing customers with an active billing profile: milestones 1 and 2 are still separate (the profile is auto-selected, so 2 follows 1 at once).
- A draft saved before this feature has no milestone state: resuming it re-announces what its data already shows once.
- Tests: `tests/milestones.test.mjs`. The toast container's markup is checked from source (no DOM test environment).
