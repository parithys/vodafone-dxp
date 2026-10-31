import { useEffect, useState } from 'react';
import { Pager } from './Pager';

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
  useEffect(() => {
    setPage(1);
  }, [resetKey]);
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

/**
 * The pagination bar, in the one layout: "Page 2 of 10" at the left, the pager (Previous, page numbers with "..." for the pages left out, Next) at
 * the right, with no container or background of its own - it sits on whatever surface it is placed on. Renders nothing on a single page, so a
 * one-page list carries no dead controls. `page` is 1-based; `onPage` receives the new 1-based page.
 */
export function Pagination({
  page,
  total,
  pageSize,
  onPage,
  className = '',
}: {
  page: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
  /** Spacing only (margin or padding) - the bar has no frame to restyle. It always carries its own top padding (pt-6), so every list has the same gap above it. */
  className?: string;
}) {
  const w = pageWindow(total, pageSize, page);
  if (w.pages <= 1) return null;
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 pt-6 ${className}`}>
      <span className="text-fg text-[length:var(--fs-body)]">{pageLabel(w.page, w.pages)}</span>
      <Pager page={w.page} pages={w.pages} onPage={onPage} />
    </div>
  );
}
