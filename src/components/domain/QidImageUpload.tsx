import { useEffect, useRef, useState } from 'react';
import { SCAN_DOCUMENT_TITLE } from './scanDocumentLabels';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Spinner } from '../primitives/Spinner';
import { ScannedIdPreview, capturedFromCard } from './ScannedIdPreview';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';
import { SCAN_DURATION_MS } from './qidImageUploadModel';
import type { QidImageUploadProps } from './qidImageUploadModel';
import { PassportScanSections } from './PassportScanSections';
import { ScanFailureNotice } from './ScanFailureNotice';
import { IdFileUpload } from './IdFileUpload';
import { applyIdUpload, missingUploadSide, removeIdUpload, swapUploadedSides, uploadedSidesInverted } from './idUploadModel';
import { SCAN_CORNERS, TRASH } from '../../assets/icons';


// The four corner brackets of a scan frame.


export function QidImageUpload({
  value,
  onChange,
  onScan,
  onRetakeDone,
  error,
  canScan = true,
  bothCaptureActions = false,
  readerEverywhere = false,
  documentType = 'QID',
  demoTypes,
  onDemoScan,
  blurFirstScan = false,
  hideUnclearNotice = false,
  variant,
  identity,
  onVerify,
  verifying,
  verified,
}: QidImageUploadProps) {
  const scanned = Boolean(value.frontScanned && value.backScanned);
  // An upload with only one side in so far.
  const missing = missingUploadSide(value);
  // A pair whose file names say the sides are the wrong way round (e.g. uploaded before names were read) is put right, once.
  const inverted = uploadedSidesInverted(value);
  useEffect(() => {
    if (inverted) onChange(swapUploadedSides(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inverted]);

  // Which pass is running, or null when the reader is idle. One state rather
  // than a boolean plus a separate "was this a retake" flag, because a retake
  // clears the capture before its pass starts - so `scanned` cannot answer
  // which kind of pass this is once it is under way.
  const [pass, setPass] = useState<'first' | 'retake' | null>(null);
  const scanning = pass !== null;
  // Completed retakes, for the button's label. Counted on success, because the
  // label reports reads the agent GOT - an attempt the reader refused produced
  // no scan to number.
  //
  // Local, like IdLookupStep's attempt budget and for the same reason: this
  // describes one sitting at the counter, not the order. It is deliberately
  // NOT the same number as that budget, which counts attempts including the
  // failed one; these answer different questions and neither can be derived
  // from the other.
  const [retakes, setRetakes] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The reader is mid-pass when the step unmounts - an ID Type switch, or the
  // agent leaving the journey. Without this the timer still fires and writes a
  // completed scan into a step that is gone.
  useEffect(() => () => clearTimeout(timer.current), []);

  const runScan = () => {
    if (scanning || !canScan) return;

    // Whether this pass is a retake has to be read BEFORE the value is
    // cleared, since clearing is what makes `scanned` false.
    // A retake is a second pass over the reader: an upload standing in for the capture is not a pass, so the first scan after one is a first pass.
    const isRetake = scanned && value.source !== 'upload';

    // A retake discards the previous read immediately rather than at the end
    // of the pass. The old capture, and whatever the consumer derived from it,
    // describe a document the agent has just decided to read again - leaving
    // them up beside a spinner would have the card claiming a validated
    // identity while the reader was busy disagreeing with it.
    // A scan after any complete capture - a previous scan, or an upload - starts from nothing.
    if (scanned) {
      onChange({
        ...value,
        frontScanned: false,
        backScanned: false,
        frontImage: undefined,
        backImage: undefined,
        source: undefined,
        combined: undefined,
        frontFile: undefined,
        backFile: undefined,
        sidesSet: undefined,
        captured: undefined,
        clear: undefined,
      });
    }

    setPass(isRetake ? 'retake' : 'first');
    timer.current = setTimeout(() => {
      setPass(null);
      // The attempt is counted and adjudicated when the pass ENDS, not when it
      // starts. Both are one charge per physical pass, so the budget arithmetic
      // is identical - but charging up front flipped the consumer's "budget
      // spent" state while the spinner was still turning, which put an
      // editable number field and a Fetch button on screen underneath a card
      // that was visibly still reading. The fallback has to arrive with the
      // failure, not ahead of it, or the reader is not the thing that opened
      // it.
      //
      // Explicit === false: an undefined onScan must not read as a rejection.
      //
      // Refused: leave the value cleared. The insert prompt returns with
      // whatever `error` the consumer renders, which is the honest state -
      // there is no capture, and the way forward is the fallback the consumer
      // owns rather than this card.
      if (onScan?.() === false) return;
      if (isRetake) setRetakes((n) => n + 1);
      const printed = capturedFromCard(documentType, identity);
      // Blurred only on a first pass, and only when the caller asked for the
      // simulation. Every retake is clear - once the agent has re-seated the
      // card, the demo has made its point, and a card that stays unreadable
      // forever would just look broken rather than illustrative.
      const clear = !blurFirstScan || isRetake;
      onChange({ ...value, frontScanned: true, backScanned: true, frontImage: undefined, backImage: undefined, frontFile: undefined, backFile: undefined, combined: undefined, sidesSet: undefined, source: 'scan', captured: printed, clear });
      if (isRetake) onRetakeDone?.(retakes, printed);
    }, SCAN_DURATION_MS);
  };

  if (documentType === 'Passport') {
    return (
      <PassportScanSections
        value={value}
        onChange={onChange}
        onScan={onScan}
        onRetakeDone={onRetakeDone}
        error={error}
        canScan={canScan}
        bothCaptureActions={bothCaptureActions}
        readerEverywhere={readerEverywhere}
        demoTypes={demoTypes}
        onDemoScan={onDemoScan}
        blurFirstScan={blurFirstScan}
        hideUnclearNotice={hideUnclearNotice}
        variant={variant}
        identity={identity}
        onVerify={onVerify}
        verifying={verifying}
        verified={verified}
      />
    );
  }

  return (
    <div className="card p-4 stack">
          {/* Scanner header: what this is. Whether the reader is available is not shown: the agent only learns of a failure after the permitted attempts. */}
          <div className="split-top flex-wrap gap-x-4 gap-y-2">
            <div className="row min-w-0">
              <Icon path={SCAN_CORNERS} className="size-6 text-accent shrink-0" />
              <span className="title title-sm uppercase tracking-wide truncate">{SCAN_DOCUMENT_TITLE}</span>
            </div>
            {/* The two ways in, always available whatever has been done so far, in this order: the reader, then upload. An upload stands as a
                completed scan (no reader pass, so no attempt is charged). */}
            <IdFileUpload
              align="end"
              bothActions={bothCaptureActions}
              readerEverywhere={readerEverywhere}
              disabled={scanning}
              leading={
                canScan ? (
                  <Button
                    variant="primary"
                    compact
                    className="shrink-0"
                    disabled={scanning}
                    onClick={runScan}
                    aria-label={scanned && value.source !== 'upload' && retakes > 0 ? `Retake scan, ${retakes} so far` : undefined}
                  >
                    <Icon path={SCAN_CORNERS} className="size-4 " />
                    {scanned && value.source !== 'upload' ? `Retake scan${retakes > 0 ? ` (${retakes})` : ''}` : 'Initiate scan'}
                  </Button>
                ) : undefined
              }
              onUpload={(r) => onChange(applyIdUpload(value, r))}
            />
          </div>
      {/* Scanning FIRST, so a retake shows the reader working rather than the
          insert prompt. A retake clears the capture to start its pass, which
          without this branch would drop the card straight back to "Insert card
          and initiate scan" - telling the agent to re-seat a document that
          never left the reader, and losing them the place they were at.
          Same height as the insert zone so the step does not jump. */}
      {scanning ? (
        <div className="min-h-[var(--size-dropzone-min-h)] dropzone px-4 py-8 stack-middle">
          <Spinner size={28} label={`${pass === 'retake' ? 'Rescanning' : 'Scanning'} the ${documentType}`} />
          <span className="caption-secondary uppercase tracking-[0.14em] text-center">
            {pass === 'retake' ? 'Rescanning' : 'Scanning'} {documentType === 'QID' ? 'QID' : documentType}
          </span>
        </div>
      ) : scanned ? (
        <>
          {/* Both faces, side by side, from the one operation. Captioned per
              face so the agent can tell which is which when judging whether a
              capture is usable - the previews are deliberately similar
              (same document, same crop) and the maroon band alone is a thin
              cue to hang that on. */}
          {value.combined ? (
            <figure className="stack-center gap-2 max-w-md mx-auto">
              <ScannedIdPreview side="front" documentType={documentType} variant={variant} identity={identity} src={value.frontImage} clear fullPage />
              <figcaption className="caption-secondary">{documentType} front and back ({value.frontFile ?? 'one file'})</figcaption>
              {value.source === 'upload' && (
                <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} file`} onClick={() => onChange(removeIdUpload(value, 'all'))}>
                  <Icon path={TRASH} className="size-4 " />
                  Remove file
                </Button>
              )}
            </figure>
          ) : (
          <div className={documentType === 'Passport' ? 'fields max-w-xs mx-auto' : 'pair-grid gap-8 max-w-[44rem] mx-auto'}>
            {(documentType === 'Passport' ? (['front'] as const) : (['front', 'back'] as const)).map((side) => (
              <figure key={side} className="stack-center gap-2">
                <ScannedIdPreview
                  side={side}
                  documentType={documentType}
                  variant={variant}
                  identity={identity}
                  src={side === 'front' ? value.frontImage : value.backImage}
                  clear={value.clear ?? true}
                />
                <figcaption className="caption-secondary capitalize">
                  {documentType === 'Passport' ? 'Passport data page' : `${documentType === 'QID' ? 'QID' : documentType} ${side}${value.source === 'upload' && (side === 'front' ? value.frontFile : value.backFile) ? ` (${side === 'front' ? value.frontFile : value.backFile})` : ''}`}
                </figcaption>
                {value.source === 'upload' && (
                  <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} ${side} file`} onClick={() => onChange(removeIdUpload(value, side))}>
                    <Icon path={TRASH} className="size-4 " />
                    Remove
                  </Button>
                )}
              </figure>
            ))}
          </div>
          )}
          {value.source === 'upload' && !value.combined && value.frontFile && value.backFile && (
            <div className="flex justify-center">
              <Button variant="tertiary" compact onClick={() => onChange(swapUploadedSides(value))}>
                Swap front and back
              </Button>
            </div>
          )}
          {/* "Document detected: X" moved out of this card and up to the
              heading IdLookupStep renders above it (2026-09-28), so it is not
              duplicated here. "Simulated capture" removed the same round -
              see the 2026-09-27 note this replaced, now gone along with the
              text. */}
          {/* role="alert": the blur is the ONLY signal a first-pass scan
              failed - IdLookupStep's OCR-extraction effect deliberately skips
              a blurred pass rather than trying and failing it, so no number
              or MOI result ever appears to explain the silence. Without this
              line the agent would see two blurry photos and a Retake button
              with nothing saying why nothing else happened. */}
          {value.clear === false && !hideUnclearNotice && (
            <p role="alert" className="text-danger text-[length:var(--fs-caption)] text-center">
              Image unclear - the reader could not read this capture. Retake the scan for a clear image.
            </p>
          )}
        </>
      ) : (
        <div className="stack gap-4">
          {/* One side uploaded so far: the document's two sides side by side - the uploaded one as it is, the other asked for, in place of the
              scanner's placeholder. Uploading it replaces the ask with the real document. */}
          {missing && (
            <div className="stack">
              <div className="scan-pair-grid">
                {(['front', 'back'] as const).map((side) => {
                  const have = side !== missing;
                  const file = side === 'front' ? value.frontFile : value.backFile;
                  return (
                    <figure key={side} className="stack-center gap-2">
                      {have ? (
                        <ScannedIdPreview side={side} documentType={documentType} variant={variant} identity={identity} src={side === 'front' ? value.frontImage : value.backImage} clear />
                      ) : (
                        <div className="dropzone-card dropzone">
                          <span className="value-text">{documentType} {side} side needed</span>
                          <IdFileUpload side={side} label={`Upload ${side} side`} onUpload={(r) => onChange(applyIdUpload(value, r))} />
                        </div>
                      )}
                      <figcaption className="caption-secondary capitalize">
                        {have ? `${documentType} ${side}${file ? ` (${file})` : ''}` : `${documentType} ${side}`}
                      </figcaption>
                      {have && (
                        <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} ${side} file`} onClick={() => onChange(removeIdUpload(value, side))}>
                          <Icon path={TRASH} className="size-4 " />
                          Remove
                        </Button>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}
          {!missing && (
            <>
          {/* The scanning surface: a dashed bed holding the card guide, the instruction and the action. */}
          <div className="dropzone px-4 py-8 centered-stack gap-5">
            <div className="scan-frame max-w-[22rem] aspect-[85.6/54]">
              {/* Guide rails at the card's four corners. */}
              <span aria-hidden="true" className="scan-corner scan-corner-tl" />
              <span aria-hidden="true" className="scan-corner scan-corner-tr" />
              <span aria-hidden="true" className="scan-corner scan-corner-bl" />
              <span aria-hidden="true" className="scan-corner scan-corner-br" />
              <Icon path={SCAN_CORNERS} className="size-12 text-border" />
            </div>
            <div className="space-y-1.5 max-w-xl">
              {!canScan && <h4 className="title title-lg">Card Could Not Be Read</h4>}
              {canScan && (
                <p className="text-secondary">
                  {`Both sides of the ${documentType === 'Other ID' ? 'document' : documentType} are required for verification`}
                </p>
              )}
            </div>
          </div>
          {/* DEMO ONLY - labelled on screen, because an unlabelled row of
              document types under the scanner is indistinguishable from the ID
              Type selector this flow deliberately removed, and an agent would
              reasonably read it as "choose the document type first".
              A real reader offers no such choice. */}
          {canScan && demoTypes && demoTypes.length > 0 && onDemoScan && (
            <div className={`${SYNTHETIC_CLASS} stack-center gap-1`}>
              <span className="text-[length:var(--fs-micro)] uppercase tracking-wide">
                Demo only - simulate inserting
              </span>
              <div className="wrap-center justify-center gap-x-3 gap-y-1">
                {demoTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      onDemoScan(t.value);
                      runScan();
                    }}
                    className="link-action"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* role="alert" so the failure is announced: the agent's attention is
              on the physical reader, not the screen, and nothing else about
              the card changes when a scan fails. */}
          {error && (
            Array.isArray(error) ? (
              <ScanFailureNotice lines={error} />
            ) : (
              <p role="alert" className="field-message">
                {error}
              </p>
            )
          )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
