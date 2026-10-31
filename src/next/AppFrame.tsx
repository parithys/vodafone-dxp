'use client';
// The Next.js host of the application: what main.tsx + App.tsx do for Vite, around the page Next routes to. The pieces are the
// application's own (AppBootstrap: boot, theme, language, login gate; Shell: sidebar, header, breadcrumbs, toasts) - nothing here
// decides a screen, a rule or a customer.
import { Suspense, useEffect } from 'react';
import type { ReactNode } from 'react';
import '../modules/registerAllScreens';
import { AppBootstrap, Shell } from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Spinner } from '../components/primitives/Spinner';
import { applyDemoContentSetting } from '../data/synthetic/syntheticMarker';

export function AppFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyDemoContentSetting();
    // The customer-view pop-up (?mirror=1) shows the journey content only: no app chrome (as main.tsx).
    if (new URLSearchParams(window.location.search).get('mirror') === '1') document.documentElement.classList.add('mirror-window');
  }, []);
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8 text-fg-2">Loading VFQ DXP…</div>}>
        <AppBootstrap>
          <Shell>
            <Suspense fallback={<div className="p-8"><Spinner size={24} label="Loading" /></div>}>{children}</Suspense>
          </Shell>
        </AppBootstrap>
      </Suspense>
    </ErrorBoundary>
  );
}
