import { PRODUCT_LINES, type Journey, type JourneyCategory, type ProductLine } from './journeyCatalogue';
import { resolveJourneyTarget } from './journeyTarget';

/** Where a journey sits in the menu: its line (New Connections, Mobile Services, Fibre & Home Services) and the tab (category) it is under. */
export interface JourneyPlace {
  line: ProductLine;
  category: JourneyCategory;
  journey: Journey;
}

function all(): JourneyPlace[] {
  return PRODUCT_LINES.flatMap((line) => line.categories.flatMap((category) => category.journeys.map((journey) => ({ line, category, journey }))));
}

/**
 * The journey a page belongs to, so the breadcrumb can follow the menu's own structure. The journey that was opened (it travels in
 * the navigation's state) wins; otherwise the first journey whose entry point is this page. A page several journeys share (the Number
 * Management Portal) is found by the one that was opened.
 */
export function journeyPlaceOf(pathname: string, openedJourneyId?: string): JourneyPlace | undefined {
  const places = all();
  const opened = openedJourneyId ? places.find((p) => p.journey.id === openedJourneyId) : undefined;
  // The opened journey only counts on the page it opens (state outlives the page it was set for when the agent navigates on).
  if (opened) {
    const target = resolveJourneyTarget(opened.journey);
    if (target && (pathname === target.split('?')[0] || pathname.startsWith(`${target.split('?')[0]}/`))) return opened;
  }
  return places.find((p) => {
    const target = resolveJourneyTarget(p.journey);
    return p.journey.status !== 'planned' && target !== undefined && target.split('?')[0] === pathname;
  });
}
