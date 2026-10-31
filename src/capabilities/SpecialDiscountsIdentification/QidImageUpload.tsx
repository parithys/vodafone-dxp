import { useEffect, useRef, useState } from 'react';
import { SCAN_DOCUMENT_TITLE } from '../../components/domain/scanDocumentLabels';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { Spinner } from '../../components/primitives/Spinner';
import { ScannedIdPreview } from './ScannedIdPreview';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';
import { SCAN_DURATION_MS } from './qidImageUploadModel';
import type { QidImageUploadProps } from './qidImageUploadModel';
import { PassportScanSections } from './PassportScanSections';
import { ScanFailureNotice } from './ScanFailureNotice';
import { IdFileUpload } from './IdFileUpload';
import { applyIdUpload, missingUploadSide, removeIdUpload, swapUploadedSides, uploadedSidesInverted } from './idUploadModel';


// The four corner brackets of a scan frame.
const SCAN_CORNERS = 'M4 8V5a1 1 0 0 1 1-1h3 M16 4h3a1 1 0 0 1 1 1v3 M20 16v3a1 1 0 0 1-1 1h-3 M8 20H5a1 1 0 0 1-1-1v-3';

const TRASH = 'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6';

export function QidImageUpload({
  value,
  onChange,
  onScan,
  error,
  canScan = true,
  documentType = 'QID',
  demoTypes,
  onDemoScan,
  blurFirstScan = false,
  hideUnclearNotice = false,
  variant,
  identity,
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
      // Blurred only on a first pass, and only when the caller asked for the
      // simulation. Every retake is clear - once the agent has re-seated the
      // card, the demo has made its point, and a card that stays unreadable
      // forever would just look broken rather than illustrative.
      const clear = !blurFirstScan || isRetake;
      onChange({ ...value, frontScanned: true, backScanned: true, frontImage: undefined, backImage: undefined, frontFile: undefined, backFile: undefined, combined: undefined, sidesSet: undefined, source: 'scan', clear });
    }, SCAN_DURATION_MS);
  };

  if (documentType === 'Passport') {
    return (
      <PassportScanSections
        value={value}
        onChange={onChange}
        onScan={onScan}
        error={error}
        canScan={canScan}
        demoTypes={demoTypes}
        onDemoScan={onDemoScan}
        blurFirstScan={blurFirstScan}
        hideUnclearNotice={hideUnclearNotice}
        variant={variant}
        identity={identity}
      />
    );
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
          {/* Scanner header: what this is. Whether the reader is available is not shown: the agent only learns of a failure after the permitted attempts. */}
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="flex items-center gap-3 min-w-0">
              <Icon path={SCAN_CORNERS} className="w-6 h-6 text-accent shrink-0" />
              <span className="text-fg font-bold uppercase tracking-wide text-[length:var(--fs-body)] truncate">{SCAN_DOCUMENT_TITLE}</span>
            </div>
            {/* The two ways in, always available whatever has been done so far, in this order: the reader, then upload. An upload stands as a
                completed scan (no reader pass, so no attempt is charged). */}
            <IdFileUpload
              align="end"
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
                    <Icon path={SCAN_CORNERS} className="w-4 h-4" />
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
        <div className="min-h-[var(--size-dropzone-min-h)] rounded-[var(--radius-card)] border border-dashed border-border bg-[var(--surface-subtle)] px-4 py-8 flex flex-col items-center justify-center gap-3">
          <Spinner size={28} label={`${pass === 'retake' ? 'Rescanning' : 'Scanning'} the ${documentType}`} />
          <span className="text-fg-2 text-[length:var(--fs-caption)] uppercase tracking-[0.14em] text-center">
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
            <figure className="flex flex-col items-center gap-2 max-w-md mx-auto">
              <ScannedIdPreview side="front" documentType={documentType} variant={variant} identity={identity} src={value.frontImage} clear fullPage />
              <figcaption className="text-fg-2 text-[length:var(--fs-caption)]">{documentType} front and back ({value.frontFile ?? 'one file'})</figcaption>
              {value.source === 'upload' && (
                <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} file`} onClick={() => onChange(removeIdUpload(value, 'all'))}>
                  <Icon path={TRASH} className="w-4 h-4" />
                  Remove file
                </Button>
              )}
            </figure>
          ) : (
          <div className={documentType === 'Passport' ? 'grid grid-cols-1 gap-4 max-w-xs mx-auto' : 'grid grid-cols-2 gap-8 max-w-[44rem] mx-auto'}>
            {(documentType === 'Passport' ? (['front'] as const) : (['front', 'back'] as const)).map((side) => (
              <figure key={side} className="flex flex-col items-center gap-2">
                <ScannedIdPreview
                  side={side}
                  documentType={documentType}
                  variant={variant}
                  identity={identity}
                  src={side === 'front' ? value.frontImage : value.backImage}
                  clear={value.clear ?? true}
                />
                <figcaption className="text-fg-2 text-[length:var(--fs-caption)] capitalize">
                  {documentType === 'Passport' ? 'Passport data page' : `${documentType === 'QID' ? 'QID' : documentType} ${side}${value.source === 'upload' && (side === 'front' ? value.frontFile : value.backFile) ? ` (${side === 'front' ? value.frontFile : value.backFile})` : ''}`}
                </figcaption>
                {value.source === 'upload' && (
                  <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} ${side} file`} onClick={() => onChange(removeIdUpload(value, side))}>
                    <Icon path={TRASH} className="w-4 h-4" />
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
        <div className="flex flex-col gap-4">
          {/* One side uploaded so far: the document's two sides side by side - the uploaded one as it is, the other asked for, in place of the
              scanner's placeholder. Uploading it replaces the ask with the real document. */}
          {missing && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-8 max-w-[44rem] mx-auto w-full">
                {(['front', 'back'] as const).map((side) => {
                  const have = side !== missing;
                  const file = side === 'front' ? value.frontFile : value.backFile;
                  return (
                    <figure key={side} className="flex flex-col items-center gap-2">
                      {have ? (
                        <ScannedIdPreview side={side} documentType={documentType} variant={variant} identity={identity} src={side === 'front' ? value.frontImage : value.backImage} clear />
                      ) : (
                        <div className="w-full aspect-[1.585] rounded-[var(--radius-card)] border border-dashed border-border bg-[var(--surface-subtle)] flex flex-col items-center justify-center gap-3 p-4 text-center">
                          <span className="text-fg font-medium text-[length:var(--fs-body)]">{documentType} {side} side needed</span>
                          <IdFileUpload side={side} label={`Upload ${side} side`} onUpload={(r) => onChange(applyIdUpload(value, r))} />
                        </div>
                      )}
                      <figcaption className="text-fg-2 text-[length:var(--fs-caption)] capitalize">
                        {have ? `${documentType} ${side}${file ? ` (${file})` : ''}` : `${documentType} ${side}`}
                      </figcaption>
                      {have && (
                        <Button variant="tertiary" compact aria-label={`Remove the uploaded ${documentType} ${side} file`} onClick={() => onChange(removeIdUpload(value, side))}>
                          <Icon path={TRASH} className="w-4 h-4" />
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
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-[var(--surface-subtle)] px-4 py-8 flex flex-col items-center gap-5 text-center">
            <div className="relative w-full max-w-[22rem] aspect-[85.6/54] rounded-[var(--radius-card)] border border-border-soft bg-bg shadow-[var(--shadow-dash-card)] flex items-center justify-center text-muted text-[length:var(--fs-micro)] uppercase tracking-wide">
              {/* Guide rails at the card's four corners. */}
              <span aria-hidden="true" className="absolute left-2 top-2 w-4 h-4 border-l-2 border-t-2 border-accent" />
              <span aria-hidden="true" className="absolute right-2 top-2 w-4 h-4 border-r-2 border-t-2 border-accent" />
              <span aria-hidden="true" className="absolute left-2 bottom-2 w-4 h-4 border-l-2 border-b-2 border-accent" />
              <span aria-hidden="true" className="absolute right-2 bottom-2 w-4 h-4 border-r-2 border-b-2 border-accent" />
              <Icon path={SCAN_CORNERS} className="w-12 h-12 text-border" />
            </div>
            <div className="space-y-1.5 max-w-xl">
              {!canScan && <h4 className="text-fg font-bold text-[length:var(--fs-h5)]">Card Could Not Be Read</h4>}
              {canScan && (
                <p className="text-fg-2 text-[length:var(--fs-body)]">
                  {`Both sides of the ${documentType} are required for verification`}
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
            <div className={`${SYNTHETIC_CLASS} flex flex-col items-center gap-1`}>
              <span className="text-[length:var(--fs-micro)] uppercase tracking-wide">
                Demo only - simulate inserting
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {demoTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      onDemoScan(t.value);
                      runScan();
                    }}
                    className="text-[length:var(--fs-caption)] text-link underline
                      hover:opacity-80 focus:outline-none
                      focus-visible:shadow-[var(--focus-ring)] rounded-[var(--radius-button)] px-0.5"
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
              <p role="alert" className="text-danger text-[length:var(--fs-caption)] text-center max-w-[var(--size-field-message-max-w)]">
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
