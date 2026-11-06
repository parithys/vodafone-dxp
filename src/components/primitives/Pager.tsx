import { Icon } from './Icon';
import { CHEVRON_LEFT, CHEVRON_RIGHT } from '../../assets/icons';
import { pageItems } from './pagerModel';


/**
 * The one pager: a bordered group of Previous, the page numbers (with "..." where pages are left out) and Next, the current page in the Primary button style (accent gradient).
 * Pages are 1-based. Renders nothing when there is only one page. Used under every paged table and list, through the Pagination capability.
 */
export function Pager({ page, pages, onPage, className = '' }: { page: number; pages: number; onPage: (page: number) => void; className?: string }) {
  if (pages <= 1) return null;
  const base = 'pager-button';
  const cell = `${base} pager-cell`;
  // The current page is the Primary button: its gradient (and hover gradient), on-accent text, bold.
  const current = `${base} pager-current`;
  return (
    <nav
      aria-label="Pagination"
      className={`button-group ${className}`}
    >
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className={cell}>
        <Icon path={CHEVRON_LEFT} className=" size-4" />
        Previous
      </button>
      {pageItems(page, pages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden="true" className="icon-tile h-9 min-w-9 px-2 text-secondary">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={p === page ? current : cell}
          >
            {p}
          </button>
        )
      )}
      <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} className={cell}>
        Next
        <Icon path={CHEVRON_RIGHT} className=" size-4" />
      </button>
    </nav>
  );
}
