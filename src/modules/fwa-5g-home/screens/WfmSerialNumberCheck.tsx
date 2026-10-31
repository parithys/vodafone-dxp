import { useEffect, useState } from 'react';
import { DualPlaySerialCheckStep } from '../../../components/patterns/DualPlaySerialCheckStep';
import type { DualPlaySerialValue } from '../../../components/patterns/DualPlaySerialCheckStep';
import { Button } from '../../../components/primitives/Button';
import { Badge } from '../../../components/primitives/Badge';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { PageHeader } from '../../../components/patterns/PageHeader';

interface Order {
  orderId: string;
  orderType: string;
  status: string;
  customerName?: string;
  msisdn?: string;
}

// SCR-093: Serial Number Check Screen (Dual Play) - technician-facing, per
// UJ-061's post-submission WFM installation phase: "technician starts route ->
// geolocation -> Kahramaa check -> Serial Number Check (Dual Play) -> Service
// Activation Success." Field Technician persona, distinct from the Retail Sales
// Agent who runs NewFwaWizard - separate screen, not a step of that wizard.
export function WfmSerialNumberCheck() {
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as Order[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [serials, setSerials] = useState<DualPlaySerialValue>({});

  useEffect(() => {
    loadKind('orders');
  }, [loadKind]);

  const pending = orders.filter((o) => o.status === 'Pending WFM Installation');
  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  const allValid = Boolean(serials.cpeIndoorValid && serials.cpeOutdoorValid && serials.simCardValid);

  const submit = async () => {
    if (!selectedOrder) return;
    await updateRecord('orders', 'orderId', selectedOrder.orderId, { status: 'Complete' });
    await createRecord('installed-assets', {
      installedAssetId: `IA-${Date.now().toString().slice(-6)}`,
      orderNumber: selectedOrder.orderId,
      productServiceName: 'FWA 5G Home Service',
      status: 'Active',
      orderType: selectedOrder.orderType,
    });
    pushToast('success', `Order ${selectedOrder.orderId}: Service Activation Success - installed assets now Active.`);
    setSelectedOrderId(null);
    setSerials({});
  };

  if (!selectedOrder) {
    return (
      <div className="p-8">
        <PageHeader title={<>WFM Installation - Serial Number Check</>} description={<>Orders awaiting Dual-Play serial number check and service activation.</>} />
        <div className="card divide-y divide-border-soft">
          {pending.map((o) => (
            <button type="button"
              key={o.orderId}
              onClick={() => setSelectedOrderId(o.orderId)}
              className="w-full text-left px-4 py-3 hover:bg-surface flex justify-between items-center"
            >
              <div>
                <div className="text-fg">{o.orderId} - {o.customerName}</div>
                <div className="text-[length:var(--fs-caption)] text-muted">{o.orderType} · {o.msisdn}</div>
              </div>
              <Badge variant="warning">Pending WFM Installation</Badge>
            </button>
          ))}
          {pending.length === 0 && <div className="px-4 py-6 text-center text-muted">No orders pending installation.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Serial Number Check - Dual Play</>} description={<>
        Order {selectedOrder.orderId} - {selectedOrder.customerName}
      </>} />
      <DualPlaySerialCheckStep value={serials} onChange={(patch) => setSerials((prev) => ({ ...prev, ...patch }))} />
      <div className="flex gap-2 mt-6">
        <Button variant="secondary" onClick={() => setSelectedOrderId(null)}>
          Back to list
        </Button>
        <Button variant="primary" onClick={submit} disabled={!allValid}>
          Submit - Trigger Service Activation
        </Button>
      </div>
    </div>
  );
}
