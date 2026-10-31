/**
 * Landing-page figures with no source in the mock data (tasks carry no due date, and queue tickets record when
 * they were generated and released but not when they were called, so a wait time cannot be derived). Demo values,
 * kept in one place so they are easy to find and replace when a real feed exists - do not scatter literals like
 * these through the components. Customers Served and Customers in Queue in the hero are live, not listed here.
 */
export const AVERAGE_WAIT_TIME_DEMO = '6 min';

/** Status pill shown above a tile's figure, by tile key. `tone` picks a tint; text is the pill's label. */
export type PillTone = 'neutral' | 'amber' | 'pink' | 'green';
export const TILE_PILLS: Record<string, { text: string; tone: PillTone }> = {
  open: { text: '2 due today', tone: 'neutral' },
  priority: { text: 'Needs attention', tone: 'amber' },
  'draft-orders': { text: 'Ready to resume', tone: 'pink' },
  approvals: { text: 'Within SLA', tone: 'neutral' },
  exceptions: { text: '1 new today', tone: 'pink' },
  campaigns: { text: 'Performing well', tone: 'green' },
};

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export const countWord = (n: number) => WORDS[n] ?? String(n);

export function greeting(now = new Date()): string {
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}
