import type { EntityKind } from '../../engines/mockDataEngine';
import { actualUserIdentity, contactUpdateFor, supplementaryRows } from './actualUserModel';
import type { ActualUserValue } from './actualUserModel';

type UpdateRecord = (kind: EntityKind, idField: string, id: string, patch: Record<string, unknown>) => Promise<void>;

/** What the order records about the line's actual user (nothing when the primary customer uses it). The Supplementary Form was signed with the CAF. */
export function actualUserOrderFields(v: ActualUserValue | undefined): Record<string, unknown> {
  const i = actualUserIdentity(v);
  if (!i) return {};
  return {
    actualUser: {
      name: i.moiResult?.name,
      customerId: i.moiResult?.isNewCustomer ? undefined : i.moiResult?.customerId,
      isNewCustomer: Boolean(i.moiResult?.isNewCustomer),
      idType: i.idType,
      idNumber: i.idNumber,
      nationality: i.moiResult?.nationality,
      dob: i.moiResult?.dob,
      email: i.email,
      alternatePhone: i.altPhone,
    },
    supplementaryForm: { signedWithCaf: true, rows: supplementaryRows(v) },
  };
}

type ListContacts = () => Promise<{ contactRecordId: string; customerId: string }[]>;

/**
 * An actual user who is already a customer keeps the details confirmed here: the email on their customer record, the phone on their existing
 * contact-level record (matched by customerId; one is never created). Returns whether anything was written.
 */
export async function saveActualUserContact(v: ActualUserValue | undefined, updateRecord: UpdateRecord | undefined, listContacts?: ListContacts): Promise<boolean> {
  const update = contactUpdateFor(v);
  if (!update || !updateRecord) return false;
  let wrote = false;
  if (Object.keys(update.patch).length) {
    await updateRecord('customers', 'customerId', update.customerId, update.patch);
    wrote = true;
  }
  if (update.contactPatch) {
    const record = (await listContacts?.())?.find((c) => c.customerId === update.customerId);
    if (record) {
      await updateRecord('customer-contacts', 'contactRecordId', record.contactRecordId, update.contactPatch);
      wrote = true;
    }
  }
  return wrote;
}
