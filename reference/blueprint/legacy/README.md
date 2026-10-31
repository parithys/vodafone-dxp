# Legacy persona model (superseded 2026-09-24)

This directory holds the **66-persona model** that drove the app until
2026-09-24, when it was replaced by 26 VFQ operational roles.

Nothing here is read at runtime. It exists so the evidence chain behind
`rbac-matrix.md`, `personas.md` and the `.knowledge/docs/<slug>` citations
stays resolvable after the cut-over.

## What's here

| File | What it is |
|---|---|
| `personas-66-evidence.json` | The previous `public/config/personas.json`, byte-identical. 66 records with `type`, `responsibilities`, `permissions`, `restrictedFeatures` and a `confidence` rating (56 high, 10 medium). The per-persona prose is **not** reproduced in the new model — the new `description` is the role table's one-liner. |
| `personas-66-descriptions.json` | The two columns that existed **only** in `reference/VFQ_DXP_Personas_Reference.xlsx` and in no JSON: `personaDescription` (a plain-English summary, often clearer than the raw `responsibilities` prose) and `systemRoleKey` (an 11-value role grouping). Extracted 2026-09-24 so that workbook's persona sheet became safely redundant rather than uniquely load-bearing. |
| `staff-id-role-map-v1.ts.txt` | The previous `src/auth/staffIdRoleMap.ts`, including the 7-row Staff ID → Role → Channel → Context card table that existed only as a comment. |

Also archived, but still loaded at runtime as display-only data:
`public/config/rbac-legacy-66.json` (the previous `rbac.json`, 145 rows,
unchanged). It feeds the collapsed "Source evidence" panel in Administration →
Roles & Access, resolved through each role's `legacyPersonaIds`. It grants
nothing — see `configEngine.getLegacyRbacForRole()`.

## What changed, and what that costs

**Access model inverted.** Access used to come from `rbac.json` — 145 rows of
sparse, source-derived evidence across 213 screens and 66 personas. Absence
meant *not evidenced*, treated conservatively as hidden precisely because it
was not a decision. Access now comes from each role's explicit `features`
grants in `personas.json`, expanded to screen ids via
`feature-catalogue.json`. Those grants are exhaustive, so absence now means
*deliberately not granted*.

**Staff IDs changed meaning.** `VFQ12342`–`VFQ12347` all map to different
roles now. For example `VFQ12343` was "Back Office / Fulfilment" and is now
"Direct Sales Agent". Any demo script or screenshot predating 2026-09-24 is
stale.

**Id scheme changed** from `PERSONA-0xx` to `ROLE-xx`, deliberately: six of
the seven old login personas fell inside `001`–`025`, so reuse would have let
a stale persisted `PERSONA-024` (Supervisor) silently re-resolve to the new
#24 (System Administrator) instead of cleanly missing.

**Information not carried forward:**

- **24 of the 145 RBAC rows have no operational-role home** — they belonged to
  16 legacy personas with no counterpart among the 26, the largest being
  `PERSONA-015` Customer/end-user (7 rows), plus the Donor Operator, the
  SADMIN system account, the Presenter/SME, and five named workshop
  participants (Rana, Marishi, Giri, Anwar, Ali). The rows survive here; they
  simply resolve for no role.
- **The `Restricted-No-Access` and `Conditional` permission levels** (33 and 19
  rows) have no slot in the new five-level scale. `Restricted-No-Access` is
  partially recoverable as a display-only `restrictions` string on a grant, but
  the machine-checkable distinction is gone. Its most substantive case was
  `PERSONA-052` (Offshore Retailer, RBAC-122/123/124) — the corpus's only
  worked example of record-level scoping, restricted to its own orders and
  leads. The 26 have no external-partner role, and no record-level scoping
  engine exists in the app, so `ROLE-09` Authorized Officer's "own enterprise
  account only" documents intent without enforcing it.
- **Per-row `actionsAllowed` / `actionsRestricted` / `confidence`** and the
  per-row source-document citations live on only in `rbac-legacy-66.json`.
- **Per-persona `confidence`** is replaced by a `provenance` string. The 26 are
  user-asserted from the operational role table, not evidence-derived, and the
  schema says so rather than emitting a fabricated confidence value.

## 66 → 26 crosswalk

Each new role's `legacyPersonaIds` array in `public/config/personas.json` is
the authoritative crosswalk. `ROLE-25` (View Only) and the 16 personas listed
above have no mapping.

`ROLE-26` (Complaints Agent) is not from the supplied role table — it was added
to inherit `PERSONA-059`'s ticket-resolution ownership, because the table has
no Complaints Team successor and widening resolution to every care agent would
have discarded the documented raise-vs-resolve separation (BR-067 / RBAC-132).
