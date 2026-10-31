---
slug: vfq-stack-modernization-br-29jun-updatev1-0-af309fe2
source: /Users/parithimalsaravanan/claude-projects/vfq/data/VFQ_Stack Modernization_ BR_29Jun_UpdateV1.0.pptx
sha256: d78708cf7673cc71888dd8f55424949546b16422019d0534201e3a98b646c707
indexed: 2026-08-20
confidence: medium
---

# VFQ Stack Modernization — Business Requirements Workshop, Day 3 (29 June 2026, Update V1.0)

**Type:** deck (business requirements workshop deck)
**Owner / author:** not stated (branded "BSS/OSS IT Stack Modernization Partnership")
**Date:** 29 June 2026 (stated on slide 1, "Day 3" of the workshop session); filename carries an "UpdateV1.0" version marker

## Purpose
Day 3 deck of the "BSS/OSS IT Stack Modernization Partnership" business requirement discussion workshop, covering two new journeys: J023 Mobile Service Suspension and J024 Mobile Service Resume, each with process flow and stated business rules.

## Key content
- **6 slides total.** Slide 1: title slide — "BSS/OSS IT Stack Modernization Partnership, Workshop Session: Business Requirement Discussions (Day 3)", dated "29thth June 2026" (sic, extraction artifact of "29th"). The filename itself carries the marker "UpdateV1.0", but no in-slide "changes since" section or version log was found in the extracted text.
- **Slide 2** — no extractable text.
- **Slide 3 — "J023: Mobile Service Suspension"**: Actors: Customer, Agent in DXP. Flow: request service suspension (via Email, Phone, or Retail Counter) → identify subscriber → search (MSISDN/Account) → fetch customer & billing details → validate customer and suspend eligibility → agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X") → send communication to customer → ticket creation and approval needed → capture payment for suspension, collected in WinCash → submit the order → end. Note: "Pending Bill, Current unbilled must be cleared" stated as a condition.
  - **Stated Business Rules** (quoted): "1) The modify order is initiated by the Agent in DXP. 2) The agent either suspends the service or changes the SIM to a park plan. 3) The order is submitted by the Agent in DXP to apply the change."
- **Slide 4** — no extractable text.
- **Slide 5 — "J024: Mobile Service Resume"**: Actors: Customer, Agent in DXP. Flow: request service resume (via Email, Phone, or Retail Counter) → identify subscriber → search (MSISDN/Account) → fetch customer & billing details → validate customer and resume eligibility → agent changes current Park Plan back to Base Plan (fetched from "Launch X") → send communication to customer → ticket creation and approval needed → capture payment of resume service via WinCash → submit the order → end. Note: "Base Plan would be Billed" stated as an outcome.
  - **Stated Business Rules** (quoted, identical wording to J023's slide): "1) The modify order is initiated by the Agent in DXP. 2) The agent either suspends the service or changes the SIM to a park plan. 3) The order is submitted by the Agent in DXP to apply the change." (Note: this rule text appears to be reused/copy-pasted from the J023 slide and does not specifically describe a "resume" action — possible carryover/drafting artifact in the source deck, flagged as-is rather than corrected.)
- **Slide 6** — no extractable text.

## Cross-references
- Follows the workshop series after vfq-stack-modernization-br-28jun-75f28727 ("VFQ_Stack Modernization_ BR_28Jun.pptx", Day 2) and, further back, vfq-stack-modernization-br-25jun-03c2aa09 ("VFQ_Stack Modernization_ BR_25Jun.pptx", Day 1). This deck introduces entirely new journey content (J023, J024) not present in either prior day's extracted text — it does not appear to be a revision of the J011/J017 content from Day 1/Day 2, despite the "UpdateV1.0" filename marker.
- The "UpdateV1.0" designation in the filename could not be corroborated against specific changed content in this batch, since the corresponding "base" (non-Update) 29Jun deck, if one exists, was not provided for comparison.
- References "Launch X" as a system/module for fetching plan data (park plan, base plan) — not otherwise defined in the extracted text; may relate to systems described in other indexed documents (not verified in this batch).

## Extraction notes
Confidence set to medium: total extracted text is thin (1,688 characters across 6 slides), with slides 2, 4, and 6 yielding no text at all (likely image/diagram-only or blank). The J023 and J024 process-flow diagrams were extracted as flattened text (shape/connector structure and any swimlane layout lost). No explicit "what changed" content tied to the "UpdateV1.0" label was found in the extracted text — the version relationship to a prior 29Jun deck is stated only in the filename, not confirmed from document content.
