import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { Button } from './components/primitives/Button';
import { useConfigStore } from './stores/configStore';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { Sidebar } from './navigation/Sidebar';
import { Breadcrumbs } from './navigation/Breadcrumbs';
import { PersonaSwitcher } from './navigation/PersonaSwitcher';
import { AppRouter } from './router';
import { ToastContainer } from './capabilities';
import { LoginPage } from './auth/LoginPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MAIN_ID, useRouteAnnouncer } from './navigation/useRouteAnnouncer';
import { ROUTER_BASENAME } from './lib/basePath';
import { useRouteScroll } from './navigation/useRouteScroll';

// The application, front to back, in three parts so a host other than the Vite entry (the Next.js spike) can reuse every piece:
// AppBootstrap (boot, theme, language, error and login gates), Shell (sidebar, header, announcer, toasts around the page) and the
// router that fills the Shell. The Vite app wires them below; nothing about their behaviour depends on the host.
export default function App() {
  return (
    <AppBootstrap>
      <AuthenticatedApp />
    </AppBootstrap>
  );
}

/** Boots the configuration, applies the theme, and shows the error or login screen until a signed-in session exists. */
export function AppBootstrap({ children }: { children: ReactNode }) {
  const ready = useConfigStore((s) => s.ready);
  const error = useConfigStore((s) => s.error);
  const boot = useConfigStore((s) => s.boot);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (error) {
    return (
      <div className="p-8 space-y-3" role="alert">
        <p className="text-danger font-medium">The application could not start.</p>
        <p className="text-fg-2">Check your connection and try again.</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    );
  }

  if (!ready) {
    return <div className="p-8 text-fg-2">Loading VFQ DXP…</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

// The signed-in app, on a DATA router (one catch-all route; AppRouter's own <Routes> still do the routing) because that
// is what lets a guided journey stop navigation and ask what to do with its progress (useBlocker). It is created when the
// signed-in app mounts, not at page load, so it reads the URL LoginPage has already reset to "/".
function AuthenticatedApp() {
  const router = useMemo(
    () => createBrowserRouter([{ path: '*', element: <Shell><AppRouter /></Shell> }], { basename: ROUTER_BASENAME }),
    []
  );
  return <RouterProvider router={router} />;
}

/** The signed-in frame: skip link, sidebar, top bar, breadcrumbs and toasts around `children` (the routed page). */
export function Shell({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useRouteScroll(pathname, hash);
  const routeAnnouncement = useRouteAnnouncer(pathname);
  return (
    <>
      {/* First tab stop: jump past the sidebar and the top bar (WCAG 2.4.1). Visible only while focused. */}
      <a
        href={`#${MAIN_ID}`}
        className="no-print skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(MAIN_ID)?.focus();
        }}
      >
        Skip to main content
      </a>
      <p className="sr-only" role="status" aria-live="polite">
        {routeAnnouncement}
      </p>
      <div className="flex h-screen">
        <div className="no-print contents">
          <Sidebar />
        </div>
        <div className="fill-column overflow-hidden">
          <div className="no-print contents">
            <PersonaSwitcher />
            <Breadcrumbs />
          </div>
          {/* relative: <main> is the scroll container, so it must anchor absolutely positioned descendants (e.g. the visually
              hidden file inputs). Otherwise they resolve against the viewport and land a full scroll-offset below their
              card, inflating the scrollable height. */}
          <main id={MAIN_ID} tabIndex={-1} className="relative flex-1 overflow-y-auto bg-[var(--page-bg)] focus:outline-none">
            <ErrorBoundary resetKey={pathname}>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
      <div className="no-print contents">
        <ToastContainer />
      </div>
    </>
  );
}
