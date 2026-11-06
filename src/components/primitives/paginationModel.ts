import { useState } from 'react';

/**
 * PAGINATION - the one definition of paging a list, behind the Pagination capability (capabilities/Pagination): the page maths, the
 * "Page a of b" label and the pager. Every paged list, table and picker in the app uses these, so the behaviour (1-based
 * pages, a changed list returns to page 1, a page that no longer exists is clamped, nothing at all on a single page), the look and the
 * wording are changed here once. Lives with the primitives so components can use it without reaching up into capabilities.
 */

/** The first and last item shown (1-based, inclusive) on a page of a list, and how many pages there are. An empty list shows 0-0 on one page. */
export function pageWindow(total: number, pageSize: number, page: number): { page: number; pages: number; from: number; to: number } {
  // An infinite page size means everything on one page.
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : Math.max(1, total);
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, Math.floor(page)), pages);
  return { page: current, pages, from: total === 0 ? 0 : (current - 1) * size + 1, to: Math.min(current * size, total) };
}

/**
 * Pages a list. `page` is 1-based. The page is clamped when the list shrinks under it, and goes back to 1 when `resetKey` changes (a new
 * search, filter or tab is a new list: landing on page 3 of it would look like missing rows).
 */
export function usePagination<T>(rows: readonly T[], pageSize: number, resetKey?: unknown) {
  const [requested, setPage] = useState(1);
  // A changed list returns to page 1: state adjusted while rendering (compared with the key it last saw), not in an effect.
  const [seenKey, setSeenKey] = useState(resetKey);
  if (!Object.is(seenKey, resetKey)) {
    setSeenKey(resetKey);
    setPage(1);
  }
  const w = pageWindow(rows.length, pageSize, requested);
  return {
    page: w.page,
    pages: w.pages,
    setPage,
    from: w.from,
    to: w.to,
    total: rows.length,
    pageSize,
    slice: rows.slice(w.from === 0 ? 0 : w.from - 1, w.to) as T[],
  };
}

/** "Page 2 of 10". */
export const pageLabel = (page: number, pages: number): string => `Page ${page} of ${pages}`;
