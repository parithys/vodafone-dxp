import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';

/**
 * The identity an agent-created customer is judged on: no registry knows the ID, so the eligibility checks run on what the agent entered. Undefined
 * for a customer a registry returned. Every page that judges eligibility for the journey's customer (Customer Verification, Product Selection, the
 * MNP plan type) passes it, or the same customer is "not found" on the page after the one that created them.
 */
export function newIdentityOf(contact: GuidedContactValue | undefined) {
  return contact?.moiResult?.createdByAgent && contact.idType
    ? { idNumber: contact.idNumber ?? '', idType: contact.idType, nationality: contact.moiResult.nationality, dob: contact.moiResult.dob, expiryDate: contact.moiResult.expiryDate }
    : undefined;
}
