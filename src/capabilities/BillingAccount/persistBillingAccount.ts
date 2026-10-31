import type { EntityKind } from '../../engines/mockDataEngine';
import type { JourneyAccountType } from '../../engines/creditLimit';
import { creditLimitAuditRecord, creditLimitOptions, creditLimitPolicy, creditSegmentOf } from '../../engines/creditLimit';
import { isHrn } from '../../engines/hrnConfiguration';
import { DEFAULT_BILL_LANGUAGE, DEFAULT_BILL_TYPE, ordinal, profilePatchFromEdit } from '../../components/patterns/billingAccountModel';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';

/** What the customer's billing account is for: decides the account's type. */
export type BillingAccountKind = Extract<JourneyAccountType, 'Consumer Mobile Postpaid' | 'Consumer Fixed Line (GigaHome)'>;

/**
 * Makes the billing account of an order real, and returns the billing profile the order is billed to.
 *
 * An existing account the agent (or the auto-resolver) selected is reused as it is. When the customer has none, the
 * journey has built a NEW one (`creatingNew`); this writes it - an `accounts` row and its `billing-profiles` row,
 * flagged `isDefault` unless the agent unticked "primary payment profile" - so it exists for Customer 360 and the next order, instead of only being named on the order.
 * Returns undefined when there is neither, which the order records as no billing profile.
 *
 * A customer who has no record yet (a new customer known only to NAS) gets the rows keyed by their ID number; the
 * journey creates no customer record, so Customer 360 will not list them until one exists.
 */
export async function persistBillingAccount(
  billing: BillingAccountValue | undefined,
  ctx: {
    createRecord: (kind: EntityKind, record: Record<string, unknown>) => Promise<void>;
    /** Saves an edited billing address onto the selected account's profile. Without it an edit stays on the order's draft only. */
    updateRecord?: (kind: EntityKind, idField: string, id: string, patch: Record<string, unknown>) => Promise<void>;
    kind: BillingAccountKind;
    customerId?: string;
    idNumber?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    /** The address the bill goes to, as a line. */
    addressLine?: string;
    /** The credit limit set for a new postpaid account: the DEFAULT for the customer (the agent's choice, when allowed, is on `newAccount.creditLimitQar`). */
    creditLimitQar?: number;
    /** The customer's nationality, which decides the credit-limit options (an agent's choice outside them is ignored). */
    nationality?: string;
    /** The customer's segment: for a Safwa, Safwa+ or Royal customer the limit cannot be changed, so an agent's choice is ignored. */
    segment?: string;
    /** The agent making the change, for the audit trail. */
    agentId?: string;
  }
): Promise<string | undefined> {
  if (billing?.selectedProfileId) {
    // The agent edited the selected account: what they changed is saved on that account's profile.
    if (billing.editingProfileId === billing.selectedProfileId && billing.newAccount && ctx.updateRecord) {
      const patch = profilePatchFromEdit(billing.newAccount);
      if (Object.keys(patch).length) await ctx.updateRecord('billing-profiles', 'billingProfileId', billing.selectedProfileId, patch);
    }
    return billing.selectedProfileId;
  }
  const fresh = billing?.creatingNew ? billing.newAccount : undefined;
  if (!fresh) return undefined;
  const stamp = Date.now().toString().slice(-6);
  const accountId = `ACC-${stamp}`;
  // The credit limit: the agent's choice when it is one of the options for this customer's segment (HRN allows none), else the default.
  const defaultQar = ctx.creditLimitQar;
  const policy = creditLimitPolicy({ segment: ctx.segment, nationality: ctx.nationality });
  const chosen = policy.editable && fresh.creditLimitQar !== undefined && creditLimitOptions(ctx.nationality).includes(fresh.creditLimitQar) ? fresh.creditLimitQar : undefined;
  const limit = chosen ?? defaultQar;
  const billingProfileId = `BILL-${stamp}`;
  await ctx.createRecord('accounts', {
    accountId,
    customerId: ctx.customerId,
    idNumber: ctx.idNumber,
    accountType: ctx.kind,
    status: 'Active',
    billingProfileId,
  });
  await ctx.createRecord('billing-profiles', {
    billingProfileId,
    accountId,
    name: fresh.profileName ?? `${ctx.contactName ?? 'Customer'} - ${ctx.kind === 'Consumer Mobile Postpaid' ? 'Postpaid' : 'Fixed Line'}`,
    // The first profile a customer has is their primary payment profile; the agent can untick it when they already have one.
    isDefault: fresh.primaryPaymentProfile ?? true,
    billingCycle: fresh.billCycleDay ? `Monthly - Day ${fresh.billCycleDay}` : 'Monthly',
    billCycleLabel: fresh.billCycleDay ? ordinal(fresh.billCycleDay) : undefined,
    billingType: fresh.billingMode ?? 'Arrears',
    billingAddress: ctx.addressLine,
    billMedium: fresh.billMedia ?? 'Email',
    billType: fresh.billType ?? DEFAULT_BILL_TYPE,
    billLanguage: fresh.billLanguage ?? DEFAULT_BILL_LANGUAGE,
    ...(fresh.vatRegistrationNumber?.trim() ? { vatRegistrationNumber: fresh.vatRegistrationNumber.trim() } : {}),
    ...(fresh.vatRegistrationNumber?.trim() && fresh.vatExpiryDate?.trim() ? { vatExpiryDate: fresh.vatExpiryDate.trim() } : {}),
    billingSchedule: fresh.billingSchedule,
    autoPayStatus: fresh.cardToken ? 'Enrolled' : 'Not enrolled',
    paymentMethod: fresh.cardToken ? 'Card on file' : undefined,
    cardLast4: fresh.cardLast4,
    collectionStatus: 'Good Standing',
    creditLimitQAR: limit,
    promiseToPayStatus: 'None',
    // The primary contact the agent picked; the customer's own details unless it is another contact from the account, whose record supplies theirs.
    billingContactName: fresh.primaryContactName?.trim() || ctx.contactName,
    billingContactPhone: fresh.primaryContactPhone !== undefined ? fresh.primaryContactPhone || undefined : ctx.contactPhone,
    billingContactEmail: fresh.primaryContactEmail !== undefined ? fresh.primaryContactEmail || undefined : ctx.contactEmail,
    ...(fresh.secondaryContactName?.trim()
      ? {
          secondaryContactName: fresh.secondaryContactName.trim(),
          ...(fresh.secondaryContactPhone ? { secondaryContactPhone: fresh.secondaryContactPhone } : {}),
          ...(fresh.secondaryContactEmail ? { secondaryContactEmail: fresh.secondaryContactEmail } : {}),
        }
      : {}),
    previousOutstandingQAR: 0,
  });
  // The account's credit limit, with its breakdown (default / agent's choice / Credit Control blank), and the audit-trail row for it.
  if (limit !== undefined) {
    const today = new Date().toISOString().slice(0, 10);
    await ctx.createRecord('credit-limits', {
      id: `CRL-${stamp}`,
      accountId,
      customerId: ctx.customerId,
      idNumber: ctx.idNumber,
      customerSegment: creditSegmentOf(ctx.nationality),
      creditLimitQar: limit,
      defaultCreditLimitQar: defaultQar,
      selectedCreditLimitQar: chosen !== undefined && chosen !== defaultQar ? chosen : null,
      creditControlLimitQar: null,
      isHrn: isHrn(ctx.nationality),
      setByAgentId: ctx.agentId,
      restrictionApplied: Boolean(policy.lock),
      lastUpdated: today,
    });
    await ctx.createRecord(
      'audit-trail',
      creditLimitAuditRecord({ recordId: accountId, toQar: limit, by: ctx.agentId ?? 'agent', how: chosen !== undefined && chosen !== defaultQar ? 'Selected on a new account' : 'Default on a new account' })
    );
  }
  return billingProfileId;
}
