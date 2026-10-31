import { Icon } from '../primitives/Icon';
import { Button } from '../primitives/Button';
import { ConnectionTypeTag } from '../primitives/ConnectionTypeTag';
import { CARD_HIGHLIGHT, CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { CHEVRON_RIGHT, ICON_CALL, ICON_CARD, ICON_DATA, STAR } from '../../assets/icons';
import type { PrepaidPlan } from './prepaidPlanModel';
import { formatQar, formatAmount } from '../../lib/format';
import { CALENDAR_ICON } from '../../assets/icons';

interface PrepaidPlanCardProps {
  p: PrepaidPlan;
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
  onDeselectProduct?: () => void;
  setDetailPack: (pack: PrepaidPlan) => void;
}


/**
 * A prepaid pack card: the same card as a postpaid plan (PostpaidPlanCard) - Popular flag and service tag on top, name,
 * price, the allowances as icon rows, View details and Select. The whole card selects; clicking it again unselects.
 */
export function PrepaidPlanCard({ p, selectedProductId, onSelectProduct, onDeselectProduct, setDetailPack }: PrepaidPlanCardProps) {
  const selected = selectedProductId === p.productId;
  const toggle = () => (selected && onDeselectProduct ? onDeselectProduct() : onSelectProduct(p.productId));
  const rows = [
    { icon: ICON_DATA, text: p.dataAllowanceGB ? `${p.dataAllowanceGB} GB data` : 'No data bundle' },
    { icon: ICON_CALL, text: p.minutesAllowance },
    { icon: CALENDAR_ICON, text: p.packValidityDays ? `Valid for ${p.packValidityDays} days` : 'No validity period' },
  ];
  return (
    <div
      id={`plan-card-${p.productId}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          toggle();
        }
      }}
      className={`relative flex flex-col gap-3 rounded-[var(--radius-card)] border p-5 cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
        selected ? CARD_SELECTED : p.popular ? CARD_HIGHLIGHT : CARD_IDLE
      }`}
    >
      {selected && <SelectedTick />}
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-accent text-on-dark px-2.5 py-0.5 text-[length:var(--fs-tag)] font-medium ${p.popular ? '' : 'invisible'}`}
          aria-hidden={!p.popular}
        >
          <Icon path={STAR} className="w-3 h-3" />
          Popular
        </span>
        <ConnectionTypeTag category="Prepaid" />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-fg font-bold text-[length:var(--fs-h5)] leading-snug">{p.name}</p>
        <p className="text-accent pt-1">
          <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
          <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(p.starterPackChargeQAR)}</span>
          <span className="text-fg-2 text-[length:var(--fs-caption)]"> starter pack</span>
        </p>
        <ul className="space-y-1.5">
          {[...rows, { icon: ICON_CARD, text: `Starter pack charge: ${formatQar(p.starterPackChargeQAR)}` }].map((f) => (
            <li key={f.text} className="flex items-center gap-2 text-fg-2 text-[length:var(--fs-caption)]">
              <Icon path={f.icon} className="w-4 h-4 shrink-0 text-accent" />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDetailPack(p);
          }}
          aria-label={`View details for ${p.name}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--radius-button)] text-link hover:underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] text-[length:var(--fs-caption)]"
        >
          View details
          <Icon path={CHEVRON_RIGHT} className="w-4 h-4" />
        </button>
        {/* Presentational: the card is the control, so this must not take focus or fire a second toggle. */}
        <Button variant={selected ? 'primary' : 'secondary'} tabIndex={-1} aria-hidden className="pointer-events-none whitespace-nowrap">
          {selected ? 'Selected' : 'Select pack'}
        </Button>
      </div>
    </div>
  );
}
