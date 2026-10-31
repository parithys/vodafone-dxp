import { useEffect, useState } from 'react';

export const MAIN_ID = 'main-content';
const APP_NAME = 'Vodafone Qatar DXP';

/**
 * Makes a client-side route change perceivable without sight (WCAG 2.4.2, 2.4.3, 4.1.3).
 *
 *   - sets document.title to "<page heading> - <app>" (the first <h1> of the new page, so every history entry and
 *     tab reads differently instead of "Vodafone Qatar DXP" everywhere)
 *   - moves focus to <main>, so the next Tab starts inside the new page and a screen reader starts reading it
 *   - returns the title for a polite live region
 *
 * Nothing happens on the first load (the browser already announces a fresh page) or when only the query string changes.
 */
export function useRouteAnnouncer(pathname: string): string {
  const [announcement, setAnnouncement] = useState('');
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    // Wait for the new route to render its heading.
    const t = window.setTimeout(() => {
      const main = document.getElementById(MAIN_ID);
      const heading = main?.querySelector('h1')?.textContent?.trim();
      const title = heading ? `${heading} - ${APP_NAME}` : APP_NAME;
      document.title = title;
      setAnnouncement(heading ? `${heading} page` : '');
      main?.focus({ preventScroll: true });
    }, 150);
    return () => window.clearTimeout(t);
    // `first` only matters for the initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return announcement;
}
