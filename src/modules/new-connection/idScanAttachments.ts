import { idTypeLabel, type IdType } from '../../data/idTypes';

/** The two sides of the document the scanner reports on (every ID type is captured front and back). */
export interface IdScanState {
  frontScanned?: boolean;
  backScanned?: boolean;
  /** 'upload' when the files were uploaded in place of the reader. */
  source?: 'scan' | 'upload';
  /** Upload: the file each side came from. */
  frontFile?: string;
  backFile?: string;
}

/** What names a stored file beyond its type and side: the number on the document and when it was captured. */
export interface IdScanFileContext {
  idNumber?: string;
  /** When the document was captured; the day goes in the name. Defaults to now. */
  at?: Date;
}

const TYPE_SLUG: Record<IdType, string> = { QID: 'QID', Passport: 'Passport', 'GCC ID': 'GCC-ID', 'Diplomatic ID': 'Diplomatic-ID' };

/** `Passport_Front_N1234567_2026-10-27.jpg` - document type, side, the number on it, the capture day; the extension of an uploaded file, else .jpg for a scan. */
export function idScanFileName(idType: IdType | undefined, side: 'Front' | 'Back', scans: IdScanState | undefined, context: IdScanFileContext = {}): string {
  const uploaded = scans?.source === 'upload' ? (side === 'Front' ? scans.frontFile : scans.backFile) : undefined;
  const ext = /\.([A-Za-z0-9]{2,5})$/.exec(uploaded ?? '')?.[1]?.toLowerCase() ?? 'jpg';
  const day = (context.at ?? new Date()).toISOString().slice(0, 10);
  const number = context.idNumber?.replace(/[^A-Za-z0-9]/g, '');
  return [TYPE_SLUG[idType ?? 'QID'], side, number, day].filter(Boolean).join('_') + `.${ext}`;
}

/**
 * The order attachments for the identity document scanned at Contact, named for the ID type actually presented
 * ("Passport - Front", "GCC ID - Back" ...), one per side that was scanned, each with the file name it is stored under
 * (see idScanFileName). A side that was not scanned (manual entry, or the scan never completed) gets no row, so an order
 * never claims a document it does not hold.
 */
export function idScanAttachments(
  idType: IdType | undefined,
  scans: IdScanState | undefined,
  context?: IdScanFileContext
): { label: string; detail: string; fileName: string }[] {
  const name = idTypeLabel(idType ?? 'QID');
  const detail = (file: string | undefined) => (scans?.source === 'upload' ? `Uploaded during Contact${file ? `: ${file}` : ''}` : 'Scanned during Contact');
  return [
    ...(scans?.frontScanned ? [{ label: `${name} - Front`, detail: detail(scans.frontFile), fileName: idScanFileName(idType, 'Front', scans, context) }] : []),
    ...(scans?.backScanned ? [{ label: `${name} - Back`, detail: detail(scans.backFile), fileName: idScanFileName(idType, 'Back', scans, context) }] : []),
  ];
}
