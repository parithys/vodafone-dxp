import { getAllRoutes } from '../engines/configEngine';
import { getScreenComponent } from '../modules/screenRegistry';
import type { Journey } from './journeyCatalogue';

/** Where a catalogued journey's entry point lives, or undefined when it has none yet (it is shown as planned). */
export function resolveJourneyTarget(journey: Journey): string | undefined {
  if (journey.path) return journey.path;
  if (!journey.screenId) return undefined;
  // Only link to a screen that is actually registered; a catalogued-but-unbuilt
  // screen id would land on <ScreenNotYetBuilt>, which is a worse answer than
  // presenting the journey as planned.
  if (!getScreenComponent(journey.screenId)) return undefined;
  return getAllRoutes().find((r) => r.screenId === journey.screenId)?.path;
}
