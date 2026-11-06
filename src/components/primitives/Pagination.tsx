import { Pager } from './Pager';
import { pageLabel, pageWindow } from './paginationModel';

/**
 * PAGINATION - the one definition of paging a list, behind the Pagination capability (capabilities/Pagination): the page maths, the
 * "Page a of b" label and the pager. Every paged list, table and picker in the app uses these, so the behaviour (1-based
 * pages, a changed list returns to page 1, a page that no longer exists is clamped, nothing at all on a single page), the look and the
 * wording are changed here once. Lives with the primitives so components can use it without reaching up into capabilities.
 */

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
    <div className={`split pt-6 ${className}`}>
      <span className="body-text">{pageLabel(w.page, w.pages)}</span>
      <Pager page={w.page} pages={w.pages} onPage={onPage} />
    </div>
  );
}
