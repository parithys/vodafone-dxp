import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { attachSummaries } from '../../../components/patterns/wizard/stepSummary';
import type { GuidedContactValue } from '../../../capabilities';
import {
  allLines,
  cafSignatureStep,
  committedLines,
  numberSelectionStep,
  paymentStep,
  planSelectionStep,
  prepaidExtrasStep,
  prepaidCartStep,
  prepaidCheckoutStep,
  serviceAddressStep,
  simTypeStep,
} from '../../../capabilities';
import type { CrossSalesValue, PrepaidCheckoutTotals } from '../../../capabilities';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { DeviceType } from '../../../lib/deviceType';
import * as sums from '../../../components/patterns/wizard/commonSummaries';
import { formatDate } from '../../../lib/format';

const contactOf = (values: Record<string, unknown>) => values.contact as GuidedContactValue | undefined;
const nameOf = (values: Record<string, unknown>) => contactOf(values)?.moiResult?.name;

// An accepted prepaid cross-sales offer fixes the first subscription's pack, so the plan step is skipped for it. Later
// subscriptions (once the cart has one) choose their own pack.
const offerAccepted = (values: Record<string, unknown>) =>
  (values.crossSales as CrossSalesValue | undefined)?.decision === 'accepted' && committedLines(values).length === 0;

// The New Prepaid steps, after Customer Verification and Product Selection (the first two steps of New Connection, which
// this product shares with the others), in the order of the Mobile Prepaid process flow and in the shape of Postpaid's:
//
//   Address -> Plan & Add-ons -> Number (or a Pre-Paired SIM) -> SIM -> Subscriptions ("Add another subscription?")
//   -> Checkout -> CAF -> Payment
//
// `device` only changes how the SIM step is operated - SIM serial scan-led on a tablet, type-led on the web - and the CAF
// type follows the device by itself (Touch Screen on a tablet, Digital on the web), both signed on screen.
//
// What differs from Postpaid, per the Mobile Prepaid BRSD: no billing account, credit limit or HRN advance; prepaid packs
// filtered by segment, with a prepaid discount; a Pre-Paired SIM that bypasses number selection; a cart of one or more
// subscriptions; prepaid checkout with the SIM card charge; the prepaid CAF and its terms. The step-to-requirement map is in
// reference/outputs/VFQ_DXP_Mobile_Prepaid_Requirements_Coverage_Reference.md.
export function prepaidSteps({ device }: { device: DeviceType }): WizardStep[] {
  return attachSummaries(
    [
      serviceAddressStep({
        mode: 'structured',
        autoPass: true,
        billing: () => false,
        identity: (values) => ({ idNumber: contactOf(values)?.idNumber, nationality: contactOf(values)?.moiResult?.nationality }),
      }),
      {
        ...planSelectionStep({ kind: 'prepaid', segment: (values) => (values.eligibility as EligibilityResult | undefined)?.segment }),
        skip: offerAccepted,
      },
      {
        ...prepaidExtrasStep({ segment: (values) => (values.eligibility as EligibilityResult | undefined)?.segment }),
        skip: offerAccepted,
      },
      numberSelectionStep({ priceField: 'priceQAR', prePairedOption: true }),
      simTypeStep({
        customerEmail: (values) => contactOf(values)?.moiResult?.email,
        device,
        prePaired: (values) => values.prePaired === true,
      }),
      prepaidCartStep(),
      prepaidCheckoutStep({ idType: (values) => contactOf(values)?.idType, customerName: nameOf }),
      cafSignatureStep({
        variant: 'full',
        journey: 'prepaid',
        customerName: nameOf,
        // MPRA_001_CAF_02: the prepaid terms the customer sees before signing, from the business-maintained statements.
        keyInformationScenario: 'prepaid-',
        idDocument: (values) => ({ label: 'ID', value: contactOf(values)?.idNumber }),
        // CAF_03: the prepaid form lists the mobile number(s) and SIM serial(s) it covers.
        formDetails: (values) => {
          const lines = allLines(values);
          return [
            { label: 'Application Date', value: formatDate(new Date()) },
            { label: lines.length > 1 ? 'Mobile numbers' : 'Mobile number', value: lines.map((l) => l.msisdn).join(', ') || '-' },
            { label: lines.length > 1 ? 'SIM serials' : 'SIM serial', value: lines.map((l) => l.simType.simSerial ?? 'eSIM').join(', ') || '-' },
          ];
        },
      }),
      // "On successful WinCash confirmation, return to DXP, submit the order": Payment is the last step, so Continue
      // here could only mean "submit" (PAY_01, ORD_01).
      paymentStep({ submitOnPaid: true, amountDue: (values) => (values.checkoutTotals as PrepaidCheckoutTotals | undefined)?.totalDueQar ?? 0 }),
    ],
    {
      plan: sums.planSummary(),
      planExtras: [
        { key: 'discount', label: 'Discount', type: 'select', optional: true, labelFrom: { kind: 'addons-discounts', idField: 'addonDiscountId', labelField: 'name' }, value: (v) => v.discountId },
        { key: 'addons', label: 'Add-Ons', type: 'multi', optional: true, labelFrom: { kind: 'addons-discounts', idField: 'addonDiscountId', labelField: 'name' }, value: (v) => v.addonIds },
      ],
      payment: sums.paymentSummary,
    }
  );
}
