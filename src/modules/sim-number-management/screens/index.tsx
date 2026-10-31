import { registerScreen } from '../../screenRegistry';
import { NumberManagementPortal } from './NumberManagementPortal';
import { GlobalSearchScreen } from './GlobalSearchScreen';
import { SimSwapQueueScreen } from './SimSwapQueueScreen';

registerScreen('SCR-024', NumberManagementPortal);
registerScreen('SCR-195', GlobalSearchScreen);
registerScreen('SCR-196', SimSwapQueueScreen);
