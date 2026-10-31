# Responsive Behaviour Catalogue (Phase 30)

Desktop vs. Tablet behavior differences, evidenced concretely in two places, plus the aggregate channel-coverage picture from `channel-architecture.md`. Mobile (phone form-factor) is **not evidenced** anywhere in the corpus as a distinct agent-facing channel — see §3.

---

## 1. Concrete evidenced Desktop-vs-Tablet divergence

### 1.1 SIM Swap Approval (UJ-091) — different queue names AND different step sequences, not just layout

This is the richest evidenced example of true responsive *behavioral* divergence (not just visual reflow) — the same business action (approve/reject a SIM Swap order) follows genuinely different navigation paths per channel:

| | Desktop | Tablet |
|---|---|---|
| **Entry point** | "SIM Swap Queue" | "Order Approval Queue" |
| **Steps** | Open queue → sort/search order → Assign to Me → open order (via Order ID hyperlink) → scroll down → Approve/Reject | Open queue → sort/search → Assign to Me → open order → **Validate Attachments** (extra step, not present on Desktop) → Approve/Reject-Drop Order |
| **Approve outcome** | Pop-up for comments → Submit → task closes, Order Completed | (not separately detailed, presumed same completion) |
| **Post-completion landing** | Task closes (implicitly returns to queue) | Explicitly returns to **My Activities Page** |
| **Reject outcome** | Pop-up for Rejection Reason + comments → Drop Order → order cancelled | Reject/Drop Order → order cancelled (same outcome, folded into one action set on Tablet vs. two-step Approve-or-Reject on Desktop) |

**Implication for the rebuild:** do not assume Tablet is simply a scaled-down Desktop layout — for at least this journey, Tablet has an additional evidenced validation step (Validate Attachments) that Desktop's walkthrough does not mention. Confirm with the business whether this is a deliberate tablet-specific control or a walkthrough-recording gap before deciding whether to replicate the asymmetry or unify the two paths in the new DXP.

### 1.2 CAF Signature Capture (Reusable Pattern 6) — explicit UI "shift" between form factors

SCR-019 (CAF tablet signature view) is explicitly described as the view "shifting between laptop and tablet views" for the signature-capture step — i.e. the source material itself documents a form-factor-driven UI change at this specific point in the flow (see `reusable-patterns.md` Pattern 6), rather than a uniform layout across channels.

---

## 2. Aggregate channel coverage (from `channel-architecture.md` §2)

| Channel | Screens | Journeys |
|---|---|---|
| Desktop (Open UI) | 95 | 13 |
| Tablet | 65 | 25 |
| Desktop (Vanilla/Manual) | 32 | 8 |

Tablet has **more journey-level coverage (25) than Desktop Open UI (13)** despite fewer total screens (65 vs. 95) — read together with §1's finding, this suggests Tablet guided journeys in this corpus tend to be documented as slightly more complete/longer end-to-end walkthroughs per journey, not that Tablet is a stripped-down channel.

---

## 3. Mobile (phone) — not evidenced

No source document shows an agent-facing phone-sized UI. The only phone-adjacent references are customer-facing: the My Vodafone (MVA) app and SMS deep-links (`notification-catalogue.md`, `channel-architecture.md` §4) — these are a **different, customer-direct channel** with zero UI screens evidenced in this corpus, not a responsive breakpoint of the agent-facing DXP. **Recommendation (Assumed):** do not build a phone-width responsive breakpoint for the agent-facing screens catalogued in `screens.md` — evidence points to exactly two agent-facing form factors (Desktop, Tablet), each with materially real content (not just breakpoint reflow), per §1.

## 4. Implementation recommendation

- Treat Desktop and Tablet as **two maintained UI variants sharing the same domain/pattern components** (`component-catalogue.md`), not one responsive layout with CSS breakpoints — the evidenced divergence in §1.1 is behavioral (extra validation step, different landing page), not purely visual.
- Where a journey has both a Desktop and a Tablet source document (`workflow-execution-matrix.md`'s per-journey scenario groupings already keep these separate — see its intro note on not merging channel variants), implement both explicitly rather than picking one as canonical and deriving the other via responsive CSS.
- No evidence supports a third (mobile-phone) breakpoint for agent-facing screens.
