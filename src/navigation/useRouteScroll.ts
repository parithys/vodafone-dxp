import { useLayoutEffect, useRef } from 'react';
import { MAIN_ID } from './useRouteAnnouncer';

/**
 * The app's one scroll rule, applied by the shell to every route, journey and persona:
 *
 *   - same page (the pathname is unchanged - a query-string, hash or in-page state change such as a wizard step or
 *     tab) keeps the scroll position;
 *   - a different page (the pathname changes) starts at the top of the destination.
 *
 * <main> is the scroll container (the window itself never scrolls), so react-router's <ScrollRestoration> does not
 * apply. Do not scroll on route change from a page; change this rule here. A hash link (#anchor) is left to the
 * browser/page to resolve.
 */
export function useRouteScroll(pathname: string, hash: string): void {
  const previous = useRef(pathname);
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (hash) return;
    document.getElementById(MAIN_ID)?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
}
