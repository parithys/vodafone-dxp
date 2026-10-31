import { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { isBusinessId } from '../../engines/businessSegment';

const Business360Page = lazy(() => import('./Business360Page').then((m) => ({ default: m.Business360Page })));
const Customer360Layout = lazy(() => import('./Customer360Layout').then((m) => ({ default: m.Customer360Layout })));

// One route for both: an enterprise account ID (ENT-ACC-...) opens Business 360, anything else the customer's profile.
export function CustomerOrBusiness360() {
  const { customerId } = useParams<{ customerId: string }>();
  // Keyed by the customer: opening another customer starts that page's local state (tab, selected service, open drawer) afresh instead of carrying the last one's over.
  return isBusinessId(customerId) ? <Business360Page key={customerId} /> : <Customer360Layout key={customerId} />;
}
