'use client';
// The react-router-dom surface the DXP application uses, implemented over the Next.js App Router. The Next build aliases
// `react-router-dom` to this file (next.config.mjs), so application code is unchanged: it keeps importing useNavigate, Link,
// useLocation ... and gets Next's URL ownership underneath.
//
// What react-router gave that Next does not, and how it is bridged:
//   location.state   the journey's launch context ({ startFresh, launch, resumeOrderId, navJourney }) - Next has no per-entry state.
//                    Kept per URL in sessionStorage and cleared by `navigate(url, { replace: true, state: null })`, the way the
//                    journeys already consume it. (Differs from react-router in one case: Back to an entry whose state was never
//                    consumed re-delivers it.)
//   useBlocker       the "leave this journey?" prompt. Intercepts navigation made through this module (navigate, Link, setSearchParams).
//                    Browser Back/Forward and reload CANNOT be intercepted in the App Router - a documented gap.
//   Routes / Route   a matcher for the screens not yet migrated to Next route files (the catch-all in app/[[...slug]]).

import { Children, Fragment, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import { useParams as useNextParams, usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';

// ---------------------------------------------------------------- location state, per URL
const STATE_KEY = 'vfq-next-nav-state';
let navSeq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readStates(): Record<string, unknown> {
  try {
    return JSON.parse(sessionStorage.getItem(STATE_KEY) ?? '{}') as Record<string, unknown>;
  } catch {
    return {};
  }
}
function setUrlState(url: string, state: unknown) {
  try {
    const all = readStates();
    if (state === undefined || state === null) delete all[url];
    else all[url] = state;
    sessionStorage.setItem(STATE_KEY, JSON.stringify(all));
  } catch {
    /* storage blocked: the state simply does not survive */
  }
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};
const useNavSeq = () => useSyncExternalStore(subscribe, () => navSeq, () => 0);

// ---------------------------------------------------------------- blockers
interface Loc {
  pathname: string;
  search: string;
}
type BlockerFn = (args: { currentLocation: Loc; nextLocation: Loc }) => boolean;
const blockers = new Set<{ fn: BlockerFn; block: (proceed: () => void) => void }>();

const splitUrl = (url: string): Loc => {
  const [pathname, search = ''] = url.split('?');
  return { pathname, search: search ? `?${search}` : '' };
};

function runBlockers(url: string, go: () => void): boolean {
  const next = splitUrl(url);
  const current: Loc = { pathname: window.location.pathname, search: window.location.search };
  for (const b of blockers) {
    if (b.fn({ currentLocation: current, nextLocation: next })) {
      b.block(go);
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------- navigation
export type NavigateFunction = (to: string | number, options?: { replace?: boolean; state?: unknown }) => void;

export function useNavigate(): NavigateFunction {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  return useCallback<NavigateFunction>((to, options) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
    const url = to.startsWith('?') ? `${window.location.pathname}${to}` : to;
    const go = () => {
      navSeq += 1;
      setUrlState(url, options?.state);
      if (options?.replace) routerRef.current.replace(url);
      else routerRef.current.push(url);
      emit();
    };
    // A replace that only consumes state is never a departure.
    if (options?.replace && splitUrl(url).pathname === window.location.pathname) return go();
    if (!runBlockers(url, go)) go();
  }, []);
}

export function useLocation() {
  const pathname = usePathname();
  const params = useNextSearchParams();
  const seq = useNavSeq();
  const search = params.toString() ? `?${params.toString()}` : '';
  const state = typeof window === 'undefined' ? null : (readStates()[`${pathname}${search}`] ?? null);
  return { pathname, search, hash: '', state, key: `${pathname}${search}#${seq}` };
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string> | ((p: URLSearchParams) => URLSearchParams), opts?: { replace?: boolean }) => void] {
  const current = useNextSearchParams();
  const pathname = usePathname();
  const navigate = useNavigate();
  const params = new URLSearchParams(current.toString());
  const set = useCallback(
    (next: URLSearchParams | Record<string, string> | ((p: URLSearchParams) => URLSearchParams), opts?: { replace?: boolean }) => {
      const base = new URLSearchParams(window.location.search);
      const resolved = typeof next === 'function' ? next(base) : next instanceof URLSearchParams ? next : new URLSearchParams(next);
      const qs = resolved.toString();
      navigate(`${pathname}${qs ? `?${qs}` : ''}`, { replace: opts?.replace });
    },
    [navigate, pathname]
  );
  return [params, set];
}

const RouteParams = createContext<Record<string, string>>({});
export function useParams<T extends Record<string, string | undefined> = Record<string, string>>(): T {
  const next = useNextParams() as Record<string, string | string[]>;
  const matched = useContext(RouteParams);
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(next ?? {})) flat[k] = Array.isArray(v) ? v.join('/') : v;
  return { ...flat, ...matched } as T;
}

export function useBlocker(fn: BlockerFn) {
  const [pending, setPending] = useState<(() => void) | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const entry = { fn: ((a) => fnRef.current(a)) as BlockerFn, block: (proceed: () => void) => setPending(() => proceed) };
    blockers.add(entry);
    return () => void blockers.delete(entry);
  }, []);
  return {
    state: pending ? ('blocked' as const) : ('unblocked' as const),
    proceed: () => {
      const go = pending;
      setPending(null);
      // The blocker must not stop the very navigation it just allowed.
      const held = [...blockers];
      held.forEach((b) => blockers.delete(b));
      go?.();
      setTimeout(() => held.forEach((b) => blockers.add(b)), 0);
    },
    reset: () => setPending(null),
  };
}

// ---------------------------------------------------------------- components
const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; replace?: boolean; state?: unknown };
export function Link({ to, replace, state, onClick, children, ...rest }: LinkProps) {
  const navigate = useNavigate();
  return (
    <a
      {...rest}
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !plainClick(e) || rest.target === '_blank') return;
        e.preventDefault();
        navigate(to, { replace, state });
      }}
    >
      {children}
    </a>
  );
}

type NavLinkProps = Omit<LinkProps, 'className'> & { className?: string | ((s: { isActive: boolean }) => string); end?: boolean };
export function NavLink({ to, end, className, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  return <Link to={to} className={typeof className === 'function' ? className({ isActive }) : className} {...rest} />;
}

export function Navigate({ to, replace, state }: { to: string; replace?: boolean; state?: unknown }) {
  const navigate = useNavigate();
  useEffect(() => navigate(to, { replace, state }), [navigate, to, replace, state]);
  return null;
}

// ---------------------------------------------------------------- Routes / Route (the screens not yet migrated to Next route files)
export interface RouteProps {
  path: string;
  element: ReactNode;
}
export function Route(_props: RouteProps): null {
  return null;
}

const rank = (seg: string) => (seg === '*' ? 1 : seg.startsWith(':') ? 2 : 3);
function match(pattern: string, pathname: string): { params: Record<string, string>; score: number } | null {
  const p = pattern.split('/').filter(Boolean);
  const u = pathname.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  let score = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] === '*') {
      params['*'] = u.slice(i).join('/');
      return { params, score };
    }
    if (u[i] === undefined) return null;
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(u[i]);
    else if (p[i] !== u[i]) return null;
    score = score * 4 + rank(p[i]);
  }
  return u.length === p.length ? { params, score: score + 1 } : null;
}

function collect(children: ReactNode, out: ReactElement<RouteProps>[]) {
  Children.forEach(children, (c) => {
    if (!isValidElement(c)) return;
    if (c.type === Fragment) collect((c.props as { children?: ReactNode }).children, out);
    else if (c.type === Route) out.push(c as ReactElement<RouteProps>);
  });
}

export function Routes({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routes: ReactElement<RouteProps>[] = [];
  collect(children, routes);
  let best: { el: ReactElement<RouteProps>; params: Record<string, string>; score: number } | null = null;
  for (const el of routes) {
    const m = match(el.props.path, pathname);
    // A catch-all ('*') is the last resort whatever else matches.
    const score = el.props.path === '*' ? 0 : (m?.score ?? -1);
    if (m && (!best || score > best.score)) best = { el, params: m.params, score };
  }
  return best ? <RouteParams.Provider value={best.params}>{best.el.props.element}</RouteParams.Provider> : null;
}

// Not used by the Next host (Next owns routing); present so shared modules that import them still resolve.
export const createBrowserRouter = (): never => {
  throw new Error('createBrowserRouter is not available under Next.js: routing is owned by the App Router.');
};
export const RouterProvider = (): never => {
  throw new Error('RouterProvider is not available under Next.js: routing is owned by the App Router.');
};
