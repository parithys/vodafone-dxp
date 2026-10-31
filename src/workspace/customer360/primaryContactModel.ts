export interface ContactLike {
  contactRecordId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export const contactName = (c: Partial<ContactLike>): string => [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ');

/**
 * The account's Primary Contact: the one chosen on its billing profile when that is still one of its contacts, otherwise the FIRST contact.
 * An account with no contacts has none.
 */
export function primaryContactOf<C extends { contactRecordId?: unknown }>(contacts: C[], chosenId: unknown): C | undefined {
  return contacts.find((c) => c.contactRecordId === chosenId) ?? contacts[0];
}

/** The Primary Contact can be changed only when the account has more than one contact to choose from. */
export const canChangePrimaryContact = (contactCount: number): boolean => contactCount > 1;
