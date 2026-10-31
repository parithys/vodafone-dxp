# Application Reconstruction Package — Folder & Component Structure (Phase 38)

Concrete project layout implementing the architecture in `frontend-architecture.md`. This is a **recommended structure**, not evidenced by the corpus (see that document's evidence-status note) — it operationalizes the five engines and the module hierarchy into an actual repo layout.

```
vfq-dxp-app/
├── config/                          # generated from blueprint/reconstruction-package/config/*.json (copy or symlink at build time)
│   ├── routes.json
│   ├── rbac.json
│   ├── business-rules.json
│   ├── validation-rules.json
│   ├── personas.json
│   ├── module-hierarchy.json
│   └── domain-schema.json
├── mock-data/                       # seed data, from blueprint/reconstruction-package/mock-data/*.json
│   └── *.json
├── src/
│   ├── engines/
│   │   ├── configEngine.ts          # loadConfig() + typed accessors (§10)
│   │   ├── ruleEngine.ts            # rule catalogue lookup + ruleImplementations registry (§5)
│   │   ├── validationEngine.ts      # field-level validation resolver for React Hook Form (§5)
│   │   ├── mockDataEngine.ts        # in-memory/IndexedDB CRUD + latency simulation + lifecycle transitions (§7)
│   │   └── personaEngine.ts         # active persona + RBAC filtering (§8)
│   ├── stores/
│   │   ├── personaStore.ts
│   │   ├── entityStore.ts
│   │   ├── workflowStore.ts
│   │   ├── notificationStore.ts
│   │   └── configStore.ts
│   ├── components/
│   │   ├── primitives/              # Button, Input, Select, DatePicker, SignaturePad, FileUpload, Badge, Toast, Modal, Drawer, Tabs, DataTable
│   │   ├── domain/                  # QidInput, MsisdnPicker, CreditLimitEditor, BillingProfileSelector, ... (bound to domain-schema.json fields)
│   │   └── patterns/                # GuidedActivationWizard, Customer360Panel, OrderApprovalQueue, CafSignatureCapture, ...
│   │                                #   — see reusable-patterns.md for the full evidenced catalogue
│   ├── modules/                     # one folder per module-hierarchy.md module (16)
│   │   ├── lead-management/
│   │   │   └── screens/             # one component per SCR-xxx assigned to this module (routes.json)
│   │   ├── mobile-postpaid/
│   │   ├── mobile-prepaid/
│   │   ├── pre-to-post-migration/
│   │   ├── mnp-fnp-porting/
│   │   ├── fixed-line-fibre/
│   │   ├── fwa-5g-home/
│   │   ├── enterprise-iot-b2b/
│   │   ├── billing-adjustments/
│   │   ├── order-management/
│   │   ├── identity-customer-management/
│   │   ├── sim-number-management/
│   │   ├── trouble-ticketing-complaints/
│   │   ├── access-roles-approval-governance/
│   │   ├── caf-attachments-forms/
│   │   └── platform-governance-architecture/
│   ├── navigation/
│   │   ├── Sidebar.tsx              # primary nav = 16 modules, filtered by personaEngine
│   │   ├── Breadcrumbs.tsx          # derived from routes.json module/sub-module path
│   │   └── PersonaSwitcher.tsx      # dev/demo "login-as" control (§8)
│   ├── router.tsx                   # React Router config generated from config/routes.json
│   ├── App.tsx
│   └── main.tsx
├── blueprint -> ../blueprint/        # (symlink, optional) keep the evidence trail linked from code
└── package.json
```

## Component hierarchy example (one screen, fully wired)

To make the composition model in `frontend-architecture.md` §3 concrete, here is how a real screen — **SCR-XXX "New Postpaid Tablet Wizard"** — composes down to primitives:

```
modules/mobile-postpaid/screens/NewPostpaidTabletWizard.tsx
└─ patterns/GuidedActivationWizard.tsx           (Pattern component — see reusable-patterns.md)
    ├─ domain/QidInput.tsx                       (step: Contact)
    ├─ domain/CreditLimitEditor.tsx              (step: Plan — calls ruleEngine for Agent Minimum threshold)
    ├─ domain/MsisdnPicker.tsx                   (step: Number)
    ├─ domain/SimSerialScanner.tsx               (step: SIM)
    ├─ patterns/CafSignatureCapture.tsx           (step: CAF)
    └─ primitives/DataTable.tsx                   (final: order line-item summary)
```

Every domain/pattern component reads its field list from `config/domain-schema.json` + `field-inventory.md`'s entries for that screen name, and its validation from `validationEngine`, and (where applicable) its eligibility/threshold checks from `ruleEngine` — no field list, validation message, or threshold value should be hardcoded inline in the screen component.

## Route generation

`router.tsx` should be generated (not hand-written) from `config/routes.json` — a simple `.map()` over the 213 entries producing `<Route path={r.path} element={<ScreenComponent screenId={r.screenId} />} />`, with `ScreenComponent` resolved via a screenId → component registry populated by each module's `screens/index.ts`. This keeps `routes.json` (data) and the router (code) from drifting apart as screens are added.

## What's NOT included in this reconstruction package

Per `gap-analysis.md`, the following are deliberately left as follow-on work rather than guessed at here:
- Concrete visual design tokens beyond the placeholder in `frontend-architecture.md` §6 (no design evidence exists).
- Full `ruleImplementations` for all 346 business rules (only a priority subset is recommended — see §5's build-sequencing note).
- Component code for all 213 screens (this package defines the *pattern* each screen should be built from, in `reusable-patterns.md`, not每 screen's literal JSX).
