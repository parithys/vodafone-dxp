import { Select } from '../primitives/Select';
import { creditLimitPolicy } from '../../engines/creditLimit';
import { accountTypeForJourney, creditLimitOptions, creditSegmentOf, customerCategoryOf, defaultCreditLimitFor, type JourneyAccountType } from '../../engines/creditLimit';
import { isHrn } from '../../engines/hrnConfiguration';
import { formatQar } from '../../lib/format';

const row = 'flex items-baseline justify-between gap-4 py-1.5 border-b border-border-soft';

/**
 * A NEW account's credit limit (a new customer, or a customer with no billing account yet): the account type the agent's journey opens, the customer's
 * segment (Qatari / Expat) and category (HRN / Non-HRN) read from their nationality - and the credit limit: a dropdown that starts on the segment's
 * default (Expat QAR 1,000) and offers the values up to it. For an HRN customer it is the HRN QAR 50 and cannot be changed.
 */
export function CreditLimitCard({
  nationality,
  selected,
  onChange,
  accountType = accountTypeForJourney('postpaid'),
  customerSegment,
  embedded = false,
}: {
  nationality: string | undefined;
  /** The agent's chosen limit; undefined means the default. */
  selected: number | undefined;
  onChange: (limitQar: number | undefined) => void;
  accountType?: JourneyAccountType;
  /** The customer's segment: a Safwa, Safwa+ or Royal customer's limit cannot be changed (creditLimitPolicy), as an HRN customer's cannot. */
  customerSegment?: string;
  /** Only the rows, with no heading or spacing of their own: the caller lists them inside its own section (Billing Details). */
  embedded?: boolean;
}) {
  const segment = creditSegmentOf(nationality);
  const category = customerCategoryOf(nationality);
  const defaultQar = defaultCreditLimitFor(nationality);
  const options = creditLimitOptions(nationality);
  const hrn = isHrn(nationality);
  const policy = creditLimitPolicy({ segment: customerSegment, nationality });
  const value = selected !== undefined && options.includes(selected) ? selected : defaultQar;
  const rows = (
    <>
      <div className={row}>
        <dt className="text-fg-2">Account Type</dt>
        <dd className="text-fg font-medium">{accountType.startsWith('Consumer') ? 'Consumer' : accountType}</dd>
      </div>
      <div className={row}>
        <dt className="text-fg-2">Customer Segment</dt>
        <dd className="text-fg font-medium">{segment ?? '-'}</dd>
      </div>
      <div className={row}>
        <dt className="text-fg-2">Customer Category</dt>
        <dd className="text-fg font-medium">{category}</dd>
      </div>
      {/* The limit sits in the same row layout as the facts above: a dropdown for a customer who can choose, plain text for one who cannot (HRN: QAR 50). */}
      <div className={`${row} items-center`}>
        <dt className="text-fg-2">Credit Limit (QAR)</dt>
        <dd className="text-fg font-medium">
          {policy.editable ? (
            <div className="w-44">
              <Select
                aria-label="Credit Limit (QAR)"
                value={String(value)}
                options={options.map((o) => ({ value: String(o), label: `${formatQar(o)}` }))}
                onChange={(e) => onChange(Number(e.target.value) === defaultQar ? undefined : Number(e.target.value))}
              />
            </div>
          ) : (
            formatQar(value)
          )}
        </dd>
      </div>
    </>
  );
  // Why a limit cannot be changed, except for HRN, which needs no explanation (a row of its own, so it can sit inside a definition list).
  const note =
    !policy.editable && !(hrn && policy.lock === 'hrn') && policy.message ? (
      <div className="py-1.5">
        <dt className="sr-only">Note</dt>
        <dd className="text-muted text-[length:var(--fs-caption)]">{policy.message}</dd>
      </div>
    ) : null;
  if (embedded) {
    return (
      <>
        {rows}
        {note}
      </>
    );
  }
  return (
    <section aria-label="Credit limit" className="space-y-3 mt-8">
      <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Credit Limit</h3>
      <dl className="text-[length:var(--fs-body)]">
        {rows}
        {note}
      </dl>
    </section>
  );
}
