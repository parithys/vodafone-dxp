import { Button } from '../../components/primitives/Button';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge, type BadgeVariant } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import { RevealValue, useFieldAccess } from './fieldAccess';
import { formatDate } from '../../lib/format';
import { CALENDAR_ICON, CIRCLE_ICON, EYE_ICON, EYE_OFF_ICON, GLOBE_ICON, MAIL_ICON, PHONE_ICON } from '../../assets/icons';


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
    <div className="row min-w-0 meta-cell">
      <Icon path={icon} className="icon-md text-on-dark-2" />
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
      <div className="text-[length:var(--fs-micro)] caps-strong text-on-dark-2 whitespace-nowrap">{label}</div>
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
          <div className="profile-subbar">
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
          <div className="profile-avatar" aria-hidden>
            {initials(p.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="cluster-sm">
              <h1 className="title-on-dark">{p.name}</h1>
              {p.tags?.map((t) => (
                <Badge key={t.label} variant={t.variant}>
                  {t.label}
                </Badge>
              ))}
              {p.nameBadge}
              {p.actions && <div className="ml-auto row-tight">{p.actions}</div>}
            </div>
            <div className="cluster-sm text-on-dark text-[length:var(--fs-body)]">
              <span>
                {idLabel}: <span className="font-medium">{idShown}</span>
              </span>
              {revealButton}
              {p.blacklisted && <Badge variant="danger">Blacklisted</Badge>}
            </div>
            <div className="wrap-center gap-y-3 pt-2">
              {p.phone && <Fact icon={PHONE_ICON} value={p.phone} caption="Primary MSISDN" />}
              {dob && <Fact icon={CALENDAR_ICON} value={dob} caption="Date of Birth" />}
              {p.email && <Fact icon={MAIL_ICON} value={p.email} caption="Email" />}
              {p.preferredLanguage && <Fact icon={GLOBE_ICON} value={p.preferredLanguage} caption="Preferred Language" />}
            </div>
          </div>
        </div>

        <div className="profile-aside">
          <Stat label="Segment" value={p.segment} />
          {p.totalConnections !== undefined && <Stat label="Total Connections" value={p.totalConnections} />}
          {p.creditLimit && <Stat label="Credit Limit" value={p.creditLimit} />}
        </div>

        <aside
          aria-label="Alerts and attention"
          className="rounded-[var(--radius-card)] on-dark-danger p-4 w-full lg:w-56 shrink-0 self-start"
        >
          <div className="row-between mb-3">
            <span className="inline-flex items-center gap-2 font-semibold text-on-dark text-[length:var(--fs-body)]">
              <Icon path={CIRCLE_ICON} className="w-4 h-4 text-danger" />
              Alerts &amp; Attention
            </span>
            {p.alerts.length > 0 && (
              <span className="count-badge-danger">
                {p.alerts.length}
              </span>
            )}
          </div>
          {p.alerts.length === 0 ? (
            <p className="text-on-dark-2 text-[length:var(--fs-body)]">No alerts.</p>
          ) : (
            <ul className="space-y-2">
              {p.alerts.map((a) => (
                <li key={a.label} className="row-tight text-on-dark text-[length:var(--fs-body)]">
                  <span className={`dot shrink-0 ${a.tone === 'danger' ? 'bg-danger' : 'bg-[var(--warn)]'}`} />
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
