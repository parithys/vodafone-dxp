import { addonChargeNowQar } from '../../engines/addonCategories';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { discountsForCustomer, type CustomerBenefit } from '../../engines/customerBenefitEngine';
import { monthlyCharges } from '../../engines/postpaidPricing';
import { closestPlans, PLAN_GROUPS, SPECIAL_DISCOUNT_TYPE, discountsForSpecialType, specialDiscountToPreselect, isPlanOfferedTo, SPECIAL_OFFERS_TAB_LABEL, OFFERS_TAB_LIMIT, planGroupOf, matchesPlanType, midPricedPlan } from './postpaidPlanModel';
import type { PostpaidPlan, Discount, AddonProduct, PlanGroupKey, TabKey, PlanTypeFilter } from './postpaidPlanModel';

interface UsePostpaidPlanAddonsArgs {
  selectedProductId: string | undefined;
  discountId: string | undefined;
  onSelectDiscount: (discountId: string | undefined) => void;
  addonIds: string[];
  onAddonsChange: (ids: string[]) => void;
  /** Told which source the selected plan came from (OFFER / PLAN) and what an offer bundles, for the next step. */
  onSelectionChange?: (sel: { source: 'OFFER' | 'PLAN' | undefined; bundled: string[] }) => void;
  customerBenefit?: 'mada' | 'b2b2c' | 'retired' | 'none';
  /** The Special Discount chosen at Customer Verification; 'none' = Standard (or rejected): no Special Discount is offered. Omitted: the journey has no such choice. */
  specialDiscountType?: 'mada' | 'b2b2c' | 'retired' | 'none';
  customerBenefits?: CustomerBenefit[];
  /** The customer's nationality: a nationality promotion plan is offered only to its nationality (isPlanOfferedTo). */
  customerNationality?: string;
  /** A plan left out of the choices: the line's current plan, when the journey is changing it. */
  hiddenProductId?: string;
}

export function usePostpaidPlanAddons({
  selectedProductId,
  discountId,
  onSelectDiscount,
  addonIds,
  onAddonsChange,
  onSelectionChange,
  customerBenefit,
  specialDiscountType,
  customerBenefits,
  customerNationality,
  hiddenProductId,
}: UsePostpaidPlanAddonsArgs) {
  const [plans, setPlans] = useState<PostpaidPlan[]>([]);
  // Whether the catalogue has been read: an empty list before that is loading, not "no plans".
  const [plansLoaded, setPlansLoaded] = useState(false);
  const [addonProducts, setAddonProducts] = useState<AddonProduct[]>([]);
  const [planDiscounts, setPlanDiscounts] = useState<Discount[]>([]);
  // Of the three special types only the one chosen at Customer Verification is offered (a customer holds one).
  const discounts = useMemo(
    () => discountsForSpecialType(discountsForCustomer(planDiscounts, customerBenefits, customerBenefit && customerBenefit !== 'none' ? customerBenefit : undefined), specialDiscountType),
    [planDiscounts, customerBenefits, customerBenefit, specialDiscountType]
  );
  // The plan whose details are open, or null. Holds the plan OBJECT rather
  // than an id, so the drawer cannot render a heading for one plan and
  // figures for another.
  const [detailPlan, setDetailPlan] = useState<PostpaidPlan | null>(null);
  const [planSearch, setPlanSearch] = useState('');
  // Type-ahead suggestions dropdown (2026-09-28), separate from the substring
  // filter below - see CompanySearchInput.tsx for the same combobox shape
  // (click-outside close, listbox/option roles).
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTabState] = useState<TabKey>('specials');
  // The plan-type filter belongs to the tab being shown: switching tab starts again at All Plans.
  const [planTypeFilter, setPlanTypeFilter] = useState<PlanTypeFilter>('all');
  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    setPlanTypeFilter('all');
  };
  // Set once, the moment the catalogue first has something in it - not on
  // every load, which would snap the agent back to the first tab if the
  // catalogue ever refetched while they were on "Add-ons". Guards against
  // landing on an empty "Today's Special Promotions" tab when nothing in the
  // catalogue happens to be flagged popular.
  const defaultTabSet = useRef(false);

  // Name OR price. The price side matches the raw number anywhere in the
  // figure, so "35" finds 350 - narrowing as the agent types rather than
  // requiring the exact charge.
  const visiblePlans = plans.filter((p) => {
    if (!matchesPlanType(p, planTypeFilter)) return false;
    const q = planSearch.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || String(p.mrcQAR).includes(q);
  });
  // Tabs themselves are stable while the agent types a search - built from
  // the FULL catalogue, not the filtered one, so a query that empties the
  // active tab's matches doesn't also make its own tab disappear out from
  // under it. Each tab's CONTENT still reads the filtered list below.
  // The Special Discount selected on Customer Verification adds a third tab listing only the plans that discount applies to.
  const special = specialDiscountType && specialDiscountType !== 'none' ? SPECIAL_DISCOUNT_TYPE[specialDiscountType] : undefined;
  // planDiscounts holds only the SELECTED plan's discounts, so the tab reads the whole catalogue of this discount type.
  const [specialDiscountRows, setSpecialDiscountRows] = useState<Discount[]>([]);
  // Whether the special-discount rows have been read (true at once when the customer holds no Special Discount): the opening tab waits for it.
  const [specialRowsLoaded, setSpecialRowsLoaded] = useState(false);
  useEffect(() => {
    if (!special) {
      setSpecialDiscountRows([]);
      setSpecialRowsLoaded(true);
      return;
    }
    let cancelled = false;
    setSpecialRowsLoaded(false);
    void mockDataEngine.list<Discount>('addons-discounts').then((all) => {
      if (cancelled) return;
      setSpecialDiscountRows(all.filter((d) => d.category === 'Discount' && d.addonType === special.addonType));
      setSpecialRowsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [special]);
  // The plans a Special Discount can actually be taken on: an Offers-tab plan is pre-bundled (its discounts are locked), so it is not listed here; nor is a Family Plan.
  const specialPlanIds = useMemo(
    () => new Set(specialDiscountRows.filter((d) => { const plan = plans.find((p) => p.productId === d.planId); return plan && planGroupOf(plan) !== 'specials' && plan.planClass !== 'Postpaid Family Plans'; }).map((d) => d.planId)),
    [specialDiscountRows, plans]
  );
  const hasSpecialTab = Boolean(special) && plans.some((p) => specialPlanIds.has(p.productId));
  const planGroupTabs = [
    ...PLAN_GROUPS.filter((g) => plans.some((p) => planGroupOf(p) === g.key)),
    ...(hasSpecialTab && special ? [{ key: 'special' as PlanGroupKey, label: SPECIAL_OFFERS_TAB_LABEL }] : []),
  ];
  const groupPlans = (key: PlanGroupKey) => {
    const inGroup = (p: PostpaidPlan) => (key === 'special' ? specialPlanIds.has(p.productId) : planGroupOf(p) === key);
    const list = visiblePlans.filter(inGroup);
    if (key === 'for-you' || key === 'special') {
      // Standard Plans and Special Offers: the mid-priced plan of the whole tab (not of what a search or filter leaves) is marked Popular and listed first;
      // no other plan on these tabs carries the badge. Copies, so the catalogue's own flags (which decide the Offers tab) are untouched.
      const mid = midPricedPlan(plans.filter(inGroup));
      const marked = list.map((p) => ({ ...p, popular: p.productId === mid?.productId }));
      return [...marked.filter((p) => p.popular), ...marked.filter((p) => !p.popular)];
    }
    return key === 'specials' ? list.slice(0, OFFERS_TAB_LIMIT) : list;
  };
  // The selection was withdrawn while its tab was open: fall back to Offers.
  useEffect(() => {
    if (activeTab === 'special' && !hasSpecialTab) setActiveTab('specials');
  }, [activeTab, hasSpecialTab]);

  // The opening tab: Special Offers for a customer whose Special Discount (Consumer B2B2C, Retiree or MADA) is validated - its details given and
  // its supporting document scanned and accepted, which is what makes `specialDiscountType` a type at all - otherwise Offers.
  useEffect(() => {
    if (defaultTabSet.current || plans.length === 0) return;
    if (special && !specialRowsLoaded) return;
    defaultTabSet.current = true;
    if (hasSpecialTab) {
      setActiveTab('special');
      return;
    }
    const firstNonEmpty = PLAN_GROUPS.find((g) => plans.some((p) => planGroupOf(p) === g.key));
    if (firstNonEmpty) setActiveTab(firstNonEmpty.key);
  }, [plans, special, specialRowsLoaded, hasSpecialTab]);

  // The search belongs to the tab being shown: its suggestions come from that tab's plans only, never the other tabs'.
  const tabPlans = plans.filter((p) => matchesPlanType(p, planTypeFilter)).filter((p) => (activeTab === 'special' ? specialPlanIds.has(p.productId) : planGroupOf(p) === activeTab)).slice(0, activeTab === 'specials' ? OFFERS_TAB_LIMIT : undefined);
  const suggestions = closestPlans(planSearch, tabPlans);

  useEffect(() => {
    if (!searchOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    mockDataEngine.list<PostpaidPlan & AddonProduct>('products').then((all) => {
      setPlans(all.filter((p) => p.type === 'Postpaid Plan' && p.listed !== false && p.productId !== hiddenProductId && isPlanOfferedTo(p, customerNationality)).sort((a, b) => a.mrcQAR - b.mrcQAR));
      setAddonProducts(all.filter((p) => p.type === 'Add-on'));
      setPlansLoaded(true);
    });
  }, [hiddenProductId, customerNationality]);

  // Discounts are loaded for the selected plan only; a failed load can be retried and never blocks the step.
  const [discountsState, setDiscountsState] = useState<'loading' | 'error' | 'ready'>('ready');
  const [discountsAttempt, setDiscountsAttempt] = useState(0);
  useEffect(() => {
    if (!selectedProductId) {
      setPlanDiscounts([]);
      return;
    }
    let cancelled = false;
    setDiscountsState('loading');
    mockDataEngine
      .list<Discount>('addons-discounts')
      .then((all) => {
        if (cancelled) return;
        setPlanDiscounts(all.filter((d) => d.category === 'Discount' && d.planId === selectedProductId));
        setDiscountsState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setPlanDiscounts([]);
        setDiscountsState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProductId, discountsAttempt]);
  const retryDiscounts = () => setDiscountsAttempt((n) => n + 1);
  // A discount chosen earlier that this customer is no longer offered (the Special Discount type changed, or Standard was chosen) is dropped: it never
  // survives as a hidden 25% on the order. Only once this plan's discounts have loaded, so a resumed draft is not cleared while they load.
  useEffect(() => {
    if (!discountId || discountsState !== 'ready' || planDiscounts.length === 0) return;
    if (!discounts.some((d) => d.addonDiscountId === discountId)) onSelectDiscount(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId, discounts, discountsState, planDiscounts]);

  const selectedPlan = plans.find((p) => p.productId === selectedProductId);
  // "Offers" is the specials group (2026-09-30 rule): every plan there is
  // pre-bundled, so it gets the same add-ons/discounts lockout a plan
  // individually flagged `preBundledOffer` already got - see the two panels
  // below. Derived from the group rather than a second per-plan flag: the
  // business rule is "this WHOLE TAB is pre-bundled", not "some plans in it
  // are", and planGroupOf is already the one place that decides tab
  // membership.
  const isOffersPlan = selectedPlan ? planGroupOf(selectedPlan) === 'specials' : false;
  const preBundled = Boolean(selectedPlan?.preBundledOffer) || isOffersPlan;
  // Where the plan was chosen from: an Offer (add-ons and discounts bundled, read-only) or a standalone Plan (optional extras).
  const selectionSource: 'OFFER' | 'PLAN' | undefined = selectedPlan ? (preBundled ? 'OFFER' : 'PLAN') : undefined;
  const bundledItems = useMemo(() => (selectionSource === 'OFFER' ? selectedPlan?.benefits ?? [] : []), [selectionSource, selectedPlan]);
  const bundledKey = bundledItems.join('|');
  useEffect(() => {
    onSelectionChange?.({ source: selectionSource, bundled: bundledItems });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionSource, selectedProductId, bundledKey]);
  const selectedDiscount = discounts.find((d) => d.addonDiscountId === discountId);
  // Accepted benefit -> its discount on the chosen plan, applied once (the agent
  // can still change it afterwards). Retired: ADO-7114..7117 (demo catalogue entries, see their _note).
  const benefitType = customerBenefit === 'mada' ? 'MADA Discount' : customerBenefit === 'b2b2c' ? 'B2B2C Discount' : customerBenefit === 'retired' ? 'Retired Discount' : undefined;
  const benefitAppliedFor = useRef<string | undefined>(undefined);
  useEffect(() => {
    // Selected by itself only for a plan chosen on Special Offers; on Standard Plans the choice starts at No Discount (Add Discount offers the rest).
    if (!benefitType || discountId || !selectedProductId || discountsState !== 'ready' || activeTab !== 'special') return;
    // Once per plan AND type: choosing "No discount" afterwards sticks, but a changed Special Discount type is selected afresh.
    const key = `${selectedProductId}|${customerBenefit}`;
    if (benefitAppliedFor.current === key) return;
    // Only this plan's own discounts: while a newly chosen plan's discounts load, the list still holds the previous plan's, and selecting
    // from it would be dropped again once the right ones arrive - leaving the Special Discount unselected for good.
    const match = specialDiscountToPreselect(discounts.filter((d) => d.planId === selectedProductId), customerBenefit);
    if (match) {
      benefitAppliedFor.current = key;
      onSelectDiscount(match.addonDiscountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitType, customerBenefit, selectedProductId, discounts, discountId, discountsState, activeTab]);

  // Max ONE discount, and it is scoped to the plan it was picked against
  // (Discount.planId) - so a plan change retires whatever discount the
  // PREVIOUS plan had, rather than leaving a stale id in the order that no
  // longer names a discount on the current plan at all (Checkout/the order
  // payload read `discountId` directly, so an orphaned one would silently
  // ride along with the new plan). The radio group already guarantees at
  // most one discount for a GIVEN plan; this is what still guarantees it
  // across a plan switch. Keyed on the previous product id, not just "did a
  // discount exist", so it fires only on an actual plan change, not on
  // mount.
  const prevProductId = useRef(selectedProductId);
  useEffect(() => {
    if (prevProductId.current !== selectedProductId) {
      prevProductId.current = selectedProductId;
      // Selections belong to the plan they were made on: a new plan starts clean (silently - no message is shown).
      if (discountId) onSelectDiscount(undefined);
      if (addonIds.length > 0) onAddonsChange([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  const selectedAddons = addonProducts.filter((a) => addonIds.includes(a.productId));
  const addonsMonthlyQar = selectedAddons.reduce((sum, a) => sum + addonChargeNowQar(a), 0);
  // One itemisation, shared with Checkout and with the order payload - see
  // engines/postpaidPricing.ts for why that is a module and not three copies.
  // No device instalment here: this step has not reached Device & DOI yet, so
  // the figure it shows is the service subtotal, and Checkout adds the
  // instalment once there is one.
  const charges = selectedPlan
    ? monthlyCharges({
        planQar: selectedPlan.mrcQAR,
        discountRate: selectedDiscount?.price,
        addonsQar: addonsMonthlyQar,
      })
    : undefined;

  return {
    plansLoaded,
    plans,
    discounts,
    detailPlan,
    setDetailPlan,
    planSearch,
    setPlanSearch,
    searchOpen,
    setSearchOpen,
    searchRef,
    activeTab,
    setActiveTab,
    planTypeFilter,
    setPlanTypeFilter,
    planGroupTabs,
    groupPlans,
    suggestions,
    selectedPlan,
    preBundled,
    selectionSource,
    bundledItems,
    selectedAddons,
    discountsState,
    retryDiscounts,
    selectedDiscount,
    charges,
  };
}
