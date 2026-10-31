# VFQ DXP

A working prototype of the Vodafone Qatar (VFQ) Digital Experience Platform for retail and contact-centre agents: guided sales and service journeys, a Customer 360 view and the work queues around them. It runs entirely in the browser against synthetic data, so no backend is needed.

Built with React 19, TypeScript, Vite, Tailwind CSS 4, zustand and React Router.

## Run it

Needs Node.js 22 or later.

```bash
npm install
npm run dev        # http://localhost:5173/
```

The web, tablet and mobile views run as one app; the ports below only give each view its own address so all three can be open at once.
The app adapts to the real window size and device, not to the port, so open the tablet and mobile ports in a tablet-sized and a phone-sized window (or the browser's device emulation).

| Command | View | URL |
|---|---|---|
| `npm run dev` | Web | http://localhost:5173/ |
| `npm run dev:tablet` | Tablet | http://localhost:5174/ |
| `npm run dev:mobile` | Mobile | http://localhost:5175/ |
| `npm run dev:all` | All three at once | the three URLs above |

Set `PORT` to move a view (`PORT=6000 npm run dev:tablet`).

With the servers running, `npm run open:tablet`, `open:mobile`, `open:web` or `open:all` open Chrome windows pre-sized to each device
(tablet 820x1180, mobile 390x844, web 1440x900) so no DevTools is needed. Each view opens in its own throwaway Chrome profile, so its
sign-in is separate. Set `CHROME_PATH` if Chrome is not in its usual place. A sized window has a mouse, so touch-only behaviour
(the tablet device type) still needs DevTools device emulation or a real device.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (web, port 5173) |
| `npm test` | The automated suite (about 150 tests, no browser needed) |
| `npm run lint` | Lint with oxlint |
| `npm run build` | Type-check and production build into `dist/` |
| `npm run preview` | Serve the production build locally |

### Login news

The sign-in screen's "Latest Updates" are the newest items of https://www.vodafone.qa/en/investor-relations/news (title, date, summary, banner and the article's own link), kept in `public/news/` by `scripts/sync-news.mjs`. Nothing there is edited by hand. The sync runs before `npm run dev` and `npm run build` (and keeps the last snapshot if the site cannot be reached), or on demand with `npm run sync:news` (`-- --limit=8` for a different count). It needs Node 22.15 or later for `--use-system-ca`, so the machine's certificate store is trusted. In CI or a scheduled job, run `npm run sync:news` to pick up new articles.

### Signing in

All 26 demo roles share one placeholder password, `Vodafone@123`. Staff IDs run `VFQ12341` to `VFQ12366`. The role matrix (which role has which ID, features and menu) is in `reference/outputs/Persona_Feature_Applicability_Matrix_Reference.xlsx`.

### Build settings

`VITE_SHOW_DEMO=false` hides demo-only UI (scanner simulators, specimen ID cards) for a production build. It is shown by default. See `.env.example`.

## What is in it

- **New Connection**: one continuous journey (Customer Identification once, then Postpaid, Prepaid, Fixed Line or MNP in the same wizard), and a separate **New Home Connection** journey (Fibre, Fixed-Line, FWA, 5G Home). Prepaid adapts to the device (Web or Tablet) instead of being a separate journey.
- **MNP Port-In**: NPAS approval and rejection, Confirmed Port-In Date, cancellation, Quick Draft, a Port-In Status screen, a signed MNP Form, a checkout validation gate and SIM reservation.
- **Mobile Services, Fibre & Home Services and New Connections**: the menu and journey pages, with the same four tabs per line.
- **Number Management Portal**: browse Star and Free numbers and reserve one for an identified customer.
- **Customer 360**, tickets and complaints, orders and approvals, leads, tasks and queues.

Journey and screen coverage is documented in `reference/`.

## How it is organised

```
src/
  capabilities/   the Capability Library: each reusable capability (Customer Identification, Number Selection,
                  Plan Selection, Payment ...) has one implementation; journeys import from its barrel
  components/     primitives (design system), domain controls, and multi-step patterns
  engines/        non-UI logic and data access (eligibility, rules, pricing, mock data)
  modules/        one folder per product line or journey
  navigation/     sidebar, breadcrumbs, journey catalogue
  workspace/      Customer 360, tickets, tasks, orders
public/
  config/         roles, features, routes, rules
  mock-data/      the synthetic records the app reads
tests/            node:test suites (journeys, UI guards, design tokens, architecture)
reference/        requirements, business rules, journeys, screen catalogue and the generator scripts
deploy/           nginx, Azure Static Web Apps and IIS configs
```

More detail: [`src/README.md`](src/README.md) (layout and naming), [`src/capabilities/README.md`](src/capabilities/README.md) (the Capability Library) and [`deploy/README.md`](deploy/README.md) (deployment).

## Things to know

- **Synthetic data only.** Customers, IDs, numbers and orders are made up. Changes are kept in memory for the session and are not saved anywhere.
- **Some integrations are simulated**: ID scanning and MOI, WinCash payment, and NPAS. Where an integration is simulated, the screen says so or marks the control as demo only.
- **Generated files are never hand-edited.** The role matrix, customer inventory and capability inventory are produced by scripts in `reference/scripts/`. `CLAUDE.md` lists which script to run after which kind of change.
- **Tests guard the design system.** There are checks for colours and spacing tokens, accessibility markup, import layering and the route catalogue. If a change fails one, read the message: it states the rule.

## Contributing

Run `npm test`, `npm run lint` and `npm run build` before pushing. GitHub Actions runs the same three on every push and pull request.
