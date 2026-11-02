import { useEffect, useId, useRef, useState } from 'react';
import { addonChargeNowQar, addonPriceDisplay, addonWithBillingChoice, isAddonAvailable, isFreeAddon, type AddonBillingFrequency, type CategorisedAddon } from '../../../engines/addonCategories';
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
}

function cadenceOf(addon: HeaderAddon, choice?: AddonBillingFrequency): string {
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

/** Floating selection tray mounted only for the postpaid New Connection planExtras step. */
export function SelectedAddonsHeader({
  selectedIds,
  selectedBilling,
  onChange,
  variant = 'floating',
}: {
  selectedIds: string[];
  selectedBilling: Record<string, AddonBillingFrequency>;
  onChange: (ids: string[]) => void;
  /** 'header': in the step card's top-right corner, as wide as the Journey Summary, its panel dropping down (desktop). 'floating': fixed to the bottom of a small screen, its panel rising up. */
  variant?: 'floating' | 'header';
}) {
  const [catalogue, setCatalogue] = useState<HeaderAddon[]>([]);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void mockDataEngine.list<HeaderAddon>('products').then((products) => {
      if (!cancelled) setCatalogue(products.filter((product) => product.type === 'Add-on' && isAddonAvailable(product)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    .filter((addon): addon is HeaderAddon => Boolean(addon));
  const monthlyQar = selected.reduce((sum, addon) => sum + addonChargeNowQar(addon, selectedBilling[addon.productId]), 0);
  const count = selected.length;

  return (
    <div
      ref={containerRef}
      className={variant === 'header' ? 'relative w-80' : 'fixed inset-x-4 bottom-0 z-[var(--z-popover)]'}
    >
      <Button
        variant="secondary"
        compact
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="group w-full justify-between text-left shadow-raised"
      >
        <span className="row min-w-0">
          <span className="icon-tile count-badge">
            {count}
          </span>
          <span className="truncate text-[length:var(--fs-body)] font-semibold">
            {count} add-ons · {formatQar(monthlyQar)}/month
          </span>
        </span>
        <Icon path={CHEVRON_DOWN} className={`icon-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Selected Add-Ons"
          className={`absolute inset-x-0 ${variant === 'header' ? 'top-full mt-3 max-h-[calc(100dvh-var(--spacing)*56)]' : 'bottom-full mb-3 max-h-[calc(100dvh-var(--spacing)*24)]'} tray-panel`}
        >
          <div className="shrink-0 pad-panel">
            <h2 className="text-[length:var(--fs-h5)] font-bold">Selected Add-Ons</h2>
            <p className="mt-1 caption-muted">
              Excludes the base plan. Promotional prices may change.
            </p>
          </div>

          {selected.length > 0 ? (
            <ul className="min-h-0 overflow-y-auto divide-y divide-border-soft border-y border-border-soft">
              {selected.map((addon) => (
                <li key={addon.productId} className="row-start pad-row sm:px-5">
                  <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <p className="break-words text-[length:var(--fs-body)] font-semibold leading-snug">{addon.name}</p>
                    <p className="shrink-0 whitespace-nowrap text-right text-[length:var(--fs-caption)]">
                      <span className="block font-semibold text-fg">{priceOf(addon, selectedBilling[addon.productId])}</span>
                      <span className="mt-0.5 block text-muted">{cadenceOf(addon, selectedBilling[addon.productId])}</span>
                    </p>
                  </div>
                  <IconButton
                    icon={TRASH_ALT}
                    label={`Remove ${addon.name}`}
                    tone="danger"
                    size="sm"
                    onClick={() => onChange(selectedIds.filter((id) => id !== addon.productId))}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="border-y border-border-soft px-5 py-5 text-[length:var(--fs-body)] text-muted">
              No add-ons selected.
            </p>
          )}

          <div className="spread shrink-0 items-center pad-panel">
            <span className="text-[length:var(--fs-body)] font-semibold">Monthly Add-Ons</span>
            <strong className="text-[length:var(--fs-body-lg)]">{formatQar(monthlyQar)}</strong>
          </div>
        </section>
      )}
    </div>
  );
}
