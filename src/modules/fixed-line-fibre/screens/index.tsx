import { registerScreen } from '../../screenRegistry';
import { NewFixedLineWizard } from './NewFixedLineWizard';

// SCR-043/045/046/048/050 are steps of the same single-page guided wizard
// (Pattern 1); SCR-058 (CAF preview/e-signature) is reachable as a button
// within the CAF & Signature step - all six route entries resolve to the same
// component, matching how they're triggered in-place in the source
// screenshots, not as independently navigable pages.
registerScreen('SCR-043', NewFixedLineWizard);
registerScreen('SCR-045', NewFixedLineWizard);
registerScreen('SCR-046', NewFixedLineWizard);
registerScreen('SCR-048', NewFixedLineWizard);
registerScreen('SCR-050', NewFixedLineWizard);
registerScreen('SCR-058', NewFixedLineWizard);
