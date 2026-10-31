/** Public URL prefix configured by Vite. It always starts and ends with a slash. */
export const APP_BASE_PATH = import.meta.env.BASE_URL;

/** React Router expects the mount point without a trailing slash. */
export const ROUTER_BASENAME = APP_BASE_PATH === '/' ? '/' : APP_BASE_PATH.replace(/\/$/, '');

/** Prefix an application route or public asset with the configured mount point. */
export function appPath(path = '/'): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  return `${APP_BASE_PATH}${path.replace(/^\/+/, '')}`;
}
