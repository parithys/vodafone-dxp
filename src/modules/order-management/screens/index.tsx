import { registerScreen } from '../../screenRegistry';
import { MySalesOrders } from '../MySalesOrders';
import { OrderApprovalQueue } from '../OrderApprovalQueue';
import { OrderApprovalDetail } from '../OrderApprovalDetail';

registerScreen('SCR-059', MySalesOrders);
registerScreen('SCR-060', OrderApprovalQueue);
registerScreen('SCR-197', OrderApprovalQueue);
registerScreen('SCR-061', OrderApprovalDetail);
// SCR-062/063 (Reject/Approve modals) are reachable as buttons from the same detail screen.
registerScreen('SCR-062', OrderApprovalDetail);
registerScreen('SCR-063', OrderApprovalDetail);
