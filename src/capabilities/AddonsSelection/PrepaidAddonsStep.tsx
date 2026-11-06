import { AddonsPicker } from './AddonsPicker';

export interface PrepaidAddonsStepProps {
  /** The prepaid pack the add-ons are for (its id): the only thing the Addons page takes from the pack page. */
  selectedProductId: string | undefined;
  /** The add-ons chosen for this pack (optional). */
  addonIds?: string[];
  onSelectAddons: (ids: string[]) => void;
  /** Shown when the pack has no add-on. */
  emptyMessage?: string;
}

// MPRA_001_QPC_01 (prepaid add-on selection): the Addons page of a prepaid journey, built like the postpaid one - the pack's add-ons and nothing else. The pack itself (name,
// price, benefits) is not repeated here: it is on the pack page and in the Summary. The pack's discount is the pack page's own (Edit Discount), as the postpaid plan's is.
// Prepaid add-ons carry no category and no Paid / Free, so unlike the postpaid page they are one list of rows (the same row, tag and price as the postpaid ones). No Bill
// Limit: BR-002/BR-005 exclude credit limit and bill cycle from Prepaid Activation.
export function PrepaidAddonsStep({ selectedProductId, addonIds = [], onSelectAddons, emptyMessage = 'No add-ons available for this pack' }: PrepaidAddonsStepProps) {
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
            source="prepaid"
            emptyMessage={emptyMessage}
            eligibilityContext={{ planId: selectedProductId }}
          />
        </div>
      </section>
    </div>
  );
}
