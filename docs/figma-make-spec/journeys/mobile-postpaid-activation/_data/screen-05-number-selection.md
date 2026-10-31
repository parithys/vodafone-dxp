# MPA-SCR-05 — Number Selection

Route: step 5 of 9 (`number` key), reached from Plan & Add-ons (or by auto-advance from a pre-bundled plan). Component: `MsisdnPicker` (`src/components/domain/MsisdnPicker.tsx`, 534 lines). Wired at `NewPostpaidWizard.tsx:359-377`.

## 5.1 Purpose
Let the agent choose and reserve one MSISDN for the new line, browsing three tabs (Free / Star / Reserved) that are priced-band and status driven rather than the raw `category` field, with BR-115's star-number entitlement note surfaced up front. Manual/custom MSISDN entry, offered by every other journey sharing this component, is explicitly disabled here.

## 5.2 Entry / exit conditions
- **Entry:** reached after a non-pre-bundled plan is confirmed on Plan & Add-ons, or immediately (auto-advanced) after selecting a pre-bundled plan.
- **Exit (Continue enabled):** `Boolean(values.msisdn)` (`NewPostpaidWizard.tsx:376`) — any number picked from Free, Star, or Reserved satisfies this; there is no separate "confirm" step beyond the pick itself.
- No skip/auto-advance logic on this step itself (unlike its neighbours).

## 5.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-05-ST01 | Default — Free Numbers tab, page 1 of the available list | Fresh arrival at the step, for a customer/agent with no existing reservation |
| MPA-SCR-05-ST02 | Auto-opened on the Reserved tab | Sign in as ROLE-01/VFQ12341 (Fatima Al-Kuwari, USR-1101) — `numbers.json` seeds `+97433001001` with `status: "Reserved", reservedBy: "Fatima Al-Kuwari"`, so the auto-select-on-load effect (`MsisdnPicker.tsx:184-196`) lands on Reserved rather than Free the moment the number list arrives |
| MPA-SCR-05-ST03 | Star Numbers tab, with Sort control visible | Click "Star Numbers" |
| MPA-SCR-05-ST04 | Star Numbers tab, sorted "Price: high to low" (default) vs. re-sorted by another option | Change the Sort select |
| MPA-SCR-05-ST05 | Star-number overage note shown on a card | Any Star card whose price exceeds `planMrcQar × 25`. Confirmed against the live seed: `+97499990000` is priced QAR 20,000, which exceeds even the highest entitlement in this journey's catalogue (PROD-106, MRC 750 → entitlement QAR 18,750), so it shows `+QR 1,250 extra` regardless of which plan was chosen upstream; a lower-MRC plan such as PROD-104 (MRC 350 → entitlement QAR 8,750) shows a larger overage (`+QR 11,250 extra`) on the same card |
| MPA-SCR-05-ST06 | Search narrows Free/Star list | Type an 8-digit fragment into "Search 8-digit number" (Free or Star tab only — hidden on Reserved) |
| MPA-SCR-05-ST07 | Pagination controls (Previous/Next) | Free tab with its 24 available numbers (> PAGE_SIZE of 10) — pagination renders since `pageCount > 1` |
| MPA-SCR-05-ST08 | Number selected — confirmation line | Click any available card; verbatim confirmation "Number selected and reserved for this order." appears |
| MPA-SCR-05-ST09 | Reservation cap reached / "You hold 2 of 2" state | Reach the Reserved tab for an agent already holding `MAX_RESERVATIONS_PER_AGENT` (2) numbers |

**Explicit negative/contrast state — Manual MSISDN Entry:** this journey passes `allowManualEntry={false}` (`NewPostpaidWizard.tsx:373`), so the "Manual MSISDN Entry" form (`MsisdnPicker.tsx:512-530` — Custom MSISDN input + "Reserve Custom Number" button) **never renders** in Mobile Postpaid Activation, regardless of selection state. This is a deliberate design decision specific to this journey — confirmed via the prop default: `allowManualEntry = true` is the component default, and the other four journeys sharing `MsisdnPicker` (FWA, Fixed Line Fibre, SIM & Number Management, Prepaid) omit the prop and therefore keep the form. Document this contrast explicitly rather than screenshotting an absent control; no MPA-SCR-05-ST for it.

## 5.4 UI elements and content
- **Tab strip** (fixed order for every channel as of 2026-09-28): "Free Numbers" / "Star Numbers" / "Reserved Numbers" (`TAB_LABELS`, `TAB_ORDER`, `:45-61`) — same active-tab red-text-plus-underline treatment as Plan & Add-ons' tabs
- **Reservation-cap line** (Reserved tab only): `"You hold {n} of {MAX_RESERVATIONS_PER_AGENT} reserved numbers."`, appending `" Release one before reserving another."` in warn colour once at cap (`:309-314`)
- **Search box** (Free/Star only, hidden on Reserved): aria-label/placeholder "Search 8-digit number" (`:319-329`)
- **Sort control** (Star tab only): label "Sort" (uppercase, muted) + `Select` with options "Price: high to low" (default) / "Price: low to high" / "Number: ascending" / "Number: descending" (`SORT_OPTIONS`, `:106-111`, `:341-351`)
- **BR-115 entitlement note** (Free and Star tabs, only when `planMrcQar` is known): verbatim, template-interpolated: `` `This plan entitles a Star Number up to QR ${planMrcQar * 25} at no extra charge. Anything above that is billed the difference.` `` (`:357-362`)
- **Number card grid:** two columns on Free/Star, one column on Reserved; each card shows (Reserved tab only) a "Reserved" `Badge`, the local-format number ("XXXX XXXX", `+974` prefix stripped, `toLocalMsisdn()`), and right-aligned "QR {priceQAR}"; a Star-range card with an overage additionally shows a small warn-coloured `"+QR {overage} extra"` line, rendered only when the overage is > 0 (`:396-457`)
- **Empty-list message** (per tab): Reserved → "You have no reserved numbers."; Free/Star with an active search → "No available numbers match that search."; Free/Star with no search → "No available numbers in this category." (`:461-469`)
- **Pagination footer:** "Previous"/"Next" ghost buttons plus `"Showing {from}-{to} of {total}"`, shown only when `pageCount > 1` (`:475-493`)
- **Selection confirmation:** verbatim "Number selected and reserved for this order." once any number is chosen (`:498-502`)
- **Manual MSISDN Entry section:** present only when `allowManualEntry` is true — **not applicable to this journey**, see §5.3 negative state above.

## 5.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-05-001 | Search 8-digit number | Text | No | Yes | empty | Free-text match against stored E.164 or displayed local digits (`:265-277`); not shown on Reserved tab |
| MPA-FLD-05-002 | Sort | Select | No | Yes, Star tab only | `'price-desc'` | Only 4 options listed above; Free/Reserved always effectively sort `number-asc` with no visible control |
| MPA-FLD-05-003 | MSISDN selection | Card click | Yes (gates Continue) | Yes — re-selectable | none | `Boolean(values.msisdn)`; selecting fires `onSelect(msisdn, priceQAR)`, populating both `values.msisdn` and `values.numberPriceQAR` |
| — | Custom MSISDN / "Reserve Custom Number" | N/A | N/A | N/A — **not rendered in this journey** | N/A | N/A — see §5.3 negative state; documented here only to record the field IDs are intentionally not allocated for this screen |

## 5.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-05-001 | Tab buttons (Free/Star/Reserved) | Tab/navigational | Always | `setTab(t)`; also resets `page` to 0 |
| MPA-BTN-05-002 | Number card (any) | Selectable card, full-card click target | Always for every listed row (no disabled state — only `AVAILABLE` or the agent's own `Reserved` rows are ever listed) | `onSelect(n.msisdn, n.priceQAR)` — sets `values.msisdn`/`values.numberPriceQAR` |
| MPA-BTN-05-003 | "Previous" / "Next" | Ghost, compact | Previous: `safePage > 0`; Next: `safePage < pageCount - 1` | Paginates the current tab's filtered/sorted list, 10 rows per page |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §5.2 gate | — |

## 5.7 User interactions
- Switch tabs → resets to page 0 of that tab's list; Reserved shows only this agent's own held numbers (`myReserved`, filtered by `reservedBy === agentName`, where `agentName` comes from `useAuthStore((s) => s.profile?.name)` — the sign-in identity's display name, **not** the persona/role label, `:169-173`)
- Type in search (Free/Star) → filters live, resets to page 0
- Change Sort (Star only) → re-sorts live, no page reset called out in source beyond the existing `safePage` clamp
- Click a card → immediately selects and "reserves" the number (no separate confirm step); confirmation line appears below the grid
- On first load of the number list, if this agent already holds a Reserved number, the tab auto-switches to Reserved once (`hasAutoSelectedTab` ref guards a single fire; does not re-fire on a later reservation made within the same session, `:190-196`)
- Keyboard: cards are native `<button>` elements (Enter/Space activate); tab buttons and Previous/Next likewise native buttons

## 5.8 Business rules
- MPA-BR-016 (BR-115 — star-number entitlement by plan value: `entitlementQar = planMrcQar × STAR_NUMBER_ENTITLEMENT_MULTIPLIER (25)`; overage billed is `max(0, round2(numberPriceQar − entitlementQar))`, `postpaidPricing.ts:56-73`. The 25× ratio is stated in source as the confirmed figure over a competing 50× figure that surfaced in the same request — see that module's own comment)
- MPA-BR-017 (Free/Star price-boundary rule: a number is "Free" if `priceQAR < FREE_NUMBER_PRICE_CEILING_QAR (1000)`, "Star" if `priceQAR >= 1000` — this is a price band, not the stored `category` field, per 2026-09-28 direction quoted in source: "Treat all numbers below QAR 1,000 as free to the customer". Confirmed in the live seed: `+97433001002` is stored `category: 'Star'` but priced QAR 500, so it lists under the Free tab by this rule)
- MPA-BR-018 (Reservation cap — `MAX_RESERVATIONS_PER_AGENT = 2`, enforced only on the action that CREATES a new hold via manual entry, not on re-selecting an existing hold; not independently evidenced as a numbered BR in `business-rules.json` — app-level constant per the component's own comment, `MsisdnPicker.tsx:74-79`)

## 5.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Search box | `tab !== 'Reserved'` | MPA-DP-031 |
| Sort control | `tab === 'Star'` | MPA-DP-032 |
| BR-115 entitlement note | `tab !== 'Reserved' && planMrcQar !== undefined` | MPA-DP-033 |
| Per-card overage line | `planMrcQar !== undefined && n.priceQAR >= FREE_NUMBER_PRICE_CEILING_QAR &&` `starNumberOverageQar(...) > 0` | MPA-DP-034 |
| Reservation-cap warning line | `tab === 'Reserved'` (base line always shows; the "Release one…" clause additionally requires `atReservationCap`) | MPA-DP-035 |
| Pagination footer | `pageCount > 1` for the current filtered/sorted list | MPA-DP-036 |
| Selection confirmation line | `selected` (a number is chosen) | MPA-DP-037 |
| Manual MSISDN Entry section | `allowManualEntry && !selected` — **`allowManualEntry` is hard-set `false`** for this journey, so this element is permanently absent regardless of selection state | MPA-DP-038 |
| "Reserved" badge on a card | `tab === 'Reserved'` | MPA-DP-039 |

## 5.10 Validation and error handling
No screen-level validation exists on this step beyond the Continue gate itself (`Boolean(values.msisdn)`) — every listed card is selectable with no disabled/error state, since only `AVAILABLE` or self-owned `Reserved` rows are ever shown (`:222-246`, component's own comment). The Manual MSISDN Entry validators (`isValidMsisdn`, reservation-cap error, already-taken error) exist in source (`:198-220`, `:604-617` approx.) but are **never reachable in this journey** since `allowManualEntry={false}` prevents that form from ever rendering here — not documented as MPA-VAL items for this screen because the code path is unreachable, not because it is undocumented.

## 5.11 Integration trigger points
- MPA-INT-011 — MSISDN inventory read (trigger point only — `mockDataEngine.list('numbers')`, `MsisdnPicker.tsx:180-182`)

## 5.12 Navigation behaviour
MPA-NAV-012 (Continue → SIM Type, standard). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged; no step-specific auto-advance/auto-skip exists on Number Selection itself (contrast with Plan & Add-ons' pre-bundled auto-advance and SIM Type's Physical auto-advance).

## 5.13 Related edge cases
- MPA-SCN-023 — Manual MSISDN Entry, offered by four sibling journeys sharing this same component, is unconditionally absent here (`allowManualEntry={false}`) — a deliberate Postpaid-only restriction per the 2026-09-28 direction quoted in source ("This section is not required"), not a bug or an omission.
- MPA-SCN-024 — The demo login persona ROLE-01/VFQ12341 (Fatima Al-Kuwari, USR-1101) already holds a Reserved number (`+97433001001`, priced QAR 0/Free-band despite `category: "Star"` in the raw record) — confirmed via `users-agents.json`/`personas.json` cross-reference. This makes the Reserved-tab auto-open state (MPA-SCR-05-ST02) directly reachable for the chosen demo persona, resolving the open question logged in `phase1-boundary-map.md:108` (which flagged this as needing Phase 2 verification against the actual demo agent identity `AGENT-KARTHIKK` — that placeholder id has since been repointed to Fatima Al-Kuwari/USR-1101 in `numbers.json`, per that file's own `_reservedByNote`).
- MPA-SCN-025 — Selecting a number already selected/reserved earlier in the same session is a no-op re-selection, not a new reservation against the 2-number cap (cap only applies to manually-entered new holds, which this journey cannot reach at all).

## 5.14 Persona-specific behaviour
The Reserved tab is inherently agent-identity-scoped: `myReserved` filters `numbers.json` by `reservedBy === agentName`, where `agentName` is the signed-in identity's display name from `useAuthStore`. This is not a role-based branch (no `PersonaCapability` or role-id check found in `MsisdnPicker.tsx`) but a data-scoping behaviour that differs by *which agent* is signed in — every one of the 26 roles sees the same component logic, but the Reserved tab's contents differ per the signed-in identity's own holds in `numbers.json`. Confirmed for ROLE-01 (Fatima Al-Kuwari) per §5.13; not yet checked against every other role's bound identity (preliminary — Phase 9 will verify exhaustively).

## 5.15 Accessibility
To be completed live in Phase 12.

## 5.16 Source references
- `NewPostpaidWizard.tsx:359-377` (step wiring, isValid gate, `allowManualEntry={false}`)
- `MsisdnPicker.tsx` (full component, 534 lines)
- `src/engines/postpaidPricing.ts:53-73` (`FREE_NUMBER_PRICE_CEILING_QAR`, `STAR_NUMBER_ENTITLEMENT_MULTIPLIER`, `starNumberOverageQar`)
- `public/mock-data/numbers.json` (38 records; confirmed Free/Star/Reserved seeding, and `+97433001001` reserved by "Fatima Al-Kuwari" via direct read)
- `public/mock-data/users-agents.json` (USR-1101 = Fatima Al-Kuwari)
- `public/config/personas.json` (ROLE-01/VFQ12341 → `identityUserId: USR-1101`)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/phase1-boundary-map.md:108` (prior open question this screen's fixture-check resolves)
