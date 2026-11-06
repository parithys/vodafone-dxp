import type { ReactNode } from 'react';
import { Icon } from '../../components/primitives/Icon';
import type { Fact, FactIcon } from './identityFacts';
import { CALENDAR_ICON, GENDER, GLOBE_ICON, IC_BUILDING, ID_CARD, PERSON, USERS } from '../../assets/icons';

// Registry-sourced identity facts, shown as read-only content rather than disabled form controls: nothing here
// can be typed into, so nothing looks like it can. Each fact is a label above its value beside a small icon tile.

const IC: Record<FactIcon, string> = {
  user: PERSON,
  users: USERS,
  calendar: CALENDAR_ICON,
  globe: GLOBE_ICON,
  gender: GENDER,
  idCard: ID_CARD,
  building: IC_BUILDING,
};

function Tile({ icon, className = 'w-9 h-9' }: { icon: FactIcon; className?: string }) {
  return (
    <span className={`${className} rounded-[var(--radius-button)] bg-surface text-fg-2 icon-tile`}>
      <Icon path={IC[icon]} className="size-[18px] " />
    </span>
  );
}

function FactRow({ facts, extra }: { facts: Fact[]; extra?: ReactNode }) {
  const list = (
    <dl className={`identity-grid ${extra ? '@lg:col-span-2 @lg:grid-cols-2' : '@lg:grid-cols-3'}`}>
      {facts.map((f, i) => (
        <div key={f.label} className={`row identity-cell ${i === 0 && !extra ? '@lg:pr-4' : '@lg:px-4'}`}>
          <Tile icon={f.icon} />
          <div className="min-w-0">
            <dt className="text-fg text-[length:var(--fs-caption)] leading-tight">{f.label}</dt>
            <dd className="title title-sm font-semibold leading-snug break-words">{f.value || '-'}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
  if (!extra) return list;
  // The editable control sits in the first column, ahead of the read-only facts.
  return (
    <div className="identity-fields">
      <div className="min-w-0 @lg:pr-4">{extra}</div>
      {list}
    </div>
  );
}

export function IdentityDetailsCard({ facts, status, lastRowExtra }: { facts: Fact[]; status?: string; lastRowExtra?: ReactNode }) {
  // Rows of three, the last row left-aligned however many facts it holds.
  const rows: Fact[][] = [];
  let row: Fact[] = [];
  for (const f of facts) {
    row.push(f);
    if (row.length === 3 || f.endsRow) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length) rows.push(row);
  // An editable control belongs in the last row's first column; a last row that is already full of facts gives it a row of its own.
  const extraInLastRow = Boolean(lastRowExtra) && rows[rows.length - 1]?.length === 2;
  return (
    <section aria-label="Identity Details" className="@container">
      {/* Same heading as "Contact & Notification" (plain, flush left, no icon). */}
      <div className={`spread items-center ${status ? 'mb-0' : 'mb-3'}`}>
        <h3 className="title title-md font-semibold">Identity Details</h3>
      </div>
      {status && (
        <p className="-mt-1 mb-3 success-note">{status}</p>
      )}
      {/* Validated with MOI: a light success wash and border (the same tint recipe the success toast uses) so the
          card reads as registry-confirmed; the icon tiles go white to stay legible on it. */}
      <div
        className={`panel-soft p-5 space-y-4 ${status ? 'tone-success-panel' : ''}`}
      >
        {rows.map((r, i) => (
          <div key={i} className={i > 0 ? 'pt-4 divider-top' : ''}>
            <FactRow facts={r} extra={i === rows.length - 1 && extraInLastRow ? lastRowExtra : undefined} />
          </div>
        ))}
        {lastRowExtra && !extraInLastRow && (
          <div className={`@lg:max-w-[calc(100%/3)] ${rows.length > 0 ? 'pt-4 divider-top' : ''}`}>{lastRowExtra}</div>
        )}
      </div>
    </section>
  );
}
