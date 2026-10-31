import { type IdVariant, type SpecimenIdentity } from './ScannedIdPreview';

/**
 * A completed capture (both sides, scan or upload) that is clear enough to read is accepted as it lands - no confirmation step. An unclear
 * one is not: the agent rescans, and the rescan replaces it.
 */
export const isScanAccepted = (v: Pick<QidImageUploadValue, 'frontScanned' | 'backScanned' | 'clear'> | undefined): boolean =>
  Boolean(v?.frontScanned && v.backScanned && v.clear !== false);

export interface QidImageUploadValue {
  frontScanned?: boolean;
  backScanned?: boolean;
  /**
   * Data URL of a real capture, when there is one. Nothing sets this today -
   * there is no scanner and no file input - but the preview honours it, so a
   * real capture path only has to write here.
   */
  frontImage?: string;
  backImage?: string;
  /** How the document came in: absent / 'scan' for the reader, 'upload' for files uploaded in its place. */
  source?: 'scan' | 'upload';
  /** Upload only: one file shows both sides (a single image or PDF), so it stands for the front and the back. */
  combined?: boolean;
  /** Upload only: the name of the file each side came from, for the attachment and the card. */
  frontFile?: string;
  backFile?: string;
  /** Upload only: the front/back assignment of a pair is settled (by the file names, or by the agent's swap). */
  sidesSet?: boolean;
  /** A scan only: the identity printed on the card as the reader captured it (an upload reads nothing). Dates are DD/MM/YYYY. */
  captured?: { name?: string; dob?: string; nationality?: string };
  /**
   * Whether the completed scan is sharp enough to read. Set by this
   * component, not the caller: true unless `blurFirstScan` is on AND this
   * was the first pass over the reader. See ScannedIdPreview.clear for what
   * it drives visually.
   */
  clear?: boolean;
}

export interface QidImageUploadProps {
  /** Whose document the drawn capture shows - see ScannedIdPreview.identity. */
  identity?: SpecimenIdentity;
  /** Layout of the drawn capture - see ScannedIdPreview.variant (the B2B2C / Retired / MADA office ID cards). */
  variant?: IdVariant;
  /** A clear scan needs no confirmation: it is accepted and saved as soon as it completes; an unclear one is rescanned. */
  value: QidImageUploadValue;
  onChange: (value: QidImageUploadValue) => void;
  /**
   * Called once per pass over the reader - an Initiate AND every Retake, both
   * of which drive the reader - when the pass COMPLETES, before any value is
   * written. One charge per physical pass either way, but adjudicating at the
   * end means a consumer's "budget spent" state, and any fallback it gates on
   * that, arrives with the failure rather than while the card is still
   * visibly reading.
   *
   * Return false to fail the pass: no capture is written, the card lands back
   * on the insert prompt once the pass ends, and the caller can render `error`
   * and open whatever fallback it owns.
   *
   * Optional, defaulting to always succeeding, because only IdLookupStep has
   * an attempt budget and a manual-entry fallback. The Verification Gate, SIM
   * Swap and Passport-to-QID all just need the scan to land.
   */
  onScan?: () => boolean;
  /** Rendered inside the insert zone, after a failed scan. */
  /** A string, or a list of lines (an array renders as bullet points). */
  error?: string | string[];
  /**
   * Whether the reader can still be driven. Default true.
   *
   * Pass false once the consumer's attempt budget is spent: the insert zone
   * keeps the prompt and the `error`, but drops the Initiate button. A scan
   * that can never succeed should not be offered - left live it spun for
   * 900ms and returned to the same prompt, which reads as a broken button
   * rather than as a reader that has given up, and the agent can sit there
   * pressing it. The same reason Retake is absent before the first capture.
   */
  canScan?: boolean;
  /** Offer both "Initiate scan" and "Upload document" on every device. Default: the device decides (web scans, tablet uploads). */
  bothCaptureActions?: boolean;
  /**
   * Which document is in the reader. Defaults to 'QID', which is what the
   * three journeys other than IdLookupStep capture.
   *
   * Drives the face captions and, in ScannedIdPreview, whether the back face
   * carries a barcode - only the Qatar ID does.
   */
  documentType?: string;
  /**
   * DEMO ONLY (2026-09-28, requested as such). Document types offered as text
   * links under the Initiate button; clicking one names the card and runs the
   * scan.
   *
   * This deliberately re-opens a door closed on 2026-09-25, when a
   * "Simulate scan failure" button and a "Scan attempts: n / 4" counter were
   * removed from this card for exposing the simulation. Those were debug
   * leftovers; these are an explicit demo affordance, labelled as such on
   * screen so nobody mistakes them for production. Omit both props and the
   * card renders exactly as before.
   */
  demoTypes?: { value: string; label: string }[];
  onDemoScan?: (type: string) => void;
  /**
   * DEMO ONLY (2026-09-28, requested as such). When on, the FIRST pass over
   * the reader always comes back blurred - unreadable, forcing a Retake -
   * and every pass after that is clear. Defaults to false/undefined, which
   * reproduces the exact prior behaviour (every pass clear) for
   * VerificationGate, SIM Swap and Passport-to-QID, none of which this was
   * requested for and none of which have an OCR-extraction step for a blur
   * to plausibly block.
   *
   * Scoped in IdLookupStep to `autoDetectIdType` - the scan-first flow this
   * was asked for - rather than passed unconditionally to every IdLookupStep
   * caller, for the same reason: the eight selector-led journeys have no
   * "Document detected" auto-extraction either, so a forced blur-then-retake
   * there would be a new hurdle with nothing behind it to demonstrate.
   */
  blurFirstScan?: boolean;
  /** Omit the "Image unclear" line under a blurred capture - for a flow where the agent spots the bad read themselves. */
  hideUnclearNotice?: boolean;
}

// FLD (Passport to QID journey, UJ-076): "scan/upload QID Front & Back" required
// before Continue - no real file I/O in a front-end-only app, so scanning is
// simulated, matching the mandatory-gating shape evidenced elsewhere
// (Pattern 12).
//
// ONE SCANNING OPERATION, not two. The reader takes the card once and reads
// both faces, so this is a single card with a single action and a single
// Retake - superseding the 2026-09-25 build where front and back were separate
// cards with their own Initiate and Retake buttons. That shape implied the
// agent feeds the card through twice and, worse, allowed a half-scanned state
// that every consumer had to treat as invalid anyway.
//
// The VALUE CONTRACT is deliberately unchanged: a scan still writes
// frontScanned AND backScanned, and all four consumers still gate on both.
// That is what let this be restructured without touching VerificationGate,
// NewSimSwapWizard or PassportToQidWizard - they each require both flags, and
// both flags now flip together.
//
// Two blocks: capture area, action. No header of its own.
//
// The card carried a "Qatar ID" title and, briefly, a "WAITING..." /
// "CAPTURED" state pill beside it. Both are gone, for the same reason: the
// caller already labels this section ("Scan Qatar ID" in IdLookupStep), the
// capture area IS the state - an insert prompt or two photographs - and the
// MOI badge that sat here for one revision now lives on the number field's
// label row. A header with nothing left to say is just an indent.
//
// - Capture area: a dashed insert zone before the scan, both faces after it.
//   Dashed, not solid, because the border is around an EMPTY target rather
//   than around content - the same distinction the rest of the re-skin draws
//   with its 1px solid borders.
// - Action: Initiate before, Retake after. RETAKE DRIVES THE READER ITSELF as
//   of 2026-09-26 - one press rescans, where it used to clear the card back to
//   the insert prompt and wait for a second press on Initiate. The card in
//   this journey never leaves the reader between reads, so sending the agent
//   back to "Insert card and initiate scan" asked them to re-seat a document
//   that was already seated, and cost two presses for one physical action.
//   Retake also carries the number of completed retakes, so the agent can see
//   how many reads this document has taken without counting them.
//
// Departures from the 2026-09-25 reference image, which showed the two-card
// shape. The first two are direct instructions, the rest are so the card obeys
// this app's tokens rather than restating the asset's literal values:
//
// - One card and one Retake, per above.
// - Retake is ABSENT before the first capture, where the asset greys it out.
//   A control that cannot act yet is noise in a step the agent reads top to
//   bottom, and "retake" is meaningless when nothing has been taken.
// - The primary action is --accent, not the asset's near-black. Primary
//   actions are brand red everywhere in this app, and a charcoal fill has no
//   dark-mode value (--charcoal-panel is #21232b against a #1b1d23 zone -
//   effectively invisible). Position, weight and fill-vs-outline all match.
// - The prompt sits at --fg-2, not the asset's light grey. --muted on
//   --surface-subtle is 4.33:1, just under SC 1.4.3's 4.5:1 at this size.
//   --fg-2 is 6.37:1 and still reads as secondary beside the --fg title.

// How long the simulated reader takes. In the same 200-600ms family as
// mockDataEngine's artificial latency, at the top of it because this stands in
// for a physical pass over a card rather than a data read.
export const SCAN_DURATION_MS = 900;
