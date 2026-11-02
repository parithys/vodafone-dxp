import { Icon } from '../primitives/Icon';
import { ConnectionTypeTag } from '../primitives/ConnectionTypeTag';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
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
 * price, the allowances as icon rows and View details. No button: the whole card selects, clicking it again unselects, and Popular is only the
 * flag (the card keeps the default, hover and selected looks of every plan card).
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
      className={`option-card gap-3 p-5 ${
        selected ? CARD_SELECTED : CARD_IDLE
      }`}
    >
      {selected && <SelectedTick />}
      <div className="split-nowrap">
        <span
          className={`tag-accent px-2.5 ${p.popular ? '' : 'invisible'}`}
          aria-hidden={!p.popular}
        >
          <Icon path={STAR} className="size-3 " />
          Popular
        </span>
        <ConnectionTypeTag category="Prepaid" />
      </div>
      <div className="fill-column gap-2">
        <p className="title title-lg leading-snug">{p.name}</p>
        <p className="text-accent pt-1">
          <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
          <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(p.starterPackChargeQAR)}</span>
          <span className="caption-secondary"> starter pack</span>
        </p>
        <ul className="space-y-1.5">
          {[...rows, { icon: ICON_CARD, text: `Starter pack charge: ${formatQar(p.starterPackChargeQAR)}` }].map((f) => (
            <li key={f.text} className="row gap-2 caption-secondary">
              <Icon path={f.icon} className="icon-sm text-accent" />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDetailPack(p);
          }}
          aria-label={`View details for ${p.name}`}
          className="link-inline min-h-6"
        >
          View details
          <Icon path={CHEVRON_RIGHT} className="size-4 " />
        </button>
      </div>
    </div>
  );
}
