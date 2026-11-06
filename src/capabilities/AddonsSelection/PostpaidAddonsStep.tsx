import { Checkbox } from '../../components/primitives/Checkbox';
import { BillLimitEditor } from '../../components/domain/BillLimitEditor';
import { defaultBillLimitQar } from '../../engines/postpaidPricing';
import type { ServiceOptions } from '../../components/patterns/serviceOptions';
import type { AddonBillingFrequency } from '../../engines/addonCategories';
import { AddonsPicker } from './AddonsPicker';
import { useSelectedPostpaidPlan } from './useSelectedPostpaidPlan';

const SERVICE_OPTIONS: { key: keyof ServiceOptions; label: string }[] = [
  { key: 'dnd', label: 'Enable Do Not Disturb (DND)' },
  { key: 'dob', label: 'Allow Direct Operator Billing (DOB)' },
  { key: 'vas', label: 'Enable Value-Added Services (VAS)' },
];

export interface PostpaidAddonsStepProps {
  /** The postpaid plan the add-ons are for (its id): the only thing the Addons page takes from the plan page. */
  planId: string | undefined;
  addonIds: string[];
  onAddonsChange: (ids: string[]) => void;
  addonBilling?: Record<string, AddonBillingFrequency>;
  /** The billing-frequency choice (monthly / weekly ...) is offered only where the journey records it (its order prices it); omitted, the catalogue default is what is priced. */
  onAddonBillingChange?: (billing: Record<string, AddonBillingFrequency>) => void;
  /** Who the customer is, for deciding which add-ons they are eligible for. */
  customerContext?: { nationality?: string; customerType?: string; idType?: string };
  /** Shown when no add-on is available for the plan. */
  emptyMessage?: string;
  /**
   * The activation journey's rule, passed by it: a pre-bundled plan (the whole Offers tab) takes no add-ons, so the page says so instead of listing any, and until a
   * plan is chosen there is nothing to list. Off (a line that already has its plan, e.g. Add Add-On): the plan's add-ons are listed whatever its offer.
   */
  bundledPlansTakeNoAddons?: boolean;
  /** The Bill Limit section, under the add-ons: the activation journey sets the limit for the line. Omitted, there is none (a journey that does not set one). */
  billLimit?: { value: number | undefined; onChange: (value: number, pass: boolean) => void; max?: number };
  /** The line's service options (DND, DOB, VAS), all on unless the agent unticks one. Omitted, they are not shown. */
  serviceOptions?: { value: ServiceOptions; onChange: (options: ServiceOptions) => void };
}

/**
 * The Addons page of a postpaid journey: the plan's add-ons under category tabs (Local Data, Local Minutes, International, Roaming, Combo, Others and Frequently Used), each
 * category's Paid and Free add-ons side by side, the add-ons' billing frequency and the Multi-SIM maximum; then, for the journey that sets them, the Bill Limit and the
 * service options. Eligibility comes from the plan's id and who the customer is. Nothing here chooses or changes the plan: that is the plan page's.
 */
export function PostpaidAddonsStep({
  planId,
  addonIds,
  onAddonsChange,
  addonBilling = {},
  onAddonBillingChange,
  customerContext,
  emptyMessage = 'No add-ons available for this plan',
  bundledPlansTakeNoAddons = false,
  billLimit,
  serviceOptions,
}: PostpaidAddonsStepProps) {
  const { selectedPlan, preBundled, selectionSource } = useSelectedPostpaidPlan(planId);

  if (bundledPlansTakeNoAddons && !selectedPlan) {
    return <p className="muted-body">Select a plan first - its add-ons, bill limit and discounts appear here.</p>;
  }
  if (bundledPlansTakeNoAddons && selectionSource === 'OFFER') {
    return (
      <p className="notice-neutral pad-row text-secondary">
        This plan is an offer: its add-ons and discounts are bundled, so there is nothing to choose here. Continue to review the monthly summary.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {planId && (
        <section aria-label="Add-ons" className="space-y-4">
          <div className="space-y-3 min-w-0">
            <AddonsPicker
              selectedIds={addonIds}
              onChange={onAddonsChange}
              selectedBilling={addonBilling}
              onBillingChange={onAddonBillingChange}
              hideHeader
              layout="rows"
              categorized
              emptyMessage={emptyMessage}
              eligibilityContext={{ planId, ...customerContext }}
              multiSimPlan={selectedPlan}
            />
          </div>
        </section>
      )}
      {/* The bill limit, after the add-ons, full width under a separator and without a box: it is a spending control for the whole plan, not one of the add-ons. */}
      {billLimit && selectedPlan && !preBundled && (
        <div className="border-t border-[var(--field-card-border)] pt-6">
          <BillLimitEditor
            product="Mobile"
            layout="row"
            bare
            value={billLimit.value ?? defaultBillLimitQar(selectedPlan.mrcQAR, billLimit.max)}
            onChange={billLimit.onChange}
            maxLimit={billLimit.max}
          />
        </div>
      )}
      {serviceOptions && selectedPlan && !preBundled && (
        <div className="border-t border-[var(--field-card-border)] pt-6">
          <div className="stack gap-3">
            {SERVICE_OPTIONS.map((o) => (
              <label key={o.key} className="row-start cursor-pointer">
                <Checkbox checked={serviceOptions.value[o.key]} onChange={(e) => serviceOptions.onChange({ ...serviceOptions.value, [o.key]: e.target.checked })} />
                <span className="text-fg">{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
