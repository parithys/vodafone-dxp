import * as mockDataEngine from '../../engines/mockDataEngine';
import { qidDocumentRecord, type LinkedIdUpdate } from '../../components/patterns/idLinkModel';

type CreateRecord = (kind: 'identity-documents', record: Record<string, unknown>) => Promise<unknown>;

/**
 * Customer Verification linked a QID to a customer who is already on file (through their Passport): the order adds that QID to THEIR
 * identity documents, so the next lookup by the QID finds the same customer rather than a new one. Never a second customer; never a
 * duplicate document (the same number on the same customer is left as it is). Returns whether a document was added.
 */
export async function saveLinkedIdDocument(
  link: LinkedIdUpdate | undefined,
  createRecord: (kind: never, record: Record<string, unknown>) => Promise<unknown>,
  listDocuments: () => Promise<{ customerId: string; documentNumber: string }[]> = () => mockDataEngine.list('identity-documents')
): Promise<boolean> {
  if (!link) return false;
  const existing = await listDocuments();
  if (existing.some((d) => d.customerId === link.customerId && d.documentNumber === link.documentNumber)) return false;
  await (createRecord as unknown as CreateRecord)('identity-documents', qidDocumentRecord(link));
  return true;
}
