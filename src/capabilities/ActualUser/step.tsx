import { ACTUAL_USER_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { ActualUser } from './ActualUser';
import { isActualUserValid } from './actualUserModel';
import type { ActualUserValue } from './actualUserModel';
import { actualUserSummary } from './summary';

/** Who will use the line, stored under `actualUser`. Continues when the primary customer uses it, or the actual user is fully identified. */
export function actualUserStep(opts: { primaryIdNumber?: (values: Record<string, unknown>) => string | undefined } = {}): WizardStep {
  const primaryCustomerId = (values: Record<string, unknown>) => (values.eligibility as { customerId?: string } | undefined)?.customerId;
  const primaryId = (values: Record<string, unknown>) =>
    opts.primaryIdNumber?.(values) ?? (values.contact as GuidedContactValue | undefined)?.idNumber;
  return {
    key: 'actualUser',
    summary: actualUserSummary,
    label: ACTUAL_USER_LABEL,
    render: ({ values, setValue }) => (
      <ActualUser value={(values.actualUser as ActualUserValue) ?? {}} onChange={(v) => setValue('actualUser', v)} primaryIdNumber={primaryId(values)} primaryCustomerId={primaryCustomerId(values)} />
    ),
    isValid: (values) => isActualUserValid(values.actualUser as ActualUserValue | undefined, primaryId(values)),
  };
}
