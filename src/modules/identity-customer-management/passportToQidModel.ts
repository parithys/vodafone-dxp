// Passport to QID update: the customer who OWNS the line must be the customer who holds the Passport, and the QID must belong to that same
// person - never to another customer, and never to a stranger. Checked against the records, not the typed text.
import { samePerson, type CustomerToMatch, type IdDocRecord } from '../../components/patterns/idLinkModel';
import { RESTRICTED_CUSTOMER_MESSAGE } from '../../data/customerSegments';

const digits = (s: string | undefined) => (s ?? '').replace(/\D/g, '');
const squash = (s: string | undefined) => (s ?? '').replace(/[\s-]/g, '').toUpperCase();

export interface PassportOwner {
  customerId: string;
  name: string;
  dob: string;
  nationality: string;
  /** The Passport's own record, so the update can retire it. */
  passportDocumentId?: string;
  passportNumber: string;
}
export type PassportCheck = { ok: true; owner: PassportOwner } | { ok: false; message: string; restricted?: true };

interface Data {
  customers: (CustomerToMatch & { phone?: string })[];
  documents: (IdDocRecord & { identityDocumentId?: string })[];
  /** Installed services: the line's `serviceId` (an MSISDN for a mobile line) and the account it sits on. */
  assets: { serviceId?: string; accountId?: string }[];
  accounts: { accountId: string; customerId: string }[];
}

/** Who owns the line: the account its service sits on, else the customer whose own number it is. Undefined when no record says. */
export function ownerOfMsisdn(msisdn: string, d: Pick<Data, 'customers' | 'assets' | 'accounts'>): string | undefined {
  const want = digits(msisdn).slice(-8);
  if (want.length < 8) return undefined;
  const asset = d.assets.find((a) => digits(a.serviceId).slice(-8) === want && (a.serviceId ?? '').startsWith('+'));
  const viaAccount = asset && d.accounts.find((x) => x.accountId === asset.accountId)?.customerId;
  return viaAccount ?? d.customers.find((c) => digits(c.phone).slice(-8) === want)?.customerId;
}

/** Step 1: the Passport must be on file and held by the owner of the line. */
export function checkPassportOwner(input: { msisdn: string; passportNumber: string }, d: Data, canView: (customerId: string) => boolean = () => true): PassportCheck {
  const ownerId = ownerOfMsisdn(input.msisdn, d);
  if (!ownerId) return { ok: false, message: 'No customer on file owns this MSISDN.' };
  const doc = d.documents.find((x) => x.documentType === 'Passport' && squash(x.documentNumber) === squash(input.passportNumber));
  // A protected-segment customer this role may not see - the line's owner or the Passport's holder - is refused with no detail (no name, no ID).
  if (!canView(ownerId) || (doc && !canView(doc.customerId))) return { ok: false, restricted: true, message: RESTRICTED_CUSTOMER_MESSAGE };
  if (!doc) return { ok: false, message: 'This Passport number is not on file.' };
  if (doc.customerId !== ownerId) return { ok: false, message: `This Passport belongs to ${doc.customerId}, not to the customer who owns this line (${ownerId}).` };
  const c = d.customers.find((x) => x.customerId === ownerId);
  if (!c) return { ok: false, message: `The customer record for ${ownerId} cannot be found.` };
  return { ok: true, owner: { customerId: c.customerId, name: c.name, dob: c.dob, nationality: c.nationality, passportDocumentId: doc.identityDocumentId, passportNumber: doc.documentNumber } };
}

/** Step 2: what the QID's MOI result says must be the line owner: not another customer, and (when it has no record of its own) the same person. */
export function qidProblem(
  owner: PassportOwner,
  moi: { customerId?: string; name: string; dob: string; nationality: string; linkedIdUpdate?: { customerId: string } } | undefined
): string | undefined {
  if (!moi) return undefined;
  if (moi.customerId && moi.customerId !== owner.customerId) return `This QID already belongs to customer ${moi.customerId}, not to ${owner.customerId}. A QID cannot be moved to a second customer.`;
  if (moi.linkedIdUpdate && moi.linkedIdUpdate.customerId !== owner.customerId) return `This QID is linked to customer ${moi.linkedIdUpdate.customerId}, not to ${owner.customerId}.`;
  if (!moi.customerId && !samePerson(moi, owner)) return `This QID is registered to a different person: the name, date of birth or nationality does not match ${owner.customerId}.`;
  return undefined;
}

/** What the update writes: the QID joins the customer's documents, the Passport is retired, the customer's ID details follow. */
export function passportToQidWrites(owner: PassportOwner, qid: { number: string; expiryDate?: string }) {
  return {
    qidDocument: { customerId: owner.customerId, documentType: 'QID' as const, documentNumber: qid.number, expiryDate: qid.expiryDate, via: 'passport' as const, passportNumber: owner.passportNumber },
    retirePassport: owner.passportDocumentId ? { id: owner.passportDocumentId, patch: { docStatus: 'Archived', status: 'Replaced by QID' } } : undefined,
    customerPatch: { idType: 'QID', qid: qid.number },
  };
}
