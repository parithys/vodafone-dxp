export interface SummaryTable {
  /** Red heading row; omit for the first, untitled table. */
  title?: string;
  /** Bold row labels (the summary table) vs plain (Due today / Bill Explainer). */
  boldLabels?: boolean;
  /** `agentOnly`: an operational figure (credit limit, bill limit) the customer's pop-up does not show. */
  rows: { label?: string; value: string; detail?: string; boldLabel?: boolean; boldValue?: boolean; agentOnly?: boolean }[];
}

/** The bordered two-column tables shared by Checkout and the CAF read-back. */
export function SummaryTables({ tables }: { tables: SummaryTable[] }) {
  const cell = 'table-cell';
  return (
    // Two columns on wide screens, stacked on narrow ones. With three or more tables the first sits
    // in the left column and the rest stack in the right one (Due today, then the bill explainer).
    <div className="auto-fit-grid">
      {tables.map((t, ti) => (
        <table
          key={ti}
          className={`table-plain body-text ${tables.length > 2 ? (ti === 0 ? 'lg:col-start-1 lg:row-span-2' : 'lg:col-start-2') : ''}`}
        >
          {t.title && (
            <thead>
              <tr>
                <th colSpan={2} className={`${cell} text-left font-semibold text-accent`}>
                  {t.title}
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {t.rows.map((row, i) => (
              <tr key={i} className={row.agentOnly ? 'agent-only' : undefined}>
                <th scope="row" className={`${cell} table-label-cell ${row.boldLabel ?? t.boldLabels ? 'font-semibold' : 'font-normal'}`}>
                  {row.label ?? ''}
                </th>
                <td className={`${cell} ${row.boldValue ? 'font-semibold' : ''}`}>
                  {row.value}
                  {row.detail && <span className="block caption-muted">{row.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
