import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { existingCustomerPath } from '../../../navigation/journeyPaths';
import { AddConnectionModal } from '../../../capabilities';
import { connectionOptions, FAMILY_ROLES, lineCatalogueOf, isOrderApproved, lineLabel, packagePlanId, primaryLine1Activated } from '../../../engines/familyPackage';
import type { FamilyLine, FamilyOrder } from '../../../engines/familyPackage';
import { useEntityStore } from '../../../stores/entityStore';
import { ActionButton, GridTable, Panel, StatusPill, IC } from './C360Kit';
import type { GridCol } from './C360Kit';
import { useCanStartNewConnection, useStartNewConnection } from '../useStartNewConnection';

interface PlanRow {
  productId: string;
  name: string;
  planClass?: string;
}

/**
 * Customer 360 > Products & Services > Family Package: the lines the customer holds on one Ahli (Family) plan, and the action that adds another. The rules
 * (Primary Line 1 first and approved, any type after it, every line on Primary Line 1's plan, the limits) are engines/familyPackage.ts. An empty package starts
 * the New Postpaid journey with a Family Plan (Primary Line 1); a package with lines opens Add Another Connection, which starts that journey for the type chosen.
 */
export function FamilyPackagePanel({ customerId }: { customerId: string; customerName?: string }) {
  const records = useEntityStore((s) => s.records);
  const loadKind = useEntityStore((s) => s.loadKind);
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();
  const startNewConnection = useStartNewConnection(customerId);
  const canStart = useCanStartNewConnection();

  useEffect(() => {
    for (const kind of ['family-package-lines', 'orders', 'products'] as const) void loadKind(kind, true);
  }, [loadKind]);

  const lines = useMemo(
    () => ((records['family-package-lines'] ?? []) as unknown as FamilyLine[]).filter((l) => l.customerId === customerId).sort((a, b) => FAMILY_ROLES.indexOf(a.role) - FAMILY_ROLES.indexOf(b.role) || a.sequence - b.sequence),
    [records, customerId]
  );
  const orders = useMemo(() => (records.orders ?? []) as unknown as (FamilyOrder & { status?: string; approvalStatus?: string })[], [records.orders]);
  const products = useMemo(() => (records.products ?? []) as unknown as PlanRow[], [records.products]);
  const planName = (id: string) => products.find((p) => p.productId === id)?.name ?? id;

  const empty = lines.length === 0;
  const options = connectionOptions(lines, orders, lineCatalogueOf(products));
  const activated = primaryLine1Activated(lines, orders);

  const cols: GridCol<FamilyLine>[] = [
    { key: 'line', header: 'Line', render: (l) => lineLabel(l) },
    { key: 'plan', header: 'Plan', render: (l) => planName(l.planId) },
    { key: 'msisdn', header: 'Number', render: (l) => l.msisdn ?? '-' },
    { key: 'order', header: 'Order', render: (l) => l.orderId },
    {
      key: 'status',
      header: 'Approval',
      render: (l) => {
        const o = orders.find((x) => x.orderId === l.orderId);
        return <StatusPill status={isOrderApproved(o) ? 'Approved' : (o?.approvalStatus ?? 'Unknown')} />;
      },
    },
  ];
  const subtitle = empty
    ? 'No Family Package yet. It starts with Primary Line 1, a New Postpaid activation on an Ahli plan.'
    : activated
      ? options.length > 0
        ? `Every line is on ${planName(packagePlanId(lines) ?? '')}.`
        : `Every line is on ${planName(packagePlanId(lines) ?? '')}. No further connection types can be added.`
      : 'Primary Line 1 is awaiting approval: the other connections open once it is approved.';

  return (
    <>
      <Panel
        icon={IC.box}
        title={`Family Package (${lines.length})`}
        action={
          empty ? (
            <ActionButton primary disabled={!canStart} onClick={startNewConnection}>Start Family Package</ActionButton>
          ) : (
            <ActionButton primary disabled={options.length === 0} onClick={() => setAddOpen(true)}>Add Another Connection</ActionButton>
          )
        }
      >
        <p className="caption-secondary pb-2">{subtitle}</p>
        {lines.length > 0 && <GridTable cols={cols} rows={lines} rowKey={(l) => l.lineId} empty="" />}
      </Panel>
      <AddConnectionModal open={addOpen} onClose={() => setAddOpen(false)} customerId={customerId} onStart={(familyLine) => navigate(existingCustomerPath(customerId), { state: { startFresh: true, familyLine } })} />
    </>
  );
}
