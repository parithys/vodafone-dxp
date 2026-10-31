import { registerScreen } from '../../screenRegistry';
import { NewPrepaidWizard } from './NewPrepaidWizard';

// SCR-190 is the one New Prepaid journey for web and tablet: a single-page guided wizard (Pattern 1) that advances
// through its steps without a URL change per step, as the source guided-journey screenshots show. (The corpus once
// listed its first, third and fourth steps as SCR-190/191/192; they were never separate screens.)
registerScreen('SCR-190', NewPrepaidWizard);
