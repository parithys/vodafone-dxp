import { EligibilityGateStep, newIdentityOf } from '../../../capabilities';
import type { GuidedContactValue } from '../../../capabilities';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import { LAUNCH_CUSTOMER_KEY } from '../../../components/patterns/wizard/useJourneyStartResume';
import { connectionOf, eligibilityJourney } from '../products';

/** Passport BAU/Credit Control approvals (PB-*) come from the ID type, so they are announced at Customer Verification, not repeated here. */
const isPassportOnly = (ruleIds: string[] | undefined) => !!ruleIds?.length && ruleIds.every((id) => id.startsWith('PB-'));

/**
 * What depends on the product: its eligibility rules, judged for the product chosen (and, for MNP, the plan type it ports onto).
 * Silent on a clean pass. Shared by Product Selection and the MNP plan-type step, so both judge it the same way.
 */
export function ProductEligibility({
  values,
  setValue,
  flow,
  existingCustomerId,
  onSwitchToPrepaid,
  deferredApprovals = false,
}: {
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  flow: 'new' | 'existing';
  existingCustomerId: string | undefined;
  /** Offered when the product is not already prepaid; switches the order to prepaid. */
  onSwitchToPrepaid?: () => void;
  /** MNP learns the connection type only here, so Customer Verification could not announce the approvals that depend on it (the ID type's and the passport's): show them. */
  deferredApprovals?: boolean;
}) {
  const product = values.product as string | undefined;
  const contact = values.contact as GuidedContactValue | undefined;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  if (!product || !contact?.moiResult) return null;
  return (
    <EligibilityGateStep
      // A QID linked to an existing customer (through their Passport) is judged as that customer, on the QID presented.
      asNewCustomer={flow === 'new' && !values[LAUNCH_CUSTOMER_KEY] && !contact.moiResult?.linkedIdUpdate}
      linkedIdDocument={contact.moiResult?.linkedIdUpdate}
      asCustomerId={flow === 'existing' ? existingCustomerId : (values[LAUNCH_CUSTOMER_KEY] as string | undefined)}
      announcePass={false}
      // A customer the agent created is judged on what they entered, as at Customer Verification.
      newIdentity={newIdentityOf(contact)}
      idNumber={contact.idNumber}
      journeyType={eligibilityJourney(values)}
      connectionType={connectionOf(values)}
      scope="product"
      portIn={product === 'mnp'}
      // The customer's checks were shown at Customer Verification. Here only what this product changes: everything for Prepaid (it judges
      // ID type and line limit by its own rules), otherwise just what blocks the product, the port-in dues and the approval the line count asks for.
      showRow={eligibilityJourney(values) === 'prepaid' ? undefined : (row) => row.tone === 'hard-stop' || row.tone === 'soft-stop' || row.id === 'port-in-dues' || (row.id === 'active-lines' && row.tone === 'approval-routing' && (deferredApprovals || !isPassportOnly(row.approvalRuleIds))) || (deferredApprovals && row.id === 'id-type-routing' && row.tone === 'approval-routing')}
      result={eligibility}
      onResult={(r) => setValue('eligibility', r)}
      onSwitchToPrepaid={onSwitchToPrepaid}
    />
  );
}
