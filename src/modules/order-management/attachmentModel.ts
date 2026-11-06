import type { IdVariant } from '../../components/domain/ScannedIdPreview';

/** One document recorded on an order. `previewUrl` is the captured image itself when the journey kept one (the CAF signature). */
export interface OrderAttachment {
  label: string;
  detail?: string;
  /** The name the file is stored under (an identity scan: type, side, number, day). */
  fileName?: string;
  previewUrl?: string;
}

/** The order facts a preview draws on. */
export interface AttachmentOrder {
  orderId: string;
  customerId?: string;
  customerName?: string;
  idNumber?: string;
  createdAt?: number | string;
}

const ID_SCAN = /^(Qatar ID \(QID\)|Passport|GCC ID|Diplomatic ID|Other ID) - (Front|Back)$/;
const SCAN_TYPE: Record<string, string> = { 'Qatar ID (QID)': 'QID', Passport: 'Passport', 'GCC ID': 'GCC ID', 'Diplomatic ID': 'Diplomatic ID' };

/** What a recorded attachment is, read from its label - the same words the journeys write. */
export type AttachmentShape =
  | { kind: 'id-scan'; documentType: string | undefined; name: string; side: 'front' | 'back' }
  | { kind: 'office-id'; variant: IdVariant }
  | { kind: 'caf' }
  | { kind: 'file' };

export function attachmentShape(doc: OrderAttachment): AttachmentShape {
  const scan = doc.label.match(ID_SCAN);
  if (scan) return { kind: 'id-scan', documentType: SCAN_TYPE[scan[1]], name: scan[1], side: scan[2] === 'Back' ? 'back' : 'front' };
  if (/^Office ID card$/i.test(doc.label)) {
    const v = /B2B2C/i.test(doc.detail ?? '') ? 'b2b2c' : /Retired/i.test(doc.detail ?? '') ? 'retired' : 'mada';
    return { kind: 'office-id', variant: v };
  }
  if (/^Signed CAF$/i.test(doc.label)) return { kind: 'caf' };
  return { kind: 'file' };
}
