import { registerScreen } from '../../screenRegistry';
import { LeadListView } from '../LeadListView';
import { LeadDetailsView } from '../LeadDetailsView';

// SCR-142/143/144/147/150 are the same Pattern-14 list shape, scoped differently.
registerScreen('SCR-142', () => <LeadListView scope="my" />);
registerScreen('SCR-143', () => <LeadListView scope="created" />);
registerScreen('SCR-144', () => <LeadListView scope="team" />);
registerScreen('SCR-147', () => <LeadListView scope="all" />);
registerScreen('SCR-150', () => <LeadListView scope="contact" />);

// SCR-141 is the detail view; SCR-145/146/148/149 are its evidenced sub-actions
// (Reject modal / Reassignment picker / Description popup / Callback picker) -
// all reachable as buttons from the same detail component, so all four route
// entries resolve to it too (matching how they're triggered in-place in the
// source screenshots, not as independently navigable pages).
registerScreen('SCR-141', LeadDetailsView);
registerScreen('SCR-145', LeadDetailsView);
registerScreen('SCR-146', LeadDetailsView);
registerScreen('SCR-148', LeadDetailsView);
registerScreen('SCR-149', LeadDetailsView);
