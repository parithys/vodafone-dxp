import type { ReactNode } from 'react';
import '../src/index.css';
import { ClientRoot } from './ClientRoot';

// Head tags as index.html has them.
export const metadata = { title: 'Vodafone Qatar DXP', description: 'Vodafone Qatar Digital Experience Platform - customer, sales, support and order workspaces for retail and back-office agents.', icons: { icon: '/favicon.svg' } };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#e60000' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="root">
          <ClientRoot>{children}</ClientRoot>
        </div>
      </body>
    </html>
  );
}
