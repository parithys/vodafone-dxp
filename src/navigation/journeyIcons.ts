// One stroke icon (24px grid, Icon primitive) per service-level journey, so each row of a line's Actions list says what the
// action does. A journey with no entry falls back to its category's icon (journeyIcon). Same pair of concepts may reuse a
// glyph across the two product lines (view, change plan, suspend, resume, terminate) - they are never listed together.

const EYE = 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
const SWAP = 'M7 7h13 M16 3l4 4-4 4 M17 17H4 M8 13l-4 4 4 4';
const PAUSE = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M10 9v6 M14 9v6';
const PLAY = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M10 8.5l5 3.5-5 3.5z';
const POWER = 'M12 3v8 M6.4 6.6a8 8 0 1 0 11.2 0';
const SIM = 'M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 12h6v6H9z';
const PHONE = 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z';

const ICONS: Record<string, string> = {
  // Mobile
  'mob-view-service': EYE,
  'mob-change-postpaid-plan': SWAP,
  'mob-change-prepaid-pack': 'M21 8l-9-5-9 5v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8',
  'mob-add-addon': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 8v8 M8 12h8',
  'mob-suspend': PAUSE,
  'mob-resume': PLAY,
  'mob-terminate': POWER,
  'mob-sim-replacement': SIM,
  'mob-phys-to-esim': `${PHONE} M11 18h2 M9 10a4.2 4.2 0 0 1 6 0 M10.8 12.3a1.7 1.7 0 0 1 2.4 0`,
  'mob-esim-to-phys': 'M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 14h6 M9 17h4',
  'mob-device-upgrade': `${PHONE} M12 16V9 M9 11.5l3-3 3 3`,
  'mob-ownership-change': 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M17 8h5 M20 5l2 3-2 3',
  // Fibre & Home
  'fib-view-service': EYE,
  'fib-fwa-5g-service': 'M12 12v9 M8 21h8 M8.5 8.5a5 5 0 0 0 0 7 M15.5 8.5a5 5 0 0 1 0 7 M5.5 5.5a9 9 0 0 0 0 13 M18.5 5.5a9 9 0 0 1 0 13',
  'fib-fnp-change': 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  'fib-change-plan': SWAP,
  'fib-upgrade': 'M12 19V6 M6 12l6-6 6 6',
  'fib-suspend': PAUSE,
  'fib-resume': PLAY,
  'fib-terminate': POWER,
  'fib-relocate': 'M3 6h11v10H3z M14 10h4l3 3v3h-7 M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  'fib-home-move': 'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6',
  'fib-change-install-address': 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  'fib-install-appointment': 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4 M9 15l2 2 4-4',
  'fib-router-mgmt': 'M4 14h16v6H4z M8 17h.01 M12 17h.01 M16 17h.01 M12 14v-3 M8.5 8.5a5 5 0 0 1 7 0',
  'fib-equip-replacement': 'M21 12a9 9 0 0 1-9 9 9 9 0 0 1-8.5-6 M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8.5 6 M21 3v6h-6 M3 21v-6h6',
  'fib-device-return': 'M3 8l9-5 9 5v8l-9 5-9-5V8z M9 12h7 M12 9l-3 3 3 3',
  'fib-iptv-equipment': 'M3 6h18v12H3z M8 21h8 M10 3l2 3 2-3',
  'fib-create-ticket': 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z M12 9v6 M9 12h6',
  'fib-connectivity-issue': 'M2 8.8a15 15 0 0 1 20 0 M5.5 12.4a10 10 0 0 1 13 0 M9 16a5 5 0 0 1 6 0 M12 20h.01 M3 3l18 18',
  'fib-complaint': 'M4 5h16v11H9l-5 4V5z M12 8.5v3.5 M12 14.5h.01',
  'fib-install-issue': 'M12 4l9 16H3L12 4z M12 10v4 M12 17h.01',
};

/** The journey's own icon, or `fallback` (its category's icon) when it has none. */
export function journeyIcon(journeyId: string, fallback: string): string {
  return ICONS[journeyId] ?? fallback;
}

/** Journey ids that have their own icon (the service-actions test checks every service-level journey is covered). */
export const JOURNEY_ICON_IDS = Object.keys(ICONS);
