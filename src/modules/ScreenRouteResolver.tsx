import { useLocation } from 'react-router-dom';
import { getAllRoutes } from '../engines/configEngine';
import { getScreenComponent } from './screenRegistry';
import { ScreenNotYetBuilt } from './ScreenNotYetBuilt';
import { NotFound } from './NotFound';

// router.tsx generated from config/routes.json (211 entries) - ScreenComponent
// resolved via the screenId -> component registry per folder-structure.md's
// "Route generation" note, falling back to ScreenNotYetBuilt.
export function ScreenRouteResolver() {
  const location = useLocation();
  const route = getAllRoutes().find((r) => r.path === location.pathname);
  // A path that is in no catalogue is not a screen that is merely unbuilt.
  if (!route) return <NotFound />;
  const Component = getScreenComponent(route.screenId);
  if (!Component) return <ScreenNotYetBuilt />;
  return <Component />;
}
