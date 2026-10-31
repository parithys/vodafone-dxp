import { Button } from '../../components/primitives/Button';
import { EmptyState } from '../../components/primitives/EmptyState';
import { useEffect, useState } from 'react';
import { Icon } from '../../components/primitives/Icon';
import { TabStrip } from '../../components/primitives/TabStrip';
import { SearchField } from '../../components/primitives/SearchField';
import { SegmentedTabs } from '../../components/primitives/SegmentedTabs';
import { CARD_IDLE, CARD_SELECTED, SelectedTick, SelectedCardTexture } from '../../components/primitives/offerCardParts';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { isAddonEligible, type AddonEligibilityContext, type AddonEligibilityRule } from '../../engines/addonEligibility';
import { ADDON_CATEGORIES, addonsFor, selectedPerCategory, type AddonCategory, type AddonPricingModel, type AddonBillingFrequency, type AddonBillingOption, addonPriceDisplay, addonChargeType, isAddonAvailable } from '../../engines/addonCategories';
import { formatAmount } from '../../lib/format';
import { CHEVRON_RIGHT, DATA_ICON, LAYERS_ICON } from '../../assets/icons';

interface AddonProduct {
  productId: string;
  name: string;
  type: string;
  mrcQAR: number;
  description?: string;
  /** Optional conditions for being offered this add-on - see addonEligibility.ts. */
  eligibility?: AddonEligibilityRule;
  /** The add-on's category on the Add-ons page (see addonCategories.ts). */
  addonCategory?: string;
  pricing?: 'free' | 'paid';
  /** How it is charged (see addonCategories.ts); decides Free / Paid and the price wording. */
  pricingModel?: AddonPricingModel;
  /** Stated on the record when the add-on is not monthly (weekly or one-time). */
  billingFrequency?: 'monthly' | 'weekly' | 'one-time';
  billingOptions?: AddonBillingOption[];
  introPriceQAR?: number;
  /** The catalogue's own wording for a price that is not a plain QAR amount (TBC, Plan-based, QR 10 after promotional period ...). */
  priceLabel?: string;
  /** The catalogue's status (Confirmed, Demo Only / TBC ...). Kept with the data; not displayed. */
  addonStatus?: string;
}

interface AddonsPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  selectedBilling?: Record<string, AddonBillingFrequency>;
  onBillingChange?: (billing: Record<string, AddonBillingFrequency>) => void;
  /**
   * Set by PostpaidPlanAddonsStep's own "Add-ons (optional)" TAB (2026-09-28
   * tabbed redesign) - the tab bar itself now names and counts this section,
   * so repeating "Add-ons (optional)" as a second, collapsible heading
   * directly under it was a redundant control doing the tab's job a second
   * time. The one other caller (none currently - this is still this
   * component's only call site) keeps the original collapsible heading by
   * simply omitting this prop.
   */
  hideHeader?: boolean;
  /** Who the add-ons are for. Only add-ons this customer is eligible for are shown. */
  eligibilityContext?: AddonEligibilityContext;
  /** Shown when no add-on is available. Omitted: nothing is rendered in that case. */
  emptyMessage?: string;
  /** 'rows': one full-width row per add-on (icon, name and description, Optional/Added tag, price). Default: a grid of cards. */
  layout?: 'cards' | 'rows';
  /**
   * Where the add-ons come from: 'catalogue' (default) the postpaid add-on products, offered by plan eligibility; 'prepaid' the add-ons
   * the prepaid pack carries (addons-discounts for `eligibilityContext.planId`), priced as a one-off charge.
   */
  source?: 'catalogue' | 'prepaid';
  /**
   * The dedicated Add-ons page: the category tabs (Local Data, Local Calls, International Calls, Roaming, Combo, Others) and, under them, the selected
   * category's add-ons in two columns - Paid Add-Ons and Complimentary - each listed top to bottom. Rows layout, catalogue add-ons.
   */
  categorized?: boolean;
}

// "Plan & Add-ons" (reference flow step 5) - optional, non-gating multi-select
// of catalogue products where type === 'Add-on', alongside the mandatory
// single-select Plan above it in ProductPlanStep.


export function AddonsPicker({ selectedIds, onChange, selectedBilling = {}, onBillingChange, hideHeader, eligibilityContext, emptyMessage, layout = 'cards', source = 'catalogue', categorized = false }: AddonsPickerProps) {
  const [category, setCategory] = useState<AddonCategory>(ADDON_CATEGORIES[0]);
  // Search by add-on name, description or price, scoped to the category on show (like the plan search under the plan tabs).
  const [search, setSearch] = useState('');
  const [allAddons, setAllAddons] = useState<AddonProduct[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [attempt, setAttempt] = useState(0);
  // Eligibility is evaluated BEFORE anything renders: an add-on the customer is not
  // eligible for is not in the list at all, so it can be neither seen nor selected.
  const eligibleAddons = eligibilityContext ? allAddons.filter((a) => isAddonEligible(a, eligibilityContext)) : allAddons;
  const addons = eligibleAddons.filter(isAddonAvailable);
  // Collapsed by default (2026-09-27). Add-ons are optional and most orders
  // take none, so the list was occupying the step for a decision usually
  // answered "no" - but the count in the header means a collapsed section
  // still reports what is inside it, which is the part that makes collapsing
  // safe rather than hiding state. Moot when hideHeader is set: there is no
  // collapsible heading to default shut, so the list always renders open.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load: Promise<AddonProduct[]> =
      source === 'prepaid'
        ? mockDataEngine
            .list<{ addonDiscountId: string; name: string; addonType: string; price: number; category: string; description?: string; planId?: string }>('addons-discounts')
            .then((all) =>
              all
                .filter((d) => d.category === 'Paid Add-on' && d.planId === eligibilityContext?.planId)
                .map((d) => ({ productId: d.addonDiscountId, name: d.name, type: d.addonType, mrcQAR: d.price, description: d.description }))
            )
        : mockDataEngine.list<AddonProduct>('products').then((all) => all.filter((p) => p.type === 'Add-on'));
    load
      .then((list) => {
        if (cancelled) return;
        setAllAddons(list);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [attempt, source, eligibilityContext?.planId]);

  // A selection that stopped being eligible (the plan or customer type changed) is dropped.
  const eligibleIds = addons.map((a) => a.productId).join(',');
  const selectedKey = selectedIds.join(',');
  const billingKey = Object.keys(selectedBilling).sort().join(',');
  useEffect(() => {
    if (allAddons.length === 0) return;
    const kept = selectedIds.filter((id) => addons.some((a) => a.productId === id));
    if (kept.length !== selectedIds.length) onChange(kept);
    if (onBillingChange) {
      const keptBilling = Object.fromEntries(Object.entries(selectedBilling).filter(([id]) => kept.includes(id)));
      if (Object.keys(keptBilling).length !== Object.keys(selectedBilling).length) onBillingChange(keptBilling);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibleIds, allAddons.length, selectedKey, billingKey]);

  if (status === 'loading' && emptyMessage) return <p className="text-muted text-[length:var(--fs-caption)]">Loading add-ons…</p>;
  if (status === 'error') {
    return (
      <div role="alert" className="rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[var(--warn-text)] text-[length:var(--fs-body)]">Add-ons could not be loaded. You can continue without them.</p>
        <Button variant="tertiary" compact onClick={() => { setStatus('loading'); setAttempt((n) => n + 1); }}>
          Retry
        </Button>
      </div>
    );
  }
  if (addons.length === 0) {
    return status === 'ready' && emptyMessage ? (
      <EmptyState compact message={emptyMessage} />
    ) : null;
  }

  // The add-ons on screen: all of them, or - on the Add-ons page - the selected category's, narrowed by Free / Paid.
  const useTabs = categorized && layout === 'rows' && source === 'catalogue';
  const q = search.trim().toLowerCase();
  const matchesSearch = (a: AddonProduct) =>
    !q || [a.name, a.description, addonPriceDisplay(a)?.primary, addonPriceDisplay(a)?.secondary, a.priceLabel, String(a.mrcQAR)].some((t) => t?.toLowerCase().includes(q));
  const paid = useTabs ? addonsFor(addons, category, 'paid').filter(matchesSearch) : [];
  const free = useTabs ? addonsFor(addons, category, 'free').filter(matchesSearch) : [];
  const shown = useTabs ? [...paid, ...free] : addons;
  const perCategory = selectedPerCategory(addons, selectedIds);
  const toggle = (id: string) => {
    const removing = selectedIds.includes(id);
    onChange(removing ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
    if (removing && selectedBilling[id] && onBillingChange) {
      const { [id]: _removed, ...rest } = selectedBilling;
      onBillingChange(rest);
    }
  };

  const rowCard = (a: AddonProduct) => {
    const selected = selectedIds.includes(a.productId);
    // The selector only appears where the host journey records the choice (onBillingChange); elsewhere the catalogue default is what is priced.
    const options = onBillingChange ? (a.billingOptions ?? []) : [];
    const billing = selectedBilling[a.productId] ?? a.billingFrequency ?? options[0]?.frequency;
    const chooseBilling = (frequency: AddonBillingFrequency) => {
      if (!selected) onChange([...selectedIds, a.productId]);
      onBillingChange?.({ ...selectedBilling, [a.productId]: frequency });
    };
    return (
              <div
                key={a.productId}
                role={options.length > 1 ? undefined : 'button'}
                tabIndex={options.length > 1 ? undefined : 0}
                aria-pressed={options.length > 1 ? undefined : selected}
                onClick={options.length > 1 ? undefined : () => toggle(a.productId)}
                onKeyDown={(e) => {
                  if (options.length <= 1 && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggle(a.productId);
                  }
                }}
                className={`relative rounded-[var(--radius-card)] border transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${options.length > 1 ? '' : 'cursor-pointer'} ${
                  selected ? CARD_SELECTED : CARD_IDLE
                }`}
              >
                {selected && <SelectedTick />}
                <div className="flex min-h-28 items-center gap-3 p-4 sm:gap-5 sm:p-5">
                <span className="flex h-14 w-14 shrink-0 self-start items-center justify-center card text-fg shadow-[var(--shadow-icon-tile)]">
                  <Icon path={DATA_ICON} className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  {/* The Add-ons page names an add-on by what it gives ("2.5 GB full-speed data"); elsewhere the name leads and the description follows. */}
                  <p className="text-fg font-semibold text-[length:var(--fs-body-lg)] leading-snug">{useTabs ? a.description ?? a.name : a.name}</p>
                  {!useTabs && a.description && <p className="text-fg-2 text-[length:var(--fs-caption)]">{a.description}</p>}
                  {addonChargeType(a, source === 'prepaid' ? 'prepaid' : 'catalogue', billing) && <p className="mt-1 text-muted text-[length:var(--fs-caption)]">{addonChargeType(a, source === 'prepaid' ? 'prepaid' : 'catalogue', billing)}</p>}
                </div>
                <div className="min-w-0 max-w-[50%] shrink-0 text-right">
                  {addonPriceDisplay(a, billing) ? (
                    <>
                      <p className="text-fg text-[length:var(--fs-h4)] font-bold leading-none whitespace-nowrap">{addonPriceDisplay(a, billing)!.primary}</p>
                      {addonPriceDisplay(a, billing)!.secondary && <p className="mt-2 text-fg-2 text-[length:var(--fs-caption)] max-w-48 ml-auto leading-snug">{addonPriceDisplay(a, billing)!.secondary}</p>}
                    </>
                  ) : a.pricing === 'free' || (!a.pricing && a.mrcQAR === 0) ? (
                    <p className="text-fg text-[length:var(--fs-h4)] font-bold">Free</p>
                  ) : a.priceLabel && /QR\s*\d/.test(a.priceLabel) ? (
                    // Only wording that states a QAR amount ("QR 50 per additional SIM") is shown; open prices (TBC, Plan-based, Plan-dependent) are not displayed.
                    <p className="text-fg text-[length:var(--fs-body)] font-bold max-w-48">{a.priceLabel}</p>
                  ) : a.priceLabel ? null : (
                    <p className="text-fg">
                      <span className="text-[length:var(--fs-caption)]">QAR </span>
                      <span className="text-[length:var(--fs-h4)] font-bold">{formatAmount(a.mrcQAR)}</span>
                      <span className="text-fg-2 text-[length:var(--fs-caption)]">{source === 'prepaid' ? ' one-off' : ' /mo'}</span>
                    </p>
                  )}
                </div>
                </div>
                {options.length > 1 && (
                  <div className="border-t border-border-soft p-3">
                    <SegmentedTabs
                      label={`Billing frequency for ${a.description ?? a.name}`}
                      items={options.map((option) => ({
                        key: option.frequency,
                        label: `${option.frequency === 'weekly' ? 'Weekly' : option.frequency === 'monthly' ? 'Monthly' : 'One-Time'} · QAR ${formatAmount(option.priceQAR)}`,
                      }))}
                      active={billing}
                      onChange={chooseBilling}
                      className="w-full [&>button]:flex-1 [&>button]:justify-center"
                    />
                  </div>
                )}
              </div>
    );
  };

  return (
    // Heading and spacing match the "Eligible Discounts" section this now sits
    // above (2026-09-26). It was a muted caption at --fs-caption, which read as
    // a field label rather than as one of the step's three sections - so the
    // agent saw two headings and a label where there are three equal choices to
    // make. Same element, size and weight as its sibling; the "(optional)"
    // stays because it is the one thing that distinguishes this section from
    // the other two, both of which require an answer.
    <div className="space-y-4">
      {!hideHeader && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 text-left"
        >
          <Icon path={CHEVRON_RIGHT} className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
          <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">
            Add-ons{selectedIds.length > 0 ? ` (${selectedIds.length} selected)` : ' (optional)'}
          </h3>
        </button>
      )}
      {useTabs && (
        <div className="space-y-3">
          {/* The category (navigation) - the underline tabs, with how many of the chosen add-ons each holds. */}
          <TabStrip
            label="Add-On Categories"
            items={ADDON_CATEGORIES.map((c) => ({ key: c, label: c, count: perCategory[c] > 0 ? perCategory[c] : undefined }))}
            active={category}
            onChange={(c) => {
              setCategory(c);
              setSearch('');
            }}
          />
          <SearchField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder={`Search ${category} add-ons by name or price`}
            aria-label={`Search ${category} add-ons`}
          />
        </div>
      )}
      {/* Add-on cards share the plan cards' standard (shared idle / selected states, selected texture, tick).
          Multi-select: each card toggles only itself, so choosing one never clears another. */}
      {useTabs ? (
        paid.length === 0 && free.length === 0 ? (
          <EmptyState
            icon={LAYERS_ICON}
            title={q ? `No ${category.toLocaleLowerCase()} add-ons match your search` : `No ${category.toLocaleLowerCase()} add-ons available`}
            message={q ? (
              `Try another name or price. Other categories and your selected add-ons are unchanged.`
            ) : (
              <>
                <span className="block">There are no priced, eligible add-ons available in this category.</span>
                <span className="block">Unpriced, ineligible and discontinued offers are excluded.</span>
                <span className="mt-3 block text-[length:var(--fs-caption)]">Other categories and your selected add-ons are unchanged.</span>
              </>
            )}
            className="min-h-80 border-y border-border-soft"
          />
        ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {([['PAID ADD-ONS', paid, 'paid'], ['COMPLIMENTARY', free, 'free']] as const).map(([title, list, kind]) => (
            <section key={kind} aria-label={title} className="space-y-4 min-w-0">
              <div className={`flex items-center gap-2 text-[length:var(--fs-caption-upper)] font-semibold uppercase tracking-wide ${kind === 'free' ? 'text-[var(--success)]' : 'text-fg-2'}`}>
                <h4>{title}</h4>
                <span className={`inline-flex min-w-6 items-center justify-center rounded-[var(--radius-pill)] px-2 py-0.5 text-[length:var(--fs-caption)] ${kind === 'free' ? 'bg-tone-success text-[var(--success)]' : 'bg-surface text-fg-2'}`}>
                  {list.length}
                </span>
              </div>
              {list.length === 0 ? <EmptyState compact message={q ? `No ${kind} add-ons in ${category} match that search.` : `No ${kind} add-ons in ${category}.`} /> : <div className="flex flex-col gap-4">{list.map((a) => rowCard(a))}</div>}
            </section>
          ))}
        </div>
        )
      ) : (
      <div className={layout === 'rows' ? `grid grid-cols-1 gap-3 md:grid-cols-2 ${open || hideHeader ? '' : 'hidden'}` : `grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] gap-4 ${open || hideHeader ? '' : 'hidden'}`}>
        {shown.map((a) => {
          const selected = selectedIds.includes(a.productId);
          if (layout === 'rows') return rowCard(a);
          return (
            <div
              key={a.productId}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => toggle(a.productId)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  toggle(a.productId);
                }
              }}
              className={`relative isolate flex flex-col gap-3 rounded-[var(--radius-card)] border p-5 cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                selected ? CARD_SELECTED : CARD_IDLE
              }`}
            >
              {selected && <SelectedCardTexture />}
              {selected && <SelectedTick />}
              <p className="text-fg font-bold text-[length:var(--fs-h5)] leading-snug">{a.name}</p>
              {a.description && <p className="text-fg-2 text-[length:var(--fs-caption)]">{a.description}</p>}
              <p className="text-accent mt-auto">
                <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
                <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(a.mrcQAR)}</span>
                <span className="text-fg-2 text-[length:var(--fs-caption)]">{source === 'prepaid' ? ' one-off' : ' /mo'}</span>
              </p>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
