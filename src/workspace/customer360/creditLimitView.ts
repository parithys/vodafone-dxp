import { creditLimitBreakdown, defaultCreditLimitFor, depositIncreaseOf, type CreditLimitBreakdown, type CreditLimitRecord } from '../../engines/creditLimit';

interface CreditView {
  customer: { nationality?: unknown };
  accounts: { accountId?: unknown }[];
  creditLimits: Record<string, unknown>[];
  depositBundles?: Record<string, unknown>[];
}

/**
 * The customer's credit limit as every Customer 360 screen shows it: overall, default, Credit Control Team's, deposit increase. One reading of the
 * loaded data, so the header, the tabs, the billing page and the telesales views can never show different figures for the same limit.
 */
export function creditBreakdownOf(data: CreditView): CreditLimitBreakdown {
  const record = data.creditLimits[0] as (CreditLimitRecord & { accountId?: string }) | undefined;
  const accountId = record?.accountId ?? (data.accounts[0]?.accountId as string | undefined);
  return creditLimitBreakdown(
    record,
    defaultCreditLimitFor(data.customer.nationality as string | undefined),
    depositIncreaseOf(accountId, (data.depositBundles ?? []) as { accountId?: string; depositAmountQar?: number; status?: string }[])
  );
}

/** The overall limit in force, or undefined when the customer has no limit record. */
export const overallCreditLimitOf = (data: CreditView): number | undefined => creditBreakdownOf(data).overall;
