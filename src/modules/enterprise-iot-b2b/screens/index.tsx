import { registerScreen } from '../../screenRegistry';
import { EnterpriseAccountCreation } from './EnterpriseAccountCreation';
import { BulkAdjustmentPortal } from './BulkAdjustmentPortal';

registerScreen('SCR-007', EnterpriseAccountCreation);
registerScreen('SCR-001', BulkAdjustmentPortal);
