import { appPath } from '../lib/basePath';

/**
 * Ends the browser session's application state. Called on every sign-out
 * (manual; the app has no idle timeout).
 *
 * Two kinds of state outlive a sign-out inside one page load, and both must go:
 *   1. Persisted stores - every zustand `persist` store writes under a `vfq-`
 *      key in localStorage (auth, persona, theme, sidebar, region, active
 *      customer, customer verification) or sessionStorage (workflow, journey
 *      customer). Cleared here by prefix, so a store added later is covered
 *      without editing this list.
 *   2. In-memory state - mockDataEngine's seeded store (orders, drafts,
 *      reservations created during the session) and every zustand store's
 *      current value. Neither is reachable key by key, so the page is reloaded:
 *      the next login boots from the defaults in the code and the seed files.
 *
 * One thing outlives sign-out ON PURPOSE: the session journal of records created or changed this session (orders, drafts ...,
 * mockDataEngine's `dxp-session-records` key - not a "vfq-" key, so it is not cleared here). It lets an order created as one
 * role be approved after signing in as another. It ends with the browser tab.
 *
 * Replacing with the app base rather than reloading keeps the signed-out URL
 * out of history and works when the app is mounted below the hostname root.
 */
const APP_KEY_PREFIX = 'vfq-';

function clearAppKeys(storage: Storage): void {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key?.startsWith(APP_KEY_PREFIX)) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
}

export function resetApplicationState(): void {
  clearAppKeys(localStorage);
  clearAppKeys(sessionStorage);
  window.location.replace(appPath('/'));
}
