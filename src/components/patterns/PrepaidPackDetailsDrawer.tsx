import { Button } from '../primitives/Button';
import { Drawer } from '../primitives/Drawer';
import type { PrepaidPlan } from './prepaidPlanModel';
import { formatQar } from '../../lib/format';

interface PrepaidPackDetailsDrawerProps {
  pack: PrepaidPlan | null;
  onClose: () => void;
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
}

/** A prepaid pack's details on demand, in the same side drawer as a postpaid plan's: reference read while choosing. Everything shown is catalogue data. */
export function PrepaidPackDetailsDrawer({ pack, onClose, selectedProductId, onSelectProduct }: PrepaidPackDetailsDrawerProps) {
  const selected = Boolean(pack && selectedProductId === pack.productId);
  const rows: [string, string][] = pack
    ? [
        ['Starter pack charge', `${formatQar(pack.starterPackChargeQAR)}`],
        ['Data', pack.dataAllowanceGB ? `${pack.dataAllowanceGB} GB` : '-'],
        ['Voice', pack.minutesAllowance],
        ['Validity', pack.packValidityDays ? `${pack.packValidityDays} days` : '-'],
        ['Product code', pack.productId],
        ['Available to', pack.eligibleSegments?.length ? pack.eligibleSegments.join(', ') : 'Every customer segment'],
      ]
    : [];
  return (
    <Drawer
      open={pack !== null}
      onClose={onClose}
      title={pack?.name ?? 'Prepaid pack'}
      footer={
        pack && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={selected}
              onClick={() => {
                onSelectProduct(pack.productId);
                onClose();
              }}
            >
              {selected ? 'Selected' : 'Select pack'}
            </Button>
          </>
        )
      }
    >
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
            <dt className="text-fg">{label}</dt>
            <dd className="text-fg font-medium text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </Drawer>
  );
}
