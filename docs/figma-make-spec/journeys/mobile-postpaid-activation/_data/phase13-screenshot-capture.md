# Phase 13 — Screenshot Capture

Journey: Mobile Postpaid Activation (MPA)
Method: Playwright, attached via CDP to a manually-started `chrome-headless-shell` daemon (see `chrome-daemon.sh` and the note in `capture-happy-path.mjs`/`capture-scenarios.mjs`) — the sandboxed shell this was authored in cannot let Playwright's own `chromium.launch()` manage a browser subprocess (`kill EPERM` on cleanup).

## Final, verified screenshot set (6 states)

Every image below was opened and visually confirmed to show what its filename claims before being kept. This replaces an earlier batch of 12 files, 7 of which were found on inspection to be mislabeled (see "Integrity finding" below) and have been removed.

| Screen-state ID | What it shows | Verified |
|---|---|---|
| MPA-SCR-01-ST01 | Contact step, default/unscanned — "Scan customer's identity document", Initiate scan button, ID-type demo links | Yes — visually confirmed |
| MPA-SCR-01-ST02 | Contact step, scan captured but unreadable — QID front/back preview images, "Image unclear - the reader could not read this capture. Retake scan for a clear image.", Retake scan button | Yes |
| MPA-SCR-01-ST02b | Contact step, scan attempts exhausted — "CARD COULD NOT BE READ", full ID-type selector re-shown (Qatar ID selected), manual "Qatar ID (QID) Number" field + Fetch button. **Not in the original state plan** — added because it's a real, distinct state the capture run surfaced, and discarding the evidence would have been worse than documenting it under a new id. | Yes |
| MPA-SCR-01-ST08 | Contact step, identity fully resolved (MOI validated successfully, Ahmed Al-Sulaiti's details populated, "Eligibility confirmed" toast) with a malformed email ("not-an-email") showing "Please enter a valid email address." | Yes |
| MPA-SCR-01-ST09 | Same screen as ST08 — both the email and alt-phone validation errors are visible simultaneously in that one state, so this id is a deliberate duplicate of ST08's pixels, not a distinct capture. Kept because the state plan asked for both error ids explicitly. | Yes |
| MPA-SCR-11-ST01 | Abandon confirmation modal open ("Abandon this order?", Keep working / Abandon Order) over the Contact step | Yes |

## Integrity finding — 7 screenshots were mislabeled and have been removed

The first capture pass produced 12 files. On visual verification (opening each PNG, not just trusting the script's own success log), **MPA-SCR-01-ST04, MPA-SCR-01-ST04c, MPA-SCR-02-ST03, MPA-SCR-03-ST01, MPA-SCR-04-ST01, MPA-SCR-05-ST01, and MPA-SCR-07-ST01 all turned out to be pixel-identical (or near-identical) captures of the same "CARD COULD NOT BE READ" Contact-step state** — not the Communication Address, Billing Profile, Plan & Add-ons, Number Selection, or Checkout screens their filenames claimed, and not the "clean pass, MOI resolved" state ST04/ST04c claimed either.

Root cause: `capture-happy-path.mjs`'s navigation steps (`clickContinue`) failed silently into the `safe()` wrapper on almost every step after the initial scan, because the Contact step's own scan simulation landed on its failure branch that run (see below) rather than resolving MOI - and the script still took each planned screenshot regardless of whether the preceding navigation actually succeeded, capturing the same stuck screen repeatedly under progressively-later screen-state ids. This was only caught by actually opening the images, not by reading the script's console output, which reported every step as either a caught `STEP FAILED` (with the run continuing) or a plain `captured <id>` with no verification that the click before it had landed.

These 7 files have been deleted rather than kept as placeholders. The screens they were meant to show (Communication Address after auto-skip, Billing Profile, Plan & Add-ons, Number Selection, SIM Type, Checkout, CAF & Signature, Payment, Confirmation, and the eligibility-branch states ST04/ST05/ST06/ST07) are recorded as **not captured** in this pass — see below.

## The real root cause: the identity-scan simulation is non-deterministic, not the deterministic behaviour assumed in Phase 0/1

`phase1-boundary-map.md` and `phase0-reconnaissance.md` documented specific QID/document numbers as reliably reachable via "scan, then retake until manual entry unlocks." Direct, repeated testing in this phase found that assumption **wrong in an important way**:

- Clicking an ID-type button (e.g. "Qatar ID (QID)") triggers a simulated scan that resolves **non-deterministically** to one of two outcomes: (a) a successful read, which auto-fills `#qid-number-input` as a **read-only** resolved value — in practice always CUST-1001 / `28456701234`, since with `autoDetectIdType` on, the scan searches QID and Diplomatic ID together and (per `IdLookupStep.tsx`'s `readDocumentFromScan`) always returns the first unexpired match in `identity-documents.json` file order, which is CUST-1001 — or (b) "CARD COULD NOT BE READ" after the 2-attempt budget is exhausted, which leaves `#qid-number-input` genuinely **empty and editable**, with a working "Fetch" button that submits whatever number is typed (confirmed: the lookup matches by `documentNumber` alone, regardless of which ID-type button is currently selected).
- Which of the two occurs was not observed to be controllable by anything the automation does (number of retakes, which button is clicked, timing) — it appears to vary between attempts at the same point in the same flow.
- This means: reaching CUST-1001 (the happy-path customer) is achievable either way (outcome (a) directly, or outcome (b) by then typing `28456701234` into the now-unlocked field) — **but reaching CUST-1004, CUST-1006, or CUST-9001 requires outcome (b) to occur** on that attempt, since only the manual-entry path accepts an arbitrary number. A retry helper (`resolveIdentity` in `capture-scenarios.mjs`, restarting the whole Contact step up to 5 times via `sessionStorage.clear()` + reload) was built to keep trying until outcome (b) hits, but **did not succeed within that budget for any of CUST-1006 (hard-stop), CUST-1004 (soft-stop), or CUST-9001 (approval-routing)** in this run.

This corrects the earlier documentation's framing: these three eligibility branches are not confirmed unreachable, and they are not reliably reachable either — reachability depends on a scan outcome this build does not expose any way to force. Phase 16's verification section carries this correction formally.

## What was not captured, and why

| Not captured | Reason |
|---|---|
| MPA-SCR-01-ST04 (clean pass, MOI resolved, no other content on screen) | Every attempt in this run either matched ST01/ST02/ST02b or proceeded straight to identity fields being visible (as in ST08) — a bare "resolved, nothing else yet" moment was not independently caught. |
| MPA-SCR-01-ST05 (hard-stop, CUST-1006) | Scan simulation did not land on the manual-entry outcome for this customer within 5 restart attempts — see above. |
| MPA-SCR-01-ST06 (soft-stop, CUST-1004) | Same reason. |
| MPA-SCR-01-ST07 (approval-routing, CUST-9001) | Same reason. |
| MPA-SCR-12-ST01 (eligibility checks drawer) | Not attempted after the above; depends on reaching a resolved identity first, which the happy-path run did not reliably do this pass. |
| MPA-SCR-02 (Communication Address, all sub-states) | Not reached — see the mislabeling root cause above. |
| MPA-SCR-03 through MPA-SCR-10 (Billing Profile through Confirmation, all sub-states) | Not reached this pass, for the same reason. The 9 screenshots from the very first capture run (before the mislabeling was caught) that claimed to show these screens have been deleted as inaccurate. |
| MPA-SCR-13 (Billing Setup drawer), MPA-SCR-14 (Signature Pad drawer), MPA-SCR-15 (Plan Details drawer) | Not reached — depend on the Billing Profile / Plan & Add-ons / CAF steps, none of which were reached this pass. |
| Physical SIM path, payment declined, session-expired states | Not reached — the scenario script's attempts (F, G) failed at the first `Continue` click after identity resolution, for reasons not fully root-caused before this phase was stopped (see below). |
| Mobile viewport (390×844) capture | Not attempted this pass — desktop capture alone consumed the available time budget. |

## Why this phase stopped here

Screenshot capture for this journey required solving, in order: (1) Playwright's `chromium.launch()` being unable to manage a browser process in this sandbox, (2) `chrome-headless-shell` exiting the instant its last tab closes, (3) a CDP session becoming unusable after any `page.close()` cycle on a shared daemon, (4) a hard `page.goto()` to a deep route not reliably bringing up the SPA the way a real client-side click does, (5) the manual-entry field's actual selector and submit mechanism, and (6) the scan simulation's non-determinism. Each was root-caused with direct evidence (not guessed) and fixed or worked around. Given the cumulative time already spent, and that the workflow's own instructions permit recording unreachable/uncaptured states with reasons rather than exhaustively perfecting automation, further debugging of the remaining gaps (F/G's post-identity `Continue` timeout, and forcing the scan-failure branch for CUST-1004/1006/9001) was not pursued further in this pass.

## Counts

- **Planned** (per `phase1-boundary-map.md` §7): ~75 states across 15 screens/surfaces, desktop + mobile where responsive.
- **Captured and verified accurate**: 6 states, desktop only, all on the Contact step or its Abandon modal.
- **Captured and found inaccurate, then removed**: 7 (documented above, not counted as captured).
- **Not attempted / not reached**: the remainder.
