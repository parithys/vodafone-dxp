# Source layout and naming

```
src/
  auth/            sign-in, staff-ID -> role map, session reset
  capabilities/    the Capability Library: every reusable capability, one implementation each (see capabilities/README.md)
  components/
    primitives/    design-system controls (Button, Input, Select, Modal ...); no business logic
    domain/        controls that know about VFQ data (MsisdnPicker, QidInput, EligibilityRows ...)
    patterns/      multi-step building blocks; patterns/wizard/ is the guided-journey shell and shared steps
  data/            synthetic values + reference catalogues (see data/README.md)
  engines/         non-UI logic and data access (mockDataEngine, configEngine, activityEngine ...)
  hooks/           app-wide hooks
  lib/             tiny pure helpers (values.ts)
  modules/         one folder per product line / journey; screens/index.tsx registers its screens
    new-connection/  the New Postpaid Activation journey: wizard at the root, steps/ and hooks/ beside it
  navigation/      sidebar, breadcrumbs, global search, persona switcher
  stores/          zustand stores (customerContextStore holds the viewed customer and the journey customer)
  types/           shared types
  workspace/       pages that are not product-line journeys (customer360/, tickets, tasks, orders ...)
    customer360/     layout + header; sections/ (Retail tab pages, topic sections); telesales/ (Telesales layout)
```

## Naming

- **Components**: `PascalCase.tsx`, one main component per file (`CustomerTypeStep.tsx`).
- **Everything else** (models, helpers, hooks, step-list builders): `camelCase.ts(x)` - `customerTypeModel.ts`,
  `useJourneyCustomerLock.ts`, `buildMnpSteps` in `mnpSteps.tsx`.
- A file that exports components should not also export constants or functions (fast refresh); put those in a
  `*Model.ts` / `*Shared.ts` next to it.
- Tokens: colours, sizes and field state colours come from `tokens.css`; no hex values in components. This is enforced
  (`tests/ui.test.mjs`): translucent and mixed colours are named tokens, never `white/70`, `bg-black/40` or an inline
  `color-mix()` - use `text-on-dark-2`, `bg-on-dark-fill-2`, `border-on-dark-line-2`, `bg-scrim`, `bg-paper`,
  `bg-tone-success` / `-soft` (and `danger`, `warn`, `info`, `accent`, `blue`). Stacking and motion come from `--z-*` and
  `--motion-*` (`z-[var(--z-overlay)]`, `duration-[var(--motion-fast)]`); Tailwind's spacing (`p-4`) and font-weight
  (`font-semibold`) utilities are bound to `--space-unit` and `--fw-*`, so they are token-driven too.
- Shared building blocks: `.card` / `.card-surface` (the card shell), `lib/format.ts` (QAR, dates, sizes),
  `lib/statusTone.ts` (status text -> colour), `IconButton`, `CloseButton`. Reach for these before writing a local copy.
- Synthetic content is marked with `SYNTHETIC_CLASS` / `Synthetic<T>` (`data/synthetic/syntheticMarker.ts`).

## Styling architecture - utilities, components, tokens

```
design tokens (src/tokens.css; tests/tokens.test.mjs checks them)
      -> reusable components (components/primitives, capabilities/)
      -> Tailwind utilities (layout)
      -> screens / journeys (compose components + utilities)
```

**The rule:** if a style says *how an element is laid out*, use Tailwind utilities. If it says *what a reusable UI element is*,
use (or add to) a component. Do not hide readable utilities behind a semantic class (`.customer-row`), and do not copy a long
utility string that recreates a component.

| You are styling | Use |
|---|---|
| flex / grid / gap / margin / padding / width / position / overflow / responsive breakpoints | utilities in the screen |
| a button | `<Button variant="primary \| secondary \| tertiary \| destructive" size="sm \| md \| lg">` - never a hand-rolled `<button>` that looks like one |
| a text link that acts | `<Button variant="tertiary">`; a navigation link uses `text-link` (teal) - **never red** |
| a field | `Input`, `Select`, `Textarea`, `SearchField`, `PhoneNumberInput` (states: default, hover, focus, error, disabled; a filled field keeps the same border) |
| a status chip | `Badge` (`StatusPill` for ticket/order statuses); toasts via `pushToast(kind, ...)` - success / error / warning / info |
| a card you can click | the card hover string in `capabilities/SelectableCard/offerCardParts.tsx` (`CARD_IDLE`, `CARD_SELECTED`) |
| a dialog | `Modal` (short confirmation) or `Drawer` (forms); close with `CloseButton`; behaviour from `useDialogBehaviour` |
| a table / tabs / pager | `DataTable`, `GridTable`; `Tabs`, `PlanTabStrip` (check these before writing a new one) |

**Values come from tokens, not literals.** Radius: `--radius-sm` 8, `--radius-button` 12 (buttons, fields), `--radius-card` 16,
`--radius-card-lg` 20, `--radius-pill`. Type sizes: `--fs-*` (including `--fs-stat`, `--fs-xs`). Colour, shadow and gradient:
`--accent`, `--accent-gradient` (+ `-hover`), `--link`, `--field-*`, `--icon-tile-*`. No hex colours and no `rounded-lg/xl/2xl` in
components; an arbitrary value (`w-[420px]`) is for one-off sizing only, and a value used a second time becomes a token.

**Before adding anything,** search for it: `grep` the component name, check `capabilities/registry.json` and the
`reference/outputs/UI_Component_Route_Inventory_Reference.xlsx` inventory. Reuse or extend; do not add `ButtonV2`.
