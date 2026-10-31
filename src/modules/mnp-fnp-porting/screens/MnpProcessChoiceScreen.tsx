import { NewMnpWizard } from './NewMnpWizard';

// SCR-120: MNP Guided Process - Choose process. The Postpaid/Prepaid choice is a step of the one New Connection journey now
// (the product step, after Customer Verification), so this opens it with MNP chosen and the plan type still to pick.
export function MnpProcessChoiceScreen() {
  return <NewMnpWizard />;
}
