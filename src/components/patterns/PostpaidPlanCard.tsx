import { Icon } from '../primitives/Icon';
import { ConnectionTypeTag } from '../primitives/ConnectionTypeTag';
import { CARD_IDLE, CARD_SELECTED, SelectedTick, ICON_CALL, ICON_CARD, ICON_DATA, ICON_GIFT, STAR_ICON, planFeatureRows } from '../primitives/offerCardParts';
import { PLAN_CLASS_TAG, isPlanClass, type PostpaidPlan } from './postpaidPlanModel';
import { ServiceTypeTag } from '../primitives/ServiceTypeTag';
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
}

export function PostpaidPlanCard({ p, selectedProductId, billLimit, onSelectProduct, onDeselectProduct, setDetailPlan, displayName, compact = false, discountPct = 0 }: PostpaidPlanCardProps) {
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
      className={`relative flex flex-col gap-3 rounded-[var(--radius-card)] border p-5 cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
        selected ? CARD_SELECTED : CARD_IDLE
      }`}
    >
      {selected && <SelectedTick />}
      {!compact && (
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-accent text-on-dark px-2.5 py-0.5 text-[length:var(--fs-tag)] font-medium ${p.popular ? '' : 'invisible'}`}
            aria-hidden={!p.popular}
          >
            <Icon path={STAR_ICON} className="w-3 h-3" />
            Popular
          </span>
          {isPlanClass(p.planClass) ? <ServiceTypeTag type={PLAN_CLASS_TAG[p.planClass]} /> : <ConnectionTypeTag category="Postpaid" />}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-fg font-bold text-[length:var(--fs-h5)] leading-snug">{displayName ?? p.name}</p>
        {/* Same price block on every tab: the struck-through price on its own small line, then "QAR n /month for N months" on one line. */}
        <div className={`flex flex-col gap-0.5 ${compact ? '' : 'order-1'}`}>
          {struckPrice !== undefined && (
            <p className="text-fg-2 text-[length:var(--fs-caption)] line-through">{formatQar(struckPrice)}</p>
          )}
          <p className="text-accent flex flex-wrap items-baseline gap-x-1.5">
            <span>
              <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
              <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(discounted ?? p.mrcQAR)}</span>
              <span className="text-fg-2 text-[length:var(--fs-caption)]"> /month</span>
            </span>
            {p.promoMonths && <span className="text-fg-2 text-[length:var(--fs-caption)]">for {p.promoMonths} months</span>}
          </p>
        </div>
        {compact ? (
          /* One headline line, from the plan's own first feature (its data, or its speed) - the rest is in View details. */
          headline && <p className="text-fg font-semibold text-[length:var(--fs-body)] leading-snug">{headline}</p>
        ) : (
          <>
            <ul className="space-y-1.5 order-3">
              {[...(p.features?.length ? p.features.map((f, i) => ({ icon: i === 0 ? ICON_DATA : /minute|call/i.test(f) ? ICON_CALL : ICON_CARD, text: f })) : planFeatureRows(p)), { icon: ICON_CARD, text: `Bill limit: ${formatQar(shownLimit)}` }].map((f) => (
                <li key={f.text} className="flex items-center gap-2 text-fg-2 text-[length:var(--fs-caption)]">
                  <Icon path={f.icon} className="w-4 h-4 shrink-0 text-accent" />
                  {f.text}
                </li>
              ))}
            </ul>
            {/* What the plan includes free: one prominent block, so the agent can confirm it with the customer. */}
            {p.features?.length && p.benefits?.length ? (
              <div className="border-t border-[var(--field-card-border)] pt-4 mt-auto space-y-1.5 order-4">
                <p className="text-fg font-bold text-[length:var(--fs-caption)] uppercase tracking-wide">Included in This Offer</p>
                <ul className="space-y-1">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-fg font-medium text-[length:var(--fs-caption)]">
                      <Icon path={ICON_GIFT} className="w-4 h-4 shrink-0 text-accent mt-0.5" />
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
          className="inline-flex min-h-6 items-center gap-1 rounded-[var(--radius-button)] text-link hover:underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] text-[length:var(--fs-caption)] font-medium"
        >
          View details
          <Icon path="M9 18l6-6-6-6" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
