import { useEffect, useRef, useState } from 'react';
import { SCAN_DOCUMENT_TITLE } from '../../components/domain/scanDocumentLabels';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { Spinner } from '../../components/primitives/Spinner';
import { ScannedIdPreview } from './ScannedIdPreview';
import { ScanFailureNotice } from './ScanFailureNotice';
import { IdFileUpload } from './IdFileUpload';
import { applyIdUpload, idCaptureOptions } from './idUploadModel';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';
import { SCAN_DURATION_MS } from './qidImageUploadModel';
import type { QidImageUploadProps } from './qidImageUploadModel';

// ---------------------------------------------------------------------------------------------------------
// Passport: two separate scanning sections, one per side, each captured on the flatbed scanner.
// The attempt budget is charged once per document pass (the first side to complete), not once per side.
// ---------------------------------------------------------------------------------------------------------
// The four corner brackets of a scan frame.
const SCAN_CORNERS = 'M4 8V5a1 1 0 0 1 1-1h3 M16 4h3a1 1 0 0 1 1 1v3 M20 16v3a1 1 0 0 1-1 1h-3 M8 20H5a1 1 0 0 1-1-1v-3';

type PassportProps = Pick<QidImageUploadProps, 'value' | 'onChange' | 'onScan' | 'error' | 'canScan' | 'demoTypes' | 'onDemoScan' | 'blurFirstScan' | 'hideUnclearNotice' | 'variant' | 'identity'>;

export function PassportScanSections({ value, onChange, onScan, error, canScan = true, demoTypes, onDemoScan, blurFirstScan = false, hideUnclearNotice = false, variant, identity }: PassportProps) {
  const capture = idCaptureOptions(canScan);
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
      // The first pass over each side comes back blurred when the demo asks for it; a retake is clear.
      const nextBlurred = { ...blurred, [side]: blurFirstScan && !isRetake };
      setBlurred(nextBlurred);
      onChange({ ...latest.current, [scannedKey]: true, clear: !(nextBlurred.front || nextBlurred.back) });
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
            <span className="text-fg-2 text-[length:var(--fs-caption)] uppercase tracking-[0.14em]">Scanning Passport {side} side</span>
          </>
        ) : done ? (
          <>
            <figure className="flex flex-col items-center gap-2 max-w-[15rem] w-full">
              <ScannedIdPreview
                side={side}
                documentType="Passport"
                variant={variant}
                identity={identity}
                src={side === 'front' ? value.frontImage : value.backImage}
                clear={!blurred[side]}
              />
              <figcaption className="text-fg-2 text-[length:var(--fs-caption)]">Passport {side}</figcaption>
            </figure>
            {blurred[side] && !hideUnclearNotice && (
              <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
                Image unclear - the reader could not read this capture. Retake the scan for a clear image.
              </p>
            )}
            {capture.scan ? (
              <Button variant="secondary" compact onClick={() => scanSide(side)} aria-label={n > 0 ? `Retake ${side} side scan, ${n} so far` : undefined}>
                Retake scan{n > 0 && ` (${n})`}
              </Button>
            ) : (
              <IdFileUpload
                side={side}
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
            <div className="relative w-full max-w-[9.5rem] aspect-[88/125] rounded-[var(--radius-card)] border border-border-soft bg-bg shadow-[var(--shadow-dash-card)] flex items-center justify-center text-muted text-[length:var(--fs-micro)] uppercase tracking-wide">
              <span aria-hidden="true" className="absolute left-2 top-2 w-4 h-4 border-l-2 border-t-2 border-accent" />
              <span aria-hidden="true" className="absolute right-2 top-2 w-4 h-4 border-r-2 border-t-2 border-accent" />
              <span aria-hidden="true" className="absolute left-2 bottom-2 w-4 h-4 border-l-2 border-b-2 border-accent" />
              <span aria-hidden="true" className="absolute right-2 bottom-2 w-4 h-4 border-r-2 border-b-2 border-accent" />
              <Icon path={SCAN_CORNERS} className="w-10 h-10 text-border" />
            </div>
            <div className="space-y-1">
              {!canScan && <h4 className="text-fg font-bold text-[length:var(--fs-body)]">Card Could Not Be Read</h4>}
              {canScan && <p className="text-fg-2 text-[length:var(--fs-caption)]">Scan the {side} side of the passport for verification.</p>}
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
    <div className="card p-4 flex flex-col gap-4">
      {/* Scanner header: what this is. Whether the reader is available is not shown: the agent only learns of a failure after the permitted attempts. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3 min-w-0">
          <Icon path={SCAN_CORNERS} className="w-6 h-6 text-accent shrink-0" />
          <span className="text-fg font-bold uppercase tracking-wide text-[length:var(--fs-body)] truncate">{SCAN_DOCUMENT_TITLE}</span>
        </div>
        {/* The whole document in one go: two files, or one (both sides in a single image or PDF, or one side). */}
        {/* Upload in place of the reader. Scanning is done by each side's own Scan / Retake button below, so the header carries no scan button of its own. */}
        <IdFileUpload
          align="end"
          disabled={scanning !== null}
          onUpload={(r) => {
            setBlurred({ front: false, back: false });
            onChange(applyIdUpload(latest.current, r));
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section('front')}
        {section('back')}
      </div>
      {showDemo && (
        <div className={`${SYNTHETIC_CLASS} flex flex-col items-center gap-1`}>
          <span className="text-[length:var(--fs-micro)] uppercase tracking-wide">Demo only - simulate inserting</span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {demoTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  onDemoScan(t.value);
                  scanSide('front');
                }}
                className="text-[length:var(--fs-caption)] text-link underline hover:opacity-80 focus:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-[var(--radius-button)] px-0.5"
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
          <p role="alert" className="text-danger text-[length:var(--fs-caption)] text-center max-w-[var(--size-field-message-max-w)] mx-auto">
            {error}
          </p>
        ))}
    </div>
  );
}
