# VFQ DXP - Next.js SPA architecture spike

Branch `spike/nextjs` (the `main` implementation is untouched). Next.js 16.4.2 (App Router, Turbopack), React 19.2.8, static export.
Scope rule held throughout: architecture may change; UX, business rules, capabilities, customer data behaviour and journey behaviour may not.

## 1. Existing architecture summary

| Area | Today |
|---|---|
| Build | Vite 8 + `@vitejs/plugin-react` + `@tailwindcss/vite` (Tailwind 4); `tsc -b && vite build`; output `dist/` (5.7 MB, 54 JS chunks, 1.54 MB JS) |
| Entry | `index.html` -> `src/main.tsx` -> `App` (boot, theme/language, login gate) -> data router (`createBrowserRouter`, one catch-all route) -> `Shell` -> `AppRouter` (`src/router.tsx`, 31 `<Route>`s, 16 lazy) |
| Routing API used | `useNavigate` 40, `Link` 19, `useLocation` 15, `useSearchParams` 12, `useParams` 8, `useBlocker` 1 (journey leave prompt), `NavLink` 1, `Navigate` 1 - 67 files import `react-router-dom` |
| Router state | `location.state` carries the journey launch context (`startFresh` 20 uses, `resumeOrderId`, `navJourney`, `launch`); consumed by `navigate(url, { replace: true, state: null })` |
| Browser-only code | 10 files use `localStorage` / `sessionStorage` / `BroadcastChannel` / `window.open` (stores, Customer view pop-up) |
| Vite-specific APIs | 3 reads of `import.meta.env` (`DEV`, `VITE_SHOW_DEMO`); no `import.meta.glob`, `?raw`, `?url` |
| Mock data | `public/mock-data/*.json` + `public/config/*.json`, fetched at runtime by `mockDataEngine` / `configEngine`; no server |
| Deploy | `deploy/` (nginx, Azure Static Web Apps, IIS): static files + rewrite of unknown paths to `/index.html` |

### State ownership (A-F)

| Category | Owner | Persistence | Survives a route change |
|---|---|---|---|
| A Application | `configStore` (boot), `authStore`, `themeStore`, `sidebarStore`, `regionStore`, `notificationStore`, `qnomyQueueStore` | local storage (auth, theme, sidebar, region) | yes (module-level zustand) |
| B Customer | `customerContextStore` (`customer`, `recentCustomerIds`; also `journey`) , `customerVerificationStore` | `customer` in localStorage, `journey` in sessionStorage (split storage) | yes |
| C Persona/role | `personaStore` (`activePersonaId`, versioned migration) | localStorage | yes |
| D Journey | `workflowStore` (drafts per wizard id), journey lock in `customerContextStore.journey` | sessionStorage | yes |
| E Capability | inside the draft `values` (e.g. `contact`, `eligibility`, `caf`, `billingAccount`, `simDetails`, `launchCustomerId`) | with the draft | yes |
| F Page-local | React `useState` in components | none | no (by design) |

Nothing in A-E lives in the router, so none of it depends on which router hosts the app. The only router-held state is `location.state` (launch context) and the URL.

## 2. Next.js architecture introduced

Static export only. No Server Components with data, no Server Actions, no API routes, no SSR, no backend.

- `app/layout.tsx` (server component): head tags from `index.html`, `#root` wrapper, imports `src/index.css` (same tokens and Tailwind).
- `app/ClientRoot.tsx`: loads the app with `dynamic(..., { ssr: false })`. The app is browser-only (stores read storage, journeys open windows), so the exported HTML is an empty shell and the app mounts in the browser. This is the "SPA in Next" model.
- `src/next/AppFrame.tsx`: the Next host: `AppBootstrap` + `Shell` (the app's own, split out of `App.tsx`) around the routed page, plus the `main.tsx` start-up bits (demo-content flag, `mirror-window` class).
- `src/next/routerCompat.tsx`: the `react-router-dom` surface the app uses, implemented over `next/navigation`. `next.config.mjs` aliases `react-router-dom` to it (Turbopack `resolveAlias`), so the 67 consuming files are unchanged.
- `src/next/routes.tsx` + `app/**/page.tsx`: Next route files for the migrated screens; every other URL is served by `app/[...slug]/page.tsx`, which mounts the existing `AppRouter` (so the whole app keeps working while journeys are migrated one at a time).
- `next.config.mjs` (`output: 'export'`, `images.unoptimized`, alias), `postcss.config.mjs` (Tailwind for Next), `tsconfig.next.json` (strict, as TypeScript 6 defaults the Vite config to).

Changes to existing files (all behaviour-preserving, and the Vite app still builds and passes every test):
- `src/App.tsx`: `App` split into `AppBootstrap`, `Shell({children})`, `AuthenticatedApp`; the Vite wiring is the same.
- `src/router.tsx`: screen registration moved to `src/modules/registerAllScreens.ts`; `CustomerOrBusiness360` moved to `src/workspace/customer360/CustomerOrBusiness360.tsx`.
- `src/lib/buildEnv.ts` (new): the three `import.meta.env` reads, so another host can supply them (`process.env.NEXT_PUBLIC_*`).
- `vite.config.ts`: `css.postcss.plugins: []`, so Vite ignores `postcss.config.mjs` (otherwise Tailwind would run twice).
- `scripts/serve-static.mjs`: a static host simulator (with / without SPA fallback) used to test deployment behaviour.

## 3. Folder structure

Before: `index.html`, `src/` (`App.tsx`, `main.tsx`, `router.tsx`, `capabilities/`, `components/`, `engines/`, `modules/`, `stores/`, `workspace/`, ...), `public/`, `deploy/`, `tests/`.
After: the same, plus `app/` (Next route files, required by the App Router), `src/next/` (host glue: 3 files), `next.config.mjs`, `postcss.config.mjs`, `tsconfig.next.json`. `src/` is not restructured.

## 4. Route mapping (existing route -> journey -> entry point -> Next route)

| Existing route | Screen / journey | Entry point | Next |
|---|---|---|---|
| `/` | Dashboard | login, Dashboard link | `app/page.tsx` **migrated** |
| `/customer-search` | Customer Search | sidebar, global search | `app/customer-search/page.tsx` **migrated** |
| `/customer/:customerId` | Customer 360 / Business 360 | search result, links | `app/customer/[customerId]/page.tsx` **migrated** (167 pages from the mock data) |
| `/mobile`, `/mobile/:category` | Mobile product line (Plans & Numbers ...) | Actions menu, sidebar | `app/mobile/page.tsx`, `app/mobile/[category]/page.tsx` **migrated** (4 categories from the journey catalogue) |
| `/mobile/change-postpaid-plan` | **Change Postpaid Plan** (representative journey) | Plans & Numbers card | `app/mobile/change-postpaid-plan/page.tsx` **migrated**, same `RequireFeature` guard |
| the other 25 route entries (start-connection, change-prepaid-pack, add-addon, fibre-home, orders, support, sales, tasks, administration, `:moduleSlug`, `:moduleSlug/:screenSlug`, legacy redirects, `*`) | unchanged | unchanged | `app/[...slug]` -> existing `AppRouter` (not migrated) |

Required preserved state per hop (all verified): active customer (`customerContextStore`), launch context (`location.state.launch`), journey draft and lock (`workflowStore` / `journey`), persona.

## 5-6. State management and customer context strategy

No state was moved. The stores are the single sources of truth and live outside the router, so Next route changes cannot reset them. The customer context set by Customer Search / Customer 360 persists through Actions -> Plans & Numbers -> journey; the journey reads it from the draft (`launchCustomerId`) and `useActedForCustomer`, as on `main`. No default, mock or hard-coded customer is substituted anywhere in the spike. Verified live: Customer Search -> CUST-3083 (stored as active customer) -> Actions -> Plans & Numbers ("Acting for Abdulla Nasser Rashid Al-Sada") -> Change Postpaid Plan -> QID scan returned CUST-3083's own card -> header "CUST-3083" -> journey lock CUST-3083.

## 7. Shared capabilities reused

Unchanged and consumed by the Next pages through the existing screens: Customer Qualification / Identification (scan, MOI), Eligibility Gate, Line Selection, Plan Selection (postpaid), Checkout Summary, CAF & Signature, Payment, Activation Complete, Guided Activation Wizard, Customer view. No capability logic exists in `app/` or `src/next/`.

## 8. Components that required modification

`App.tsx`, `router.tsx` (extractions only), 3 files for `buildEnv`, `vite.config.ts`. No capability, pattern, primitive, engine or store changed.

## 9. Persona / role strategy

`personaStore` and `personaEngine` are unchanged; `RequireFeature` and the navigation engine read them as before. **Tested live under Next and under Vite (identical results)**, mid-journey (Change Postpaid Plan, step 2, CUST-3011, a line selected), through the profile menu:

1. Retail Sales (ROLE-01) -> Direct Sales (ROLE-03, no grant for the journey): the app's own "Switch role with a journey in progress?" dialog appears; on "Switch anyway" the page shows "No access", the sidebar drops from 14 to 7 entries, `activePersonaId` is ROLE-03.
2. State retained while the role cannot use the journey: active customer CUST-3011, journey lock CUST-3011, draft step 2 (all unchanged).
3. ROLE-03 -> Retail Sales (same dialog): the journey is back at "Step 2 of 7: Select Line", header "Rajesh Kumar Pillai - QID 28508035600011 - CUST-3011", sidebar 14 entries.

Not tested: roles other than these two, and the approval queues' role-specific buttons under Next (covered only by the existing tests on the Vite loader).

## 10. Desktop / tablet strategy

`detectDeviceType()` (touch points / coarse pointer, read once on first use) and every capability that uses it are unchanged. Layout at 768 px matched the Vite app (sidebar collapses, summary accordion, no horizontal overflow).

**Touch ("tablet") branch tested live under Next and under Vite (identical results)**, with touch emulation on (`maxTouchPoints` 5, coarse pointer; the emulation also forces a 375 px viewport, so this tests the device logic, not tablet-width layout together with touch): the journey wizard root reports `data-device="tablet"`; the CAF type is set automatically to **Touch Screen** with the signature pad shown and no picker; **Customer view** is not offered (web only); the scan control is "Initiate scan". On a pointer device the CAF type is Digital (unit test `tests/signatureMode.test.mjs`; the live web run in Next was not repeated).

**MNP Port-In run live under Next** (a legacy-catch-all route, served by `app/[...slug]`): from Customer 360 (CUST-3083) -> Actions -> Plans & Numbers -> MNP Port-In. Web (non-touch): the QID scan drew CUST-3083's own card, Billing Profile resolved itself (existing BILL-7149 selected), SIM Serial advanced by itself on a validated scan and stored ICCID / stock status / kind, Customer view appeared on Offers & Plans and Checkout and not on Donor Details, the Port-in Number is the +974 phone field (stored `+97466000666`), and the MNP Form step has no selector and shows `MNP-Digital` with a signature pad. Touch emulation: `data-device="tablet"` and the MNP Form shows `MNP-Touch Screen`, again with no selector. Not tested: signing the form, CAF & Signature and Payment of the MNP journey (the signature pad does not accept synthetic input), and a real tablet. Because the device is read on first use, a page that loads on a touch device and is later resized keeps its first reading (same on `main`).

## 11-13. Deployment, static export, server runtime

- `next build` with `output: 'export'` succeeds: 178 static HTML pages, `out/` 13 MB (Vite `dist/` 5.7 MB), JS 1.98 MB in 42 files (Vite 1.54 MB in 54), +28 % JS. No Next server is required.
- Static export needs every dynamic URL enumerated at build time. `/customer/[customerId]` is generated from the mock data (167 ids) and `/mobile/[category]` from the journey catalogue; nothing is invented. A customer id that is not in the mock data has no page.
- **Hosting requirement (new):** an unknown path must be rewritten to the catch-all document `/not-migrated.html`, not `/index.html`. Verified: with the `/index.html` rewrite (what `deploy/` uses today) opening `/orders` directly shows the Dashboard at the `/orders` URL (the Next client hydrates the root page's payload). With the rewrite to `/not-migrated.html`, `/orders` and `/customer/CUST-9999` render correctly (the latter shows the existing "No customer found for CUST-9999" state). `deploy/nginx.conf`, `staticwebapp.config.json` and `web.config` would all need that change.
- Server runtime: none required. Next features not used: SSR, Server Components with data, Server Actions, API routes, middleware, ISR, image optimisation.

## 14. Issues discovered during the migration

1. Opening a legacy journey by client navigation reloads the page (see section 18).
2. `location.state` has no equivalent in the App Router. Bridged per URL in `sessionStorage`. Differs from react-router in one case: Back to an entry whose launch state was never consumed re-delivers it (journeys consume it immediately, so not observed).
3. `useBlocker` (leave-journey prompt) works for in-app navigation (Link, `navigate`, `setSearchParams`): verified, the dialog appears and "stay" keeps the page and entry list unchanged. **Browser Back/Forward and reload cannot be intercepted by the App Router**: verified, Back leaves the journey with no prompt (draft, journey lock and step were preserved and Forward restored step 2). This is a regression versus `main`, where Back is blocked.
4. A static export prerenders client components, so any module-level `window` / storage access would fail the build; avoided by loading the app with `ssr: false`.
5. Next removes `import.meta.env` (Vite-only): `buildEnv.ts`.
6. Next rewrote `tsconfig.next.json` to `strict: false` on first build, which hid nothing but produced 5 type errors on strictness differences; set explicitly to `strict: true`.
7. Turbopack's PostCSS step needs a local port; it fails inside the Claude sandbox (EPERM). Builds were run in the user's terminal.
8. `npm install` needed `NODE_OPTIONS=--use-system-ca` on this machine (as the repo's other scripts do).
9. Tailwind (Next's PostCSS path) warns about one invalid generated class `text-[length:var(--fs-*)]` (a literal in source text). Harmless; not seen in the Vite build.
10. Next warns that it ignored a `package-lock.json` outside the repo (`turbopack.root` would silence it).
11. `next dev` was not run; only `next build` + static serving.

## 15. Existing defects discovered

- After login the URL is reset to `/`, so a deep link opened while signed out is lost (the same on `main`: `AuthenticatedApp` is created after `LoginPage` resets the URL). Not changed.
- CUST-3083 has no postpaid lines, so Change Postpaid Plan correctly stops at Select Line ("No postpaid lines on file for this customer"): data, not a defect.

## 16. Changes made

As listed in section 2, on the branch `spike/nextjs` only.

## 17. Regression-test results

- `main` build intact on the branch: `npx tsc -b` clean, `npm test` 276/276, `npm run build` OK, architecture test (no cycles, layers) passes with the new `src/next/`.
- Next: `next build` OK (178 pages); strict TypeScript OK.
- Side-by-side DOM comparison, Vite (5173) vs Next static export (4002), same data and path, 10 stages: Dashboard, Customer Search, search results, Customer 360 (CUST-3011), Plans & Numbers, journey step 1, scanned card, identified, Select Line, Offers & Plans. Element count, set of CSS classes (hash) and normalised text (hash) were **identical at all 10 stages**.
- Persona switching and the touch branch: tested separately, identical under Vite and Next (sections 9 and 10).
- Not compared: Payment and the confirmation page, other journeys, dark theme, Customer view pop-up window, `next dev`.

## 18. Remaining risks

- Lost browser Back/Forward leave-prompt (issue 2); it needs either a popstate workaround (history.go compensation, fragile) or accepting the change.
- Per-URL router state (issue 1) is a different model; a future journey that relies on distinct state for the same URL would behave differently.
- Static export needs enumerated dynamic params and a host rewrite to a specific document (13); unknown customers are only reachable through the fallback.
- +28 % JS and a larger output for no functional gain in a front-end prototype.
- The compat layer (about 250 lines) becomes permanent infrastructure to maintain against both react-router and Next API changes.
- Untested under Next: signing and paying in the MNP journey, roles other than ROLE-01 / ROLE-03, the Customer view pop-up window, a real tablet, `next dev`.
- Client navigation to a route that has no Next route file (for example the MNP journey from the Plans & Numbers card) is a full page load, not an in-app transition: the exported site has no RSC payload for it, so the Next router falls back to a hard navigation, which the host rewrite then serves with the catch-all document. Launch state (sessionStorage) and the stores survive it, so the customer and the journey are intact (verified), but the page reloads and in-memory UI state is lost. Each journey migrated to a Next route file removes this.

## 19. Recommendation

**Continue with the existing architecture.** The spike shows Next.js can host the DXP as a static SPA with identical rendered output and intact customer context, and that adoption can be incremental (native Next routes beside the existing router). But it demonstrated no benefit for a front-end prototype that uses no server feature, it costs a permanent router compatibility layer, it removes the browser-Back leave prompt, larger output, and it needs a deployment change. Do not migrate fully on the strength of this spike.

If Next.js is a mandated organisation standard, **adopt it incrementally** using this pattern (keep the compat layer, migrate route files journey by journey, change the host rewrite to the catch-all document), after deciding how to handle the Back/Forward prompt and re-running the untested checks above. The persona and touch checks that were the open question are now done and show no difference from `main`.
