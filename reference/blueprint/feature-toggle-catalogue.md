# Feature Toggle Catalogue (Phase 29)

**This is the thinnest-evidenced deliverable in the blueprint.** No source document discusses feature flags, toggles, or A/B rollout mechanics in the software-engineering sense. The closest evidenced analogs are (1) explicit **Current State vs. Target State** pairs naming the same capability at two points in its modernization lifecycle, and (2) the Mobile Postpaid BRSD's formal **Change Category** classification (AS-IS / Minor Enhancement / Major Enhancement / New / GAP) applied to every one of its 13 capabilities — both are about phased *delivery*, not runtime *toggling*, but are the nearest thing to "current vs. future features" this corpus evidences.

---

## 1. Current-state → Target-state pairs (Explicit — candidates for a "legacy vs. new" toggle during migration)

| Capability | Current State | Target State |
|---|---|---|
| Bulk Adjustment | SCR-002 PowerApps Bulk Adjustment Portal | SCR-001 Bulk Adjustment Portal (DXP) / UJ-001 |
| Bulk Activation | SCR-009 Bulk Activation Control Sheet (Excel Macro) / UJ-005 | SCR-010 DSP Bulk Activation Templates |
| Product Catalog | (legacy Siebel catalog, not separately screen-catalogued) | SCR-026 DXP Product Catalog |
| Mobile Postpaid Activation | (as-is Siebel/ECR/Open UI flows documented throughout `guided-journeys-postpaid-*`) | UJ-103 (BRSD target-state journey) |

**For a front-end-only rebuild, these pairs are not "toggle" candidates in the traditional sense** — since the new DXP has no legacy system to fall back to at runtime, there's nothing to toggle between in production. Their practical use is **development sequencing**: build the Target State screen/journey, and treat the Current State entry purely as historical/reference context for why the target design looks the way it does (e.g. SCR-001's fixed-template + failure-report design is a direct response to SCR-002's manual PowerApps process).

## 2. Change Category classification (Explicit — `vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`)

The Mobile Postpaid BRSD classifies each of its 13 capabilities (CAP-01 through CAP-13) as **AS-IS / Minor Enhancement / Major Enhancement / New / GAP** — all 13 are explicitly marked "New" in this BRSD (per its own summary), meaning even capabilities that map to existing legacy behavior are being rebuilt fresh for the DXP, not incrementally toggled on top of the old system. This reinforces §1's conclusion: this modernization is a **rebuild**, not a toggle-based incremental rollout, so a traditional feature-flag framework has limited evidenced justification.

**Note the Fibre BRSD documents a differently-worded Change Category scheme** ("from Technology & Scope perspective" per its own text) — this wording discrepancy is a known corpus inconsistency (see `conflict-report.md`'s method notes on cross-BRSD terminology drift), not itself cataloged as a verified conflict since it's a documentation-style difference rather than a substantive contradiction.

## 3. Recommendation for the front-end architecture (Assumed — not evidenced)

Given the thin evidence, a full feature-flag *system* (LaunchDarkly-style, remote config, percentage rollouts) is not justified by this corpus. What IS reasonable to build, as a standard engineering practice rather than an extracted requirement:

- A single build-time/config-time flag per module, keyed off `build-readiness.md`'s readiness classification — e.g. `FEATURE_BILLING_ADJUSTMENTS_ENABLED = false` for `Missing`/`High Risk` modules (Billing & Adjustments, CAF/Attachments & Forms, Access/Roles/Approval Governance, Platform Governance) until their underlying business rules are confirmed, so incomplete modules can be hidden from the navigation (`config/rbac.json`-driven) rather than shipped half-built.
- No user-facing or persona-specific feature toggles are evidenced or recommended beyond the RBAC-driven visibility already covered in `rbac-matrix.md` / `persona-matrix.md`.

This catalogue is intentionally short — padding it further would misrepresent how little the source corpus says about feature-toggle mechanics.
