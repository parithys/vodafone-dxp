import { registerScreen } from '../../screenRegistry';
import { TicketsDashboard } from './TicketsDashboard';
import { TicketDetail } from './TicketDetail';

registerScreen('SCR-211', TicketsDashboard);
// SCR-029 and SCR-210 both describe the same central ticket-management page
// from different evidenced angles (public notes/bell icon vs. role-owned
// fields/Activities) - see TicketDetail.tsx.
registerScreen('SCR-029', TicketDetail);
registerScreen('SCR-210', TicketDetail);
