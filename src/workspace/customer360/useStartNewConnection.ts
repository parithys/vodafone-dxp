import { usePersonaStore } from '../../stores/personaStore';
import { canUseFeature } from '../../engines/personaEngine';
import { PRODUCT_FEATURE } from '../../modules/new-connection/productAccess';
import { useNavigate } from 'react-router-dom';
import { existingCustomerPath } from '../../navigation/journeyPaths';

/**
 * Starts a New Connection journey from Customer 360 FOR the customer being viewed: it opens the Existing Customer
 * flow, whose draft, identity scan and discounts are scoped to that customer's id. (Opening the plain
 * /mobile/start-connection route would start a New Customer journey and the demo scanner would return whichever QID
 * is first on file.) `startFresh` so it never resumes an old draft.
 */
/** Whether the active role may start a New Connection (its grant): the Customer 360 buttons that start one follow it. */
export function useCanStartNewConnection(): boolean {
  const personaId = usePersonaStore((s) => s.activePersonaId);
  return canUseFeature(personaId, PRODUCT_FEATURE.postpaid);
}

export function useStartNewConnection(customerId: string | undefined) {
  const navigate = useNavigate();
  return () => navigate(customerId ? existingCustomerPath(customerId) : '/mobile/start-connection', { state: { startFresh: true } });
}
