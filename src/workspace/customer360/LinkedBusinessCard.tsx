import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLinkedBusiness, type LinkedBusinessLookup } from '../../engines/businessAccountEngine';

/** The business behind a customer's line, or undefined while loading and for a customer with no business link. */
function useLinkedBusiness(customerId: string): LinkedBusinessLookup | undefined {
  const [result, setResult] = useState<{ id: string; lookup: LinkedBusinessLookup } | undefined>();
  useEffect(() => {
    let cancelled = false;
    void getLinkedBusiness(customerId).then((lookup) => !cancelled && setResult({ id: customerId, lookup }));
    return () => {
      cancelled = true;
    };
  }, [customerId]);
  // A result for a previously viewed customer is never shown against this one.
  const lookup = result?.id === customerId ? result.lookup : undefined;
  return !lookup || lookup.status === 'none' ? undefined : lookup;
}

/** For a reimbursed (B2B2C) line a company-paid (EBU) line is the company's own, so it carries no link on the profile. */
function reimbursed(lookup: LinkedBusinessLookup | undefined) {
  return lookup?.status === 'linked' && lookup.segment !== 'EBU' ? lookup : undefined;
}

/** "Company Name: <name>" and "Company Code: <ENT-ACC id>", in two columns under the header's contact facts. */
export function LinkedBusinessLine({ customerId }: { customerId: string }) {
  const linked = reimbursed(useLinkedBusiness(customerId));
  if (!linked) return null;
  const { business } = linked;
  return (
    // A full-width rule (out to the header's edges), then the line. Left edge = the customer name's: the header padding (1.25rem) + the avatar (4rem) + the gap after it (1rem).
    <div className="mt-4 -mx-5 pr-5 pl-[calc(1.25rem+4rem+1rem)] pt-3 border-t border-border-soft">
      <div aria-label="Linked business" className="flex flex-wrap items-center gap-x-10 gap-y-1 text-[length:var(--fs-body)]">
        <p>
          <span className="text-fg-2">Company Name: </span>
          <Link to={`/customer/${business.enterpriseAccountId}`} className="text-link underline font-semibold">
            {business.name}
          </Link>
        </p>
        <p>
          <span className="text-fg-2">Company Code: </span>
          <Link to={`/customer/${business.enterpriseAccountId}`} className="text-link underline font-semibold">
            {business.enterpriseAccountId}
          </Link>
        </p>
      </div>
    </div>
  );
}

// A link to a business that cannot be found still needs the agent's attention, so it keeps its own notice.
export function LinkedBusinessCard({ customerId }: { customerId: string }) {
  const lookup = useLinkedBusiness(customerId);
  if (lookup?.status !== 'unresolved') return null;
  return (
    <div className="mt-4">
      <p role="alert" className="rounded-[var(--radius-card)] bg-warn-bg text-[var(--warn-text)] px-4 py-3 text-[length:var(--fs-body)]">
        This customer is linked to business account {lookup.parentBusinessId}, which could not be found. Check the link before relying on the customer's segment or billing.
      </p>
    </div>
  );
}
