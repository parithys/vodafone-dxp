import { useLocation } from 'react-router-dom';
import { getAllRoutes } from '../engines/configEngine';
import { NotYetBuiltPanel } from './NotYetBuiltPanel';
import { screenDisplayName } from '../lib/screenName';

// Honest placeholder per CLAUDE.md's evidence model - never silently invent a
// screen's behavior. Shows exactly what IS evidenced about this screen
// (blueprint/screens.md) so a future build session knows where to pick up,
// rather than a blank 404.
//
// The markup now lives in NotYetBuiltPanel, shared with the workspace-level
// placeholder (WorkspaceNotYetBuilt). This component keeps the routes.json
// lookup, which is what distinguishes it: a screen placeholder describes a
// catalogued SCR- id, a workspace placeholder describes a nav destination that
// has no screen id at all.
export function ScreenNotYetBuilt() {
  const location = useLocation();
  const route = getAllRoutes().find((r) => r.path === location.pathname);

  return (
    <NotYetBuiltPanel
      title={route ? screenDisplayName(route.screenName) : 'Unknown screen'}
      body={
        <>
          This screen is not available yet.
        </>
      }
      details={[
        { term: 'Screen ID', value: route?.screenId },
        { term: 'Type', value: route?.screenType },
        { term: 'Module', value: route?.module },
      ]}
    />
  );
}
