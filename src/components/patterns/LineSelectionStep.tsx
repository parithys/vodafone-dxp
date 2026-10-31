import { useEffect, useState } from 'react';
import { ServiceTypeTag } from '../primitives/ServiceTypeTag';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { loadCustomerLines, lineIneligibility } from './lineSelectionModel';
import type { CustomerLine, LineType } from './lineSelectionModel';
import { formatQar } from '../../lib/format';

interface LineSelectionStepProps {
  /** The identified customer; nothing is listed until there is one. */
  customerId: string | undefined;
  /** Which lines to offer: postpaid, prepaid, or every mobile line when omitted. */
  lineType?: LineType;
  value: CustomerLine | undefined;
  onChange: (line: CustomerLine | undefined) => void;
  /** The journey needs the line's catalogue plan (Add Add-On: add-ons are offered by plan); a line without one cannot be chosen. */
  requirePlan?: boolean;
}

const LINE_NOUN: Record<LineType, string> = { postpaid: 'postpaid', prepaid: 'prepaid' };

// Which of the customer's lines the order changes. A line that cannot be changed (not active, barred, billing profile in
// collections) is listed with its reason rather than hidden, so the agent can tell the customer why.
export function LineSelectionStep({ customerId, lineType, value, onChange, requirePlan }: LineSelectionStepProps) {
  const [lines, setLines] = useState<CustomerLine[] | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLines(undefined);
    if (!customerId) return;
    void loadCustomerLines(customerId, lineType).then((l) => {
      if (!cancelled) setLines(l);
    });
    return () => {
      cancelled = true;
    };
  }, [customerId, lineType]);

  // A line chosen for another customer (the identity was changed) no longer applies.
  useEffect(() => {
    if (value && value.customerId !== customerId) onChange(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  if (!customerId) return <p className="text-muted text-[length:var(--fs-body)]">Identify the customer first.</p>;
  if (!lines) return <p className="text-muted text-[length:var(--fs-body)]">Loading the customer's lines…</p>;
  if (lines.length === 0) {
    return <p className="text-muted text-[length:var(--fs-body)]">No {lineType ? `${LINE_NOUN[lineType]} ` : 'mobile '}lines on file for this customer.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {lines.map((line) => {
        const reason = lineIneligibility(line, { requirePlan });
        const selected = value?.installedAssetId === line.installedAssetId;
        return (
          <button
            key={line.installedAssetId}
            type="button"
            aria-pressed={selected}
            disabled={Boolean(reason)}
            onClick={() => onChange(selected ? undefined : line)}
            className={`relative text-left rounded-[var(--radius-card)] border p-4 disabled:cursor-not-allowed ${reason ? 'border-border-soft bg-surface' : selected ? CARD_SELECTED : CARD_IDLE}`}
          >
            {selected && !reason && <SelectedTick />}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-fg font-semibold">{line.identifier}</span>
              <ServiceTypeTag type={line.lineType} />
            </div>
            <p className="text-fg text-[length:var(--fs-body)]">{line.productName}</p>
            <p className="text-fg-2 text-[length:var(--fs-caption)]">
              {line.priceQAR === undefined ? 'Price not on file' : line.lineType === 'postpaid' ? `${formatQar(line.priceQAR)} / month` : `${formatQar(line.priceQAR)} starter pack`} · {line.status}
            </p>
            {reason && <p className="text-danger text-[length:var(--fs-caption)] mt-1">{reason}</p>}
          </button>
        );
      })}
    </div>
  );
}
