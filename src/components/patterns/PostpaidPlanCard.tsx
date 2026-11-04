import { Icon } from '../primitives/Icon';
import { ConnectionTypeTag } from '../primitives/ConnectionTypeTag';
import { CARD_IDLE, CARD_SELECTED, SelectedTick, planFeatureRows } from '../primitives/offerCardParts';
import { multiSimBenefitText } from '../../engines/multiSim';
import { CHEVRON_RIGHT, ICON_CALL, ICON_CARD, ICON_DATA, ICON_GIFT, STAR } from '../../assets/icons';
import { PLAN_CLASS_TAG, isPlanClass, type PostpaidPlan } from './postpaidPlanModel';
import { ServiceTypeTag } from '../primitives/ServiceTypeTag';
import type { ServiceTypeTagKey } from '../../lib/serviceTypeTag';
import { formatQar, formatAmount } from '../../lib/format';

interface PostpaidPlanCardProps {
  p: PostpaidPlan;
  selectedProductId: string | undefined;
  billLimit: number | undefined;
  onSelectProduct: (productId: string) => void;
  onDeselectProduct?: () => void;
  setDetailPlan: (plan: PostpaidPlan) => void;
  /** The name to show when it differs from the plan's own (Special Offers: led by the Special Discount). */
  displayName?: string;
  /** The short card of the Offers tab: name, price, one headline line and View details. The other tabs keep the full card. */
  compact?: boolean;
  /** A discount applied to this plan as a fraction (0.25 = 25%): the monthly price shown is the discounted one, the plan's own price struck through above it. */
  discountPct?: number;
  /** A plan-type tag to show in place of the plan class's (a Secondary plan's own type: Kids Plan, Data-only Plan). */
  tagType?: ServiceTypeTagKey;
}

export function PostpaidPlanCard({ p, selectedProductId, billLimit, onSelectProduct, onDeselectProduct, setDetailPlan, displayName, compact = false, discountPct = 0, tagType }: PostpaidPlanCardProps) {
      const selected = selectedProductId === p.productId;
      // Card per plan: name, price, bill limit, no button: the whole card selects.
      // The full allowance table, benefits and contract term live in
      // the details drawer ("View details", which stops propagation
      // so opening it never selects the plan), so the cards stay
      // comparable at a glance.
      // The limit shown is what the Bill Limit editor will start at
      // for this plan (its MRC), or the agent's own figure once this
      // plan is the selected one.
      // Whole card selects; clicking it again unselects.
      const toggle = () => (selected && onDeselectProduct ? onDeselectProduct() : onSelectProduct(p.productId));
      const shownLimit = selected ? billLimit ?? p.mrcQAR : p.mrcQAR;
      const discounted = discountPct > 0 ? Math.round(p.mrcQAR * (1 - discountPct) * 100) / 100 : undefined;
      // The struck-through price: the plan's own price when a discount applies, else the pre-promotion price.
      const struckPrice = discounted !== undefined ? p.mrcQAR : p.promoMonths ? p.originalMrcQAR : undefined;
      const headlineBase = p.features?.[0] ?? planFeatureRows(p)[0]?.text;
      const headline = headlineBase ? `${headlineBase}${p.features && p.features.length > 1 ? ' & more' : ''}` : undefined;
  return (
    <div
      key={p.productId}
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
      {/* The same top row on every tab: the Popular badge (full cards only) at the left, the plan-type tag always in the top-right corner. */}
      <div className="card-tag-row">
        {!compact && (
          <span
            className={`tag-accent px-2.5 ${p.popular ? '' : 'invisible'}`}
            aria-hidden={!p.popular}
          >
            <Icon path={STAR} className="size-3 " />
            Popular
          </span>
        )}
        <span className="card-plan-tag">
          {tagType ? <ServiceTypeTag type={tagType} /> : isPlanClass(p.planClass) ? <ServiceTypeTag type={PLAN_CLASS_TAG[p.planClass]} /> : <ConnectionTypeTag category="Postpaid" />}
        </span>
      </div>
      <div className="fill-column gap-2">
        <p className="title title-lg leading-snug">{displayName ?? p.name}</p>
        {/* Same price block on every tab: the struck-through price on its own small line, then "QAR n /month for N months" on one line. */}
        <div className={`stack gap-0.5 ${compact ? '' : 'order-1'}`}>
          {struckPrice !== undefined && (
            <p className="caption-secondary line-through">{formatQar(struckPrice)}</p>
          )}
          <p className="price-row">
            <span>
              <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
              <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(discounted ?? p.mrcQAR)}</span>
              <span className="caption-secondary"> /month</span>
            </span>
            {p.promoMonths && <span className="caption-secondary">for {p.promoMonths} months</span>}
          </p>
        </div>
        {compact ? (
          /* One headline line, from the plan's own first feature (its data, or its speed) - the rest is in View details. */
          headline && <p className="title title-sm font-semibold leading-snug">{headline}</p>
        ) : (
          <>
            <ul className="space-y-1.5 order-3">
              {[...(p.features?.length ? p.features.map((f, i) => ({ icon: i === 0 ? ICON_DATA : /minute|call/i.test(f) ? ICON_CALL : ICON_CARD, text: f })) : planFeatureRows(p)), ...(multiSimBenefitText(p) ? [{ icon: ICON_CARD, text: multiSimBenefitText(p)! }] : []), { icon: ICON_CARD, text: `Bill limit: ${formatQar(shownLimit)}` }].map((f) => (
                <li key={f.text} className="row gap-2 caption-secondary">
                  <Icon path={f.icon} className="icon-sm text-accent" />
                  {f.text}
                </li>
              ))}
            </ul>
            {/* What the plan includes free: one prominent block, so the agent can confirm it with the customer. */}
            {p.features?.length && p.benefits?.length ? (
              <div className="card-features">
                <p className="text-fg caps-label">Included in This Offer</p>
                <ul className="space-y-1">
                  {p.benefits.map((b) => (
                    <li key={b} className="row-start gap-2 feature-line">
                      <Icon path={ICON_GIFT} className="icon-sm text-accent mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
        {/* Pre-bundled eligible offer (2026-09-28) - stated on the
            card itself, since choosing one skips straight to
            Number Selection with no further chance to review
            add-ons/discount for THIS plan. */}
        {p.preBundledOffer && (
          <p className="text-[length:var(--fs-caption)] text-accent order-5">
            Pre-bundled offer - selecting this skips add-ons/discount and goes straight to Number Selection.
          </p>
        )}
      </div>
      <div className="flex items-center pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDetailPlan(p);
          }}
          aria-label={`View details for ${displayName ?? p.name}`}
          className="link-inline min-h-6"
        >
          View details
          <Icon path={CHEVRON_RIGHT} className="size-4 " />
        </button>
      </div>
    </div>
  );
}
