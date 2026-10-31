import { registerScreen } from '../../screenRegistry';
import { NewFwaWizard } from './NewFwaWizard';
import { WfmSerialNumberCheck } from './WfmSerialNumberCheck';

// SCR-077/078/079/080/082/084/085 are the New FWA guided wizard's home tile and
// steps - all resolve to the same single-page wizard component.
registerScreen('SCR-077', NewFwaWizard);
registerScreen('SCR-078', NewFwaWizard);
registerScreen('SCR-079', NewFwaWizard);
registerScreen('SCR-080', NewFwaWizard);
registerScreen('SCR-082', NewFwaWizard);
registerScreen('SCR-084', NewFwaWizard);
registerScreen('SCR-085', NewFwaWizard);

// SCR-093 is a separate, technician-facing screen (see WfmSerialNumberCheck.tsx).
registerScreen('SCR-093', WfmSerialNumberCheck);
