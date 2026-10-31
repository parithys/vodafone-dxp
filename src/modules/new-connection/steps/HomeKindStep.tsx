import { ChoiceCards } from '../../../components/primitives/ChoiceCards';
import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { HOME_PRODUCTS } from '../products';
import type { HomeProduct } from '../products';
import { HOME_PRODUCT_ICON } from './ProductSelection';
import type { ProductStepContext } from './ProductSelection';
import { selectHomeKind } from './productChoice';

/**
 * "Connection type": the first step of New Fixed Line in New Connection - Fibre, Fixed-Line, FWA or 5G Home. It is asked here, on its
 * own page, not on Recommended Offers. (New Home Connection chooses it with its product cards on Product Selection, so has no such step.)
 */
export function homeKindStep(ctx: ProductStepContext): WizardStep {
  return {
    key: 'homeKind',
    label: 'Connection Type',
    heading: 'Connection Type',
    summary: [{ key: 'homeKind', label: 'Connection Type', type: 'text', value: (v) => HOME_PRODUCTS.find((h) => h.key === v.homeProduct)?.label }],
    render: ({ values }) => (
      <ChoiceCards<HomeProduct>
        legend="Connection type"
        items={HOME_PRODUCTS.map((h) => ({ key: h.key, label: h.label.replace('New ', '').replace(' Connection', ''), icon: HOME_PRODUCT_ICON[h.key] }))}
        value={values.homeProduct as HomeProduct | undefined}
        onChange={(k) => selectHomeKind(ctx, values, k)}
      />
    ),
    isValid: (values) => Boolean(values.homeProduct),
  };
}
