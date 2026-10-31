import type { EntityKind } from './mockDataEngine';

/**
 * The audit trail of a customer's information. Every write to one of these records is compared with what the record held and each field that
 * actually changed becomes one audit row (what changed, old value, new value, who, and how it came about) - so no journey or screen has to
 * remember to log, and none can change the customer's information without leaving a trace.
 */
const AUDITED: Partial<Record<EntityKind, { recordType: string; recordIdField: string; labels?: Record<string, string> }>> = {
  customers: { recordType: 'Customer', recordIdField: 'customerId' },
  'customer-contacts': { recordType: 'Contact', recordIdField: 'contactRecordId' },
  // Addresses and identity documents hang off the customer; their rows are filed under the customer so Customer 360 shows them.
  addresses: { recordType: 'Address', recordIdField: 'customerId' },
  // The customer's accounts and billing profiles: filed under the account, which is how Customer 360 joins the trail.
  accounts: { recordType: 'Account', recordIdField: 'accountId', labels: { status: 'Account Status', hrnFlag: 'HRN Flag' } },
  'billing-profiles': { recordType: 'Billing Profile', recordIdField: 'accountId', labels: { name: 'Billing Account Name', primaryContactId: 'Primary Contact' } },
  'identity-documents': { recordType: 'ID Document', recordIdField: 'customerId' },
};

/** Fields that are derived by the system and are not information about the customer (a line counter moves with every order; timestamps follow another change). */
const NOT_CUSTOMER_INFORMATION = new Set(['activePostpaidLines', 'activePrepaidLines', 'creditRiskUpdatedAt', 'lastUpdated', 'updatedAt']);

const LABELS: Record<string, string> = {
  name: 'Customer Name',
  qid: 'ID Number',
  idType: 'ID Type',
  idNumber: 'ID Number',
  idExpirationDate: 'ID Expiry Date',
  documentType: 'ID Type',
  documentNumber: 'ID Number',
  expiryDate: 'ID Expiry Date',
  docStatus: 'Document Status',
  dob: 'Date of Birth',
  cellNumber: 'Mobile Number',
  phone: 'Mobile Number',
  kahramaaId: 'Kahramaa ID',
  poBox: 'PO Box',
};
const humanise = (field: string) => LABELS[field] ?? field.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const show = (v: unknown): string | undefined => (v === undefined || v === null || v === '' ? undefined : typeof v === 'object' ? JSON.stringify(v) : String(v));

export const isAuditedKind = (kind: EntityKind): boolean => kind in AUDITED;

export interface CustomerChangeInput {
  kind: EntityKind;
  /** The record as it was before the write. */
  before: Record<string, unknown>;
  /** What the write sets. */
  patch: Record<string, unknown>;
  by: string;
  /** How the change came about: edited by the agent, updated from the MOI response, set by the system... */
  how: string;
  now?: Date;
}

/** One audit row per field the write really changed; none for a field set to the value it already had. */
export function customerChangeAuditRows(i: CustomerChangeInput): Record<string, unknown>[] {
  const spec = AUDITED[i.kind];
  if (!spec) return [];
  const recordId = show(i.before[spec.recordIdField]);
  if (!recordId) return [];
  const now = i.now ?? new Date();
  const stamp = `${now.getTime()}`;
  return Object.keys(i.patch)
    .filter((f) => !f.startsWith('_') && !NOT_CUSTOMER_INFORMATION.has(f) && show(i.before[f]) !== show(i.patch[f]))
    .map((f, n) => ({
      auditId: `AUD-${stamp.slice(-8)}${n ? `-${n}` : ''}-${f}`,
      recordType: spec.recordType,
      recordId,
      employeeUser: i.by,
      fieldModified: spec.labels?.[f] ?? humanise(f),
      oldValue: show(i.before[f]),
      newValue: show(i.patch[f]),
      changeBasis: i.how,
      timestamp: now.toISOString(),
    }));
}

/** The audit row for an ID document added to a customer (a QID linked to a Passport customer): there is no old value, the new value is the document. */
export function idDocumentAddedAuditRow(doc: Record<string, unknown>, by: string, how: string, now = new Date()): Record<string, unknown> | undefined {
  const customerId = show(doc.customerId);
  if (!customerId) return undefined;
  return {
    auditId: `AUD-${`${now.getTime()}`.slice(-8)}-doc`,
    recordType: 'ID Document',
    recordId: customerId,
    employeeUser: by,
    fieldModified: 'ID Document Added',
    newValue: [show(doc.documentType), show(doc.documentNumber)].filter(Boolean).join(' '),
    changeBasis: how,
    timestamp: now.toISOString(),
  };
}
