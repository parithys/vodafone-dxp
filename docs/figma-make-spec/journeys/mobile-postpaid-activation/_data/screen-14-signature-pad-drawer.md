# MPA-SCR-14 — Signature Pad Drawer

Component: `Drawer` wrapping `SignaturePad` primitive (`src/components/patterns/CafSignatureCapture.tsx:284-291` for the customer-facing/auto-detect render path used by this journey; an equivalent instance also exists at lines 398-405 for the legacy non-postpaid render path, not used here).

## 14.1 Purpose
Capture an in-app hand-drawn signature as a data URL, for the Digital and Touch Screen CAF types (both require in-app signing under this journey's `autoDetectDeviceType` behavior — see MPA-SCR-08).

## 14.2 Entry / exit conditions
- **Entry:** click "Please Sign" button on the CAF preview box (MPA-SCR-08), available once `cafType` auto-detection has resolved.
- **Exit:** "Done" (captures the drawn signature as a data URL, closes, marks the CAF step signed and locked) or "Clear" (resets the canvas, stays open).

## 14.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-14-ST01 | Open, empty canvas | Click "Please Sign" |
| MPA-SCR-14-ST02 | Mid-draw | Draw a partial signature stroke |
| MPA-SCR-14-ST03 | Drawn, ready to confirm | Complete a signature stroke before clicking Done |

## 14.4 UI elements and content
- **Drawer title (verbatim):** "Please Sign"
- `SignaturePad` canvas component (drawing surface), with "Done" and "Clear" controls (exact button labels/layout not independently re-verified beyond the component name — `SignaturePad.tsx` itself was not read in this pass; flagged for Phase 12/13 live confirmation)

## 14.5 Field specifications
| ID | Label | Type | Mandatory | Validation |
|---|---|---|---|---|
| MPA-FLD-14-001 | Signature canvas | Drawing/canvas input | Yes (for Digital CAF type; see MPA-SCR-08 isValid) | Must have at least one stroke to produce a non-empty data URL on Done |

## 14.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-14-001 | "Done" | Primary | Presumed always enabled (not confirmed whether disabled on an empty canvas — flagged for live verification) | Captures canvas as data URL, calls `onDone(dataUrl)`, which sets `caf.signatureDataUrl` on the parent step and closes the drawer |
| MPA-BTN-14-002 | "Clear" | Secondary | Presumed always enabled | Resets the canvas without closing the drawer |

## 14.7 User interactions
Pointer/touch drag to draw; "Done" commits, "Clear" resets. Exact keyboard-accessibility of a canvas-based signature pad is a known general accessibility risk for this pattern — flagged explicitly for Phase 12 (WCAG 2.2 AA observations), since canvas drawing has no native keyboard equivalent unless the component provides one.

## 14.8 Business rules
None specific — feeds MPA-SCR-08's `isValid`/`locksAfter` gates directly (a non-empty `signatureDataUrl` is what satisfies the Digital-CAF-type validity condition and triggers the lock).

## 14.9 Conditional display rules
Only rendered for Digital and Touch Screen CAF types (both require in-app signing under `autoDetectDeviceType`); never shown for a Manual CAF type — though Manual is documented as dropped entirely under auto-detection for this journey (see MPA-SCR-08), so in practice this drawer is used on every run of this journey once CAF type resolves.

## 14.10 Validation and error handling
No explicit inline validation message found; the gate is structural (Continue disabled at the wizard level until `signatureDataUrl` is present).

## 14.11 Integration trigger points
None — signature capture is purely local (canvas → data URL), no external signing service.

## 14.12 Navigation behaviour
Closing on "Done" returns to the CAF screen, now showing the "Signed" badge and a thumbnail of the captured signature; the step's `customerFacing` flag flips to false at this same moment (see MPA-SCR-08 §8.9), restoring the normal wizard chrome (rail, Back/Continue footer) the customer-facing render had hidden.

## 14.13 Related edge cases
MPA-SCN-057 — signing on a touch-capable device (Touch Screen CAF type) vs. a desktop/laptop (Digital CAF type) — both funnel through this same drawer under `autoDetectDeviceType`, per MPA-SCR-08's own auto-detection logic.

## 14.14 Persona-specific behaviour
None found.

## 14.15 Accessibility
To be completed live in Phase 12 — flagged in advance (§14.7) as a likely WCAG 2.2 AA gap given the canvas-drawing interaction pattern.

## 14.16 Source references
- `CafSignatureCapture.tsx:284-291` (Drawer + SignaturePad instantiation, postpaid/auto-detect render path)
- `CafSignatureCapture.tsx:213-222` ("Please Sign" trigger button / "Signed" badge post-capture)
