import { Button } from '../../components/primitives/Button';
import { useState } from 'react';
import { Drawer } from '../primitives/Drawer';
import { Icon } from '../primitives/Icon';
import type { EligibilityResult } from './eligibilityTypes';
import { ROW_TONE, ICON_TONE, ROW_ICON, buildEligibilityRows, OUTCOME_LEGEND } from './eligibilityRowsModel';
import type { EligibilityRow } from './eligibilityRowsModel';

/** The divided-list row treatment, shared between the inline "needs
 * attention" panel (unresolved rows only) and the "View eligibility checks"
 * popup (every row) - see buildEligibilityRows' own note on why this is one
 * function rather than two near-identical blocks. */
export function EligibilityChecksList({ rows }: { rows: EligibilityRow[] }) {
  return (
    <ul className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] overflow-hidden divide-y divide-border-soft">
      {rows.map((row) => (
        <li key={row.id} className={`flex items-center gap-3 px-4 py-3 ${ROW_TONE[row.tone]}`}>
          <Icon path={ROW_ICON[row.tone]} className={`w-5 h-5 shrink-0 ${ICON_TONE[row.tone]}`} />
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-[length:var(--fs-body)] ${row.tone === 'advisory' ? 'text-[var(--tint-blue-fg)]' : 'text-fg'}`}>{row.title}</p>
            {/* The RESULT, not a static description of what the check does -
                see the inline panel's own note on this below. */}
            {row.detail && (
              <p className={`text-[length:var(--fs-caption)] leading-snug whitespace-pre-line ${row.tone === 'advisory' ? 'text-[var(--tint-blue-fg)]' : 'text-fg-2'}`}>{row.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function EligibilityOutcomeLegend() {
  return (
    <div className="mt-6 pt-4 border-t border-border-soft">
      <h4 className="text-fg font-semibold text-[length:var(--fs-body)] mb-2">What These Outcomes Mean</h4>
      <ul className="list-disc pl-5 space-y-2">
        {OUTCOME_LEGEND.map((item) => (
          <li key={item.title} className="text-[length:var(--fs-caption)] leading-snug">
            <span className="font-semibold text-fg">{item.title}</span>{' '}
            <span className="text-fg-2">{item.detail}</span>
            <br />
            <span className="text-muted italic">{item.example}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Footer-left link (2026-09-28: "Add a text link on the left side. On click,
 * open a popup showing all eligibility checks performed and their results.")
 *
 * The inline panel below renders NOTHING once every check passes (a
 * deliberate silence - see its own note on `unresolved.length === 0`), so a
 * clean run leaves no on-screen trace of what actually ran beyond a toast
 * that has already faded. This is the way back to that full list, available
 * regardless of whether anything needs attention.
 */
export function EligibilityChecksLink({
  eligibility,
  journeyType = 'postpaid',
  label = 'View eligibility checks',
}: {
  eligibility: EligibilityResult | undefined;
  journeyType?: 'postpaid' | 'prepaid';
  /** Link text, also used as the drawer title when overridden. */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!eligibility) return null;
  const rows = buildEligibilityRows(eligibility.checks, eligibility.requiresHrnAdvance, eligibility.nationality, journeyType, eligibility.isExistingCustomer);
  return (
    <>
      <Button variant="tertiary" compact onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title={label === 'View eligibility checks' ? 'Eligibility Checks' : label}>
        <EligibilityChecksList rows={rows} />
        <EligibilityOutcomeLegend />
      </Drawer>
    </>
  );
}
