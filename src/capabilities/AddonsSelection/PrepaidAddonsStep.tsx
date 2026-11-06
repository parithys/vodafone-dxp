import { AddonsPicker } from './AddonsPicker';

export interface PrepaidAddonsStepProps {
  /** The prepaid pack the add-ons are for (its id): the only thing the Addons page takes from the pack page. */
  selectedProductId: string | undefined;
  /** The add-ons chosen for this pack (optional). */
  addonIds?: string[];
  onSelectAddons: (ids: string[]) => void;
  /** Shown when the pack has no add-on. */
  emptyMessage?: string;
  /** The pack's mandatory products are selected for the agent and cannot be removed (New Prepaid). Off: every add-on is optional. */
  mandatoryProducts?: boolean;
}

// MPRA_001_QPC_01 (prepaid add-on selection): the Addons page of a prepaid journey, the same page as the postpaid one - the pack's add-ons under category tabs (Local Data ...
// Others, Frequently Used) with a search, Paid and Free side by side, and the Selected Add-Ons tray (the step declares it, see prepaidAddonsStep). The pack itself (name,
// price, benefits) is not repeated here: it is on the pack page and in the Summary. The pack's discount is the pack page's own (Edit Discount), as the postpaid plan's is.
// A prepaid add-on is listed under the category its record states (else Others) and is paid once, so its price reads "one-off". No Bill Limit: BR-002/BR-005 exclude
// credit limit and bill cycle from Prepaid Activation.
export function PrepaidAddonsStep({ selectedProductId, addonIds = [], onSelectAddons, emptyMessage = 'No add-ons available for this pack', mandatoryProducts = false }: PrepaidAddonsStepProps) {
  if (!selectedProductId) {
    return <p className="muted-body">Select a pack first - its add-ons appear here.</p>;
  }
  return (
    <div className="space-y-4">
      <section aria-label="Add-ons" className="space-y-4">
        <div className="space-y-3 min-w-0">
          <AddonsPicker
            selectedIds={addonIds}
            onChange={onSelectAddons}
            hideHeader
            layout="rows"
            categorized
            source="prepaid"
            mandatoryProducts={mandatoryProducts}
            emptyMessage={emptyMessage}
            eligibilityContext={{ planId: selectedProductId }}
          />
        </div>
      </section>
    </div>
  );
}
