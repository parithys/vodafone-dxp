import { LegacyRoute } from '../../src/next/routes';

// Every screen not yet given its own Next route file is served by the existing route table (src/router.tsx), so the whole application keeps
// working while journeys are migrated one at a time. A static export lists one placeholder; any other path needs the host's fallback.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: ['not-migrated'] }];
}

export default function Page() {
  return <LegacyRoute />;
}
