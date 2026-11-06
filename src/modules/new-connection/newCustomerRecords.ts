import { primaryContactMobile } from '../../capabilities';
import * as mockDataEngine from '../../engines/mockDataEngine';
import type { GuidedContactValue } from '../../capabilities';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';

/** A customer the journey identified for the first time: the registry (NAS) knew the person, or the agent typed the identity, but no customer record exists. */
export const isNewlyIdentifiedCustomer = (contact: GuidedContactValue | undefined, eligibility: EligibilityResult | undefined): boolean =>
  Boolean(contact?.moiResult?.isNewCustomer) && !eligibility?.customerId;

/**
 * The records that make a newly identified customer exist: the customer, the identity document they were identified by, and their contact record, all
 * from what Customer Verification captured (the agent's edits over the registry's values, the registry's expiry, the segment the eligibility check judged).
 * Nothing is derived or defaulted for what was not captured: an absent value is left off the record.
 */
export function buildNewCustomerRecords(customerId: string, contact: GuidedContactValue, eligibility: EligibilityResult | undefined, now: Date = new Date()) {
  const moi = contact.moiResult;
  const firstName = contact.firstName ?? moi?.firstName;
  const middleName = contact.middleName ?? moi?.middleName;
  const lastName = contact.lastName ?? moi?.lastName;
  const name = moi?.name ?? [firstName, middleName, lastName].filter(Boolean).join(' ');
  const phone = primaryContactMobile(contact) ?? moi?.mobile;
  const idType = contact.idType;
  const stamp = now.toISOString();
  const drop = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ''));
  const customer = drop({
    _note: 'Created by the New Postpaid journey (Family Package Primary Line 1) for a customer identified for the first time (2026-11-04).',
    customerId,
    qid: contact.idNumber,
    idType,
    name,
    firstName,
    middleName,
    lastName,
    dob: moi?.dob,
    nationality: moi?.nationality ?? eligibility?.nationality,
    segment: eligibility?.segment,
    email: contact.email ?? moi?.email,
    phone,
    gender: contact.gender ?? moi?.gender,
    // The salutation entered in the journey (for an existing customer it is written to their profile at submission; this customer has no profile until now).
    salutation: contact.salutation?.trim() || undefined,
    preferredLanguage: moi?.preferredLanguage,
    // A registry-confirmed identity is verified; one the agent typed (no registry knows the ID) is not claimed to be.
    moiValidationStatus: moi?.createdByAgent ? undefined : 'Verified',
    blacklisted: false,
  });
  const document = drop({
    identityDocumentId: `IDD-${now.getTime().toString().slice(-7)}`,
    customerId,
    documentType: idType,
    documentNumber: contact.idNumber,
    expiryDate: moi?.expiryDate,
    validationPath: moi?.createdByAgent ? 'Capture/Validate Details' : 'MOI Validation',
    status: moi?.createdByAgent ? 'Captured' : 'Validated',
    scanCompleted: Boolean(contact.qidScans),
    scannedAt: stamp,
    docStatus: 'Active',
    uploadDateTime: stamp,
    serviceReference: customerId,
  });
  const contactRecord = drop({
    contactRecordId: `CTC-${customerId}`,
    customerId,
    firstName,
    middleName,
    lastName,
    idType,
    idNumber: contact.idNumber,
    idExpirationDate: moi?.expiryDate,
    nationality: moi?.nationality ?? eligibility?.nationality,
    dob: moi?.dob,
    gender: contact.gender ?? moi?.gender,
    preferredLanguage: moi?.preferredLanguage,
    cellNumber: phone,
  });
  return { customer, document, contact: contactRecord };
}

/**
 * The customer who already has this ID on record (the customer's own `qid`, or an identity document carrying the number), if any. The New Customer journey
 * takes an ID that already has a record through as a new customer on purpose, so a second order for the same person must be given their record, never a
 * second one: two records for one ID leave the next identity lookup asking the agent which one to use.
 */
export async function existingCustomerIdFor(idNumber: string | undefined): Promise<string | undefined> {
  if (!idNumber) return undefined;
  const [customers, documents] = await Promise.all([
    mockDataEngine.list<{ customerId: string; qid?: string }>('customers'),
    mockDataEngine.list<{ customerId: string; documentNumber?: string }>('identity-documents'),
  ]);
  return customers.find((c) => c.qid === idNumber)?.customerId ?? documents.find((d) => d.documentNumber === idNumber)?.customerId;
}

/** A fresh customer id, in the shape of the existing ones. */
export const newCustomerId = (now: Date = new Date()): string => `CUST-${now.getTime().toString().slice(-6)}`;
