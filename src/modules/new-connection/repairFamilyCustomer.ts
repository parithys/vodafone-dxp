import * as mockDataEngine from '../../engines/mockDataEngine';
import type { FamilyLine } from '../../engines/familyPackage';
import type { GuidedContactValue } from '../../capabilities';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { buildNewCustomerRecords, isNewlyIdentifiedCustomer, newCustomerId } from './newCustomerRecords';

// A Family Package line is tied to its customer by `customerId`, or - for a customer first identified in a journey, before they had a record - by the
// `idNumber` they were identified with. The "this customer already has a Family Package" check reads both, but Customer 360 and Customer Search only know
// customer RECORDS, so a package held by an ID alone told the agent to add connections from a Customer 360 that does not exist. These functions find those
// lines and give them their customer: the record is created from what Customer Verification captured (the same records a first Family Package line creates),
// or an existing record for the ID is used, and the lines (and the orders that opened them) are linked to it.

/** The lines held by this ID alone: no customer record named on them. */
export const orphanFamilyLines = (lines: readonly FamilyLine[], idNumber: string | undefined): FamilyLine[] =>
  idNumber ? lines.filter((l) => !l.customerId && l.idNumber === idNumber) : [];

type Write = {
  createRecord: (kind: 'customers' | 'identity-documents' | 'customer-contacts', record: Record<string, unknown>) => Promise<void>;
  updateRecord: (kind: 'family-package-lines' | 'orders', idField: string, id: string, patch: Record<string, unknown>, audit?: { how?: string; by?: string }) => Promise<void>;
};

/**
 * Gives the customer behind `orphanLines` a record and links the lines to it. Returns the customer's id, or undefined when that cannot be done: the ID is not
 * one the journey identified as a new customer (nothing was captured to build a record from), so nothing is invented. Safe to run again: a record that now
 * exists for the ID is used rather than created twice.
 */
export async function repairFamilyCustomer(
  { contact, eligibility, orphanLines }: { contact: GuidedContactValue | undefined; eligibility: EligibilityResult | undefined; orphanLines: readonly FamilyLine[] },
  { createRecord, updateRecord }: Write
): Promise<string | undefined> {
  if (!contact?.idNumber || orphanLines.length === 0) return undefined;
  let customerId = eligibility?.customerId;
  if (!customerId) {
    const known = (await mockDataEngine.list<{ customerId: string; qid?: string }>('customers')).find((c) => c.qid === contact.idNumber);
    if (known) customerId = known.customerId;
    else if (isNewlyIdentifiedCustomer(contact, eligibility)) {
      customerId = newCustomerId();
      const records = buildNewCustomerRecords(customerId, contact, eligibility);
      await createRecord('customers', records.customer);
      await createRecord('identity-documents', records.document);
      await createRecord('customer-contacts', records.contact);
    } else return undefined;
  }
  const how = 'Linked to the customer record created for this ID';
  for (const line of orphanLines) await updateRecord('family-package-lines', 'lineId', line.lineId, { customerId }, { how });
  const orders = await mockDataEngine.list<{ orderId: string; idNumber?: string; customerId?: string; familyPackageId?: string }>('orders');
  for (const o of orders.filter((x) => x.idNumber === contact.idNumber && !x.customerId && x.familyPackageId)) await updateRecord('orders', 'orderId', o.orderId, { customerId }, { how });
  return customerId;
}
