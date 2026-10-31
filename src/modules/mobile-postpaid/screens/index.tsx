import { registerScreen } from '../../screenRegistry';
import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// Every route that used to open the standalone NewPostpaidWizard now opens the New Connection
// journey, so a postpaid activation looks and behaves the same however it is reached (menu,
// journey catalogue, or a resumed Draft Order). The standalone wizard is no longer routed.
const NewPostpaidWizard = () => <NewConnectionWizard flow="new" />;

// SCR-154/155/156/159/157/158/160/161/162 are steps of the same single-page
// guided wizard (Pattern 1) - all nine route entries resolve to it.
// SCR-037 ("New Postpaid Connection Journey, single-scroll flow", UJ-042) was
// mis-bucketed under SIM & Number Management in routes.json's coarse keyword
// match (its number-selection step triggered a false match) - moved here and
// resolved to the same wizard.
registerScreen('SCR-037', NewPostpaidWizard);
registerScreen('SCR-154', NewPostpaidWizard);
registerScreen('SCR-155', NewPostpaidWizard);
registerScreen('SCR-156', NewPostpaidWizard);
registerScreen('SCR-157', NewPostpaidWizard);
registerScreen('SCR-158', NewPostpaidWizard);
registerScreen('SCR-159', NewPostpaidWizard);
registerScreen('SCR-160', NewPostpaidWizard);
registerScreen('SCR-161', NewPostpaidWizard);
registerScreen('SCR-162', NewPostpaidWizard);
