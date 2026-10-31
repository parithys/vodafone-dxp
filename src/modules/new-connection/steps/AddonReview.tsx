import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { EmptyState } from '../../../components/primitives/EmptyState';
import {
  addonChargeNowQar,
  addonOneTimeQar,
  addonWithBillingChoice,
  isFreeAddon,
  type AddonBillingFrequency,
  type CategorisedAddon,
} from '../../../engines/addonCategories';
import { defaultBillLimitQar } from '../../../engines/postpaidPricing';
import { formatQar } from '../../../lib/format';
import { effectiveCreditLimitQar, type BillingAccountValue } from '../../../capabilities';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { Product } from '../newConnectionModel';

interface ReviewProduct extends Product, CategorisedAddon {
  description?: string;
}

const frequencyLabel = (frequency: AddonBillingFrequency | undefined): string =>
  frequency === 'weekly' ? 'Weekly' : frequency === 'one-time' ? 'One-Time' : 'Monthly';

function statedCharge(addon: ReviewProduct, choice?: AddonBillingFrequency): string {
  const effective = addonWithBillingChoice(addon, choice);
  if (isFreeAddon(effective)) return 'Free';
  if (effective.billingFrequency === 'one-time') return `${formatQar(addonOneTimeQar(addon, choice))} one-time`;
  if (effective.billingFrequency === 'weekly') return `${formatQar(effective.mrcQAR)}/week`;
  return `${formatQar(addonChargeNowQar(addon, choice))}/month`;
}

export function AddonReview({
  products,
  values,
  onEdit,
}: {
  products: Product[];
  values: Record<string, unknown>;
  onEdit?: () => void;
}) {
  const reviewProducts = products as ReviewProduct[];
  const selectedIds = (values.addonIds as string[] | undefined) ?? [];
  const selectedBilling = (values.addonBilling as Record<string, AddonBillingFrequency> | undefined) ?? {};
  const selected = selectedIds
    .map((id) => reviewProducts.find((product) => product.productId === id && product.type === 'Add-on'))
    .filter((product): product is ReviewProduct => Boolean(product));
  const plan = reviewProducts.find((product) => product.productId === values.productId && product.type !== 'Add-on');
  const creditLimitQar = effectiveCreditLimitQar(
    values.eligibility as EligibilityResult | undefined,
    values.billingAccount as BillingAccountValue | undefined
  );
  const billLimitQar =
    (values.billLimit as number | undefined) ??
    (plan ? defaultBillLimitQar(plan.mrcQAR, creditLimitQar) : undefined);
  const addonRecurringQar = selected.reduce(
    (total, addon) => total + addonChargeNowQar(addon, selectedBilling[addon.productId]),
    0
  );
  const planAndAddonsQar = (plan?.mrcQAR ?? 0) + addonRecurringQar;
  const limitDifference = billLimitQar === undefined ? undefined : billLimitQar - planAndAddonsQar;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-border-soft bg-bg" aria-labelledby="selected-addons-review">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-soft px-5 py-4">
          <div>
            <h3 id="selected-addons-review" className="text-[length:var(--fs-h5)] font-bold text-fg">Selected Add-Ons</h3>
            <p className="mt-1 text-[length:var(--fs-caption)] text-muted">
              Verify each billing frequency and charge before customer confirmation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">{selected.length} selected</Badge>
            {onEdit && (
              <Button variant="secondary" compact onClick={onEdit}>
                Edit Add-Ons
              </Button>
            )}
          </div>
        </div>

        {selected.length > 0 ? (
          <ul className="divide-y divide-border-soft">
            {selected.map((addon) => {
              const choice = selectedBilling[addon.productId];
              const effective = addonWithBillingChoice(addon, choice);
              const recurringQar = addonChargeNowQar(addon, choice);
              return (
                <li key={addon.productId} className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="break-words text-[length:var(--fs-body)] font-semibold leading-snug text-fg">{addon.name}</p>
                    {addon.description && addon.description !== addon.name && (
                      <p className="mt-1 text-[length:var(--fs-caption)] text-muted">{addon.description}</p>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[length:var(--fs-caption)] sm:contents">
                    <div className="sm:text-right">
                      <dt className="text-muted">Billing Frequency</dt>
                      <dd className="mt-1 font-semibold text-fg">{frequencyLabel(effective.billingFrequency)}</dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-muted">Charge</dt>
                      <dd className="mt-1 font-semibold text-fg">{statedCharge(addon, choice)}</dd>
                      {effective.billingFrequency === 'weekly' && (
                        <dd className="mt-0.5 text-muted">{formatQar(recurringQar)}/month equivalent</dd>
                      )}
                      {effective.billingFrequency === 'one-time' && (
                        <dd className="mt-0.5 text-muted">No Recurring Impact</dd>
                      )}
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            compact
            title="No Add-Ons Selected"
            message="The order will continue without optional add-ons."
          />
        )}
      </section>

      <section className="rounded-[var(--radius-card)] border border-border-soft bg-surface-subtle p-5" aria-labelledby="bill-limit-impact">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 id="bill-limit-impact" className="text-[length:var(--fs-h5)] font-bold text-fg">Bill-Limit Impact</h3>
            <p className="mt-1 text-[length:var(--fs-caption)] text-muted">Recurring figures are shown before discounts and VAT.</p>
          </div>
          <strong className="text-[length:var(--fs-h4)] text-fg">{formatQar(addonRecurringQar)}/month</strong>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-4">
            <dt className="text-[length:var(--fs-caption)] text-muted">Add-On Recurring</dt>
            <dd className="mt-1 text-[length:var(--fs-body-lg)] font-bold text-fg">{formatQar(addonRecurringQar)}/month</dd>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-4">
            <dt className="text-[length:var(--fs-caption)] text-muted">Plan + Add-Ons</dt>
            <dd className="mt-1 text-[length:var(--fs-body-lg)] font-bold text-fg">{formatQar(planAndAddonsQar)}/month</dd>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-4">
            <dt className="text-[length:var(--fs-caption)] text-muted">Current Bill Limit</dt>
            <dd className="mt-1 text-[length:var(--fs-body-lg)] font-bold text-fg">{billLimitQar === undefined ? 'Not Available' : formatQar(billLimitQar)}</dd>
          </div>
        </dl>
        {limitDifference !== undefined && (
          <p
            role={limitDifference < 0 ? 'alert' : 'status'}
            className={`mt-4 text-[length:var(--fs-body)] font-medium ${limitDifference < 0 ? 'rounded-[var(--radius-card)] border border-[var(--warn-border)] bg-[var(--warn-bg)] p-3 text-[var(--warn-text)]' : 'text-fg-2'}`}
          >
            {limitDifference < 0
              ? `Recurring plan and add-on charges are ${formatQar(Math.abs(limitDifference))} above the current bill limit. Confirm the limit before continuing.`
              : `${formatQar(limitDifference)} remains between recurring plan and add-on charges and the bill limit.`}
          </p>
        )}
      </section>
    </div>
  );
}
