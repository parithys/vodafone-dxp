import { Button } from '../../components/primitives/Button';
import { CARD } from '../stepStyles';
import { SERVICE_JOURNEYS } from './serviceJourneys';
import type { ServiceJourney } from './serviceJourneys';

export function HandOff({ journey, onGo }: { journey: ServiceJourney; onGo: (route: string) => void }) {
  const j = SERVICE_JOURNEYS.find((x) => x.key === journey);
  if (!j?.route) return null;
  return (
    <div className={`${CARD} space-y-2`}>
      <p className="text-fg text-[length:var(--fs-body)]">
        <strong>{j.label}</strong> continues in its own journey - this customer has already been identified and validated here.
      </p>
      <Button variant="primary" compact onClick={() => onGo(j.route!)}>
        Continue in {j.label}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------- Existing / new customer
