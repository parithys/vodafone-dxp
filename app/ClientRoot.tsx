'use client';
// The application is a browser-only prototype (stores read localStorage / sessionStorage, journeys open windows and channels), so it is
// never rendered on the server or at build time: the exported HTML is an empty shell and the app mounts in the browser.
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const AppFrame = dynamic(() => import('../src/next/AppFrame').then((m) => m.AppFrame), { ssr: false });

export function ClientRoot({ children }: { children: ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
