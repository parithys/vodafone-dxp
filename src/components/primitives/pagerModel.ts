/**
 * Which pages the pager lists: all of them up to 7; otherwise the first three, the last three and the current page with its neighbours, with
 * a gap ("...") wherever pages are left out (a gap that would hide a single page shows that page instead). 1-based.
 */
export function pageItems(page: number, pages: number): (number | 'gap')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = new Set<number>([1, 2, 3, pages - 2, pages - 1, pages, page - 1, page, page + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push('gap');
    out.push(p);
  });
  return out;
}
