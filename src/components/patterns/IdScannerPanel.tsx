import type { MutableRefObject } from 'react';
import { QidImageUpload } from '../domain/QidImageUpload';
import { idTypesFor } from '../../data/idTypes';
import { idTypeLabel, type QidType } from '../domain/QidInput';
import type { SpecimenIdentity } from '../domain/ScannedIdPreview';
import type { IdLookupValue } from './idLookupModel';

/**
 * The scanner section of the ID lookup: the document being read (or why there is none), the two-face
 * capture, and the retake / fallback behaviour around it. Shown only when the selected document type can
 * be scanned. It owns no state: everything the lookup step tracks comes in as props.
 */
export function IdScannerPanel({
  value,
  onChange,
  latest,
  idType,
  verifyThenFetch,
  autoDetectIdType,
  contextNoDocument,
  contextHeldTypes,
  contextIdentity,
  scanComplete,
  setNotFound,
  clearReconciliation,
  demoType,
  handleScanAttempt,
  handleDemoScan,
  scanBudgetSpent,
}: {
  value: IdLookupValue;
  onChange: (v: IdLookupValue) => void;
  latest: MutableRefObject<IdLookupValue>;
  idType: QidType;
  verifyThenFetch: boolean;
  autoDetectIdType: boolean;
  contextNoDocument: string | undefined;
  contextHeldTypes: string[];
  contextIdentity: SpecimenIdentity | undefined;
  scanComplete: boolean;
  setNotFound: (v: boolean) => void;
  clearReconciliation: () => void;
  demoType: QidType | null;
  handleScanAttempt: () => boolean;
  handleDemoScan: (type: QidType) => void;
  /** The scan attempts are used up (not merely that manual entry is open). */
  scanBudgetSpent: boolean;
}) {
  return (
    <div className="space-y-2">
      {/* The scanner card carries its own "Scan Identity Document" heading, so nothing is repeated
          above it before a read. Once a scan has resolved, name what was found ("Document detected: X"; "Qatar
          ID" for QID, the type itself for the other three). Never name a type before the reader has identified it. */}
      {value.idNumber && !verifyThenFetch && (
        <p className="text-[length:var(--fs-label)] text-fg-2">
          {`Document detected: ${idType === 'QID' ? 'Qatar ID' : idType}`}
        </p>
      )}
      {contextNoDocument ? (
        <div role="status" className="card card-surface p-6 text-center space-y-1">
          <p className="text-fg font-semibold">
            {contextHeldTypes.length > 0 ? `No ${idTypeLabel(idType)} on file for ${contextNoDocument}` : `No identity document on file for ${contextNoDocument}`}
          </p>
          <p className="text-fg-2 text-[length:var(--fs-caption)]">
            {contextHeldTypes.length > 0
              ? `They hold: ${contextHeldTypes.map((t) => idTypeLabel(t as QidType)).join(', ')}. Choose that ID type, or enter the number manually.`
              : 'There is no card to read for this customer. Enter the ID number manually.'}
          </p>
        </div>
      ) : (
      <QidImageUpload
        identity={contextIdentity}
        value={value.qidScans ?? {}}
        onChange={(qidScans) => {
          // A Retake DISCARDS the previous read - the number that was
          // extracted and the MOI result fetched from it. Without this the
          // screen contradicted itself: the scanner showed a rescan in
          // progress while "MOI validated successfully" and the prefilled
          // identity fields stayed on display, for a document the reader
          // was at that moment re-reading. (Before retakes drove the
          // reader, the same contradiction showed the insert prompt
          // instead of a spinner.)
          //
          // This fires on the clear QidImageUpload performs at the START
          // of a retake pass, which is also what keeps the auto-fetch
          // effect below from re-reading the number mid-pass: scanComplete
          // goes false, so it resets and waits for the new capture. GuidedContactStep clears its
          // six identity fields from a cleared moiResult on its own, and
          // the step's isValid gate goes back to failing, so Continue is
          // no longer available against a discarded read.
          const stillComplete = Boolean(qidScans.frontScanned && qidScans.backScanned);
          if (scanComplete && !stillComplete) {
            setNotFound(false);
            clearReconciliation();
            onChange({ ...value, qidScans, idNumber: '', scannedExpiry: undefined, moiResult: undefined });
            return;
          }
          // An upload that replaces a scan (or the other way round) starts the number and expiry afresh: they are typed for an upload.
          if (scanComplete && stillComplete && (qidScans.source === 'upload') !== (value.qidScans?.source === 'upload')) {
            setNotFound(false);
            clearReconciliation();
            onChange({ ...latest.current, qidScans, idNumber: '', scannedExpiry: undefined, moiResult: undefined });
            return;
          }
          // latest, not the closure: a retake's completion fires ~900ms after it
          // started, through the onChange captured THEN - spreading that stale
          // `value` restored the number the retake had just cleared.
          onChange({ ...latest.current, qidScans });
        }}
        // Names the document in the card's captions and picks its
        // artwork - the QID specimen must not stand in for a Diplomatic
        // ID.
        documentType={demoType ?? idType}
        onScan={handleScanAttempt}
        // DEMO ONLY - see QidImageUpload.demoTypes. All four are offered,
        // including the two this journey cannot sell against, because the
        // point is to show what each document looks like coming off the
        // reader.
        //
        // Scoped to the scan-first flow. The eight journeys that still lead
        // with a type selector would otherwise show two ways to pick a type
        // on one screen, one of them labelled "demo" - which reads as a
        // broken duplicate rather than as a demo aid.
        demoTypes={!autoDetectIdType ? undefined : idTypesFor('all').map((t) => ({
          value: t,
          // idTypeLabel, not the raw union member, so the link reads
          // "Qatar ID" rather than "QID" while still carrying the type.
          label: idTypeLabel(t),
        }))}
        onDemoScan={(t) => handleDemoScan(t as QidType)}
        // DEMO ONLY, same scope as demoTypes above and for the same reason:
        // the eight selector-led journeys have no "Document detected"
        // auto-extraction step for a forced blur-then-retake to demonstrate,
        // so only the scan-first flow gets the blurred-first-pass behaviour.
        blurFirstScan={autoDetectIdType}
        hideUnclearNotice={verifyThenFetch}
        // Budget spent: the reader is done, so the card stops offering to
        // drive it and the error below becomes the only instruction.
        // Switching ID type resets the budget (handleIdTypeChange), which
        // is the one way back to scanning - a different document deserves
        // its own attempts.
        canScan={!scanBudgetSpent}
        // Wording per the 2026-09-27 walkthrough. It names the barcode as
        // well as manual entry because both are real fallbacks at the
        // counter, and says "after the permitted attempts" so the agent
        // knows the reader is out of tries rather than merely unlucky.
        error={
          scanBudgetSpent
            ? [
                'We could not read the document after the permitted attempts.',
                'Select the ID type and enter the number manually to continue.',
                "Manual entry requires Store Manager's approval for activation.",
              ]
            : undefined
        }
      />
      )}
    </div>
  );
}
