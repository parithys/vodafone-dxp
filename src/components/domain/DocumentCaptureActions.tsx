import { useRef, useState } from 'react';
import { Button } from '../primitives/Button';
import { UPLOAD_RULES } from './documentUploadRules';
import { detectDeviceType, type DeviceType } from '../../lib/deviceType';
import { scanDocument } from '../../lib/documentScan';

/**
 * How a supporting document is taken, for every document scenario (a number discount's document, a court order, Additional Documents ...): the way to CAPTURE it that suits the
 * device, beside the way to UPLOAD an existing file.
 *
 *   web              Scan Document (the desk scanner) and Upload Document
 *   tablet / mobile  Capture With Camera (the device camera, the rear one) and Upload Document
 *
 * Whichever is used, the caller gets one `File` and checks it against the shared upload rules exactly as before (type, size); this control only says where the file comes from. The
 * device is the one the journey runs on (lib/deviceType), unless the caller passes it.
 */
export function DocumentCaptureActions({
  onFile,
  hasDocument = false,
  device,
  what = 'document',
  disabled = false,
  disabledTitle,
  accept = UPLOAD_RULES.supporting.accept,
}: {
  /** The file taken, by whichever way. */
  onFile: (file: File) => void;
  /** A document is already attached: the upload button reads "Replace Document". */
  hasDocument?: boolean;
  device?: DeviceType;
  /** What the document is, for the controls' accessible names ("supporting document", "court order"). */
  what?: string;
  disabled?: boolean;
  /** Why the controls are disabled (shown as the tooltip). */
  disabledTitle?: string;
  accept?: string;
}) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const kind = device ?? detectDeviceType();
  const take = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    // Cleared so choosing the same file again still fires.
    input.value = '';
    if (file) onFile(file);
  };
  const scan = async () => {
    setScanning(true);
    setScanError(null);
    try {
      onFile(await scanDocument());
    } catch (e) {
      setScanError(e instanceof Error ? e.message : 'The scan failed. Try again, or upload the file.');
    } finally {
      setScanning(false);
    }
  };
  return (
    <>
      <input ref={uploadRef} type="file" accept={accept} className="sr-only" tabIndex={-1} aria-label={`Choose the ${what}`} onChange={(e) => take(e.currentTarget)} />
      {kind === 'tablet' && (
        // `capture` opens the camera straight away on a phone or tablet (the rear camera); a browser without it falls back to the file picker.
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-label={`Capture the ${what} with the camera`} onChange={(e) => take(e.currentTarget)} />
      )}
      {kind === 'tablet' ? (
        <Button variant="secondary" compact disabled={disabled} title={disabled ? disabledTitle : undefined} onClick={() => cameraRef.current?.click()}>
          Capture With Camera
        </Button>
      ) : (
        <Button variant="secondary" compact disabled={disabled || scanning} title={disabled ? disabledTitle : undefined} onClick={() => void scan()}>
          {scanning ? 'Scanning…' : 'Scan Document'}
        </Button>
      )}
      <Button variant="secondary" compact disabled={disabled} title={disabled ? disabledTitle : undefined} onClick={() => uploadRef.current?.click()}>
        {hasDocument ? 'Replace Document' : 'Upload Document'}
      </Button>
      {scanError && (
        <span role="alert" className="text-danger text-[length:var(--fs-caption)]">
          {scanError}
        </span>
      )}
    </>
  );
}
