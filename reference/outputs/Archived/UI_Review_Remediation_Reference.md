# UI review and remediation - 2026-10-07

Scope: the whole app, as a single standalone Vite/React app (not a monorepo). AI and Explainability layers excluded.
Method: 8 read-only audit passes (design, layout, interaction, data states, accessibility, production readiness,
content, capability consistency), root causes triaged, fixes applied in batches, each checked with `tsc -b`,
`oxlint`, `npm run build` and a browser smoke test of 14 routes.

Not done as the skill specifies: no checkpoint branch or per-batch commits, because the sandbox blocks writes to
`.git`. A copy of `src/` and `public/` from before the run is at `$TMPDIR/vfq-backup`. Commit manually.

## Fixed

| Area | Change |
|---|---|
| Robustness | `ErrorBoundary` resets on route change and wraps the whole app (`main.tsx`); "Back to home" link on the fallback |
| Robustness | Customer 360, Task detail, Cross-sell, Customer search effects: cancel on unmount/param change, `.catch` |
| Robustness | `mockDataEngine`: a missing/bad seed file now fails loudly, failed seed retries, `list/get` wait for the seed |
| Robustness | Storage reads/writes guarded (customer context store, Customer 360 rail) |
| Lint | `rules-of-hooks` error in `DemoFaultPanel` (hook after early return); redundant `Boolean()` cast |
| Accessibility | New `useDialogBehaviour`: Modal and Drawer move focus in, trap Tab, restore focus, Escape closes top layer only; Select/PhoneNumberInput Escape no longer closes the dialog behind them |
| Accessibility | Dialog close buttons: `type`, hit area, focus ring; labelled date input; arrow-key/roving-tabindex plan tabs; focus indicator on 4 bare inputs/selects |
| Accessibility | `--muted` #757575 -> #6b6b6b and `--success` #388e3c -> #2e7d32 (were below 4.5:1 on the page background) |
| Production | Route-level code splitting: initial bundle 1,383 kB -> 445 kB (workspaces and journeys load on demand) |
| Production | `index.html` title, description, theme colour; unused deps `idb`, `react-hook-form` removed; `VITE_SHOW_DEMO` flag (`.env.example`) |
| Content | Currency prefix unified to `QAR` everywhere (checkout, order complete, penalties, rules); `formatQar` single signature |
| Content | Passport specimen no longer renders lorem ipsum; Customer Qualification step uses the shared step-label constant |
| Content | Landing-page demo values (avg wait, tile pills) carry a "Demo value" tooltip |
| Layout | Summary panel height no longer clipped; landing KPI grid/hero/search hint responsive; breadcrumbs wrap; vertical tabs stack on narrow widths; metric cards grow instead of overflowing |
| Design | `--radius-card-lg`, `--shadow-icon-tile` tokens replace literals; scanner frames use the card shadow token |
| Docs | `src/README.md`, `CLAUDE.md` describe the Capability Library and build flags |

## Residual - needs a human or a larger change

1. **Accent text on the tinted page background**: `#e60000` on `#f1f4fa` is 4.37:1 (AA needs 4.5). Brand colour; decide whether to darken text uses or lighten the page.
2. **CAF terms placeholder** ("Sample text - replace with approved wording", `CafTerms.tsx`): needs approved legal copy before release.
3. **Status colour maps disagree** between Retail 360 and Telesales 360 (`pillFor` vs `toneFor`, plus two private maps): needs one product-approved mapping.
4. **Duplicate chrome**: `C360Kit` `Pill`/`SearchBox`/`UnderlineTabs` and 5 raw Telesales search inputs duplicate `Badge`, `SearchField`, `Tabs`; ~6 hand-rolled accent buttons and the Telesales pagers miss the new button styling. Mechanical but touches ~25 files.
5. **Seven QAR formatters** remain besides `formatQar` (different locales/decimals); consolidate in one pass.
6. **Mixed label case** (about 44 sentence-case labels in a Title Case app) and step labels typed inline in 6 journeys (`Offers`, `Add-ons`, ...): needs a naming decision.
7. **Responsive grids use viewport breakpoints** in 26 files although the real content width is much narrower (sidebar + summary panel); convert to container queries. Customer 360 icon rail and the top header strip also need small-viewport work.
8. **Self-host the Figtree font** (index.html loads it from Google Fonts - blocks first paint offline/behind a proxy).
9. **Scanner simulators and specimen cards ship by default** (`VITE_SHOW_DEMO` defaults on). Set it to `false` for a real production build; the scan flow then needs a real reader.
10. **`/:moduleSlug` QA catalogue** (213-screen built/not-built list) is reachable by every signed-in user.
11. oxlint warnings remain (41 `only-export-components`, 21 `set-state-in-effect`, 7 `exhaustive-deps`) - none are errors.
12. **`src/capabilities/` is untracked in git** (`?? src/capabilities/`): commit it with the rest or a clean checkout cannot build.
