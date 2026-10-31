import { donorDetailsValid } from '../../../components/patterns/DonorDetailsStep';
import type { DonorDetailsValue } from '../../../components/patterns/DonorDetailsStep';
import { mnpFormSigned } from '../../../components/patterns/DonorAttachmentStep';
import type { DonorAttachmentValue } from '../../../components/patterns/DonorAttachmentStep';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { BillingAccountValue } from '../../../components/patterns/billingAccountModel';
import type { WinCashPaymentValue } from '../../../components/patterns/WinCashPaymentStep';
import { isCafValid, type CafValue } from '../../../capabilities';
import { hasBillingAccount } from '../../new-connection/products';
import { contactOf, mnpFormInputOf } from './mnpFormInput';

/** One line of the validation gate: what was checked, and whether it is satisfied. */
export interface GateCheck {
  id: string;
  label: string;
  ok: boolean;
  /** What is wrong, when it is not ok. */
  detail?: string;
}

/**
 * BR-MNP-009 (Mandatory Validation Gate): "the system shall prevent progression to payment or order submission until all mandatory
 * customer, billing, SIM, MNP and product validations have been successfully completed."
 *
 *   'checkout'  what must hold before the order is presented for payment: customer, eligibility (including the dues check), billing
 *               profile (postpaid only, BR-MNP-005), plan, SIM, and the MNP number and donor details.
 *   'submit'    those, plus what the journey has collected since: the signed MNP Form and CAF (BR-MNP-010) and the payment, or the
 *               zero-value receipt (BR-MNP-011).
 */
export function mnpValidationGate(values: Record<string, unknown>, stage: 'checkout' | 'submit' = 'checkout'): GateCheck[] {
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const billing = values.billingAccount as BillingAccountValue | undefined;
  const checks: GateCheck[] = [
    {
      id: 'customer',
      label: 'Customer Identified and Verified',
      ok: Boolean(contactOf(values)?.moiResult),
      detail: 'Complete Customer Verification.',
    },
    {
      id: 'eligibility',
      label: 'Eligible for a Port-In',
      // Approval routing is not a failure (the order is routed once submitted); a hard or soft stop is.
      ok: Boolean(eligibility) && !eligibility!.hardStop && !eligibility!.softStop,
      detail: eligibility ? 'The customer is not eligible for this port-in; see the eligibility checks.' : 'Eligibility has not been checked.',
    },
    ...(hasBillingAccount(values)
      ? [{ id: 'billing', label: 'Billing Profile', ok: Boolean(billing?.selectedProfileId || (billing?.creatingNew && billing.newAccount)), detail: 'Choose or create a billing profile.' }]
      : []),
    { id: 'plan', label: 'Plan Selected', ok: Boolean(values.productId), detail: 'Choose a plan.' },
    { id: 'sim', label: 'Vodafone SIM Validated', ok: Boolean(values.simSerial && values.simValid), detail: 'Scan or enter a valid, available SIM serial.' },
    {
      id: 'mnp',
      label: 'Port-In Number and Donor Details',
      ok: donorDetailsValid(values.donorDetails as DonorDetailsValue | undefined),
      detail: 'Complete the donor details with a valid port-in number.',
    },
  ];
  if (stage === 'submit') {
    checks.push(
      { id: 'form', label: 'MNP Form Signed', ok: mnpFormSigned(values.donorAttachment as DonorAttachmentValue | undefined, mnpFormInputOf(values)), detail: 'The MNP Form must be signed on the current details.' },
      { id: 'caf', label: 'CAF Signed', ok: isCafValid(values.caf as CafValue | undefined, (t) => t === 'Digital' || t === 'Touch Screen'), detail: 'The CAF must be signed.' },
      { id: 'payment', label: 'Payment or Zero-Value Receipt', ok: Boolean((values.payment as WinCashPaymentValue | undefined)?.paid), detail: 'Take the payment, or issue the zero-value receipt.' }
    );
  }
  return checks;
}

/** The gate passes when every check does. */
export const gatePasses = (checks: GateCheck[]) => checks.every((c) => c.ok);
