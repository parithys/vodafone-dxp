import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../../components/primitives/Button';
import { Drawer } from '../../components/primitives/Drawer';
import { Icon } from '../../components/primitives/Icon';
import { useNotificationStore } from '../../stores/notificationStore';
import type { PolicyLink, PolicyTable } from '../../data/planPolicy';
import { formatQar } from '../../lib/format';
import { BARS, CHEVRON_DOWN, CHEVRON_RIGHT, CLOSE, CUBE, EXTERNAL, HOUSE, ICONS_DOC, ICON_CARD, ICON_GIFT, ICON_PHONE, MEGAPHONE, SHARE, SERVICE, SORT_ASC_ICON, SPARKLES, STATUS, TAG } from '../../assets/icons';

// The "View details" drawer on a Recommended-offers card (2026-10-04 design: Recommended-offers-02).
// Every value shown comes from the offer / its linked plans; nothing here is typed in per offer.

/** The offer fields the drawer reads - structural, so the step's own Offer type satisfies it. */
export interface OfferDetails {
  offerName: string;
  offerDescription: string;
  monthlyRental: number;
  campaignCode: string;
  /** Label for the code row; a plan shows its product code here. Defaults to 'Campaign code'. */
  codeLabel?: string;
  status: string;
  offerType?: string;
  priorityCode?: string;
  treatmentCode?: string;
  channel?: string;
  promotionId?: string;
  addOnMonthly?: number;
  /** When set, the drawer shows this policy (bullets, tables, links) in place of Offer information / Included items. */
  policy?: { title: string; bullets: string[]; tables: PolicyTable[]; links: PolicyLink[] };
}

const ICONS = {
  close: CLOSE,
  up: SORT_ASC_ICON,
  down: CHEVRON_DOWN,
  right: CHEVRON_RIGHT,
  gift: ICON_GIFT,
  house: HOUSE,
  phone: ICON_PHONE,
  service: SERVICE,
  tag: TAG,
  card: ICON_CARD,
  megaphone: MEGAPHONE,
  sparkles: SPARKLES,
  bars: BARS,
  share:
    SHARE,
  status: STATUS,
  cube: CUBE,
  doc: ICONS_DOC,
  external: EXTERNAL,
};

const PANEL = 'rounded-[var(--radius-card)] border border-border-soft bg-bg';

/** A titled, collapsible block. The chevron points the way the block will move: up while open. */
function Section({ title, defaultOpen = true, chevronWhenOpen = 'up', children }: { title: string; defaultOpen?: boolean; chevronWhenOpen?: 'up' | 'down'; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const openIcon = chevronWhenOpen === 'up' ? ICONS.up : ICONS.down;
  const closedIcon = chevronWhenOpen === 'up' ? ICONS.down : ICONS.up;
  return (
    <section className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-[var(--radius-button)] text-left focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
      >
        <h3 className="text-fg font-bold text-[length:var(--fs-h5)]">{title}</h3>
        <Icon path={open ? openIcon : closedIcon} className="w-5 h-5 text-fg" />
      </button>
      {open && children}
    </section>
  );
}

function IconDisc({ path, className = '' }: { path: string; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-[var(--radius-pill)] ${className}`}>
      <Icon path={path} className="w-5 h-5" />
    </span>
  );
}

export function OfferDetailsDrawer({
  offer,
  serviceLabel,
  prepaid = false,
  fixedService,
  highlight,
  includedNames,
  showRelatedDocuments = true,
  planDetails,
  hideStatusTags = false,
  selected,
  onSelect,
  onClose,
}: {
  /** The offer whose details are open; null keeps the drawer closed. */
  offer: OfferDetails | null;
  serviceLabel: string;
  /** The offer sells a prepaid pack, priced once; otherwise its rental is monthly. */
  prepaid?: boolean;
  /** True for the home services (fixed line, FWA): they get the house artwork, the rest the handset. */
  fixedService: boolean;
  /** One line of what the linked plan includes, read from its product record; null hides the banner. */
  highlight: { title: string; subtitle: string } | null;
  includedNames: string[];
  /** The "Need more information?" block. A plan's drawer leaves it out: no document exists for it, so it is generic filler. */
  showRelatedDocuments?: boolean;
  /** The plan's own facts (data, minutes, SMS, bill limit), listed as "Plan Details" under the banner. */
  planDetails?: string[];
  /** Leaves out the Available / type pills under the title (a plan's drawer: they say nothing about the plan). */
  hideStatusTags?: boolean;
  selected: boolean;
  /** Selects this offer (a no-op to the caller if it already is). The drawer closes after. */
  onSelect: () => void;
  onClose: () => void;
  /** Drawer width; defaults to 30% of the viewport (at least 420px). */
}) {
  const pushToast = useNotificationStore((s) => s.pushToast);
  // Keep the last offer rendered while the drawer slides out, so its content does not vanish mid-animation.
  const [shown, setShown] = useState<OfferDetails | null>(offer);
  if (offer && offer !== shown) setShown(offer);
  const o = offer ?? shown;

  const rows: { icon: string; label: string; value?: string; pill?: boolean }[] = o
    ? [
        { icon: ICONS.service, label: 'Service', value: serviceLabel },
        { icon: ICONS.tag, label: 'Offer Type', value: o.offerType },
        { icon: ICONS.card, label: 'Monthly Rental', value: `${formatQar(o.monthlyRental)}${prepaid ? '' : '/mo'}` },
        { icon: ICONS.card, label: 'Add-On (Monthly)', value: o.addOnMonthly ? `${formatQar(o.addOnMonthly)}/mo` : undefined },
        { icon: ICONS.service, label: o.codeLabel ?? 'Campaign code', value: o.campaignCode },
        { icon: ICONS.megaphone, label: 'Promotion', value: o.promotionId },
        { icon: ICONS.sparkles, label: 'Treatment', value: o.treatmentCode },
        { icon: ICONS.bars, label: 'Priority', value: o.priorityCode },
        { icon: ICONS.share, label: 'Channel', value: o.channel },
        { icon: ICONS.status, label: 'Status', value: o.status, pill: true },
      ].filter((r) => r.value)
    : [];

  // The shared Drawer lays the two buttons out equally.
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          if (!selected) onSelect();
          onClose();
        }}
      >
        {selected ? 'Selected' : 'Select this offer'}
        {!selected && <Icon path={ICONS.right} className="w-4 h-4" />}
      </Button>
    </>
  );

  return (
    <Drawer
      open={offer !== null}
      onClose={onClose}
      title="Offer Details"
      footer={footer}
      bodyClassName="px-6 pb-6 pt-6"
    >
      {o && (
        <div className="space-y-6">
          {/* Offer summary */}
          <div className="flex items-start gap-4">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-surface-warm">
              <IconDisc path={fixedService ? ICONS.house : ICONS.phone} className="h-16 w-16 bg-bg text-accent" />
            </span>
            <div className="min-w-0 space-y-2">
              <h2 className="text-fg font-bold text-[length:var(--fs-h5)] leading-tight">{o.offerName}</h2>
              <p className="text-fg-2 text-[length:var(--fs-body)]">{o.offerDescription}</p>
              {!hideStatusTags && <div className="flex flex-wrap gap-2">
                <span className="rounded-[var(--radius-pill)] bg-surface-warm text-accent px-3 py-1 text-[length:var(--fs-caption)] font-medium">{o.status}</span>
                {o.offerType && <span className="rounded-[var(--radius-pill)] bg-surface text-fg-2 px-3 py-1 text-[length:var(--fs-caption)] font-medium">{o.offerType}</span>}
              </div>}
            </div>
          </div>

          {/* What the plan includes */}
          {highlight && (
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface-warm px-5 py-4 flex items-center gap-4">
              <Icon path={ICONS.gift} className="w-9 h-9 shrink-0 text-accent" />
              <div className="min-w-0 pr-16">
                <p className="text-fg font-bold text-[length:var(--fs-body)]">{highlight.title}</p>
                <p className="text-fg-2 text-[length:var(--fs-caption)]">{highlight.subtitle}</p>
              </div>
              <svg viewBox="0 0 120 80" className="absolute right-0 top-0 h-full w-28" aria-hidden="true" preserveAspectRatio="xMaxYMid slice">
                <circle cx="95" cy="40" r="46" fill="var(--accent)" fillOpacity="0.12" />
                <circle cx="120" cy="40" r="32" fill="var(--accent)" fillOpacity="0.45" />
              </svg>
            </div>
          )}

          {planDetails && planDetails.length > 0 && (
            <Section title="Plan Details">
              <ul className={`${PANEL} p-4 space-y-2`}>
                {planDetails.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-fg text-[length:var(--fs-body)]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-[var(--radius-pill)] bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {o.policy ? (
            <Section title={o.policy.title}>
              <div className={`${PANEL} p-4 space-y-4`}>
                <ul className="list-disc space-y-2 pl-5 text-fg text-[length:var(--fs-body)]">
                  {o.policy.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {o.policy.tables.map((t, i) => (
                  <div key={i} className="space-y-2">
                    {t.title && <p className="text-fg text-[length:var(--fs-body)]">{t.title}</p>}
                    <table className="w-full border-collapse text-left text-[length:var(--fs-body)]">
                      <thead>
                        <tr>
                          {t.head.map((h) => (
                            <th key={h} className="border border-border-soft bg-accent px-3 py-2 font-bold text-accent-on">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map(([k, v]) => (
                          <tr key={k}>
                            <th scope="row" className="border border-border-soft px-3 py-2 font-bold text-fg">
                              {k}
                            </th>
                            <td className="border border-border-soft px-3 py-2 font-bold text-fg">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <ul className="list-disc space-y-3 pl-5 text-fg text-[length:var(--fs-body)]">
                  {o.policy.links.map((l) => (
                    <li key={l.text}>
                      {l.text}
                      {l.label && (
                        <button
                          type="button"
                          onClick={() => pushToast('info', 'This page is not available yet.', { key: 'policy-link' })}
                          className="mt-1 block text-left text-link hover:underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-[var(--radius-sm)]"
                        >
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          ) : (
            <>
          <Section title="Offer Information">
            <dl className={`${PANEL} px-4`}>
              {rows.map((r, i) => (
                <div key={r.label} className="flex items-center gap-4">
                  <IconDisc path={r.icon} className="h-10 w-10 bg-surface text-fg-2" />
                  <div className={`flex flex-1 items-center justify-between gap-4 py-4 ${i > 0 ? 'border-t border-border-soft' : ''}`}>
                    <dt className="text-fg text-[length:var(--fs-body)]">{r.label}</dt>
                    <dd className="text-right">
                      {r.pill ? (
                        <span className="rounded-[var(--radius-pill)] bg-tone-success text-success px-3 py-1 text-[length:var(--fs-caption)] font-medium">{r.value}</span>
                      ) : (
                        <span className="text-fg text-[length:var(--fs-body)]">{r.value}</span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Section>

          {includedNames.length > 0 && (
            <Section title="Included Plans and Add-Ons">
              <div className={`${PANEL} p-4 flex items-start gap-4`}>
                <IconDisc path={ICONS.cube} className="h-14 w-14 bg-surface-warm text-accent" />
                <div className="space-y-2 pt-1">
                  <p className="text-fg-2 text-[length:var(--fs-body)]">
                    {includedNames.length} item{includedNames.length === 1 ? '' : 's'} included
                  </p>
                  <ul className="space-y-1">
                    {includedNames.map((n) => (
                      <li key={n} className="flex items-center gap-3 text-fg text-[length:var(--fs-body)]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-[var(--radius-pill)] bg-accent" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          )}

            </>
          )}

          {!o.policy && showRelatedDocuments && (
          <Section title="Need more information?" chevronWhenOpen="down">
            <div className={`${PANEL} p-4 flex items-center gap-4`}>
              <IconDisc path={ICONS.doc} className="h-14 w-14 bg-surface text-fg-2" />
              <div className="flex-1">
                <p className="text-fg font-medium text-[length:var(--fs-body)]">Related Documents</p>
                <p className="text-fg-2 text-[length:var(--fs-caption)]">Terms, conditions and more</p>
              </div>
              {/* No offer documents exist in the app yet, so this says so instead of going nowhere. */}
              <Button variant="tertiary" compact onClick={() => pushToast('info', 'No documents are attached to this offer yet', { key: 'offer-documents' }) }>
                View documents
                <Icon path={ICONS.external} className="w-4 h-4" />
              </Button>
            </div>
          </Section>
          )}
        </div>
      )}
    </Drawer>
  );
}
