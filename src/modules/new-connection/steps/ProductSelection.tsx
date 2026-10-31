import { CARD_IDLE, CARD_SELECTED, SelectedTick, CrossSalesStep, journeyLabel } from '../../../capabilities';
import type { CrossSalesValue, GuidedContactValue, Offer } from '../../../capabilities';
import { useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import type { EntityKind } from '../../../engines/mockDataEngine';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import { Radio } from '../../../components/primitives/Radio';
import { Icon } from '../../../components/primitives/Icon';
import { clearAndQuiet, selectProduct } from './productChoice';
import { ProductEligibility } from './ProductEligibility';
import { StartCards } from './StartCards';
import { HOME_PRODUCTS, IN_JOURNEY_OFFERS, PRODUCTS, PRODUCT_OF_OFFER_JOURNEY, homeProductOfOffer, mnpTypeOfOffer } from '../products';
import type { HomeProduct, MnpType, ConnectionProduct } from '../products';
import type { ConnectionJourney } from '../newConnectionModel';


/** What the product step needs from the journey. */
export interface ProductStepContext {
  wizardId: string;
  /** 'connection' (New Connection) or 'home' (New Home Connection): which products Product Selection offers. */
  journey: ConnectionJourney;
  /** 'new' (Agent 360 / Mobile) or 'existing' (Customer 360) - how Customer Verification treated the customer. */
  flow: 'new' | 'existing';
  existingCustomerId: string | undefined;
  applyCrossSales: (setValue: (field: string, value: unknown) => void, v: CrossSalesValue) => void;
  navigate: NavigateFunction;
  createRecord: (kind: EntityKind, record: Record<string, unknown>) => Promise<void>;
}

// The icon tile of each home product card (the same card as the Installation Address service types).
export const HOME_PRODUCT_ICON: Record<HomeProduct, string> = {
  // Optical fibre: a cut cable inside a ring, its strands fanning out to nodes (drawn thin: see strokeWidth below).
  fibre:
    'M5.2 19.4A10.4 10.4 0 1 1 14.4 22.2M7.4 20l1.7-3.8 2.5 1.2 2.9-1.6 1.1 4.4M11.2 15.4Q8.8 13.4 8.4 9.6M11.7 15.2Q10.6 11.4 11 7.9M12.4 15.3Q13 11 14.5 8.2M13 15.7Q15.2 14 16.5 11M13.4 16.6Q16.2 16.5 17.1 14.3M7.3 8.5a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0M9.9 6.8a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0M13.8 7.2a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0M15.8 9.9a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0M16.4 13.2a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0',
  'fixed-line': 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  fwa: 'M12 20v-9M8 20h8M6.3 6.3a8 8 0 000 11.4M17.7 6.3a8 8 0 010 11.4M9 9a4 4 0 000 6M15 9a4 4 0 010 6',
  '5g-home': 'M3 11l9-8 9 8M5 10v10h14V10M9.5 20v-5.5h5V20',
};

/**
 * Product selection: the point in the one New Connection journey where the agent, with the customer already identified,
 * chooses what to sell. The customer's recommended offers (when there are any) sit above the four products; choosing a
 * product, or selecting an offer for one, continues in THIS wizard - there is no exit and no restart. The eligibility
 * checks that depend on the product (ID-type routing, collections, line cap) are judged here for the product chosen, and
 * a billing account is resolved here for the products that have one.
 */
export function ProductSelection({
  values,
  setValue,
  goNext,
  ctx,
  variant = 'cards',
}: {
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  /** Moves the wizard on one step (the one its own Continue calls). */
  goNext: () => void;
  ctx: ProductStepContext;
  /** 'buttons': the mobile page, whose products are the footer buttons (New Fixed Line, New MNP, New Prepaid, New Postpaid). 'cards': the home product cards. */
  variant?: 'cards' | 'buttons' | 'launch';
}) {
  const product = values.product as ConnectionProduct | undefined;
  const mnpType = values.mnpType as MnpType | undefined;
  const homeProduct = values.homeProduct as HomeProduct | undefined;
  const homeJourney = ctx.journey === 'home';
  const contact = values.contact as GuidedContactValue | undefined;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const crossSales = values.crossSales as CrossSalesValue | undefined;

  // 'launch': a new customer has no cross-sales offer, so there is no Recommended Offers page - the five ways to start are the page itself, as cards.
  const launch = variant === 'launch';
  const buttons = variant === 'buttons' || launch;
  // A product chosen by a footer button (or named by the entry point) moves on by itself once its eligibility is judged and
  // quiet. The flag is cleared as it fires, so coming Back to this page later never skips it again.
  const advance = values.productPreselected === true && Boolean(product) && clearAndQuiet(values, { requireHomeKind: homeJourney });
  useEffect(() => {
    if (!advance || new URLSearchParams(window.location.search).get('mirror') === '1') return;
    setValue('productPreselected', false);
    goNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advance]);
  // The mobile page moves on by itself once the product (and its kind) is chosen; the home cards wait for Continue.
  const chooseProduct = (next: ConnectionProduct, nextMnpType?: MnpType, nextHome?: HomeProduct) => {
    selectProduct(ctx, values, setValue, next, { mnpType: nextMnpType, homeProduct: nextHome, advance: buttons });
  };

  const onOfferChange = (v: CrossSalesValue) => {
    const target = v.decision === 'accepted' ? PRODUCT_OF_OFFER_JOURNEY[v.journey as never] : undefined;
    if (target) chooseProduct(target, mnpTypeOfOffer(v.journey), homeProductOfOffer(v.journey));
    ctx.applyCrossSales(setValue, v);
  };

  return (
    <div className="space-y-8">
      {/* The billing account the product needs is selected or created by its Billing Profile step (billingAccountStep.headless). */}

      {/* Recommended offers belong to New Connection; New Home Connection goes straight to the home products. */}
      {launch && <StartCards values={values} setValue={setValue} goNext={goNext} ctx={ctx} choose={chooseProduct} />}

      {!homeJourney && !launch && (
        <CrossSalesStep
          customerId={eligibility?.customerId}
          value={crossSales ?? {}}
          onChange={onOfferChange}
          onHandOff={(route) => ctx.navigate(route)}
          journey={IN_JOURNEY_OFFERS}
          // An existing customer sees every offer type, topped up with sample offers; a new customer sees only what they have.
          showAllOfferTypes={eligibility?.isExistingCustomer === true}
          onInterestedOffer={async (offer: Offer) => {
            const leadId = `LEAD-${Date.now().toString().slice(-6)}`;
            await ctx.createRecord('leads', {
              leadId,
              serviceNeeded: journeyLabel(offer.serviceJourney) ?? 'Mobile',
              status: 'New',
              ownerId: useAuthStore.getState().profile?.userId ?? null,
              createdVia: 'New Connection - Cross Sales Offer',
              offerId: offer.offerId,
              offerName: offer.offerName,
              customerId: eligibility?.customerId,
              mobileNumber: contact?.moiResult?.phone,
            });
            useNotificationStore.getState().pushToast('success', `Lead ${leadId} has been created`, { key: `lead-${leadId}` });
          }}
        />
      )}

      <section aria-labelledby="product-choice" className="space-y-3">
        {!buttons && (
          <>
          <h3 id="product-choice" className="text-fg font-bold text-[length:var(--fs-h5)]">
            {homeJourney ? 'Which connection does the customer want?' : 'What does the customer want?'}
          </h3>
          {homeJourney ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,11rem),1fr))] gap-3" role="radiogroup" aria-labelledby="product-choice">
              {HOME_PRODUCTS.map((p) => {
                const selected = product === 'fixed-line' && homeProduct === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    title={p.description}
                    onClick={() => chooseProduct('fixed-line', undefined, p.key)}
                    className={`relative flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 ${
                      selected
                        ? `${CARD_SELECTED} text-[var(--field-card-selected)]`
                        : 'border-[var(--field-card-border)] bg-bg text-fg hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]'
                    }`}
                  >
                    {selected && <SelectedTick />}
                    <span className={`inline-flex p-2 rounded-[var(--radius-card)] ${selected ? 'bg-[var(--field-card-selected)] text-on-dark' : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'}`}>
                      <Icon path={HOME_PRODUCT_ICON[p.key]} className="w-6 h-6" strokeWidth={p.key === 'fibre' ? 1.4 : undefined} />
                    </span>
                    <span className="text-[length:var(--fs-caption)] font-medium text-center">{p.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div role="radiogroup" aria-labelledby="product-choice" className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
              {PRODUCTS.map((p) => {
                const selected = product === p.key;
                return (
                  <label key={p.key} className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 cursor-pointer ${selected ? CARD_SELECTED : CARD_IDLE}`}>
                    <Radio name="new-connection-product" className="mt-1" checked={selected} onChange={() => chooseProduct(p.key, p.key === 'mnp' ? (mnpType ?? 'postpaid') : undefined, p.key === 'fixed-line' ? homeProduct : undefined)} />
                    <span>
                      <span className="block text-fg font-medium">{p.label}</span>
                      <span className="block text-fg-2 text-[length:var(--fs-caption)]">{p.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          </>
        )}
      </section>

      {/* What depends on the product: its eligibility rules, judged for the product chosen. Silent on a clean pass. */}
      {/* The eligibility outcomes (collections, line limits, approval routing) are the agent's: not part of the customer's pop-up. */}
      <div className="agent-only">
        <ProductEligibility
          values={values}
          setValue={setValue}
          flow={ctx.flow}
          existingCustomerId={ctx.existingCustomerId}
          onSwitchToPrepaid={product === 'prepaid' || product === 'fixed-line' ? undefined : () => chooseProduct('prepaid')}
        />
      </div>
    </div>
  );
}
