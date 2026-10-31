// QID <-> Passport reconciliation at Customer Verification. A person presenting a QID that no customer holds may already be a customer under
// their PASSPORT (the registry returns the Passport linked to the QID). Before anyone is treated as new, the existing customer is looked for:
//   1. through the linked Passport: the customer holding it, confirmed to be the same person (name, date of birth and nationality agree);
//   2. failing a link, by exactly those three attributes: one customer is the person, several are an ambiguity, none means new.
// A customer who already holds a DIFFERENT QID is never silently given a second one: that is a conflict for the agent to resolve.
import { reconcileIdentity } from './idReconciliation';

export interface PersonToMatch {
  name: string;
  /** ISO date. */
  dob: string;
  nationality: string;
  /** The Passport the registry links to this person's QID, when it has one. */
  linkedPassportNumber?: string;
}
export interface IdDocRecord {
  customerId: string;
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
}
export interface CustomerToMatch {
  customerId: string;
  name: string;
  dob: string;
  nationality: string;
  /** The segment, for the role's access to the customer (a protected segment is not named to a role without the grant). */
  segment?: string;
}

/** What an agent is told when the person matches a customer this role may not see: nothing that names or identifies them. */
export const RESTRICTED_MATCH_MESSAGE = 'This person may already be a customer whose record this role cannot view. Identify them by their existing ID, or ask a colleague with access.';

export type ExistingCustomerResult =
  | { kind: 'none' }
  | { kind: 'linked'; customerId: string; via: 'passport' | 'identity'; passportNumber?: string }
  | { kind: 'conflict'; message: string; customerId?: string };

/** What a successful link asks the order to do: add this QID to the existing customer's identity documents. */
export interface LinkedIdUpdate {
  customerId: string;
  documentType: 'QID';
  documentNumber: string;
  expiryDate?: string;
  via: 'passport' | 'identity';
  /** The Passport the customer was found by, when the link was through one. */
  passportNumber?: string;
}

const squash = (s: string) => s.replace(/[\s-]/g, '').toUpperCase();

/** Same person: name, date of birth and nationality all agree (case, spacing, punctuation and date format aside). */
export function samePerson(a: Pick<PersonToMatch, 'name' | 'dob' | 'nationality'>, b: Pick<CustomerToMatch, 'name' | 'dob' | 'nationality'>): boolean {
  const r = reconcileIdentity({ name: a.name, dob: a.dob, nationality: a.nationality }, { name: b.name, dob: b.dob, nationality: b.nationality });
  return ['name', 'dob', 'nationality'].every((k) => r.find((x) => x.attribute === k)?.result === 'match');
}

export function resolveExistingCustomer(
  person: PersonToMatch,
  docs: IdDocRecord[],
  customers: CustomerToMatch[],
  /** The QID being presented: a customer who holds a different QID than this one cannot be linked to it. */
  presentedQid?: string,
  /** Whether this role may see a customer (protected segments). A message about a customer it may not see names no one: RESTRICTED_MATCH_MESSAGE. */
  canSee: (c: CustomerToMatch) => boolean = () => true
): ExistingCustomerResult {
  const restrictedConflict = (c: CustomerToMatch | undefined): ExistingCustomerResult | undefined => (c && !canSee(c) ? { kind: 'conflict', message: RESTRICTED_MATCH_MESSAGE } : undefined);
  const heldQid = (customerId: string) => docs.find((d) => d.customerId === customerId && d.documentType === 'QID');
  const qidConflict = (customerId: string): ExistingCustomerResult | undefined => {
    const held = heldQid(customerId);
    const hidden = restrictedConflict(customers.find((c) => c.customerId === customerId));
    if (hidden && held && presentedQid && squash(held.documentNumber) !== squash(presentedQid)) return hidden;
    return held && presentedQid && squash(held.documentNumber) !== squash(presentedQid)
      ? { kind: 'conflict', customerId, message: `This person is already customer ${customerId}, who holds a different QID (${held.documentNumber}). Check the ID before continuing.` }
      : undefined;
  };

  if (person.linkedPassportNumber) {
    const wanted = squash(person.linkedPassportNumber);
    const passportDoc = docs.find((d) => d.documentType === 'Passport' && squash(d.documentNumber) === wanted);
    if (passportDoc) {
      const customer = customers.find((c) => c.customerId === passportDoc.customerId);
      if (!customer) return { kind: 'conflict', customerId: passportDoc.customerId, message: `The Passport linked to this QID is on file, but its customer record (${passportDoc.customerId}) cannot be found.` };
      if (!samePerson(person, customer)) {
        const hidden = restrictedConflict(customer);
        if (hidden) return hidden;
        return { kind: 'conflict', customerId: customer.customerId, message: `The Passport linked to this QID belongs to ${customer.customerId}, whose name, date of birth or nationality differ. Check the ID before continuing.` };
      }
      return qidConflict(customer.customerId) ?? { kind: 'linked', customerId: customer.customerId, via: 'passport', passportNumber: passportDoc.documentNumber };
    }
  }

  const matches = customers.filter((c) => samePerson(person, c));
  if (matches.length > 1) {
    if (matches.some((m) => !canSee(m))) return { kind: 'conflict', message: RESTRICTED_MATCH_MESSAGE };
    return { kind: 'conflict', message: `More than one existing customer has this name, date of birth and nationality (${matches.map((m) => m.customerId).join(', ')}). Identify the customer by their existing ID.` };
  }
  if (matches.length === 1) return qidConflict(matches[0].customerId) ?? { kind: 'linked', customerId: matches[0].customerId, via: 'identity' };
  return { kind: 'none' };
}

/** The agent-facing sentence when someone is about to be created as a new customer but already exists. */
export function duplicateCustomerMessage(r: ExistingCustomerResult, canSee: boolean = true): string | undefined {
  if (r.kind === 'conflict') return r.message;
  if (r.kind === 'linked' && !canSee) return RESTRICTED_MATCH_MESSAGE;
  if (r.kind === 'linked') return `A customer with the same name, date of birth and nationality is already on file (${r.customerId}). Identify them by their existing ID instead of creating a duplicate.`;
  return undefined;
}

/** The identity-document record that adds the QID to an existing customer (the shape identity-documents.json uses). */
export function qidDocumentRecord(update: LinkedIdUpdate, now: Date = new Date()): Record<string, unknown> {
  const stamp = now.toISOString();
  return {
    identityDocumentId: `IDD-${now.getTime().toString().slice(-7)}`,
    customerId: update.customerId,
    documentType: update.documentType,
    documentNumber: update.documentNumber,
    expiryDate: update.expiryDate,
    validationPath: 'MOI Validation',
    status: 'Validated',
    scanCompleted: true,
    scannedAt: stamp,
    docStatus: 'Active',
    uploadDateTime: stamp,
    serviceReference: update.customerId,
    ...(update.passportNumber ? { linkedFromPassport: update.passportNumber } : {}),
  };
}
