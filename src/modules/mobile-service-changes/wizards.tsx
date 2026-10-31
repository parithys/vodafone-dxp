import { ServiceChangeWizard } from './ServiceChangeWizard';
import { addAddonSteps, changePostpaidPlanSteps, changePrepaidPackSteps } from './serviceChangeSteps';
import { submitServiceChangeOrder } from './submitServiceChangeOrder';

// The three Plans & Numbers journeys that change a line the customer already has. Each is the shared journey shell on its own steps
// (serviceChangeSteps.tsx), built from the Capability Library: Customer Verification, Line Selection, Offers & Plans / Add-ons,
// Checkout, CAF & Signature and Payment. Routed directly (router.tsx); the Plans & Numbers menu leads here.

export function ChangePostpaidPlanWizard() {
  return (
    <ServiceChangeWizard
      wizardId="change-postpaid-plan"
      title="Change Postpaid Plan"
      buildSteps={changePostpaidPlanSteps}
      submit={(values, deps) => submitServiceChangeOrder('change-postpaid-plan', values, deps)}
    />
  );
}

export function ChangePrepaidPackWizard() {
  return (
    <ServiceChangeWizard
      wizardId="change-prepaid-pack"
      title="Change Prepaid Pack"
      buildSteps={changePrepaidPackSteps}
      submit={(values, deps) => submitServiceChangeOrder('change-prepaid-pack', values, deps)}
    />
  );
}

export function AddAddonWizard() {
  return <ServiceChangeWizard wizardId="add-addon" title="Add Add-On" buildSteps={addAddonSteps} submit={(values, deps) => submitServiceChangeOrder('add-addon', values, deps)} />;
}
