import { normalizePortInNumber, scheduledDateError } from '../../data/portInRules';

export interface DonorDetailsValue {
  /** DF-MNP-009: as typed; the order carries it normalised (974 + 8 digits). */
  portInNumber?: string;
  /** DF-MNP-010..014: the customer's identity at the donor operator, all chosen by the agent from what the customer states. */
  donorId?: string;
  donorIdType?: string;
  donorCustomerType?: string;
  donorOperator?: string;
  donorSubscriptionType?: string;
  /** DF-MNP-015: optional, must be a working day. */
  scheduledPortInDate?: string;
  /** Set by this step when the number cannot be ported in (already on Vodafone, or a request is already awaiting NPAS). */
  portInNumberBlocked?: string;
}

/** Whether the donor details are complete and usable: every mandatory field, a valid number, a working-day date when one is given. */
export function donorDetailsValid(d: DonorDetailsValue | undefined): boolean {
  if (!d) return false;
  return Boolean(
    d.portInNumber && normalizePortInNumber(d.portInNumber) && !d.portInNumberBlocked && d.donorId?.trim()
      && d.donorIdType && d.donorCustomerType && d.donorOperator && d.donorSubscriptionType
      && !scheduledDateError(d.scheduledPortInDate)
  );
}

export type MnpFormType = 'MNP-Digital' | 'MNP-Touch Screen';

export interface DonorAttachmentValue {
  mnpFormType?: MnpFormType;
  signatureDataUrl?: string;
  /** DF-MNP-025: the unique reference generated with the form. */
  formNumber?: string;
  generatedAt?: string;
  /** The journey data the form was generated from; a change to any of it regenerates the form and clears the signature. */
  snapshotKey?: string;
  /** DF-MNP-026: recorded True when the customer signs. */
  signed?: boolean;
  signedAt?: string;
}

/** What the MNP Form is generated from (MNP_PI_001_CAF_02): the validated customer, donor, Port-In number, product and order details. */
export interface MnpFormInput {
  customerName?: string;
  idType?: string;
  idNumber?: string;
  mnpType: 'postpaid' | 'prepaid';
  productId?: string;
  simSerial?: string;
  donor?: DonorDetailsValue;
}

/** What is still missing for the form to be generated: generation is blocked until the list is empty. */
export function mnpFormMissing(f: MnpFormInput): string[] {
  const d = f.donor;
  const missing: string[] = [];
  if (!f.customerName || !f.idNumber) missing.push('Customer verification');
  if (!d?.portInNumber || !normalizePortInNumber(d.portInNumber)) missing.push('Port-in number');
  if (!d?.donorId || !d.donorIdType || !d.donorCustomerType || !d.donorOperator || !d.donorSubscriptionType) missing.push('Donor details');
  if (!f.productId) missing.push('Plan');
  if (!f.simSerial) missing.push('SIM serial');
  return missing;
}

/** A stable key over everything the form shows, so the form can tell that the journey data it was generated from has changed. */
export function mnpFormSnapshotKey(f: MnpFormInput): string {
  const d = f.donor ?? {};
  return JSON.stringify([
    f.customerName, f.idType, f.idNumber, f.mnpType, f.productId, f.simSerial,
    normalizePortInNumber(d.portInNumber ?? ''), d.donorId, d.donorIdType, d.donorCustomerType, d.donorOperator, d.donorSubscriptionType, d.scheduledPortInDate,
  ]);
}

/** The signed MNP Form is valid for submission only when it was generated from the data the journey holds now. */
export function mnpFormSigned(v: DonorAttachmentValue | undefined, f: MnpFormInput): boolean {
  return Boolean(v?.formNumber && v.signed && v.signatureDataUrl && v.mnpFormType && v.snapshotKey === mnpFormSnapshotKey(f));
}
