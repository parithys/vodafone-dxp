import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// Every route that used to open the standalone NewPostpaidWizard now opens the New Connection
// journey, so a postpaid activation looks and behaves the same however it is reached (menu,
// journey catalogue, or a resumed Draft Order). The standalone wizard is no longer routed.
export const NewPostpaidWizard = () => <NewConnectionWizard flow="new" />;
