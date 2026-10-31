/** The customer segments an agent can move a customer to: the configured list (data/customerSegments.ts). The customer's current segment is always shown too. */
export { ALL_SEGMENTS as EDITABLE_SEGMENTS } from '../../data/customerSegments';
/** Account statuses an agent can set (the ones the account records carry). */
export const EDITABLE_ACCOUNT_STATUSES: readonly string[] = ['Active', 'Suspended', 'Closed'];

export interface AccountEdits {
  creditLimitQar?: number;
  accountStatus?: string;
  segment?: string;
}

/**
 * What changed in the account details: the field names for the follow-up ticket, and the values to write. A credit limit must be a whole number
 * of QAR, zero or more. Pure, so the rules are tested without the drawer.
 */
export function diffAccountEdits(
  before: { creditLimitQar?: number; accountStatus?: string; segment?: string },
  after: { creditLimit: string; accountStatus: string; segment: string }
): { changed: string[]; edits: AccountEdits; error?: string } {
  const changed: string[] = [];
  const edits: AccountEdits = {};
  const trimmed = after.creditLimit.trim();
  if (trimmed !== '') {
    const n = Number(trimmed);
    if (!Number.isInteger(n) || n < 0) return { changed, edits, error: 'Enter the credit limit as a whole number of QAR, zero or more.' };
    if (n !== before.creditLimitQar) {
      changed.push('Credit Limit');
      edits.creditLimitQar = n;
    }
  }
  if (after.accountStatus && after.accountStatus !== before.accountStatus) {
    changed.push('Account Status');
    edits.accountStatus = after.accountStatus;
  }
  if (after.segment && after.segment !== before.segment) {
    changed.push('Customer Segment');
    edits.segment = after.segment;
  }
  return { changed, edits };
}

