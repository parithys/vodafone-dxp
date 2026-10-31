import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { OfferDetailsDrawer } from './OfferDetailsDrawer';
import type { OfferProduct } from '../../components/primitives/offerCardParts';
import { CARD_HIGHLIGHT, CARD_IDLE, CARD_SELECTED, SelectedTick, STAR_ICON } from '../../components/primitives/offerCardParts';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { journeyLabel, continuesHere, offerTypeOf, hasDestination, offerTypesFor, isHomeJourney, isPrepaidJourney } from './serviceJourneys';
import type { OfferJourneys } from './serviceJourneys';
import { HandOff } from './HandOff';
import { offerHighlight } from './crossSalesModel';
import type { CrossSalesValue, Offer } from './crossSalesModel';
import { OFFERS_PER_TYPE, SAMPLE_OFFERS } from '../../data/synthetic/sampleOffers';

export function CrossSalesStep({
  customerId,
  value,
  onChange,
  onHandOff,
  onContinue,
  onInterestedOffer,
  journey = 'new-postpaid',
  showAllOfferTypes = false,
}: {
  customerId: string | undefined;
  value: CrossSalesValue;
  onChange: (v: CrossSalesValue) => void;
  onHandOff: (route: string) => void;
  /** With onInterestedOffer: each card carries its own Select Offer (take this offer and go on) and Interested (raise a lead
   * for it) buttons in place of "Select offer". */
  onContinue?: () => void;
  onInterestedOffer?: (offer: Offer) => Promise<void>;
  /** The journey (or journeys) this step belongs to: their offers continue here, every other journey's hand off. */
  journey?: OfferJourneys;
  /**
   * Shows every offer type, none hidden, each topped up with illustrative sample offers to three cards whether or not the customer has real ones
   * (existing customers). Sample offers can be looked at but not selected. Off: only the types the customer has offers for.
   */
  showAllOfferTypes?: boolean;
}) {
  const offerTypes = offerTypesFor(journey);
  const [offers, setOffers] = useState<Offer[] | undefined>();
  // The offer whose comprehensive details are open in the side drawer.
  const [detailOffer, setDetailOffer] = useState<Offer | null>(null);
  // Accept on a card selects the offer, then goes on once that selection has reached the journey's values.
  const [advanceFor, setAdvanceFor] = useState<string | undefined>();
  const [leadBusy, setLeadBusy] = useState<string | undefined>();
  useEffect(() => {
    if (advanceFor && value.decision === 'accepted' && value.offerId === advanceFor) {
      setAdvanceFor(undefined);
      onContinue?.();
    }
  }, [advanceFor, value, onContinue]);
  const [products, setProducts] = useState<Record<string, OfferProduct>>({});
  useEffect(() => {
    let cancelled = false;
    mockDataEngine
      .list<OfferProduct>('products')
      .then((all) => {
        if (!cancelled) setProducts(Object.fromEntries(all.map((p) => [p.productId, p])));
      })
      .catch(() => {
        // Offers fall back to their ids when the product names cannot be loaded.
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const productNames = Object.fromEntries(Object.entries(products).map(([id, p]) => [id, p.name]));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [all, contacts] = await Promise.all([
        mockDataEngine.list<Offer>('cross-sales-offers'),
        mockDataEngine.list<{ contactRecordId: string; customerId: string }>('customer-contacts'),
      ]);
      const mine = new Set(contacts.filter((c) => c.customerId === customerId).map((c) => c.contactRecordId));
      // Open offers for this customer, in one of the five offer types.
      const open = all.filter((o) => mine.has(o.contactId) && (o.status === 'Offered' || o.status === 'Interested') && offerTypesFor(journey).some((t) => t.key === offerTypeOf(o.serviceJourney)));
      if (!cancelled) setOffers(open);
    })();
    return () => {
      cancelled = true;
    };
  }, [customerId, journey]);

  // Nothing on offer is its own outcome, not an empty state to sit in.
  useEffect(() => {
    if (offers && offers.length === 0 && value.decision !== 'none') onChange({ decision: 'none' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers]);

  if (!offers) return <p className="text-muted text-[length:var(--fs-body)]">Checking for cross-sales offers…</p>;
  if (offers.length === 0 && !showAllOfferTypes) {
    return (
      <div className="flex items-center gap-5 rounded-[var(--radius-card-lg)] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--bg),var(--surface-subtle))] p-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-bg text-[var(--tint-teal-fg)] shadow-[var(--shadow-icon-tile)]">
          <Icon path="M3 17l6-6 4 4 8-8 M15 7h6v6" className="w-6 h-6" />
        </span>
        <div className="min-w-0">
          <p className="text-fg font-semibold text-[length:var(--fs-body)]">No Cross-Sales Offer Available</p>
          <p className="text-fg-2 text-[length:var(--fs-caption)]">Continue to choose a service from the standard catalogue.</p>
        </div>
      </div>
    );
  }

  const accepted = offers.find((o) => o.offerId === value.offerId && value.decision === 'accepted');
  // One offer carries the Recommended flag: the best (lowest) priority code, first listed on a tie.
  const recommendedId = [...offers].sort((x, y) => (x.priorityCode ?? 'P9').localeCompare(y.priorityCode ?? 'P9'))[0]?.offerId;
  // One section per offer type that has offers for this customer (a type with none is not shown), each laid out in three columns.
  // Within a section the Recommended card comes first, then the rest from the lowest monthly fee to the highest.
  const sections = offerTypes
    .map((type) => {
      const real = offers.filter((o) => offerTypeOf(o.serviceJourney) === type.key).sort((a, b) => Number(b.offerId === recommendedId) - Number(a.offerId === recommendedId) || a.monthlyRental - b.monthlyRental);
      // Every type shown, topped up to three cards with samples (after the real ones).
      return { type, items: showAllOfferTypes ? [...real, ...SAMPLE_OFFERS[type.key].slice(0, Math.max(0, OFFERS_PER_TYPE - real.length))] : real };
    })
    .filter(({ items }) => items.length > 0);
  return (
    <div className="space-y-4">
      <div className="space-y-8" role="radiogroup" aria-label="Offers">
        {sections.map(({ type, items }) => (
          <section key={type.key} aria-labelledby={`offer-type-${type.key}`} className="space-y-3">
            <h3 id={`offer-type-${type.key}`} className="text-fg font-bold text-[length:var(--fs-h5)]">
              {type.label}
            </h3>
            {items.length > 0 && (
          <ul className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))]">
        {items.map((o) => {
          const selected = value.decision === 'accepted' && value.offerId === o.offerId;
          const recommended = o.offerId === recommendedId;
          const perMonth = !(o.serviceJourney === 'new-prepaid' || o.serviceJourney === 'mnp-prepaid');
          // The whole card is the control: click (or Enter/Space) selects it,
          // and clicking the selected one again clears it.
          const toggle = () =>
            o.sample
              ? undefined
              : onChange(
              selected
                ? {}
                : { decision: 'accepted', offerId: o.offerId, offerName: o.offerName, journey: o.serviceJourney, linkedProductIds: o.linkedProductIds }
            );
          return (
            <li
              key={o.offerId}
              role="radio"
              aria-checked={selected}
              aria-disabled={o.sample || undefined}
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  toggle();
                }
              }}
              className={`relative rounded-[var(--radius-card)] border p-5 flex flex-col gap-3 ${o.sample ? 'cursor-default' : 'cursor-pointer'} transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                selected ? CARD_SELECTED : recommended ? CARD_HIGHLIGHT : CARD_IDLE
              }`}
            >
              {selected && <SelectedTick />}
              {/* Top row: the Recommended flag on the left, the journey tag pinned right. */}
              <div className="flex min-h-[25px] items-center gap-1.5">
                {recommended && (
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[var(--radius-pill)] bg-accent text-on-dark px-2 py-0.5 text-[length:var(--fs-tag)] font-medium">
                    <Icon path={STAR_ICON} className="w-3 h-3" />
                    Recommended
                  </span>
                )}
                {/* Every card carries its journey tag, pinned right. */}
                {o.sample && <span className="shrink-0 rounded-[var(--radius-pill)] border border-border-soft px-2 py-0.5 text-muted text-[length:var(--fs-tag)]">Sample</span>}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-fg font-bold text-[length:var(--fs-h5)] leading-snug">{o.offerName}</p>
                <p className="text-fg-2 text-[length:var(--fs-caption)]">{o.offerDescription}</p>
                <p className="text-accent">
                  <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
                  <span className="text-[length:var(--fs-h3)] font-bold">{o.monthlyRental}</span>
                  {perMonth && <span className="text-fg-2 text-[length:var(--fs-caption)]"> /month</span>}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1">
                {/* Opens the full offer details in the side drawer; it stops
                    propagation so looking never selects the offer. */}
                <button
                  type="button"
                  aria-label={`View details for ${o.offerName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailOffer(o);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-button)] text-link hover:underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] text-[length:var(--fs-caption)] font-medium"
                >
                  View details
                  <Icon path={CHEVRON_RIGHT} className="w-4 h-4" />
                </button>
                {onInterestedOffer ? (
                  <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <Button
                      variant="secondary"
                      compact
                      disabled={leadBusy === o.offerId || o.sample}
                      title={o.sample ? 'A sample offer - not available to select' : undefined}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setLeadBusy(o.offerId);
                        try {
                          await onInterestedOffer(o);
                        } finally {
                          setLeadBusy(undefined);
                        }
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      Interested
                    </Button>
                    <Button
                      variant="primary"
                      compact
                      disabled={o.sample || !hasDestination(o.serviceJourney, journey)}
                      title={o.sample ? 'A sample offer - not available to select' : hasDestination(o.serviceJourney, journey) ? undefined : 'The upgrade journey is not available yet'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!selected) toggle();
                        // A postpaid offer continues here; one that continues in another journey shows its hand-off instead.
                        if (continuesHere(o.serviceJourney, journey)) setAdvanceFor(o.offerId);
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      Select Offer
                    </Button>
                  </div>
                ) : (
                  /* Presentational: the card is the control, so the button must not take focus or fire a second toggle. */
                  <Button variant={selected ? 'primary' : 'secondary'} tabIndex={-1} aria-hidden className="pointer-events-none">
                    {selected ? 'Selected' : 'Select offer'}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
          </ul>
            )}
          </section>
        ))}
      </div>
      {/* The hand-off banner only exists for offers that continue in another journey (MNP, fixed line),
          so rendering it conditionally made the footer and page jump ~120px whenever the selection
          moved between a postpaid offer and one of those. The slot is always present at the banner's
          own height (105px, measured), so nothing below it moves. */}
      <div className="min-h-[105px]">
        {accepted && !continuesHere(accepted.serviceJourney, journey) && accepted.serviceJourney && (
          <HandOff journey={accepted.serviceJourney} onGo={onHandOff} />
        )}
      </div>
      <OfferDetailsDrawer
        offer={detailOffer}
        serviceLabel={journeyLabel(detailOffer?.serviceJourney) ?? '-'}
        prepaid={isPrepaidJourney(detailOffer?.serviceJourney)}
        fixedService={isHomeJourney(detailOffer?.serviceJourney)}
        highlight={detailOffer ? offerHighlight(detailOffer, products) : null}
        includedNames={(detailOffer?.linkedProductIds ?? []).map((id) => productNames[id] ?? id)}
        selected={Boolean(detailOffer && value.decision === 'accepted' && value.offerId === detailOffer.offerId)}
        onSelect={() =>
          detailOffer &&
          !detailOffer.sample &&
          onChange({
            decision: 'accepted',
            offerId: detailOffer.offerId,
            offerName: detailOffer.offerName,
            journey: detailOffer.serviceJourney,
            linkedProductIds: detailOffer.linkedProductIds,
          })
        }
        onClose={() => setDetailOffer(null)}
      />
    </div>
  );
}

const CHEVRON_RIGHT = 'M9 18l6-6-6-6';
