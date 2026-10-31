# UI design-system audit scripts

Read-only tooling behind `reference/outputs/UI_Design_System_Gap_Analysis_Reference.md` / `.xlsx` (audit of 2026-10-10).
Nothing here edits `src/`. Python 3 + `openpyxl`; no other dependencies.

## Re-run

```bash
python3 reference/scripts/ui_audit/audit.py          # hard-coded values, token usage, raw elements, repeated class strings
python3 reference/scripts/ui_audit/inventory.py      # 308-row component inventory (exports, inbound references, raw elements)
python3 reference/scripts/ui_audit/a11y2.py          # brace/string-aware JSX a11y scan (type-less buttons, names, roles, tables...)
python3 reference/scripts/ui_audit/build_report.py   # writes the .md and .xlsx into reference/outputs/
```

Intermediate JSON goes to `$UI_AUDIT_WORK` (default `$TMPDIR/ui_audit`), not into the repo.

## Files

| File | Purpose |
|---|---|
| `audit.py` | Scans `src/**` for literals (hex, rgba, arbitrary lengths, z-index, durations, raw white/black, default radius/shadow, spacing and weight utilities), token definitions/usage/dead/duplicate/dark-parity, primitive vs raw element counts, repeated class strings, duplicate-family names, light-mode contrast |
| `inventory.py` | One row per `.tsx` file: layer, lines, exports, importing files, raw element counts |
| `a11y2.py` | JSX-aware accessibility checks. Replaces naive regexes that stop at `=>` inside props (the `type` guard in `tests/ui.test.mjs` has that flaw) |
| `dom_style_audit.js` | Run in the browser on each route: compares computed colours, font sizes, radii and shadows of visible elements with the resolved token set |
| `findings.json` | The hand-curated finding register (73 rows: id, severity, effort, tier, phase, evidence, recommendation) |
| `report_template.md` | Narrative of the report; `build_report.py` fills `{{COUNTS}}`, `{{PLAN}}`, `{{REGISTER}}` |
| `build_report.py` | Combines the metrics, `findings.json` and the template into the markdown report and the workbook |

## What is regenerated and what is a snapshot

Regenerated from source on each run: every count in `audit.py`, `inventory.py`, `a11y2.py` output, and the workbook sheets built from them (component inventory, hard-coding by file, dead/duplicate tokens, a11y evidence, duplicate families, repeated class strings, light contrast).

Snapshot of the 2026-10-10 audit, edit by hand when the app changes: `findings.json`, `report_template.md`, and a few constants in `build_report.py` (token total 246, dead tokens 57, colour tokens without dark 51, raw `<button>` 131, primitive-adoption table). Dead-token and dark-parity figures there come from the token-governance pass, which parsed declarations per line; `audit.py`'s own `unused`/`dark_missing` lists are an approximation (it does not count tokens read through `getPropertyValue`, e.g. the tooltip timings).

## Using `dom_style_audit.js`

Open the app, sign in, navigate to a route, paste the file into the console, and read the returned object (`offColour`, `offBg`, `offBorder`, `offRadius`, `offShadow`, `offSize`). An empty list means every computed value matches a token. Alpha-white overlays and `color-mix` tints show up as expected off-token values.
