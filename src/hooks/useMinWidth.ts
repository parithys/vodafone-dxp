import { useSyncExternalStore } from 'react';

/** True while the viewport is at least `px` wide. Reads the media query, so it follows a resize or rotation. */
export function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => true,
  );
}
