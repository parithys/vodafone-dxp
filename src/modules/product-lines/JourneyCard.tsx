import { Link } from 'react-router-dom';
import { Badge } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import type { Journey, JourneyStatus } from '../../navigation/journeyCatalogue';

const ARROW_RIGHT = 'M5 12h14 M13 5l7 7-7 7';

// Status drives the whole card treatment: badge variant, border, and whether
// the card is a link at all. All three reuse existing Badge variants and
// --warn / --success tokens - no new tokens or primitives.
const STATUS: Record<JourneyStatus, {
  label: string;
  variant: 'success' | 'warning' | 'filled-neutral';
  border: string;
  cta: string;
}> = {
  available: {
    label: 'Available',
    variant: 'success',
    border: 'border-[var(--field-card-border)] hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]',
    cta: 'Start now',
  },
  partly: {
    label: 'Partly Available',
    variant: 'warning',
    border: 'border-[var(--field-card-border)] hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]',
    cta: 'Check compatibility',
  },
  planned: {
    label: 'Planned',
    variant: 'filled-neutral',
    // Dashed border and a greyed surface = nothing to click, so a planned card never looks interactive.
    border: 'border-dashed border-[var(--field-card-border)]',
    cta: '',
  },
};

export function JourneyCard({ journey, index, to, state }: { journey: Journey; index: number; to?: string; state?: Record<string, unknown> }) {
  const s = STATUS[journey.status];
  const interactive = Boolean(to) && journey.status !== 'planned';

  const body = (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant={s.variant}>{s.label}</Badge>
        <span className="flex items-center gap-2 text-[length:var(--fs-caption)] text-muted shrink-0">
          {journey.product && <span>{journey.product}</span>}
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        </span>
      </div>
      <div
        className={`font-medium text-[length:var(--fs-body-lg)] mb-1 ${
          journey.status === 'planned' ? 'text-muted' : 'text-fg'
        }`}
      >
        {journey.title}
      </div>
      <p className={`text-[length:var(--fs-body)] ${journey.status === 'planned' ? 'text-muted' : 'text-fg-2 mb-3'}`}>{journey.description}</p>
      {interactive ? (
        <span
          className={`inline-flex items-center gap-1.5 font-medium text-[length:var(--fs-body)] ${
            journey.status === 'available' ? 'text-link' : 'text-[var(--warn-text)]'
          }`}
        >
          {s.cta}
          {journey.status === 'available' && <Icon path={ARROW_RIGHT} className="w-4 h-4" />}
        </span>
      ) : null}
    </>
  );

  const shell = `rounded-[var(--radius-card)] border p-5 transition-all ${journey.status === 'planned' ? 'bg-light-neutral' : 'bg-bg'} ${s.border}`;

  if (!interactive) return <div className={shell}>{body}</div>;
  return (
    // `startFresh` marks this as STARTING a journey rather than returning to
    // one. GuidedActivationWizard discards any saved draft when it sees it, so
    // a card click always opens step 1 with nothing filled in - an agent who
    // reaches for "New Postpaid Connection" has a new customer at the counter,
    // and resuming the previous one's half-finished order is worse than
    // useless: it starts them on a step they never visited, against an ID they
    // never scanned.
    //
    // Carried in location.state, NOT read from the route, so that RESUMING
    // still works. The draft persists deliberately, and a mid-journey reload
    // or a step click in the rail must not wipe it - only an explicit start
    // does.
    <Link to={to!} state={{ ...(state ?? { startFresh: true }), navJourney: journey.id }} className={`group block ${shell}`}>
      {body}
    </Link>
  );
}
