import { ServiceChangeWizard } from '../../mobile-service-changes/ServiceChangeWizard';
import { preToPostSteps } from './preToPostSteps';
import { submitPreToPostOrder } from './submitPreToPostOrder';

// SCR-177: Postpaid - Contact wizard step (Pre-to-Post) - UJ-086 manual conversion (agent-initiated, not
// system-recommended): "enter prepaid number, confirm identity -> Plan step (manually search/apply postpaid promotion) ->
// CAF auto-generated bilingual form, e-signature -> Sales Order created (Plan Change/Pre2Post)."
// It runs on the same shared steps and journey shell as New Mobile Postpaid and the line-change journeys (see preToPostSteps.tsx), so the
// identity eligibility checks, the customer lock, the customer-facing CAF and the Activation Complete page behave identically.
export function NewPreToPostWizard() {
  return <ServiceChangeWizard wizardId="pre-to-post-manual" title="Prepaid to Postpaid Conversion" buildSteps={preToPostSteps} submit={(values, deps) => submitPreToPostOrder(values, deps)} />;
}
