import { defaultBillLimitQar } from '../../engines/postpaidPricing';
import { AddonsPicker } from '../../capabilities/AddonsSelection/AddonsPicker';
import { BillLimitEditor } from '../domain/BillLimitEditor';
import type { PostpaidPlan } from './postpaidPlanModel';
import type { AddonBillingFrequency } from '../../engines/addonCategories';

interface PostpaidAddonsPanelProps {
  preBundled: boolean;
  addonIds: string[];
  onAddonsChange: (ids: string[]) => void;
  addonBilling: Record<string, AddonBillingFrequency>;
  onAddonBillingChange: (billing: Record<string, AddonBillingFrequency>) => void;
  selectedProductId: string | undefined;
  customerContext?: { nationality?: string; customerType?: string; idType?: string };
  selectedPlan: PostpaidPlan | undefined;
  billLimit: number | undefined;
  onBillLimitChange: (value: number, pass: boolean) => void;
  billLimitMax?: number;
  /** The bill limit is shown by the caller (full width, apart from the add-ons) instead of under the add-ons. */
  hideBillLimit?: boolean;
}

export function PostpaidAddonsPanel({
  preBundled,
  addonIds,
  onAddonsChange,
  addonBilling,
  onAddonBillingChange,
  selectedProductId,
  customerContext,
  selectedPlan,
  billLimit,
  onBillLimitChange,
  billLimitMax,
  hideBillLimit = false,
}: PostpaidAddonsPanelProps) {
  return (preBundled ? (
        <div className="notice-warning pad-row">
          <p className="title title-sm font-semibold">Add-Ons Unavailable for This Plan</p>
          <p className="text-[var(--warn-text)] text-[length:var(--fs-caption)] mt-1">
            The selected plan is pre-bundled and already includes its extras, so it does not accept add-ons.
            Choose another plan to add extras.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AddonsPicker
            selectedIds={addonIds}
            onChange={onAddonsChange}
            selectedBilling={addonBilling}
            onBillingChange={onAddonBillingChange}
            hideHeader
            layout="rows"
            categorized
            emptyMessage="No add-ons available for this plan"
            eligibilityContext={{ planId: selectedProductId, ...customerContext }}
          />
          {/* Bill Limit, re-added 2026-09-28 as an editable add-on
              defaulted from the selected plan's MRC - lives in this
              same tab since it is scoped to the figure it defaults
              from. Hidden until a plan is chosen, same as Eligible
              Discounts, since there is no MRC to default from before
              then. */}
          {selectedPlan && !hideBillLimit && (
            <BillLimitEditor product="Mobile" layout="row" value={billLimit ?? defaultBillLimitQar(selectedPlan.mrcQAR, billLimitMax)} onChange={onBillLimitChange} maxLimit={billLimitMax} />
          )}
        </div>
      ));
}
