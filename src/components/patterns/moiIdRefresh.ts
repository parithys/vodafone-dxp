/**
 * When an existing customer is identified, MOI's latest answer for the document is the truth about their ID: the customer's ID details are brought
 * in line with it. A Diplomatic ID returned by MOI makes the customer's ID Type Diplomatic ID.
 */
export const MOI_UPDATE_BASIS = 'Updated from MOI response';

export interface MoiDocument {
  customerId: string;
  documentType: string;
  documentNumber: string;
}

/**
 * The change MOI's answer makes to the customer's ID details (ID Type and ID Number), or undefined when they already agree. The document identified
 * is the customer's ID of record when it is a Diplomatic ID (a diplomat is a diplomat), when it is the only ID they hold, or when it already is the
 * number on their record - a Passport looked up for a customer whose ID of record is their QID changes nothing.
 */
export function moiIdDetailsPatch(
  customer: { idType?: string; qid?: string },
  document: MoiDocument,
  heldDocuments: readonly MoiDocument[]
): { idType: string; qid: string } | undefined {
  const own = heldDocuments.filter((d) => d.customerId === document.customerId);
  const ofRecord = document.documentType === 'Diplomatic ID' || own.length <= 1 || document.documentNumber === customer.qid;
  if (!ofRecord) return undefined;
  if (customer.idType === document.documentType && customer.qid === document.documentNumber) return undefined;
  return { idType: document.documentType, qid: document.documentNumber };
}
