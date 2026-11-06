import { EmptyState } from '../primitives/EmptyState';
import { type CustomerBenefit } from '../../engines/customerBenefitEngine';
import { PlanSearchBox } from './PlanSearchBox';
import { PlanTabStrip } from './PlanTabStrip';
import { Select } from '../primitives/Select';
import { PLAN_TYPE_FILTERS } from './postpaidPlanModel';
import type { PlanTypeFilter } from './postpaidPlanModel';
import { PlanGroupPanel } from './PlanGroupPanel';
import { PlanDetailsDrawer } from './PlanDetailsDrawer';
import { usePostpaidPlans } from './usePostpaidPlans';


interface PostpaidPlanStepProps {
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
  /** Told which tab a plan was chosen from (Offers, Plans, Special Offers ...), so the journey can route by it. */
  onPlanTabChange?: (tab: string) => void;
  /** Clicking the already-selected plan card unselects it. Omit to make a chosen plan sticky. */
  onDeselectProduct?: () => void;
  discountId: string | undefined;
  onSelectDiscount: (discountId: string | undefined) => void;
  /** Told where the selected plan came from (OFFER / PLAN) and what an offer bundles. */
  onSelectionChange?: (sel: { source: 'OFFER' | 'PLAN' | undefined; bundled: string[] }) => void;
  /** The bill limit chosen on the Addons page, shown on the selected plan's card (read-only here: it is set on the Addons page). */
  billLimit?: number;
  /** Agent 360... no - Agent 360 doesn't apply here; this is BR-076's
   * eligibility-derived default (EligibilityGateStep), shown read-only so
   * the agent sees what limit this activation was pre-qualified against. */
  /** Benefit the agent accepted on Customer Verification (office ID confirmed): the plan's matching discount is applied automatically. */
  customerBenefit?: 'mada' | 'b2b2c' | 'retired' | 'none';
  /** The Special Discount chosen on Customer Verification (accepted or not): names the contextual third tab. */
  specialDiscountType?: 'mada' | 'b2b2c' | 'retired' | 'none';
  /** Benefits the customer's record lists (see customerBenefitEngine). Only discounts they unlock are offered; undefined = customer not known, nothing is filtered. */
  customerBenefits?: CustomerBenefit[];
  /** The customer's nationality: a nationality promotion plan is offered only to its nationality. */
  customerNationality?: string;
  /** A plan not offered: the line's current plan, when the journey changes it. */
  hiddenProductId?: string;
}

// "RED Plan" & "Eligible Discounts" - Mobile Postpaid's Plan & Add-ons step
// (SCR-156, reference 12-step flow position 5). Plan tiers use the evidenced
// "Postpaid Red <price> Promotion" naming family (field-inventory.md's
// Pre-to-Post guided-journey Plan step, stage-k-remining.md) rather than
// inventing a naming scheme - the specific price/data/speed values per tier
// aren't individually evidenced beyond that naming pattern, so they're
// representative demo catalogue entries like the rest of products.json.
// Discounts read the (previously unused) "Discount" category of
// addons-discounts.json, reusing the same Loyalty Discount concept/rate
// already evidenced there (ADO-7103) rather than inventing new discount
// types this app has no evidence for.
export function PostpaidPlanStep({
  selectedProductId,
  onSelectProduct,
  onPlanTabChange,
  onDeselectProduct,
  discountId,
  onSelectDiscount,
  onSelectionChange,
  billLimit,
  customerBenefit,
  specialDiscountType,
  customerBenefits,
  customerNationality,
  hiddenProductId,
}: PostpaidPlanStepProps) {
  const {
    plans,
    discounts,
    detailPlan,
    setDetailPlan,
    planSearch,
    setPlanSearch,
    searchOpen,
    setSearchOpen,
    searchRef,
    plansLoaded,
    activeTab,
    setActiveTab,
    planTypeFilter,
    setPlanTypeFilter,
    planGroupTabs,
    groupPlans,
    suggestions,
  } = usePostpaidPlans({
    selectedProductId,
    discountId,
    onSelectDiscount,
    onSelectionChange,
    customerBenefit,
    specialDiscountType,
    customerBenefits,
    customerNationality,
    hiddenProductId,
  });

  // Choosing a plan also records the tab it was chosen from.
  const selectPlan = (productId: string) => {
    onSelectProduct(productId);
    onPlanTabChange?.(activeTab);
  };
  return (
    <div className="space-y-6">
      {/* The HRN advance ("Please collect QAR ... from the customer") is shown once, on Customer Verification, and not repeated here. */}
      {/* Tabbed (2026-09-28 mockup): the plan groups (Offers, Standard Plans and, for a validated Special Discount, Special Offers) are the panels of ONE tab strip.
          Switching tabs never changes which plan is selected; it only changes which panel is showing. What is added to the plan is the Add-Ons capability's own
          page, the step after this one. */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          plansLoaded ? <EmptyState compact message="No postpaid plans are available right now." /> : <p className="text-muted" role="status">Loading plans…</p>
        ) : (
          <>
            {/* Tab strip - same active-tab treatment (red text + underline)
                MsisdnPicker's Free/Star/Reserved tabs already use, so the one
                tabbed control pattern in this app looks the same everywhere
                it appears. Count badges show how many plans each group holds. */}
            <PlanTabStrip
              planGroupTabs={planGroupTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Search by plan NAME or PRICE (2026-09-27), under the tabs and scoped to whichever plan-group tab is active: it narrows that tab's
                cards, and the type-ahead dropdown suggests that tab's plans only. Beside it, the plan-type filter (All Plans, Voice Plan or
                Broadband Plan), which starts at All Plans on each tab. */}
            {activeTab !== 'specials' && (
            <div className="row-start">
              <div className="min-w-0 flex-1">
                <PlanSearchBox
                    searchRef={searchRef}
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    planSearch={planSearch}
                    setPlanSearch={setPlanSearch}
                    suggestions={suggestions}
                    selectedProductId={selectedProductId}
                    onSelectProduct={selectPlan}
                    scopeLabel={planGroupTabs.find((g) => g.key === activeTab)?.label}
                    onPickResult={(plan) => {
                      // A result is always on the tab being shown: select it, clear the filter and bring its card into view.
                      selectPlan(plan.productId);
                      setPlanSearch('');
                      setSearchOpen(false);
                      window.setTimeout(() => {
                        const el = document.getElementById(`plan-card-${plan.productId}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el?.classList.add('ring-4', 'ring-accent-border');
                        window.setTimeout(() => el?.classList.remove('ring-4', 'ring-accent-border'), 1800);
                      }, 80);
                    }}
                  />
              </div>
              <div className="w-56 shrink-0">
                <Select
                  aria-label="Plan Type"
                  options={PLAN_TYPE_FILTERS.map((f) => ({ value: f.key, label: f.label }))}
                  value={planTypeFilter}
                  onChange={(e) => setPlanTypeFilter(e.target.value as PlanTypeFilter)}
                />
              </div>
            </div>
            )}

            {/* Plan-group panel */}
            {planGroupTabs.some((g) => g.key === activeTab) && (
              <PlanGroupPanel
                groupPlans={groupPlans}
                activeTab={activeTab}
                selectedProductId={selectedProductId}
                billLimit={billLimit}
                onSelectProduct={selectPlan}
                onDeselectProduct={onDeselectProduct}
                setDetailPlan={setDetailPlan}
                specialDiscountType={specialDiscountType}
                discountPct={Math.abs(discounts.find((d) => d.addonDiscountId === discountId)?.price ?? 0)}
              />
            )}

          </>
        )}
      </div>


      {/* Plan details, on demand. A drawer rather than a modal: it is reference
          material read while choosing, so it slides in beside the list instead
          of covering it and forcing a dismissal to compare the next tier.
          
          Everything in it is real catalogue data. commitmentMonths in
          particular is on every seeded plan and was displayed nowhere - the
          cards show data/voice/speed only, so the contract term the customer is
          signing up to was the one figure an agent could not see. */}
      <PlanDetailsDrawer detailPlan={detailPlan} onClose={() => setDetailPlan(null)} selectedProductId={selectedProductId} onSelectProduct={selectPlan} showPlanDetails={activeTab === 'specials'} />
    </div>
  );
}
