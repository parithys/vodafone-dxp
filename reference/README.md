# Reference material

This folder holds the distilled reconstruction documentation for the VFQ DXP
project — it is **not** consumed by the application at build time or runtime.
It moved here from the project root on 2026-08-25 so that `vfq-dxp-app/` is a
single, self-contained source of truth for the active implementation.

| Folder/file | What it is |
|---|---|
| `blueprint/` | Reconstructed requirements, business rules, journeys, personas, screen catalogue, RBAC, traceability docs |
| `.knowledge/` | Indexed summaries of the raw workshop/BRSD/form corpus, with per-document confidence scoring |
| `diagrams/` | Standalone HTML process-flow diagrams for individual journeys/workflows |
| `scripts/` | Generators for the four workbooks in `outputs/`. Each writes to `outputs/`, not to this folder's root — if you move one of its products, update the script's `OUT` in the same change or the next regeneration recreates the file at the old path and leaves a stale copy behind |
| `outputs/` | **Script-generated** workbooks, and the only things here that are. Never hand-edit: the next regeneration overwrites. `Persona_Feature_Applicability_Matrix_Reference.xlsx` (role × feature SSOT — see `../CLAUDE.md`), `Test_Data_Reference.xlsx`, `Validation_Integration.xlsx`, `Postpaid_Activation_Open_Questions_Reference.xlsx` |
| `data/` | Source data the documentation was built from. `CRM_Journeys_Final_Updated_with_Type.xlsx` — the 165-row journey/workflow/view/action/access catalogue with Unique ID + Mapping Report; see `configEngine.ts`'s `journeyCatalogueMap` for how a subset of these IDs surface on module/screen cards |
| `docs/` | Curated reference documents — written and maintained by hand, **not** generated. Abbreviations, Design Principles, the 66-persona record, the Postpaid open-questions source markdown (which `build_postpaid_open_questions.py` reads as its input), and `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md` — live policy cited by six `blueprint/` documents, which is why it sits here and not in `audit/` |
| `audit/` | Completed audit trail: Phase 1.5 Actions 1–6, plus the Customer 360 BRSD audit. The work these scheduled is done; they are cited by filename rather than path, so nothing resolves through their old location |
| `deliverables/` | Client-facing documents produced from this material |

**Generated documentation/analysis artifacts** (gap analyses, RBAC reviews, persona/reference
exports, and similar deliverables produced on request) belong in this tree — not left only in a
scratch/temp location — so they stay discoverable for future analysis, design, requirements
validation, and RBAC review work. Keep the `VFQ_DXP_<Topic>_Reference.<ext>` /
`VFQ_DXP_<Topic>_<Report type>.<ext>` naming, and file by *provenance* rather than dropping
everything at this folder's root (which is how it used to work, until 2026-09-27):

- produced by a script in `scripts/` → `outputs/`
- written and maintained by hand → `docs/`
- a source workbook the documentation was built from → `data/`
- a finished, point-in-time review → `audit/`

Only `README.md` lives at this folder's root now.

**Raw source corpus lives one level up, at the project root** —
`Guided Journeys/`, `Workshop Recordings/`, `Application Screenshots/`,
`Business Documents/` and the other topical folders — not inside
`vfq-dxp-app/`, since it is large (6.5GB+) and genuinely reference-only.

Two pointers that used to be wrong here, corrected 2026-09-27:

- Citations of the form `data/<file>` appear throughout these documents, but
  **there is no longer a `data/` folder at the project root** — its contents
  were reorganised into the topical folders named above. Those citations
  record provenance; they no longer resolve as paths.
- **BRSD workbooks are not in this folder and never were.** They live in
  `../../vfq-diagram-engine/BRSD/`, which is the diagram engine's input
  corpus (its `manifest.json` records each as `BRSD/<file>.xlsx`). Note the
  app's own reconstruction indexed a *different* set of BRSD versions
  (Fibre v1.2, Postpaid V2.0) from the old `data/` folder, so the engine's
  workbooks are not a second copy of what fed this documentation.

See `../CLAUDE.md` for the full project-structure note and knowledge-base
lookup instructions.
