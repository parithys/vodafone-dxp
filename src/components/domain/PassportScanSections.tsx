import { useEffect, useRef, useState } from 'react';
import { SCAN_DOCUMENT_TITLE } from './scanDocumentLabels';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Spinner } from '../primitives/Spinner';
import { ScannedIdPreview, capturedFromCard } from './ScannedIdPreview';
import { ScanFailureNotice } from './ScanFailureNotice';
import { IdFileUpload } from './IdFileUpload';
import { applyIdUpload, idCaptureOptions } from './idUploadModel';
import { detectDeviceType } from '../../lib/deviceType';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';
import { SCAN_DURATION_MS } from './qidImageUploadModel';
import type { QidImageUploadProps } from './qidImageUploadModel';
import { SCAN_CORNERS } from '../../assets/icons';

// ---------------------------------------------------------------------------------------------------------
// Passport: two separate scanning sections, one per side, each captured on the flatbed scanner.
// The attempt budget is charged once per document pass (the first side to complete), not once per side.
// ---------------------------------------------------------------------------------------------------------
// The four corner brackets of a scan frame.

type PassportProps = Pick<QidImageUploadProps, 'value' | 'onChange' | 'onScan' | 'onRetakeDone' | 'error' | 'canScan' | 'bothCaptureActions' | 'readerEverywhere' | 'demoTypes' | 'onDemoScan' | 'blurFirstScan' | 'hideUnclearNotice' | 'variant' | 'identity'>;

export function PassportScanSections({ value, onChange, onScan, onRetakeDone, error, canScan = true, bothCaptureActions = false, readerEverywhere = false, demoTypes, onDemoScan, blurFirstScan = false, hideUnclearNotice = false, variant, identity }: PassportProps) {
  const capture = idCaptureOptions(detectDeviceType(), canScan, bothCaptureActions, readerEverywhere);
  const [scanning, setScanning] = useState<'front' | 'back' | null>(null);
  const [blurred, setBlurred] = useState({ front: false, back: false });
  const [retakes, setRetakes] = useState({ front: 0, back: 0 });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef(value);
  latest.current = value;
  const charged = useRef(false);
  const anyScanned = Boolean(value.frontScanned || value.backScanned);
  useEffect(() => () => clearTimeout(timer.current), []);
  // A fresh document (both sides cleared from outside) starts a new pass.
  useEffect(() => {
    if (!anyScanned) {
      charged.current = false;
      setBlurred({ front: false, back: false });
    }
  }, [anyScanned]);

  const scanSide = (side: 'front' | 'back') => {
    if (scanning || !canScan) return;
    const scannedKey = side === 'front' ? 'frontScanned' : 'backScanned';
    const imageKey = side === 'front' ? 'frontImage' : 'backImage';
    const isRetake = Boolean(latest.current[scannedKey]);
    if (isRetake) onChange({ ...latest.current, [scannedKey]: false, [imageKey]: undefined, clear: undefined });
    setScanning(side);
    timer.current = setTimeout(() => {
      setScanning(null);
      if (!charged.current) {
        charged.current = true;
        if (onScan?.() === false) {
          charged.current = false;
          return;
        }
      }
      if (isRetake) setRetakes((r) => ({ ...r, [side]: r[side] + 1 }));
      const shownCount = retakes[side];
      // The first pass over each side comes back blurred when the demo asks for it; a retake is clear.
      const nextBlurred = { ...blurred, [side]: blurFirstScan && !isRetake };
      setBlurred(nextBlurred);
      onChange({ ...latest.current, [scannedKey]: true, clear: !(nextBlurred.front || nextBlurred.back) });
      if (isRetake) onRetakeDone?.(shownCount, capturedFromCard('Passport', identity));
    }, SCAN_DURATION_MS);
  };

  const section = (side: 'front' | 'back') => {
    const done = Boolean(side === 'front' ? value.frontScanned : value.backScanned);
    const n = retakes[side];
    const zone = 'rounded-[var(--radius-card)] border border-dashed border-border bg-[var(--surface-subtle)] px-4 py-6 flex flex-col items-center justify-center gap-4 text-center min-h-[var(--size-dropzone-min-h)]';
    return (
      <div key={side} className={zone}>
        {scanning === side ? (
          <>
            <Spinner size={28} label={`Scanning the Passport ${side} side`} />
            <span className="caption-secondary uppercase tracking-[0.14em]">Scanning Passport {side} side</span>
          </>
        ) : done ? (
          <>
            <figure className="stack-center gap-2 max-w-[15rem] w-full">
              <ScannedIdPreview
                side={side}
                documentType="Passport"
                variant={variant}
                identity={identity}
                src={side === 'front' ? value.frontImage : value.backImage}
                clear={!blurred[side]}
              />
              <figcaption className="caption-secondary">Passport {side}</figcaption>
            </figure>
            {blurred[side] && !hideUnclearNotice && (
              <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
                Image unclear - the reader could not read this capture. Retake the scan for a clear image.
              </p>
            )}
            {capture.scan && (
              <Button variant="secondary" compact onClick={() => scanSide(side)} aria-label={n > 0 ? `Retake ${side} side scan, ${n} so far` : undefined}>
                Retake scan{n > 0 && ` (${n})`}
              </Button>
            )}
            {capture.upload && (
              <IdFileUpload
                side={side}
                scanner={false}
                label={`Upload ${side} side again`}
                onUpload={(r) => {
                  setBlurred((b) => ({ ...b, [side]: false }));
                  onChange(applyIdUpload(latest.current, r));
                }}
              />
            )}
          </>
        ) : (
          <>
            {/* Guide frame: the passport page as it lies on the glass, with rails at its corners. */}
            <div className="scan-frame max-w-[9.5rem] aspect-[88/125]">
              <span aria-hidden="true" className="scan-corner scan-corner-tl" />
              <span aria-hidden="true" className="scan-corner scan-corner-tr" />
              <span aria-hidden="true" className="scan-corner scan-corner-bl" />
              <span aria-hidden="true" className="scan-corner scan-corner-br" />
              <Icon path={SCAN_CORNERS} className="w-10 h-10 text-border" />
            </div>
            <div className="space-y-1">
              {!canScan && <h4 className="title-sm">Card Could Not Be Read</h4>}
              {canScan && <p className="caption-secondary">Scan the {side} side of the passport for verification.</p>}
            </div>
            {capture.scan && (
              <Button variant="primary" onClick={() => scanSide(side)}>
                <Icon path={SCAN_CORNERS} className="w-4 h-4" />
                Scan {side} side
              </Button>
            )}
            {/* Upload this side in place of the reader (no reader pass, so no attempt is charged). */}
            <IdFileUpload
              side={side}
              scanner={canScan}
              bothActions={bothCaptureActions}
              readerEverywhere={readerEverywhere}
              label={`Upload ${side} side`}
              onUpload={(r) => {
                setBlurred((b) => ({ ...b, [side]: false }));
                onChange(applyIdUpload(latest.current, r));
              }}
            />
          </>
        )}
      </div>
    );
  };

  const showDemo = !anyScanned && canScan && demoTypes && demoTypes.length > 0 && onDemoScan;
  const showError = !anyScanned && error;

  return (
    <div className="card p-4 stack-lg">
      {/* Scanner header: what this is. Whether the reader is available is not shown: the agent only learns of a failure after the permitted attempts. */}
      <div className="split-top-wrap gap-x-4 gap-y-2">
        <div className="row min-w-0">
          <Icon path={SCAN_CORNERS} className="w-6 h-6 text-accent shrink-0" />
          <span className="title-sm uppercase tracking-wide truncate">{SCAN_DOCUMENT_TITLE}</span>
        </div>
        {/* The whole document in one go: two files, or one (both sides in a single image or PDF, or one side). */}
        {/* Upload in place of the reader. Scanning is done by each side's own Scan / Retake button below, so the header carries no scan button of its own. */}
        <IdFileUpload
          align="end"
          bothActions={bothCaptureActions}
              readerEverywhere={readerEverywhere}
          disabled={scanning !== null}
          onUpload={(r) => {
            setBlurred({ front: false, back: false });
            onChange(applyIdUpload(latest.current, r));
          }}
        />
      </div>
      <div className="fields md:grid-cols-2">
        {section('front')}
        {section('back')}
      </div>
      {showDemo && (
        <div className={`${SYNTHETIC_CLASS} stack-center gap-1`}>
          <span className="text-[length:var(--fs-micro)] uppercase tracking-wide">Demo only - simulate inserting</span>
          <div className="wrap-center justify-center gap-x-3 gap-y-1">
            {demoTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  onDemoScan(t.value);
                  scanSide('front');
                }}
                className="link-action"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {showError &&
        (Array.isArray(error) ? (
          <ScanFailureNotice lines={error} />
        ) : (
          <p role="alert" className="field-message mx-auto">
            {error}
          </p>
        ))}
    </div>
  );
}
