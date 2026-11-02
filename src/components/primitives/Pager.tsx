import { Icon } from './Icon';
import { CHEVRON_LEFT, CHEVRON_RIGHT } from '../../assets/icons';


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

/**
 * The one pager: a bordered group of Previous, the page numbers (with "..." where pages are left out) and Next, the current page in the Primary button style (accent gradient).
 * Pages are 1-based. Renders nothing when there is only one page. Used under every paged table and list, through the Pagination capability.
 */
export function Pager({ page, pages, onPage, className = '' }: { page: number; pages: number; onPage: (page: number) => void; className?: string }) {
  if (pages <= 1) return null;
  const base = 'flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 px-3 text-[length:var(--fs-body)] focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--focus-outline)] transition-colors';
  const cell = `${base} text-fg hover:bg-[var(--icon-tile-bg)] disabled:text-muted disabled:hover:bg-transparent`;
  // The current page is the Primary button: its gradient (and hover gradient), on-accent text, bold.
  const current = `${base} bg-[image:var(--accent-gradient)] text-accent-on font-bold hover:bg-[image:var(--accent-gradient-hover)]`;
  return (
    <nav
      aria-label="Pagination"
      className={`button-group ${className}`}
    >
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className={cell}>
        <Icon path={CHEVRON_LEFT} className="h-4 w-4" />
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
        <Icon path={CHEVRON_RIGHT} className="h-4 w-4" />
      </button>
    </nav>
  );
}
