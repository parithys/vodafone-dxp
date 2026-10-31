# `src/data` — the data layer

Everything the app shows that is **not read from the mock records** lives here, clearly marked.
(The mock *records* themselves stay in `public/mock-data/*.json`, served through
`engines/mockDataEngine`; config stays in `public/config/*.json` via `engines/configEngine`.)

| Folder | What it is | Rule |
|---|---|---|
| `synthetic/` | Invented values and simulators: Customer 360 demo values (`customer360Demo.ts`), sample ID cards and barcode numbers (`idScanSamples.ts`), login-page figures (`loginMetrics.ts`) | Shown to the user ⇒ must be marked synthetic (see below) |
| `reference/` | Catalogues and lookup rules for a journey that the source documents never enumerated (`ticketReferenceData.ts`) | Plain constants + the builders that use them |

## The synthetic marker — `synthetic/syntheticMarker.ts`

- `SHOW_DEMO_CONTENT` — master switch. `false` hides every marked element and makes demo values read `-`.
- `Synthetic<T>` / `synthetic(v)` — a value carrying `isSynthetic: true`.
- `SyntheticValue` (`SyntheticValue.tsx`) — renders a `Synthetic` value in the violet marker (`.demo-only` in `index.css`).
- `SYNTHETIC_CLASS` — put this on any other synthetic element (simulators, previews, "Fetched from…" notes).

Do not write the class name by hand and do not colour synthetic content any other way.
