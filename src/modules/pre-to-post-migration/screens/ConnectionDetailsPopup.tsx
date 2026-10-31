import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/patterns/PageHeader';
import { loadCustomerLines } from '../../../capabilities';
import type { CustomerLine } from '../../../capabilities';
import { useCustomerContext } from '../../../stores/customerContextStore';

// SCR-075: Connection Details Popup - a shared pre-journey guardrail reused
// identically across FWA, MNP, Postpaid Cross-Sales, and Pre-to-Post
// journeys (screens.md, 6 source documents), not a Pre-to-Post-exclusive
// screen. Shows Prepaid/Postpaid connection counts BEFORE the agent proceeds
// (BR-211: 2+ postpaid connections triggers a credit-policy advisory) - the
// identified customer's own, counted from the lines Customer 360 lists for them (Line Selection's
// definition), not from every installed asset in the system.
export function ConnectionDetailsPopup() {
  const customerId = useCustomerContext((s) => s.journey?.customerId ?? s.customer?.customerId);
  const [lines, setLines] = useState<CustomerLine[] | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLines(undefined);
    if (customerId) void loadCustomerLines(customerId).then((l) => !cancelled && setLines(l));
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const postpaidCount = lines?.filter((l) => l.lineType === 'postpaid').length ?? 0;
  const prepaidCount = lines?.filter((l) => l.lineType === 'prepaid').length ?? 0;

  return (
    <div className="p-8 max-w-md">
      <PageHeader title="Connection Details" />
      {!customerId ? (
        <p className="text-muted mt-4">Identify a customer to see their connections.</p>
      ) : !lines ? (
        <p className="text-muted mt-4">Loading the customer's connections…</p>
      ) : (
        <>
          <div className="card p-4 mt-4 space-y-2">
            <p className="text-fg">Total Number of Prepaid Connections: {prepaidCount}</p>
            <p className="text-fg">Total Number of Postpaid Connections: {postpaidCount}</p>
          </div>
          {postpaidCount >= 2 && (
            <p className="text-[length:var(--fs-caption)] text-danger mt-3">
              Advisory: 2 or more postpaid connections on this account - review credit policy before proceeding.
            </p>
          )}
        </>
      )}
    </div>
  );
}
