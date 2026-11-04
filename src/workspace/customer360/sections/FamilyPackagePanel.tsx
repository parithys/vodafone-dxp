import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { existingCustomerPath } from '../../../navigation/journeyPaths';
import { AddConnectionModal, CARD_IDLE, CARD_SELECTED, SelectedTick } from '../../../capabilities';
import { Button } from '../../../components/primitives/Button';
import { Modal } from '../../../components/primitives/Modal';
import { Radio } from '../../../components/primitives/Radio';
import { useAuthStore } from '../../../stores/authStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { addonChargeForLinesQar, addonChargePerLineQar, packageAddonOptions } from '../../../engines/familyPackageAddons';
import type { FamilyAddonProduct, FamilyPackageAddon } from '../../../engines/familyPackageAddons';
import { formatQar } from '../../../lib/format';
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
  const [addonOpen, setAddonOpen] = useState(false);
  const [addonChoice, setAddonChoice] = useState<string | undefined>();
  const createRecord = useEntityStore((st) => st.createRecord);
  const removeRecord = useEntityStore((st) => st.removeRecord);
  const pushToast = useNotificationStore((st) => st.pushToast);
  const navigate = useNavigate();
  const startNewConnection = useStartNewConnection(customerId);
  const canStart = useCanStartNewConnection();

  useEffect(() => {
    for (const kind of ['family-package-lines', 'family-package-addons', 'orders', 'products', 'customers'] as const) void loadKind(kind, true);
  }, [loadKind]);

  const lines = useMemo(
    () => ((records['family-package-lines'] ?? []) as unknown as FamilyLine[]).filter((l) => l.customerId === customerId).sort((a, b) => FAMILY_ROLES.indexOf(a.role) - FAMILY_ROLES.indexOf(b.role) || a.sequence - b.sequence),
    [records, customerId]
  );
  const orders = useMemo(() => (records.orders ?? []) as unknown as (FamilyOrder & { status?: string; approvalStatus?: string })[], [records.orders]);
  const products = useMemo(() => (records.products ?? []) as unknown as PlanRow[], [records.products]);
  const owner = useMemo(() => ((records.customers ?? []) as unknown as { customerId: string; nationality?: string; idType?: string }[]).find((c) => c.customerId === customerId), [records.customers, customerId]);
  const packageId = lines[0]?.packageId;
  const held = useMemo(() => ((records['family-package-addons'] ?? []) as unknown as FamilyPackageAddon[]).filter((a) => a.packageId === packageId), [records, packageId]);
  const catalogue = products as unknown as FamilyAddonProduct[];
  const planName = (id: string) => products.find((p) => p.productId === id)?.name ?? id;

  const empty = lines.length === 0;
  const options = connectionOptions(lines, orders, lineCatalogueOf(products));
  const activated = primaryLine1Activated(lines, orders);
  // Add-ons are the package's, managed here: the existing catalogue and eligibility (the package plan's, the owner's), each line paying the add-on's charge.
  const addonOptions = activated ? packageAddonOptions(catalogue, held, { planId: packagePlanId(lines), nationality: owner?.nationality, idType: owner?.idType }) : [];
  const addonById = (id: string) => catalogue.find((p) => p.productId === id);
  const addAddon = async () => {
    const a = addonOptions.find((o) => o.productId === addonChoice);
    if (!a || !packageId) return;
    await createRecord('family-package-addons', { addonRecordId: `FPA-${Date.now().toString().slice(-7)}`, packageId, customerId, addonId: a.productId, addedAt: new Date().toISOString(), addedBy: useAuthStore.getState().profile?.userId });
    pushToast('success', `${a.name} added to the Family Package`);
    setAddonOpen(false);
    setAddonChoice(undefined);
  };
  const addonCols: GridCol<FamilyPackageAddon>[] = [
    { key: 'name', header: 'Add-on', render: (h) => addonById(h.addonId)?.name ?? h.addonId },
    { key: 'perLine', header: 'Per Line', render: (h) => { const a = addonById(h.addonId); return a ? `${formatQar(addonChargePerLineQar(a))}/mo` : '-'; } },
    { key: 'lines', header: 'Lines', render: () => String(lines.length) },
    { key: 'total', header: 'All Lines', render: (h) => { const a = addonById(h.addonId); return a ? `${formatQar(addonChargeForLinesQar(a, lines.length))}/mo` : '-'; } },
    { key: 'remove', header: '', render: (h) => <Button variant="tertiary" compact onClick={() => void removeRecord('family-package-addons', 'addonRecordId', h.addonRecordId)}>Remove</Button> },
  ];

  const cols: GridCol<FamilyLine>[] = [
    { key: 'line', header: 'Line', render: (l) => lineLabel(l) },
    { key: 'plan', header: 'Plan', render: (l) => (l.tierPlanId && l.tierPlanId !== l.planId ? `${planName(l.planId)} (Family Plan: ${planName(l.tierPlanId)})` : planName(l.planId)) },
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
      {!empty && (
        <Panel icon={IC.box} title={`Package Add-ons (${held.length})`} action={<ActionButton primary disabled={addonOptions.length === 0} onClick={() => setAddonOpen(true)}>Add Add-on</ActionButton>}>
          <p className="caption-secondary pb-2">Add-ons belong to the Family Package and are managed here. Every line carries them, and each line pays the add-on's charge.</p>
          {held.length > 0 && <GridTable cols={addonCols} rows={held} rowKey={(h) => h.addonRecordId} empty="" />}
        </Panel>
      )}
      <Modal
        open={addonOpen}
        onClose={() => setAddonOpen(false)}
        title="Add a Package Add-on"
        widthClassName="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddonOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!addonChoice} onClick={() => void addAddon()}>
              Add Add-on
            </Button>
          </>
        }
      >
        <div className="max-h-[50vh] overflow-y-auto">
        <div role="radiogroup" aria-label="Add-on" className="stack gap-3">
          {addonOptions.map((a) => (
            <label key={a.productId} className={`row-start card-frame p-4 cursor-pointer ${addonChoice === a.productId ? CARD_SELECTED : CARD_IDLE}`}>
              {addonChoice === a.productId && <SelectedTick />}
              <Radio name="package-addon" className="mt-1" checked={addonChoice === a.productId} onChange={() => setAddonChoice(a.productId)} />
              <span>
                <span className="block text-fg font-medium">{a.name}</span>
                <span className="block caption-secondary">
                  {formatQar(addonChargePerLineQar(a))}/mo per line · {lines.length} {lines.length === 1 ? 'line' : 'lines'} = {formatQar(addonChargeForLinesQar(a, lines.length))}/mo
                </span>
              </span>
            </label>
          ))}
        </div>
        </div>
      </Modal>
      <AddConnectionModal open={addOpen} onClose={() => setAddOpen(false)} customerId={customerId} onStart={(familyLine) => navigate(existingCustomerPath(customerId), { state: { startFresh: true, familyLine } })} />
    </>
  );
}
