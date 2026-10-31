import { registerScreen } from '../../screenRegistry';
import { NewPreToPostWizard } from './NewPreToPostWizard';
import { MigrationOfferTab } from './MigrationOfferTab';
import { BaseManagementWizard } from './BaseManagementWizard';
import { BulkJobsDashboard } from './BulkJobsDashboard';
import { ConnectionDetailsPopup } from './ConnectionDetailsPopup';

registerScreen('SCR-177', NewPreToPostWizard);
registerScreen('SCR-179', MigrationOfferTab);
registerScreen('SCR-180', BaseManagementWizard);
registerScreen('SCR-183', BulkJobsDashboard);
registerScreen('SCR-075', ConnectionDetailsPopup);
