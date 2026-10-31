# Traceability Workbook Reconciliation (Stage J)

Closes the gap flagged in `gap-analysis.md` §8: the pre-existing `data/Vodafone_Requirement_Hierarchy_Traceability_Template.xlsx` (built independently in an earlier session from `CRM_Journeys_Final_Updated_with_Type.xlsx`'s own Relationship-sheet analysis) uses a completely different ID scheme from this blueprint's `traceability-matrix.md` — TP-xxxx/WF-xxx/TSK-xxx/VW-xxx/ACT-xxx/PERM-xxx vs. this blueprint's REQ-xxx/UJ-xxx/BR-xxx/SCR-xxx/PERSONA-xxx.

**Deliverable:** [Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx](Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx) — the original workbook with new appended columns cross-referencing every row to a blueprint ID, plus a new documentation sheet. **The original file under `data/` was not modified** — consistent with this whole engagement's treatment of `data/` as a read-only source corpus; the reconciled copy lives here in `blueprint/`.

## What changed in the workbook

- **`Requirements Inventory` sheet**: 5 new columns appended after the existing 12 (columns M-Q): `Blueprint Ref ID`, `Blueprint Ref Type`, `Blueprint Ref Name`, `Blueprint Ref Confidence`, `Blueprint Ref Note`.
- **`Traceability Matrix` sheet**: 6 new columns appended after the existing 28 (columns AC-AH): the same five plus `Matched Via (Old ID)` (which of the row's own hierarchy-level IDs produced the match).
- **New `Reconciliation Method` sheet**: full methodology, confidence breakdown, and the 2 gaps this reconciliation surfaced.
- **Nothing else was touched** — every existing column, value, and formula (including the 1,253 pre-existing formula cells, some using Excel-365-only `UNIQUE`/`FILTER` dynamic-array functions on the `Coverage Summary` and `UJ Requirement Summary` sheets) is byte-for-byte the same data as before.

**Important technical note:** this workbook's `Coverage Summary` and `UJ Requirement Summary` sheets use Excel 365 dynamic-array functions (`_xlfn.UNIQUE`, `_xlfn._xlws.FILTER`) that a save/reopen cycle through non-Excel tooling cannot recompute correctly (verified in this session — LibreOffice either errors or silently truncates these to a single cell). Editing this file with `openpyxl` (as done here) preserves the formula text exactly but clears their cached results, since `openpyxl` never reads cached values for formula cells in the first place. **Open this file in genuine Microsoft Excel** (not LibreOffice/Google Sheets) to have those two summary sheets recompute correctly — this is a pre-existing fragility in the original workbook's own formula choices, not something introduced by this reconciliation.

## Method

1. Both the 815-row `Traceability Matrix` and the `Requirements Inventory` sheet reference the same 180 unique canonical items: 11 User Journeys, 15 Workflows, 95 Tasks, 29 Views, 28 Actions, 2 Access/Permissions.
2. Each of the 180 items was matched to a blueprint entity:
   - **User Journeys & Workflows (26 items)** → matched to one of the blueprint's 16 modules (`module-hierarchy.md`) by name/subject-matter — small enough set to hand-verify rather than rely purely on keyword overlap.
   - **Tasks/Views/Actions (152 items)** → keyword-token-overlap matched against the 213 screens (`screens.md`) first; if no screen matched, against the 308 requirements (`requirements.md`); if still no match, against the 83 entities (`domain-model.md`) and 346 business rules (`business-rules.md`).
   - **Access/Permission (2 items)** → matched against the 66 personas (`personas.md`).
3. The match was propagated to all 815 `Traceability Matrix` rows by choosing, for each row, whichever of its own populated hierarchy-level IDs (Journey/Workflow/Task/View/Action/Permission) produced the **best-confidence** blueprint match — not simply the most granular one. (An earlier draft of this logic picked the most-specific populated column regardless of match quality, which sometimes surfaced a weak "umbrella" Workflow match over a clean, specific Journey match on the same row — caught and fixed before finalizing.)

## Results

| | Count | High | Medium | Low | None |
|---|---|---|---|---|---|
| 180-item canonical registry | 180 | 42 | 121 | 15 | 2 |
| 815-row Traceability Matrix (after best-match propagation) | 815 | 674 | 141 | 0 | 0 |

**98.9% of the canonical registry matched** a blueprint entity at some confidence level; every one of the 815 rows now carries a blueprint cross-reference.

## Two genuine gaps surfaced

1. **UJ-002 "Create Upgrade TT"** (creating a ticket to track a plan upgrade) — no blueprint journey covers this. **This independently corroborates** the one User-Journey-type gap already found in `gap-analysis.md` §1 from a completely different source (the 165-row master CRM catalog). Two independent analyses agreeing is a meaningful confidence signal.
2. **WF-015 "Retention / Happy Offers"** — no blueprint module evidences a dedicated customer-retention/offer-management capability. **This is newly identified by this reconciliation** — not previously flagged anywhere in this blueprint. Recommend confirming with the business whether this is in scope for the DXP rebuild; if so, it needs its own Stage-A-style extraction pass, since no evidence for it exists anywhere in `blueprint/` today.

## Limitations

- The reconciliation is keyword/name-based, not exhaustively hand-verified per row (815 rows is too many to individually confirm) — treat Medium/Low confidence entries as a strong starting hypothesis, not a guaranteed-correct mapping.
- 121 of 180 canonical items matched at only Medium confidence — meaningful subject-matter overlap, but not an exact name match. Spot-check before treating any specific Medium-confidence row as authoritative.
- This reconciliation does not attempt to merge or deduplicate the two workbooks' underlying content — it only adds a cross-reference layer. Deciding whether one supersedes the other (per `gap-analysis.md`'s original recommendation) is still a business decision, not something this reconciliation resolves.
