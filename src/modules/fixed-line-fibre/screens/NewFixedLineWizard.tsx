import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// SCR-043 - New Home Connection (Fibre, Fixed-Line, FWA, 5G Home). One continuous journey: Customer Verification once, then
// Product Selection, then the home steps (fixedActivation/fixedSteps.tsx, fixedLineSteps) in the same wizard - the same draft and
// customer context throughout, never an exit or a restart.
export function NewFixedLineWizard() {
  return <NewConnectionWizard flow="new" journey="home" />;
}
