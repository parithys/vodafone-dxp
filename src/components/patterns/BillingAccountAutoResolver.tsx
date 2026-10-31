import { useEffect } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { computeBillCycleDay } from './billingAccountModel';
import type { AccountRecord, BillingProfileRecord, ContactRecord, CustomerRecord, BillingAccountValue } from './billingAccountModel';

/**
 * Headless replacement for the Billing Profile page (2026-10-01 request): an
 * existing billing account is selected automatically, and when the customer
 * has none one is created, so the agent never has to visit the step.
 *
 * Mounts anywhere before checkout and renders nothing. It re-resolves only
 * when the customer changes, so an agent who later overrides the value is not
 * overwritten.
 *
 * The auto-created account carries no card: card-on-file tokenisation needs
 * the agent to key a card number, which an automatic step cannot do, so
 * `cardToken`/`cardLast4` stay unset and the order records none.
 */
export function BillingAccountAutoResolver({
  customerId,
  customerName,
  profileSuffix = 'Postpaid',
  accountType,
  value,
  onChange,
}: {
  customerId: string | undefined;
  customerName?: string;
  /** What the new profile is for, appended to the customer's name in its name ("... - Postpaid"). */
  profileSuffix?: string;
  /**
   * The account type this journey bills on (see accountTypeForJourney). Only an account of that type (or a variant of it - "... (HRN)") is selected;
   * an account of another type, or of none stated, is never chosen for it. Absent, any account of the customer.
   */
  accountType?: string;
  value: BillingAccountValue;
  onChange: (value: BillingAccountValue) => void;
}) {
  const key = customerId ?? 'new';
  // Whether a profile is chosen or being created. Dropping it (switching product or MNP plan type clears the billing account) resolves
  // again; an agent's own change keeps it set, so is never overwritten.
  const hasSelection = Boolean(value.selectedProfileId || value.creatingNew);
  useEffect(() => {
    if (value.autoResolvedFor === key) return;
    let cancelled = false;
    (async () => {
      const [accounts, allProfiles, allContacts, allCustomers] = customerId
        ? await Promise.all([
            mockDataEngine.list<AccountRecord>('accounts'),
            mockDataEngine.list<BillingProfileRecord>('billing-profiles'),
            mockDataEngine.list<ContactRecord>('customer-contacts'),
            mockDataEngine.list<CustomerRecord>('customers'),
          ])
        : [[], [], [], []];
      if (cancelled) return;
      const own = (accounts as AccountRecord[])
        .filter((a) => a.customerId === customerId && (!accountType || a.accountType === accountType || a.accountType.startsWith(`${accountType} (`)))
        .map((a) => allProfiles.find((pr) => pr.billingProfileId === a.billingProfileId))
        .filter((p): p is BillingProfileRecord => Boolean(p));
      if (own.length > 0) {
        onChange({ selectedProfileId: own[0].billingProfileId, autoResolvedFor: key });
        return;
      }
      const segment = (allCustomers as CustomerRecord[]).find((c) => c.customerId === customerId)?.segment;
      const contact = (allContacts as ContactRecord[]).find((c) => c.customerId === customerId);
      onChange({
        creatingNew: true,
        autoResolvedFor: key,
        newAccount: {
          primaryContactId: contact?.contactRecordId,
          preferredInvoiceRecipient: 'Primary Contact',
          billCycleDay: computeBillCycleDay(segment, new Date()),
          profileName: `${customerName ?? 'New customer'} - ${profileSuffix}`,
          billMedia: 'Email',
          billingSchedule: 'Immediate',
        },
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, hasSelection]);
  return null;
}
