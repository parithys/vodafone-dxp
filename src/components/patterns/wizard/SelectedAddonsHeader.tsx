import { useEffect, useId, useRef, useState } from 'react';
import { addonChargeNowQar, addonPriceDisplay, addonWithBillingChoice, isAddonAvailable, isFreeAddon, type AddonBillingFrequency, type CategorisedAddon } from '../../../engines/addonCategories';
import { appliedDiscountFor, discountedAddon, type AddonDiscount, type AppliedAddonDiscounts } from '../../../engines/addonDiscounts';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { formatQar } from '../../../lib/format';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { IconButton } from '../../primitives/IconButton';
import { CHEVRON_DOWN, TRASH_ALT } from '../../../assets/icons';


interface HeaderAddon extends CategorisedAddon {
  productId: string;
  name: string;
  type: string;
  /** A prepaid pack's mandatory product: always on the order, so it has no remove control. */
  mandatory?: boolean;
}

function cadenceOf(addon: HeaderAddon, source: 'catalogue' | 'prepaid', choice?: AddonBillingFrequency): string {
  // A prepaid add-on is paid once, at activation, unless its record says otherwise.
  if (source === 'prepaid' && !addon.billingFrequency) return 'One-time';
  const effective = addonWithBillingChoice(addon, choice);
  if (effective.billingFrequency === 'one-time') return 'One-time';
  if (effective.billingFrequency === 'weekly') return 'Weekly';
  return 'Monthly';
}

function priceOf(addon: HeaderAddon, choice?: AddonBillingFrequency): string {
  if (isFreeAddon(addon)) return 'Free';
  const effective = addonWithBillingChoice(addon, choice);
  return addonPriceDisplay(addon, choice)?.primary ?? formatQar(effective.mrcQAR);
}

/** The Selected Add-Ons tray of an Addons step: the postpaid add-ons (monthly) or a prepaid pack's (one-off). Mounted by the wizard for a step that sets `addonsTray`. */
export function SelectedAddonsHeader({
  selectedIds,
  selectedBilling,
  onChange,
  variant = 'floating',
  source = 'catalogue',
  appliedDiscounts,
}: {
  /** The add-on discounts applied (add-on product id -> discount id): each selected add-on is listed and totalled after its discount. */
  appliedDiscounts?: AppliedAddonDiscounts;
  /** Where the add-ons come from: the postpaid catalogue (default) or the prepaid pack's (addons-discounts). */
  source?: 'catalogue' | 'prepaid';
  selectedIds: string[];
  selectedBilling: Record<string, AddonBillingFrequency>;
  onChange: (ids: string[]) => void;
  /** 'header': in the step card's top-right corner, as wide as the Journey Summary, its panel dropping down (desktop). 'floating': fixed to the bottom of a small screen, its panel rising up. */
  variant?: 'floating' | 'header';
}) {
  const [catalogue, setCatalogue] = useState<HeaderAddon[]>([]);
  const [discountRecords, setDiscountRecords] = useState<AddonDiscount[]>([]);
  const wantsDiscounts = appliedDiscounts !== undefined;
  useEffect(() => {
    if (wantsDiscounts) void mockDataEngine.list<AddonDiscount>('addon-discounts').then(setDiscountRecords);
  }, [wantsDiscounts]);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load: Promise<HeaderAddon[]> =
      source === 'prepaid'
        ? mockDataEngine
            .list<{ addonDiscountId: string; name: string; addonType: string; price: number; category: string; isMandatory?: boolean }>('addons-discounts')
            .then((all) => all.filter((d) => d.category === 'Paid Add-on').map((d) => ({ productId: d.addonDiscountId, name: d.name, type: d.addonType, mrcQAR: d.price, mandatory: d.isMandatory === true })))
        : mockDataEngine.list<HeaderAddon>('products').then((products) => products.filter((product) => product.type === 'Add-on'));
    void load.then((list) => {
      if (!cancelled) setCatalogue(list.filter(isAddonAvailable));
    });
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!open) return;
    const close = (returnFocus = false) => {
      setOpen(false);
      if (returnFocus) containerRef.current?.querySelector('button')?.focus();
    };
    const onMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selected = selectedIds
    .map((id) => catalogue.find((addon) => addon.productId === id))
    .filter((addon): addon is HeaderAddon => Boolean(addon))
    // After the applied add-on discount (the listed price and the total both).
    .map((addon) => discountedAddon(addon, appliedDiscountFor(discountRecords, appliedDiscounts, addon)));
  const prepaid = source === 'prepaid';
  // Postpaid: what the first months' bills carry. Prepaid: what is paid once, today.
  const totalQar = selected.reduce((sum, addon) => sum + (prepaid ? addon.mrcQAR : addonChargeNowQar(addon, selectedBilling[addon.productId])), 0);
  const count = selected.length;

  return (
    <div
      ref={containerRef}
      className={variant === 'header' ? 'relative w-80' : 'tray-fixed'}
    >
      <Button
        variant="secondary"
        compact
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="group tray-toggle"
      >
        <span className="row min-w-0">
          <span className="icon-tile count-badge">
            {count}
          </span>
          <span className="truncate text-[length:var(--fs-body)] font-semibold">
            {count} add-ons · {formatQar(totalQar)}{prepaid ? ' one-off' : '/month'}
          </span>
        </span>
        <Icon path={CHEVRON_DOWN} className={`icon-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Selected Add-Ons"
          className={`tray-anchor ${variant === 'header' ? 'tray-below' : 'tray-above'} tray-panel`}
        >
          <div className="shrink-0 pad-panel">
            <h2 className="text-[length:var(--fs-h5)] font-bold">Selected Add-Ons</h2>
            <p className="mt-1 caption-muted">
              {prepaid ? 'Excludes the pack. Add-ons are charged once, with the order.' : 'Excludes the base plan. Promotional prices may change.'}
            </p>
          </div>

          {selected.length > 0 ? (
            <ul className="scroll-list-ruled">
              {selected.map((addon) => (
                <li key={addon.productId} className="row-start pad-row sm:px-5">
                  <div className="addon-line-grid">
                    <p className="addon-name">{addon.name}</p>
                    <p className="addon-price">
                      <span className="block font-semibold text-fg">{priceOf(addon, selectedBilling[addon.productId])}</span>
                      <span className="mt-0.5 block text-muted">{cadenceOf(addon, source, selectedBilling[addon.productId])}</span>
                    </p>
                  </div>
                  {!addon.mandatory && (
                    <IconButton
                      icon={TRASH_ALT}
                      label={`Remove ${addon.name}`}
                      tone="danger"
                      size="sm"
                      onClick={() => onChange(selectedIds.filter((id) => id !== addon.productId))}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="tray-empty">
              No add-ons selected.
            </p>
          )}

          <div className="spread shrink-0 items-center pad-panel">
            <span className="text-[length:var(--fs-body)] font-semibold">{prepaid ? 'One-Off Add-Ons' : 'Monthly Add-Ons'}</span>
            <strong className="text-[length:var(--fs-body-lg)]">{formatQar(totalQar)}</strong>
          </div>
        </section>
      )}
    </div>
  );
}
