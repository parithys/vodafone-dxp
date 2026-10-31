import { EmptyState } from './EmptyState';
import { Pagination, pageWindow } from './Pagination';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

const SORT_ASC_ICON = 'M6 15l6-6 6 6';
const SORT_DESC_ICON = 'M6 9l6 6 6-6';
const SORT_NEUTRAL_ICON = 'M7 10l5-5 5 5 M7 14l5 5 5-5';

export interface Column<T> {
  key: string;
  header: string;
  /** Extra classes on this column's header and body cells (e.g. a wider left padding for a leading marker). */
  cellClassName?: string;
  /** Cell content. `index` is the row's position in the current page. */
  render?: (row: T, index: number) => ReactNode;
  /** Numeric column: right-aligned in the header and every row, values never wrap, tabular figures. */
  numeric?: boolean;
  /** The identifier column: its values are semibold. */
  strong?: boolean;
  /** Visually hide the header text (kept for screen readers) - for an actions column. */
  hideHeader?: boolean;
  /** Renders this column's value as a real link to a specific destination,
   * independent of any other column's link or the row's own onRowClick - use
   * this instead of onRowClick when different columns in the same row point
   * to different pages (e.g. a ticket # column linking to the ticket, a
   * customer column linking to that customer's 360 record). Return undefined
   * for a given row to fall back to plain text (e.g. no customerId on file). */
  linkTo?: (row: T) => string | undefined;
  /** Opt out of sorting for this column - defaults to sortable whenever
   * `header` is non-empty (action/remove columns conventionally use an empty
   * header and have nothing meaningful to sort by). */
  sortable?: boolean;
  /** Override what's compared when sorting, for columns whose displayed
   * value is derived rather than a raw row field (e.g. a badge computed from
   * several fields). Defaults to the row's own `row[key]`. */
  sortValue?: (row: T) => string | number | null | undefined;
}

type SortDirection = 'asc' | 'desc';

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

interface DataTableProps<T> {
  /** Honour the columns' own percentage widths (set through `cellClassName`, e.g. `w-[30%]`) instead of sizing to the content. */
  fixedLayout?: boolean;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  /** Shown under the empty message when the empty table has a next step (clear the filters, start something). */
  emptyAction?: ReactNode;
  loading?: boolean;
  /** Rows per page; `Infinity` shows every row (no pager). */
  pageSize?: number;
  /**
   * `framed` (default): a bordered card with a sortable, paged table.
   * `plain`: sits inside a card that already frames it - no outer border, a header that stays in view while the rows scroll
   * (max 70vh), and - when there are no rows - just the empty message with no header.
   */
  variant?: 'framed' | 'plain';
  /** Tighter rows (py-2 instead of py-3.5). */
  dense?: boolean;
  /** Key (from rowKey) of the row to show as selected. */
  selectedKey?: string;
}

// Backs every list/grid screen (Lead lists, Order queues, Asset grids) per
// component-catalogue.md §1 - Assumed shape (no design-system analog).
export function DataTable<T>({
  fixedLayout = false,
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = 'No records.',
  emptyAction,
  loading,
  pageSize = 50,
  variant = 'framed',
  dense = false,
  selectedKey,
}: DataTableProps<T>) {
  const plain = variant === 'plain';
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null);

  const isSortable = (col: Column<T>) => col.sortable ?? col.header !== '';

  const toggleSort = (col: Column<T>) => {
    if (!isSortable(col)) return;
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, direction: 'asc' };
      if (prev.direction === 'asc') return { key: col.key, direction: 'desc' };
      return null;
    });
  };

  const sortedRows = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const getValue = col.sortValue ?? ((row: T) => (row as Record<string, unknown>)[col.key] as string | number | null | undefined);
    const sign = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => sign * compareValues(getValue(a), getValue(b)));
  })();

  // The page maths is the Pagination capability's; a pageSize of Infinity shows everything on one page.
  const pw = pageWindow(sortedRows.length, pageSize, page + 1);
  const currentPage = pw.page - 1;
  const pagedRows = sortedRows.slice(pw.from === 0 ? 0 : pw.from - 1, pw.to);
  const showPager = sortedRows.length > pageSize;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    // Keys pressed inside a button or link in the row belong to that control, not to the row.
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter') {
      onRowClick?.(row);
    } else if (event.key === ' ') {
      event.preventDefault();
      onRowClick?.(row);
    }
  };

  if (plain && !loading && rows.length === 0) {
    return <EmptyState compact message={emptyMessage} action={emptyAction} />;
  }

  return (
    <div className={plain ? '' : 'rounded-[var(--radius-card)] border border-[var(--table-border)] bg-bg overflow-hidden'}>
      <div className={plain ? 'overflow-auto max-h-[70vh]' : 'overflow-x-auto'}>
        <table className={`w-full text-left text-[length:var(--fs-body)] ${fixedLayout ? 'table-fixed' : ''}`}>
          <thead className={`${plain ? 'sticky top-0 z-[var(--z-sticky)] ' : ''}bg-[var(--table-header-bg)] text-fg-2`}>
            <tr>
              {columns.map((col) => {
                const sortable = isSortable(col);
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : sortable ? 'none' : undefined}
                    className={`px-4 py-3 font-semibold text-[length:var(--fs-caption-upper)] ${plain ? 'whitespace-nowrap border-b border-[var(--border)]' : ''} ${col.numeric ? 'text-right' : ''} ${col.cellClassName ?? ''}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={`inline-flex min-h-6 items-center gap-1.5 hover:text-fg ${col.numeric ? 'flex-row-reverse' : ''}`}
                      >
                        {col.header}
                        <Icon
                          path={active ? (sort.direction === 'asc' ? SORT_ASC_ICON : SORT_DESC_ICON) : SORT_NEUTRAL_ICON}
                          className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-fg' : 'text-muted'}`}
                        />
                      </button>
                    ) : col.header === '' ? (
                      <span className="sr-only">Actions</span>
                    ) : (
                      <span className={col.hideHeader ? 'sr-only' : undefined}>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState compact message={emptyMessage} action={emptyAction} />
                </td>
              </tr>
            )}
            {!loading &&
              pagedRows.map((row, rowIndex) => {
                const key = rowKey(row);
                const selected = selectedKey !== undefined && selectedKey === key;
                return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-current={selected ? 'true' : undefined}
                  onKeyDown={onRowClick ? (event) => handleRowKeyDown(event, row) : undefined}
                  className={`${plain ? 'border-b border-border-soft last:border-0' : 'border-t border-[var(--table-border)]'} transition-colors ${onRowClick ? 'cursor-pointer hover:bg-surface' : ''} ${selected ? 'bg-tone-accent-soft [&>td:first-child]:shadow-[inset_var(--selected-row-bar)_0_0_var(--accent)]' : ''}`}
                >
                  {columns.map((col, colIndex) => {
                    const value = (row as Record<string, unknown>)[col.key] ?? '-';
                    const linkHref = col.linkTo?.(row);
                    // Falls back to the first-column link cue only when the table
                    // still uses whole-row onRowClick (no per-column linkTo defined
                    // anywhere) - tables using linkTo get real per-column links
                    // instead, so this legacy heuristic doesn't double up with them.
                    const hasAnyColumnLink = columns.some((c) => c.linkTo);
                    const isLinkCol = colIndex === 0 && Boolean(onRowClick) && !hasAnyColumnLink;
                    return (
                      <td
                        key={col.key}
                        className={`px-4 ${dense ? 'py-2' : 'py-3.5'} text-fg ${plain ? 'align-middle' : ''} ${col.numeric ? 'text-right whitespace-nowrap tabular-nums' : ''} ${col.strong ? 'font-semibold' : ''} ${col.cellClassName ?? ''}`}
                      >
                        {col.render ? (
                          col.render(row, rowIndex)
                        ) : plain && !linkHref ? (
                          String(value)
                        ) : linkHref ? (
                          <Link
                            to={linkHref}
                            onClick={(event) => event.stopPropagation()}
                            className="block max-w-xs truncate text-link font-medium hover:underline"
                            title={String(value)}
                          >
                            {String(value)}
                          </Link>
                        ) : (
                          <span
                            className={`block max-w-xs truncate ${isLinkCol ? 'text-link font-medium hover:underline' : ''}`}
                            title={String(value)}
                          >
                            {String(value)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {!loading && showPager && (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--table-border)] px-4 py-2">
          <Pagination className="flex-1" page={currentPage + 1} total={sortedRows.length} pageSize={pageSize} onPage={(p) => setPage(p - 1)} />
        </div>
      )}
    </div>
  );
}
