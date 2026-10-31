import { useEffect, useState } from 'react';
import { Badge } from '../../../components/primitives/Badge';
import * as mockDataEngine from '../../../engines/mockDataEngine';

interface StarNumberTier {
  tierId: string;
  valueRangeMin: number;
  valueRangeMax: number;
  valueRangeCurrency: string;
  lockInDurationMonths: number;
}

function RuleRow({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 card p-3">
      <p className="text-fg-2 text-[length:var(--fs-body)]">{children}</p>
      <Badge variant="filled-neutral">{id}</Badge>
    </div>
  );
}

function GapNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted italic text-[length:var(--fs-body)] border-l-2 border-border-soft pl-3">{children}</p>
  );
}

/** "Device Penalty (Fiber & 5G)" - Penalty View topic, richFields slot.
 *
 * customer360-fields.json ships this field with sourceId: null because the
 * real commitment-penalties.json dataset only covers disconnection/MNP-port
 * -out/upgrade penalties, a different category. Rather than leaving the
 * honest-but-unhelpful "Not available" default, this renders the actual
 * evidenced lock-in/penalty policy rules (reference/blueprint/business-rules.md),
 * each tagged with its BR-* id - not a fabricated 26-row plan table or
 * per-customer computed amount, neither of which any source document
 * supports (see the gap note below). */
export function DevicePenaltyPolicy() {
  return (
    <div className="space-y-2">
      <RuleRow id="BR-120">Postpaid plans: 3-month minimum subscription (lock-in) period.</RuleRow>
      <RuleRow id="BR-146">
        GigaHome 5G Home: 3-month Plan lock-in, 12-month Device lock-in. Unfinished Plan lock-in - pay the remainder
        of the 3-month plan fee. Unfinished Device lock-in - 500 QAR early termination fee, or return the 5G CPE, or
        pay an 800 QAR CPE charge if the device isn't returned.
      </RuleRow>
      <RuleRow id="BR-001">
        Fibre: 12-month lock-in. Early disconnection - remainder of the 3-month minimum service period + QAR 80 x
        remaining months (of the 12). No fee once the 12 months complete.
      </RuleRow>
      <RuleRow id="BR-002">
        OSNtv: remainder of 12 months x QAR 30 (Lite) or QAR 60 (Premium) - additive with the Fibre/Plan penalty. Try &
        Buy: waived within the first 30 days if the OSN box is returned in good condition, else QAR 165.
      </RuleRow>
      <RuleRow id="BR-095">
        FWA device lock-in: 12 months. Resets only on disconnection during an FWA relocation/move. A plan change
        resets the "limit date" and loses the lock. A downgrade is treated as a breach that triggers a penalty (an
        upgrade must continue the original commitment).
      </RuleRow>
      <RuleRow id="BR-011">
        Penalty calculation is triggered only from specific guided journeys (disconnection, MNP port-out, plan
        upgrade/downgrade, park number, put-off) or an on-demand button - not on every view, for performance reasons.
      </RuleRow>
      <GapNote>
        Gap: no unified plan-tier table and no worked numeric example exist in the source corpus for GigaHome - the
        rules above are what's evidenced, not a fabricated table. A computed penalty amount for this specific
        customer also isn't available: per the domain model, a penalty "cannot be quoted without creating an order"
        in this environment.
      </GapNote>
    </div>
  );
}

/** "Star number Penalty" - Penalty View topic, richFields slot.
 *
 * Reuses the existing public/mock-data/star-number-tiers.json tier table
 * (already sourced from BR-125) instead of re-declaring the same two rows a
 * second time, and states the one place two source documents disagree
 * (BR-125 vs BR-289) rather than silently picking one. */
export function StarNumberPenaltyPolicy() {
  const [tiers, setTiers] = useState<StarNumberTier[]>([]);

  useEffect(() => {
    mockDataEngine.list<StarNumberTier>('star-number-tiers').then(setTiers);
  }, []);

  return (
    <div className="space-y-2">
      <RuleRow id="BR-125">
        Star Number lock-in is tiered by value:{' '}
        {tiers.length > 0
          ? tiers
              .map((t) => `${t.lockInDurationMonths}-month lock-in for ${t.valueRangeMin}-${t.valueRangeMax} ${t.valueRangeCurrency}`)
              .join('; ')
          : '1-year lock-in for 1,500-19,999 QAR, 2-year lock-in for 20,000+ QAR'}
        .
      </RuleRow>
      <RuleRow id="BR-289">
        A second source gives a partially-overlapping account: 1-year plan commitment generally, 3-month commitment
        for a free number, up to a 2-year lock-in for a premium 20,000+ QAR VIP number. Not reconciled with BR-125 -
        both are evidenced, and they don't fully agree.
      </RuleRow>
      <GapNote>
        Gap: no penalty <em>amount</em> is evidenced for Star Numbers anywhere in the corpus - only the lock-in
        duration. Do not infer a fee from the Device/Fibre figures above; they are a different penalty category.
      </GapNote>
    </div>
  );
}
