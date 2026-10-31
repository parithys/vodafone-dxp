# Phase 0 — Reconnaissance and Tooling

Journey: Mobile Postpaid Activation (MPA)
Date: 2026-09-29

## Document control
- Git branch: `audit-remediation/2026-08-24-1305`
- Git commit: `73c1fbb208b61acb983347c55f5bd713d89758d3`
- Repo root for this journey: `vfq-dxp-app/` (self-contained; see project CLAUDE.md)

## Stack
- Framework: React 19 + TypeScript, Vite 8 dev server (`npm run dev`, port 5173)
- Router: react-router-dom v7
- State: Zustand (`entityStore` for mock-collection CRUD, `workflowStore` for in-progress wizard draft state, sessionStorage-persisted)
- Forms/validation: no external form library — hand-rolled `isValid`/validator functions per step
- Mock/backend simulation: `src/engines/mockDataEngine.ts`, seeded from 87 JSON files under `public/mock-data/`, 200–600ms simulated latency per call, in-memory only (no IndexedDB despite `idb` being a dependency elsewhere)
- i18n: **none**. `index.html` declares `lang="en"` only; no i18next/react-intl. The "Notification Language" field (English/Arabic/Hindi/Malayalam/Filipino) is a customer-preference **content field**, not an app-locale switch. `CafSignatureCapture.tsx` hardcodes one bilingual (EN/AR) CAF header string as static copy — not a locale system. No RTL behaviour exists in the app shell.
- Component library: hand-built primitives under `src/components/primitives/`, no third-party UI kit

## How to reach each scenario
- No scenario switcher, debug panel, or test-mode toggle exists anywhere in the app.
- Every scenario (eligibility outcome, blacklist type, line-cap state, HRN flag, etc.) is driven purely by which seeded customer/identity-document record the agent looks up during the Contact step. Reproduction = enter/scan the correct magic ID number (catalogued in Phase 1/2 data).
- Confirmed directly against `public/mock-data/identity-documents.json` (not merely reported secondhand):

  | Customer | documentType | documentNumber | expiryDate |
  |---|---|---|---|
  | CUST-1001 Ahmed Al-Sulaiti | QID | 28456701234 | 2029-11-30 |
  | CUST-1002 Bimal Thapa | Passport | P0998812 | 2029-11-30 |
  | CUST-1003 Fatima Al-Kuwari | QID | 27798765432 | 2029-11-30 |
  | CUST-1004 Mohammed Al-Emadi | QID | 29011122233 | 2029-11-30 |
  | CUST-1005 Khalid Al-Mazrouei | GCC ID | 784202312345678 | 2029-11-30 |
  | CUST-1006 Sophie Laurent | Diplomatic ID | DIP-QA-004521 | **2025-08-31 (expired)** |
  | CUST-1007 Henrik Lindqvist | Diplomatic ID | DIP-QA-004977 | 2030-04-30 |
  | CUST-2001 Layla Hassan | Other ID | RES-7788221 | 2029-11-30 |
  | CUST-9001 QA Test User | QID | P1234567 | 2029-11-30 |

  Confirmed directly against `public/mock-data/customers.json`: CUST-1001 Qatari/dob 1985-03-12; CUST-1002 Nepalese/hrnAdvancePaymentRequired=true; CUST-1004 blacklisted=true/collections; CUST-1006 blacklisted=true/security; CUST-9001 dob 2010-05-20 (age 16, under-18 fixture).

  **Constraint discovered:** this journey's Contact step passes `allowedIdTypes={['QID','Diplomatic ID']}` and `unavailableIdTypes={['Passport','GCC ID']}` (greyed out, unselectable). CUST-1002 (Passport/HRN fixture) and CUST-1005 (GCC ID/line-cap fixture) are therefore **not reachable through this journey's own Contact step UI** — their ID types are disabled. This must be re-verified in Phase 2 field extraction and, if confirmed, the HRN-advisory and line-cap approval-routing states will be recorded as **unreachable in this journey's current build** rather than screenshotted, with CUST-9001 (under-18, QID — a reachable ID type) used for the one approval-routing scenario this journey's own selector permits.

## Tooling confirmed
- Screenshot capture: Playwright **not currently installed** (`node_modules/.bin/playwright` absent, not in package.json). Will install as a dev-only tool in Phase 13, scoped to `OUTPUT_DIR`/tooling use only — no application source will be touched.
- Word document generation: `python-docx` **is available** on this machine (`/Users/parithimalsaravanan/Library/Python/3.12/lib/python/site-packages/docx`). Will use it directly rather than adding an npm `docx` dependency to the app.

## Entry points confirmed directly against source
- `public/config/routes.json`, `RT-SCR-037`: path `/sim-number-management/new-postpaid-connection-journey-single-scroll-flow`, screenId `SCR-037`, screenType `Wizard`, module `Mobile Postpaid`.
- `src/modules/mobile-postpaid/screens/index.tsx`: `registerScreen()` binds **SCR-037 and SCR-154–SCR-162, all nine, to the same `NewPostpaidWizard` component**. These are not nine separate screens — they are legacy per-step screen IDs from an earlier design that all now resolve to one consolidated wizard. Routes for SCR-154–162 in routes.json are stale/vestigial reference data, not independently reachable in the running app.
- `src/navigation/journeyCatalogue.ts`: journey id `mob-new-postpaid`, `featureKey: 'postpaid.new-postpaid-wizard'`, `screenId: 'SCR-037'`, `status: 'available'`.
- `public/config/personas.json`, feature key `postpaid.new-postpaid-wizard`, confirmed directly (script-queried, not secondhand): granted to ROLE-01 Retail Sales Agent, ROLE-02 Telesales Agent, ROLE-04 Tablet/Field Sales Agent, ROLE-05 Mass Market Agent, ROLE-12 Premium Agent — all at level `Create`, **no restriction field set on any of the five grants** for this specific feature key (a claim from one research pass that ROLE-01 carried a Bill-Limit restriction on the grant itself did not hold up against the source; the real Bill-Limit floor is a business rule inside `BillLimitEditor`, not a per-role grant restriction — see Phase 1 boundary map, Persona/variant matrix).
