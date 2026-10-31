import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { canUseFeature } from '../../../engines/personaEngine';
import { usePersonaStore } from '../../../stores/personaStore';
import { HOME_CONNECTION_FEATURE, canStartProduct } from '../productAccess';
import { NewJourneyButtons, SERVICE_JOURNEYS, crossSalesSummary } from '../../../capabilities';
import { Button } from '../../../components/primitives/Button';
import { ProductSelection } from './ProductSelection';
import type { ProductStepContext } from './ProductSelection';
import { handOverToHomeConnection, productEligibilityClear, selectProduct } from './productChoice';
export { productEligibilityClear } from './productChoice';
import { PRODUCT_OF_OFFER_JOURNEY, homeProductLabel, mnpTypeOfOffer, productLabel } from '../products';
import type { ConnectionProduct, HomeProduct } from '../products';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';

/** A customer who is known to be new has no cross-sales offers: their first page is the five ways to start, not Recommended Offers. */
export const hasNoCrossSalesOffer = (values: Record<string, unknown>): boolean => (values.eligibility as EligibilityResult | undefined)?.isExistingCustomer === false;

import { homeConnectionRoute } from './homeConnectionRoute';

const productSummary = [
  { key: 'product', label: 'Product', type: 'text' as const, value: (v: Record<string, unknown>) => (v.product === 'fixed-line' && v.homeProduct ? homeProductLabel(v.homeProduct as HomeProduct) : productLabel(v.product as ConnectionProduct | undefined)) },
];

/**
 * Product selection, the second step of both journeys (see ProductSelection). Continue needs a product and its eligibility
 * judged and clear. Choosing a product with a footer button, or arriving through an entry point that already names it, sets
 * `productPreselected`: the page then moves on by itself once that eligibility is clear and quiet (once - the flag is cleared),
 * and stays when it is not, so whatever needs the agent's decision is on screen; Back always returns to it.
 *
 * New Connection keeps its original page: "Recommended offers", with the four product buttons in the footer (New Fixed Line,
 * New MNP, New Prepaid, New Postpaid). The buttons are unchanged; choosing one continues in THIS wizard rather than leaving
 * it. New Home Connection shows its four home products as cards.
 */
export function productStep(ctx: ProductStepContext): WizardStep {
  if (ctx.journey === 'home') {
    return {
      // Not `product`: that key is New Connection's Recommended Offers page, the one with Customer view (customerViewPolicy.ts).
      key: 'productSelection',
      label: 'Product Selection',
      heading: 'Product Selection',
      subheading: 'Choose the product the customer wants; the journey continues from here.',
      summary: productSummary,
      render: ({ values, setValue, goNext }) => <ProductSelection values={values} setValue={setValue} goNext={goNext} ctx={ctx} />,
      isValid: (values) => Boolean(values.product) && productEligibilityClear(values, { requireHomeKind: true }),
    };
  }
  return {
    key: 'product',
    skip: hasNoCrossSalesOffer,
    label: 'Recommended Offers',
    heading: 'Recommended Offers',
    subheading: 'Personalised using the customer’s profile and eligibility.',
    summary: [...crossSalesSummary, ...productSummary],
    render: ({ values, setValue, goNext }) => <ProductSelection values={values} setValue={setValue} goNext={goNext} ctx={ctx} variant="buttons" />,
    isValid: (values) => Boolean(values.product) && productEligibilityClear(values),
    // The footer is the product choice: one button per product, New Postpaid the primary. Each continues in this wizard.
    primaryAction: ({ values, setValue, goNext }) => {
      const personaId = usePersonaStore.getState().activePersonaId;
      const choose = (product: ConnectionProduct) => {
        // The same product again, with its eligibility already judged: go on (the agent has seen what the step reported).
        if (values.product === product && productEligibilityClear(values)) {
          setValue('productPreselected', false);
          goNext();
          return;
        }
        selectProduct(ctx, values, setValue, product, { advance: true });
      };
      return (
        <div className="flex items-center gap-3">
          {canUseFeature(personaId, HOME_CONNECTION_FEATURE) && (
            <Button variant="secondary" onClick={() => handOverToHomeConnection(ctx, values, homeConnectionRoute(ctx))}>
              New Home Connection
            </Button>
          )}
          <NewJourneyButtons
            // Only the products this role holds a grant for (the journey's own, Postpaid, always stays).
            allowed={(j) => {
              const product = PRODUCT_OF_OFFER_JOURNEY[j];
              return product ? canStartProduct(personaId, product) : true;
            }}
            onDecline={() => choose('postpaid')}
            // The button's own `goNext` runs one render after onDecline; the step moves on by itself once eligibility is judged.
            goNext={() => {}}
            onHandOff={(route) => {
              // The buttons name a service journey by its route; here that route is just the product it stands for.
              const journey = SERVICE_JOURNEYS.find((j) => j.route === route)?.key;
              const target = journey ? PRODUCT_OF_OFFER_JOURNEY[journey] : undefined;
              if (target) choose(target);
              else if (journey && mnpTypeOfOffer(journey)) choose('mnp');
            }}
          />
        </div>
      );
    },
  };
}

/** The first page for a new customer (no cross-sales offer): the five ways to start as cards. Replaces Recommended Offers for them. */
export function productCardsStep(ctx: ProductStepContext): WizardStep {
  return {
    key: 'productCards',
    skip: (values) => !hasNoCrossSalesOffer(values),
    label: 'Offers & Plans',
    heading: 'Offers & Plans',
    subheading: 'Select the applicable activation journey to view the relevant plans and offers.',
    // No Journey Summary entry: this page only starts the journey, and the plan step that follows carries the name "Offers & Plans".
    render: ({ values, setValue, goNext }) => <ProductSelection values={values} setValue={setValue} goNext={goNext} ctx={ctx} variant="launch" />,
    isValid: (values) => Boolean(values.product) && productEligibilityClear(values),
    // The cards are the choice: no Continue.
    primaryAction: () => <></>,
  };
}
