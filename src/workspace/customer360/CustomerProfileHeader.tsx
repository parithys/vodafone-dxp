import { Button } from '../../components/primitives/Button';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge, type BadgeVariant } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import { RevealValue, useFieldAccess } from './fieldAccess';
import { formatDate } from '../../lib/format';

const PHONE_ICON = 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z';
const MAIL_ICON = 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6';
const CALENDAR_ICON = 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M16 2v4 M8 2v4 M3 10h18';
const GLOBE_ICON = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20';
const CIRCLE_ICON = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z';
const EYE_ICON = 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
const EYE_OFF_ICON = 'M3 3l18 18 M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.9 M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a10 10 0 0 0 4.4-1';

export interface HeaderAlert {
  label: string;
  tone: 'danger' | 'warning';
}

export interface CustomerProfileHeaderProps {
  /** Full-bleed: no card around it - only a bottom border, and no space outside it. */
  flush?: boolean;
  name: string;
  qid: string;
  idType: string;
  /** Tags beside the name (VIP, Postpaid ...). */
  tags?: { label: string; variant: BadgeVariant }[];
  /** Anything else that belongs beside the name (the segment tag of a reimbursed line). */
  nameBadge?: ReactNode;
  /** Shown under the contact facts (the linked business). */
  belowFacts?: ReactNode;
  blacklisted: boolean;
  dob?: string;
  preferredLanguage?: string;
  /** Primary MSISDN. */
  phone?: string;
  email?: string;
  segment: string;
  totalConnections?: number;
  creditLimit?: string;
  alerts: HeaderAlert[];
  /** Opens the alerts view; the link is omitted when not given. */
  onViewAlerts?: () => void;
  /** Header actions (Edit profile) - only for layouts that have no other way to edit the profile. */
  actions?: ReactNode;
  accountNumber?: string;
  /** Mask the ID number until revealed; `onRequestReveal` decides whether the agent may (verification gate). */
  maskId?: boolean;
  onRequestReveal?: (reveal: () => void) => void;
  /** Keep a slim identity bar pinned to the top once this header has scrolled out of view. */
  pinIdentity?: boolean;
}

const maskedId = (id: string) => (id.length > 3 ? `${'•'.repeat(id.length - 3)}${id.slice(-3)}` : id);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join('')
    .toUpperCase();

function formatDob(dob?: string) {
  if (!dob) return undefined;
  const d = new Date(dob);
  return Number.isNaN(d.getTime()) ? dob : formatDate(d);
}

/** One identity fact: icon, value over a caption. Facts sit in a row separated by thin vertical rules. */
function Fact({ icon, value, caption }: { icon: string; value: string; caption: string }) {
  const mode = useFieldAccess()(caption);
  if (mode === 'hidden') return null;
  return (
    <div className="flex items-center gap-3 min-w-0 px-3 first:pl-0 border-l border-on-dark-line-2 first:border-l-0">
      <Icon path={icon} className="w-5 h-5 text-on-dark-2 shrink-0" />
      <div className="min-w-0">
        <div className="text-on-dark font-medium text-[length:var(--fs-body)] break-words">{mode === 'drill-down' ? <RevealValue>{value}</RevealValue> : value}</div>
        <div className="text-on-dark-2 text-[length:var(--fs-caption)]">{caption}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  const mode = useFieldAccess()(label);
  if (mode === 'hidden') return null;
  return (
    <div className="py-2.5 first:pt-0 last:pb-0 border-b border-on-dark-line-2 last:border-0">
      <div className="text-[length:var(--fs-micro)] uppercase tracking-wide text-on-dark-2 font-semibold whitespace-nowrap">{label}</div>
      <div className="text-on-dark font-semibold text-[length:var(--fs-body-lg)]">{mode === 'drill-down' ? <RevealValue>{value}</RevealValue> : value}</div>
    </div>
  );
}

/**
 * The Customer 360 profile header: identity on the left (avatar, name and tags, ID with whitelist status, then
 * date of birth / preferred language / primary MSISDN / email), key figures in the middle (segment,
 * total connections, credit limit) and an Alerts & Attention card on the right. Shared by every persona; every
 * value is omitted when absent.
 */
export function CustomerProfileHeader(p: CustomerProfileHeaderProps) {
  const dob = formatDob(p.dob);
  const [revealed, setRevealed] = useState(false);
  const idShown = p.maskId && !revealed ? maskedId(p.qid) : p.qid;
  const idLabel = p.idType === 'QID' ? 'QID' : p.idType;
  // Re-mask whenever the customer changes.
  useEffect(() => setRevealed(false), [p.qid]);
  // Pinned identity bar: appears only once the full header has scrolled out of view.
  const sectionRef = useRef<HTMLElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    if (!p.pinIdentity || !sectionRef.current) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [p.pinIdentity]);
  const revealButton = p.maskId && (
    <Button variant="tertiary" compact className="!text-on-dark" onClick={() => (revealed ? setRevealed(false) : p.onRequestReveal ? p.onRequestReveal(() => setRevealed(true)) : setRevealed(true))} aria-label={revealed ? `Hide ${idLabel} number` : `Show ${idLabel} number`} aria-pressed={revealed}>
      <Icon path={revealed ? EYE_OFF_ICON : EYE_ICON} className="w-4 h-4" />
      {revealed ? 'Hide' : 'Show'}
    </Button>
  );
  return (
    <>
    {p.pinIdentity && (
      <div className="sticky top-0 z-[var(--z-sticky-raised)] h-0" aria-hidden={!offscreen}>
        {offscreen && (
          <div className="absolute inset-x-0 -mx-8 flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[var(--field-card-border)] bg-bg px-8 py-2 shadow-raised text-[length:var(--fs-body)]">
            <span className="font-bold text-fg">{p.name}</span>
            <span className="text-fg-2">
              {idLabel}: <span className="text-fg font-medium">{idShown}</span>
            </span>
            {p.accountNumber && (
              <span className="text-fg-2">
                Account: <span className="text-fg font-medium">{p.accountNumber}</span>
              </span>
            )}
            {p.phone && <span className="text-fg-2">{p.phone}</span>}
          </div>
        )}
      </div>
    )}
    <section
      ref={sectionRef}
      className={p.flush ? 'border-b bg-[var(--title-band-bg)] text-on-dark p-5' : 'card border-[var(--field-card-border)] bg-charcoal-panel text-on-dark p-5 mb-4'}
    >
      <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-6">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-16 h-16 rounded-[var(--radius-card-lg)] bg-[var(--brand-plum)] text-on-dark shadow-[var(--shadow-icon-tile)] flex items-center justify-center text-[length:var(--fs-h4)] font-bold shrink-0" aria-hidden>
            {initials(p.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[length:var(--fs-h4)] font-bold text-on-dark break-words min-w-0">{p.name}</h1>
              {p.tags?.map((t) => (
                <Badge key={t.label} variant={t.variant}>
                  {t.label}
                </Badge>
              ))}
              {p.nameBadge}
              {p.actions && <div className="ml-auto flex items-center gap-2">{p.actions}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-on-dark text-[length:var(--fs-body)]">
              <span>
                {idLabel}: <span className="font-medium">{idShown}</span>
              </span>
              {revealButton}
              {p.blacklisted && <Badge variant="danger">Blacklisted</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-y-3 pt-2">
              {p.phone && <Fact icon={PHONE_ICON} value={p.phone} caption="Primary MSISDN" />}
              {dob && <Fact icon={CALENDAR_ICON} value={dob} caption="Date of Birth" />}
              {p.email && <Fact icon={MAIL_ICON} value={p.email} caption="Email" />}
              {p.preferredLanguage && <Fact icon={GLOBE_ICON} value={p.preferredLanguage} caption="Preferred Language" />}
            </div>
          </div>
        </div>

        <div className="lg:border-l lg:border-on-dark-line-2 lg:pl-6 lg:w-52 min-w-40 shrink-0 flex flex-col justify-center">
          <Stat label="Segment" value={p.segment} />
          {p.totalConnections !== undefined && <Stat label="Total Connections" value={p.totalConnections} />}
          {p.creditLimit && <Stat label="Credit Limit" value={p.creditLimit} />}
        </div>

        <aside
          aria-label="Alerts and attention"
          className="rounded-[var(--radius-card)] border border-[var(--on-dark-danger-line)] bg-[var(--on-dark-danger-fill)] p-4 w-full lg:w-56 shrink-0 self-start"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 font-semibold text-on-dark text-[length:var(--fs-body)]">
              <Icon path={CIRCLE_ICON} className="w-4 h-4 text-danger" />
              Alerts &amp; Attention
            </span>
            {p.alerts.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-[var(--radius-pill)] bg-danger-solid text-on-dark text-[length:var(--fs-micro)] font-semibold">
                {p.alerts.length}
              </span>
            )}
          </div>
          {p.alerts.length === 0 ? (
            <p className="text-on-dark-2 text-[length:var(--fs-body)]">No alerts.</p>
          ) : (
            <ul className="space-y-2">
              {p.alerts.map((a) => (
                <li key={a.label} className="flex items-center gap-2 text-on-dark text-[length:var(--fs-body)]">
                  <span className={`w-2 h-2 rounded-[var(--radius-pill)] shrink-0 ${a.tone === 'danger' ? 'bg-danger' : 'bg-[var(--warn)]'}`} />
                  {a.label}
                </li>
              ))}
            </ul>
          )}
          {p.onViewAlerts && (
            <Button variant="tertiary" type="button" onClick={p.onViewAlerts} className="mt-3 !text-on-dark">
              View all alerts &rarr;
            </Button>
          )}
        </aside>
      </div>
      {/* Spans the whole header, under the identity, figures and alerts columns. */}
      {p.belowFacts}
    </section>
    </>
  );
}
