import { badgeVariantFor } from '../../lib/statusTone';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntityStore } from '../../stores/entityStore';
import { DataTable } from '../../components/primitives/DataTable';
import { Badge } from '../../components/primitives/Badge';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import type { Lead } from './types';
import { PageHeader } from '../../components/patterns/PageHeader';

export type LeadScope = 'my' | 'created' | 'team' | 'all' | 'contact';

const SCOPE_TITLES: Record<LeadScope, string> = {
  my: 'My Leads',
  created: 'My Created Leads',
  team: "Manage Leads - My Team's Leads",
  all: 'All Leads Across Org',
  contact: 'Contact Record - Leads Sub-Tab',
};

// Pattern 14: Lead List + Owner/Status Management - a family of scoped list
// views (My Leads / My Created Leads / Team Leads / All Leads / Contact-scoped)
// over the same Lead entity, sharing a grid shape (SCR-141–150).
export function LeadListView({ scope }: { scope: LeadScope }) {
  const navigate = useNavigate();
  const loadKind = useEntityStore((s) => s.loadKind);
  const leads = (useEntityStore((s) => s.records.leads) ?? []) as unknown as Lead[];
  const loading = useEntityStore((s) => s.loading.leads);
  const loadError = useEntityStore((s) => s.errors.leads);

  useEffect(() => {
    loadKind('leads');
  }, [loadKind]);

  const filtered = leads.filter((l) => {
    // Lead ownerIds in the seed data are agent codes (USR-xxxx), not role ids,
    // so there is nothing here to compare the active role against - the "my"
    // scope is presentational in this seed set. Written plainly rather than as
    // `l.ownerId === activePersonaId || true`, which read like a real filter
    // while always being true.
    if (scope === 'my') return true;
    if (scope === 'created') return l.createdVia?.includes('Tablet') ?? true;
    return true; // team/all/contact scopes: no further evidenced filter distinct from "all" in this thin seed set
  });

  return (
    <div className="p-8">
      <PageHeader title={<>{SCOPE_TITLES[scope]}</>} description={<>{filtered.length} lead(s).</>} />
      <ErrorBanner message={loadError} />
      <DataTable<Lead>
        columns={[
          { key: 'leadId', header: 'Lead #' },
          { key: 'serviceNeeded', header: 'Service Needed' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <Badge variant={badgeVariantFor(row.status)}>{row.status}</Badge>,
          },
          { key: 'ownerId', header: 'Owner' },
          { key: 'callbackDate', header: 'Callback Date' },
        ]}
        rows={filtered}
        rowKey={(row) => row.leadId}
        onRowClick={(row) => navigate(`/lead-management/lead-details-view?id=${row.leadId}`)}
        emptyMessage="No leads in this view."
        loading={loading}
      />
    </div>
  );
}
