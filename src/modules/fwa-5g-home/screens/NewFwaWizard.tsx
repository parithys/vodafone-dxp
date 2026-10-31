import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// SCR-077/078/079/080/082/084/085 - the New FWA entry into New Home Connection: the same journey (Customer Verification, then
// the home steps) with FWA already chosen as the home product. No Installation Address service type is assumed for it: the BRSD
// and business rules do not map FWA to one, so the agent still chooses it there. The technician-side Dual-Play Serial Number
// Check (SCR-093, UJ-061's post-submission WFM phase) is a separate screen for a different persona - see WfmSerialNumberCheck.tsx.
export function NewFwaWizard() {
  return <NewConnectionWizard flow="new" journey="home" initialProduct="fixed-line" initialValues={{ homeProduct: 'fwa' }} />;
}
