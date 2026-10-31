import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/primitives/Button';
import { canUseFeature } from '../engines/personaEngine';
import { usePersonaStore } from '../stores/personaStore';

/**
 * Renders its page only for a persona granted the feature. For the destinations the navigation manifest marks as an access boundary
 * (`requiresFeature`, today Administration): hiding the menu item is not enough when the URL is typed or bookmarked.
 */
export function RequireFeature({ featureKey, children }: { featureKey: string; children: ReactNode }) {
  const personaId = usePersonaStore((s) => s.activePersonaId);
  if (canUseFeature(personaId, featureKey)) return <>{children}</>;
  return (
    <div className="p-8 w-full" role="alert">
      <h1 className="text-[length:var(--fs-h3)] font-bold text-fg mt-3 mb-2">No Access</h1>
      <p className="text-fg-2 mb-4">Your role does not have access to this page.</p>
      <Link to="/">
        <Button variant="primary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
