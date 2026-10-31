import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { Button } from '../../../components/primitives/Button';
import type { Product } from '../newConnectionModel';
import { AddonReview } from './AddonReview';

export function addonReviewStep(
  products: Product[],
  canEdit: (values: Record<string, unknown>) => boolean
): WizardStep {
  return {
    key: 'addonReview',
    label: 'Add-On Review',
    heading: 'Review Add-Ons',
    subheading: 'Verify billing frequencies, recurring charges and bill-limit impact before customer confirmation.',
    render: ({ values, goToStepKey }) => (
      <AddonReview
        products={products}
        values={values}
        onEdit={canEdit(values) ? () => goToStepKey('planExtras') : undefined}
      />
    ),
    primaryAction: ({ goNext }) => (
      <Button variant="primary" onClick={goNext}>
        Continue to Customer Confirmation
      </Button>
    ),
  };
}
