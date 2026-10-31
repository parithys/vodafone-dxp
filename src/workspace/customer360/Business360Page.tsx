import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/primitives/EmptyState';
import { useNavigate, useParams } from 'react-router-dom';
import { getBusinessAccount, type BusinessAccount, type LinkedUser } from '../../engines/businessAccountEngine';
import { BILLING_LABEL, SEGMENT_LABEL, type LinkedUserSegment } from '../../engines/businessSegment';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { DataTable, type Column } from '../../components/primitives/DataTable';
import { Icon } from '../../components/primitives/Icon';
import { SearchField } from '../../components/primitives/SearchField';
import { Select } from '../../components/primitives/Select';
import { PageHeader } from '../../components/patterns/PageHeader';

const BUILDING = 'M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17 M15 9h4a1 1 0 0 1 1 1v11 M3 21h18 M8 7h3 M8 11h3 M8 15h3';

export function SegmentBadge({ segment }: { segment: LinkedUserSegment }) {
  return <span className={segment === 'EBU' ? 'badge-segment-ebu' : 'badge-segment-cbu'}>{SEGMENT_LABEL[segment]}</span>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-fg-2 text-[length:var(--fs-caption)]">{label}</p>
      <p className="text-fg font-bold text-[length:var(--fs-h3)]">{value}</p>
    </div>
  );
}

const SEGMENT_FILTER = [
  { value: 'all', label: 'All Segments' },
  { value: 'EBU', label: 'EBU · Company-Paid' },
  { value: 'CBU', label: 'CBU · B2B2C' },
];

// Business 360: the Customer 360 view for a BUSINESS account (enterprise account ID in place of a customer ID).
// Reached from Customer Search at /customer/ENT-ACC-xxxx; every linked user opens their own Customer 360 profile.
export function Business360Page() {
  const { customerId: accountId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  // Keyed by the account ID so a result for a previously viewed business is never shown for this one.
  const [loaded, setLoaded] = useState<{ id: string; data?: BusinessAccount; failed?: boolean } | undefined>();
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState('all');

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    getBusinessAccount(accountId)
      .then((data) => !cancelled && setLoaded({ id: accountId, data }))
      .catch(() => !cancelled && setLoaded({ id: accountId, failed: true }));
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  const current = loaded?.id === accountId ? loaded : undefined;
  const data = current ? current.data ?? undefined : null;
  const failed = Boolean(current?.failed);
  const users = data?.users;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (users ?? []).filter(
      (u) => (segment === 'all' || u.segment === segment) && (!q || [u.name, u.subscriberId, u.customerId, u.mobile].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [users, query, segment]);

  if (failed) {
    return (
      <div className="p-8" role="alert">
        <p className="text-fg font-medium">The business account could not be loaded.</p>
        <Button variant="secondary" compact className="mt-3" onClick={() => navigate(0)}>
          Try again
        </Button>
      </div>
    );
  }
  if (data === null) return <div className="p-8 text-fg-2">Loading business account…</div>;
  if (data === undefined) {
    return (
      <EmptyState title="Business Account Not Found" message={<>No business account found for “{accountId}”. Try Customer Search instead.</>} />
    );
  }

  const { account } = data;
  const all = data.users;
  const ebu = all.filter((u) => u.segment === 'EBU').length;
  const cbu = all.length - ebu;

  const columns: Column<LinkedUser>[] = [
    { key: 'name', header: 'Name' },
    { key: 'subscriberId', header: 'Subscriber / account ID' },
    { key: 'segment', header: 'Segment', render: (u) => <SegmentBadge segment={u.segment} /> },
    { key: 'billingResponsibility', header: 'Billing responsibility', render: (u) => BILLING_LABEL[u.billingResponsibility], sortValue: (u) => BILLING_LABEL[u.billingResponsibility] },
    { key: 'billRecipient', header: 'Bill recipient' },
    { key: 'b2b2cBenefit', header: 'B2B2C benefit', render: (u) => (u.b2b2cBenefit ? 'Yes' : 'No'), sortValue: (u) => (u.b2b2cBenefit ? 1 : 0) },
  ];

  return (
    <div className="p-8 w-full">
      <PageHeader
        title={
          <span className="inline-flex items-center gap-3">
            <Icon path={BUILDING} className="w-6 h-6 text-accent" />
            {account.name}
          </span>
        }
        description={
          <>
            Enterprise account ID <span className="font-semibold text-fg">{account.enterpriseAccountId}</span>
            {account.crNumber ? <> · CR {account.crNumber}</> : null}
            {account.accountManagerName ? <> · Account manager {account.accountManagerName}</> : null}
          </>
        }
        badges={<Badge variant="outlined-red">Business</Badge>}
        actions={
          <Button variant="secondary" compact onClick={() => navigate('/customer-search')}>
            Back to search
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4" aria-label="Summary">
        <Stat label="Linked Users" value={all.length} />
        <Stat label="EBU · Company-Paid" value={ebu} />
        <Stat label="CBU · B2B2C" value={cbu} />
      </div>

      <section className="card p-6">
        <h2 className="text-fg font-semibold text-[length:var(--fs-h5)] mb-1">Linked Users</h2>
        {all.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-border-soft bg-surface p-6 text-center">
            <p className="text-fg font-medium mb-1">No Linked Users Yet</p>
            <p className="text-fg-2 text-[length:var(--fs-caption)]">
              No individual customer is linked to {account.enterpriseAccountId}. Users appear here once their account is linked to this business.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SearchField
                aria-label="Search linked users"
                placeholder="Search by name or ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')}
                wrapperClassName="flex-1 min-w-64"
              />
              <div className="w-56">
                <Select aria-label="Filter by segment" options={SEGMENT_FILTER} value={segment} onChange={(e) => setSegment(e.target.value)} />
              </div>
            </div>
            <DataTable
              columns={columns}
              rows={shown}
              rowKey={(u) => u.customerId}
              onRowClick={(u) => navigate(`/customer/${u.customerId}`, { state: { navKey: 'customer-search' } })}
              emptyMessage="No linked users match the search or filter."
            />
          </>
        )}
      </section>
    </div>
  );
}
