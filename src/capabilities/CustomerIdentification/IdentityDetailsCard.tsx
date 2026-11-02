import type { ReactNode } from 'react';
import { Icon } from '../../components/primitives/Icon';
import { idNumberLabel, type QidType } from '../../components/domain/QidInput';
import { CALENDAR_ICON, GENDER, GLOBE_ICON, IC_BUILDING, ID_CARD, PERSON, USERS } from '../../assets/icons';

// Registry-sourced identity facts, shown as read-only content rather than disabled form controls: nothing here
// can be typed into, so nothing looks like it can. Each fact is a label above its value beside a small icon tile.

const IC = {
  user: PERSON,
  users: USERS,
  calendar: CALENDAR_ICON,
  globe: GLOBE_ICON,
  gender: GENDER,
  idCard: ID_CARD,
  building: IC_BUILDING,
};

export interface Fact {
  label: string;
  value: string;
  icon: keyof typeof IC;
  /** Ends its row early (the next fact starts a new row), instead of filling it to three. */
  endsRow?: boolean;
}

function Tile({ icon, className = 'w-9 h-9' }: { icon: keyof typeof IC; className?: string }) {
  return (
    <span className={`${className} rounded-[var(--radius-button)] bg-surface text-fg-2 icon-tile`}>
      <Icon path={IC[icon]} className="w-[18px] h-[18px]" />
    </span>
  );
}

function FactRow({ facts, extra }: { facts: Fact[]; extra?: ReactNode }) {
  const list = (
    <dl className={`grid grid-cols-1 divide-y @lg:divide-y-0 @lg:divide-x divide-border-soft ${extra ? '@lg:col-span-2 @lg:grid-cols-2' : '@lg:grid-cols-3'}`}>
      {facts.map((f, i) => (
        <div key={f.label} className={`row min-w-0 py-2 @lg:py-0 ${i === 0 && !extra ? '@lg:pr-4' : '@lg:px-4'}`}>
          <Tile icon={f.icon} />
          <div className="min-w-0">
            <dt className="text-fg text-[length:var(--fs-caption)] leading-tight">{f.label}</dt>
            <dd className="heading-strong leading-snug break-words">{f.value || '-'}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
  if (!extra) return list;
  // The editable control sits in the first column, ahead of the read-only facts.
  return (
    <div className="grid grid-cols-1 @lg:grid-cols-3 gap-y-3 items-center">
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
        <h3 className="subtitle">Identity Details</h3>
      </div>
      {status && (
        <p className="-mt-1 mb-3 text-success font-medium text-[length:var(--fs-caption)]">{status}</p>
      )}
      {/* Validated with MOI: a light success wash and border (the same tint recipe the success toast uses) so the
          card reads as registry-confirmed; the icon tiles go white to stay legible on it. */}
      <div
        className={`card-frame p-5 space-y-4 ${
          status
            ? 'border-tone-success-border bg-tone-success [&_dl_span]:bg-bg'
            : 'border-border-soft bg-bg'
        }`}
      >
        {rows.map((r, i) => (
          <div key={i} className={i > 0 ? 'pt-4 border-t border-border-soft' : ''}>
            <FactRow facts={r} extra={i === rows.length - 1 && extraInLastRow ? lastRowExtra : undefined} />
          </div>
        ))}
        {lastRowExtra && !extraInLastRow && (
          <div className={`@lg:max-w-[calc(100%/3)] ${rows.length > 0 ? 'pt-4 border-t border-border-soft' : ''}`}>{lastRowExtra}</div>
        )}
      </div>
    </section>
  );
}

/** The identity facts every Customer Verification result shows. */
export interface IdentityFields {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  idExpiryDate?: string;
  nationality?: string;
  gender?: string;
  idTypeLabel?: string;
  /** The ID number looked up. Listed only when the caller asks for it (see identityFacts' `idType`). */
  idNumber?: string;
  companyName?: string;
  occupation?: string;
}

/**
 * One list of facts for every journey, so the card reads the same everywhere. The content follows the context:
 * the document type is left out where the agent already chose it (`showDocumentType` false). Sponsor and Occupation are not listed:
 * they are captured, and shown in Customer 360 only.
 */
export function identityFacts(f: IdentityFields, opts: { showDocumentType?: boolean; idType?: QidType } = {}): Fact[] {
  const { showDocumentType = true, idType } = opts;
  const expiry: Fact = { icon: 'calendar', label: 'ID Expiry Date', value: f.idExpiryDate ?? '' };
  const names: Fact[] = [
    { icon: 'user', label: 'First Name', value: f.firstName ?? '' },
    { icon: 'users', label: 'Middle Name(s)', value: f.middleName ?? '' },
    { icon: 'user', label: 'Last Name', value: f.lastName ?? '' },
  ];
  const dob: Fact = { icon: 'calendar', label: 'Date of Birth', value: f.dob ?? '' };
  const rest: Fact[] = [
    { icon: 'globe', label: 'Nationality', value: f.nationality ?? '' },
    { icon: 'gender', label: 'Gender', value: f.gender ?? '' },
    ...(showDocumentType ? [{ icon: 'idCard' as const, label: 'Document Type', value: f.idTypeLabel ?? '' }] : []),
    // Sponsor and Occupation are captured (on the contact and the order) but not shown in a journey: they are visible in Customer 360 only.
  ];
  // The ID that was looked up leads, read-only, when the caller passes the ID type that names it ("Qatar ID (QID) Number"): the ID number and
  // its expiry and the date of birth on the first row, the three names on the second, then nationality and gender.
  if (idType && f.idNumber) {
    return [
      { icon: 'idCard', label: idNumberLabel(idType), value: f.idNumber },
      expiry,
      { ...dob, endsRow: true },
      names[0],
      names[1],
      { ...names[2], endsRow: true },
      ...rest,
    ];
  }
  return [names[0], names[1], names[2], dob, expiry, ...rest];
}
