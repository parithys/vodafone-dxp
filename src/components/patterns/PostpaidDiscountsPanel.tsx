import { Button } from '../primitives/Button';
import { EmptyState } from '../primitives/EmptyState';
import { SPECIAL_DISCOUNT_ADDON_TYPES, SPECIAL_DISCOUNT_CARD_TITLE, discountDescription, discountsAscending, type Discount } from './postpaidPlanModel';
import { DiscountCard } from './DiscountCard';

interface PostpaidDiscountsPanelProps {
  selectedProductId: string | undefined;
  preBundled: boolean;
  discountId: string | undefined;
  onSelectDiscount: (discountId: string | undefined) => void;
  discounts: Discount[];
  /** Where the plan's discounts are in loading; on error the agent can retry or continue without one. */
  discountsState?: 'loading' | 'error' | 'ready';
  onRetryDiscounts?: () => void;
}

export function PostpaidDiscountsPanel({
  selectedProductId,
  preBundled,
  discountId,
  onSelectDiscount,
  discounts,
  discountsState = 'ready',
  onRetryDiscounts,
}: PostpaidDiscountsPanelProps) {
  return (!selectedProductId ? (
        <p className="text-muted text-[length:var(--fs-caption)]">Select a plan to see eligible discounts.</p>
      ) : discountsState === 'loading' ? (
        <p className="text-muted text-[length:var(--fs-caption)]">Loading discounts…</p>
      ) : discountsState === 'error' ? (
        <div role="alert" className="rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[var(--warn-text)] text-[length:var(--fs-body)]">Discounts could not be loaded. You can continue without one.</p>
          <Button variant="tertiary" compact onClick={onRetryDiscounts}>
            Retry
          </Button>
        </div>
      ) : preBundled ? (
        // A pre-bundled plan already comes with its own offer decided
        // - either individually flagged (PostpaidPlan.preBundledOffer)
        // or, as of 2026-09-30, simply because it lives on the Offers
        // tab (isOffersPlan). A flagged plan is reached at all only by
        // walking back to a tab the wizard's autoAdvanceWhen already
        // carried the agent past once; an Offers-tab plan without that
        // flag stays on this step normally, it just has nothing to
        // choose on this panel. Either way this explains why, rather
        // than showing a "No discount" picker with nothing behind it.
        <div className="rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3">
          <p className="text-fg font-semibold text-[length:var(--fs-body)]">Discounts Unavailable for This Plan</p>
          <p className="text-[var(--warn-text)] text-[length:var(--fs-caption)] mt-1">
            The selected plan is pre-bundled and already includes its offer, so it does not accept extra
            discounts. Choose another plan to apply a discount.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Same card standard as the plan and add-on cards (shared idle / selected states, texture, tick).
              Eligible Discounts always has one selection: "No Discount" when no Special Discount applies (and whenever no discount is
              chosen), the Special Discount once a validated Consumer B2B2C / Retiree / MADA applies (the plan step selects it). Choosing
              another card replaces the choice; choosing the selected card changes nothing. */}
          {discounts.length === 0 ? (
            <EmptyState compact message="No discounts available for this plan." />
          ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] gap-4">
            <DiscountCard
              title="No Discount"
              description="Continue without a discount"
              value="-"
              selected={!discountId}
              onToggle={() => onSelectDiscount(undefined)}
            />
            {discountsAscending(discounts).map((d) => (
              <DiscountCard
                key={d.addonDiscountId}
                title={SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType) ? SPECIAL_DISCOUNT_CARD_TITLE : d.name}
                description={discountDescription(d)}
                value={`${Math.round(d.price * 100)}%`}
                selected={discountId === d.addonDiscountId}
                onToggle={() => onSelectDiscount(d.addonDiscountId)}
              />
            ))}
          </div>
          )}
        </div>
      ));
}
