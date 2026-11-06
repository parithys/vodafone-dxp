import { SPECIMENS } from '../../data/synthetic/idScanSamples';

export interface SpecimenIdentity {
  name: string;
  idNo: string;
  nationality: string;
  /** dd/mm/yyyy */
  dob: string;
  /** dd/mm/yyyy */
  expiry: string;
}

/** The identity printed on the card the reader is shown: the customer's own when the journey is bound to one, else the document type's specimen. */
export function capturedFromCard(documentType: string | undefined, identity?: SpecimenIdentity): { name: string; dob: string; nationality: string } {
  const s = identity ?? SPECIMENS[documentType ?? 'QID'] ?? SPECIMENS.QID;
  return { name: s.name, dob: s.dob, nationality: s.nationality };
}
