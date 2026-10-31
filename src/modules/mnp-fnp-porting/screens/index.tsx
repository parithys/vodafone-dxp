import { registerScreen } from '../../screenRegistry';
import { NewMnpWizard } from './NewMnpWizard';
import { MnpProcessChoiceScreen } from './MnpProcessChoiceScreen';
import { PortInStatusScreen } from './PortInStatusScreen';

// SCR-121–129/132–134 are steps of the same single-page guided wizard (Pattern 1).
const WIZARD_SCREEN_IDS = [
  'SCR-121', 'SCR-122', 'SCR-123', 'SCR-124', 'SCR-125',
  'SCR-126', 'SCR-127', 'SCR-129', 'SCR-132', 'SCR-133', 'SCR-134',
];
WIZARD_SCREEN_IDS.forEach((id) => registerScreen(id, NewMnpWizard));

// SCR-120: the Postpaid/Prepaid choice gate entered before the wizard above.
registerScreen('SCR-120', MnpProcessChoiceScreen);

// SCR-136: Port-In Status - a submitted request's NPAS status, Confirmed Port-In Date, rejection reason and next actions.
registerScreen('SCR-136', PortInStatusScreen);
