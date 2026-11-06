import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { MsisdnPicker } from '../../components/domain/MsisdnPicker';
import { toLocalMsisdn } from '../../components/domain/msisdnPickerModel';
import type { MsisdnRecord, NumberPickerProfile } from '../../components/domain/msisdnPickerModel';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import type { PricingProduct, PricingRecharge } from '../../components/patterns/prepaidCartModel';
import { simCardCharge } from '../../data/prepaidSimCharge';
import { usePersonaStore } from '../../stores/personaStore';
import { formatQar } from '../../lib/format';
import { autoAllocatedFreeNumber } from './prepaidNumberAllocation';
import type { MsisdnSource } from './prepaidNumberAllocation';

/** The Free pool only: whoever the agent is, "choose another number" on the SIM page offers Free numbers (the Star tab is Number Selection's, by role). */
const FREE_POOL: NumberPickerProfile = { tabsFor: () => ['Free'], sorting: false, lockIn: false, planEntitlement: false };

/**
 * The order's mobile number on the SIM Selection page of a New Prepaid activation. A number already chosen on Number Selection is carried unchanged through the rest of the
 * order and is not repeated here. With none chosen, one is allocated from the Free pool - the agent proceeds with it or chooses another eligible number (a Free one) - and
 * this section shows it. A Pre-Paired SIM brings its own number, so there is nothing to show here.
 */
export function PrepaidMobileNumber({ msisdn, source, prePaired, onChange }: { msisdn: string | undefined; source: MsisdnSource | undefined; prePaired: boolean; onChange: (msisdn: string, priceQAR: number, source: MsisdnSource) => void }) {
  const [choosing, setChoosing] = useState(false);
  // A number the agent chose on Number Selection is carried read-only and needs no section here; the section is for the number allocated on this page (kept, or replaced).
  const [allocatedHere] = useState(() => !msisdn || source === 'auto');
  useEffect(() => {
    if (msisdn || prePaired) return;
    let live = true;
    void mockDataEngine.list<MsisdnRecord>('numbers').then((all) => {
      const n = live ? autoAllocatedFreeNumber(all) : undefined;
      if (n) onChange(n.msisdn, 0, 'auto');
    });
    return () => {
      live = false;
    };
    // Allocates once, when the page opens with no number.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (prePaired || !allocatedHere) return null;
  return (
    <section aria-label="Mobile Number" className="card card-surface p-4 space-y-3 mb-6">
      <div className="split-nowrap">
        <h3 className="title title-md font-semibold">Mobile Number</h3>
        {msisdn && <Badge variant="accent">{source === 'auto' ? 'Allocated from the Free pool' : 'Selected'}</Badge>}
      </div>
      {msisdn ? (
        <>
          <p className="price-figure" aria-label="Mobile number, read-only">{toLocalMsisdn(msisdn)}</p>
          <p className="caption-secondary">
            {source === 'auto' ? 'Proceed with this number or choose another Free number.' : 'This number is carried through the rest of the order.'}
          </p>
          {source === 'auto' && (
            <Button variant="secondary" compact onClick={() => setChoosing((v) => !v)}>
              {choosing ? 'Keep this number' : 'Choose another number'}
            </Button>
          )}
        </>
      ) : (
        <p className="caption-secondary" role="status">Allocating a number from the Free pool…</p>
      )}
      {choosing && source === 'auto' && (
        <MsisdnPicker
          selected={msisdn}
          profile={FREE_POOL}
          onSelect={(m, p) => {
            onChange(m, p, 'selected');
            setChoosing(false);
          }}
        />
      )}
    </section>
  );
}

/**
 * The SIM charge for the order, under the selected SIM's container: Standard, Reduced or Waived from the configurable SIM charging rules (by role, ID type and recharge). The SIM's
 * own details - type, serial number and Paired / Unpaired - are the SIM container's (SimTypeStep). The rules are mock / draft (data/prepaidSimCharge.ts).
 */
export function PrepaidSimCharge({ sim, idType, rechargeId, productId }: { sim: SimTypeValue | undefined; idType: string | undefined; rechargeId: string | undefined; productId: string | undefined }) {
  const roleId = usePersonaStore((s) => s.activePersonaId);
  const [products, setProducts] = useState<PricingProduct[]>([]);
  const [recharges, setRecharges] = useState<PricingRecharge[]>([]);
  useEffect(() => {
    void mockDataEngine.list<PricingProduct>('products').then(setProducts);
    void mockDataEngine.list<PricingRecharge>('recharge-products').then(setRecharges);
  }, []);
  if (!sim?.simType) return null;
  // The charge is judged on the recharge; with none chosen, on the starter pack (the rule the order is priced with).
  const judgedOn = rechargeId ? recharges.find((r) => r.rechargeId === rechargeId)?.amountQar ?? 0 : products.find((p) => p.productId === productId)?.starterPackChargeQAR ?? 0;
  const charge = simCardCharge(idType, judgedOn, roleId);
  const label = charge.kind === 'none' ? 'No charge rule' : charge.kind === 'waived' ? 'Waived' : charge.kind === 'reduced' ? 'Reduced' : 'Standard';
  return (
    // A summary card in the order's own look: the charge as the figure (with the standard price struck through when the rule lowers it), the rule's outcome as the badge and its reason beneath.
    <section aria-label="SIM charge" className="card card-surface p-4 mt-4 space-y-2">
      <div className="split-nowrap">
        <h4 className="value-text">SIM Charge</h4>
        <Badge variant={charge.kind === 'waived' ? 'success' : charge.kind === 'none' ? 'filled-neutral' : 'accent'}>{label}</Badge>
      </div>
      {charge.kind !== 'none' && (
        <p className="row gap-3">
          <span className="title title-xl leading-none">{formatQar(charge.chargeQar)}</span>
          {charge.kind !== 'standard' && <s className="caption-muted">{formatQar(charge.standardChargeQar)}</s>}
        </p>
      )}
      <p className="caption-secondary">{charge.message}</p>
    </section>
  );
}
