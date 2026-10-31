import { badgeVariantFor } from '../../../lib/statusTone';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { useEntityStore } from '../../../stores/entityStore';
import { useWorkflowStore } from '../../../stores/workflowStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { PageHeader } from '../../../components/patterns/PageHeader';
import { formatQarAny } from '../../../lib/format';

interface CrossSalesOffer {
  offerId: string;
  offerName: string;
  offerDescription?: string;
  campaignCode: string;
  promotionId: string;
  status: string;
  monthlyRental: number;
  addOnMonthly?: number;
  serviceIdentifier: string;
  journeyType?: string;
  serviceJourney?: string;
}

// SCR-179: Migration Offer tab (Complex Asset List Applet) - UJ-087 Autobase:
// "Migration Offers grid (system pre-populated, 1 of 1)... Accept / Interested
// / Reject" (BR-272: Pre2Post offers are sourced from the Unica campaign
// engine; agent may only disposition, never author, an offer).
export function MigrationOfferTab() {
  const offers = (useEntityStore((s) => s.records['cross-sales-offers']) ?? []) as unknown as CrossSalesOffer[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const navigate = useNavigate();
  const [dispositioned, setDispositioned] = useState<Record<string, string>>({});

  useEffect(() => {
    loadKind('cross-sales-offers');
  }, [loadKind]);

  // The offers for the Prepaid to Postpaid journey: by the journey the offer carries (the same key the cross-sell Offers step groups by). The older
  // journeyType tag is on one record only, so it is read as well and nothing already shown is lost.
  const migrationOffers = offers.filter((o) => o.serviceJourney === 'pre-to-post' || o.journeyType === 'PreToPost');

  const disposition = async (offer: CrossSalesOffer, status: string) => {
    await updateRecord('cross-sales-offers', 'offerId', offer.offerId, { status });
    setDispositioned((prev) => ({ ...prev, [offer.offerId]: status }));
    if (status === 'Accepted') {
      useWorkflowStore.getState().setFieldValue('base-management', 'offer', offer);
      navigate('/pre-to-post-migration/base-management-wizard-contact-offer-summary-activity');
    } else {
      pushToast('warning', `Offer ${offer.offerId} marked ${status}.`);
    }
  };

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Migration Offer</>} description={<>System-recommended prepaid-to-postpaid migration offers (Unica campaign engine).</>} />

      <div className="space-y-4">
        {migrationOffers.map((o) => {
          const status = dispositioned[o.offerId] ?? o.status;
          return (
            <div key={o.offerId} className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-fg font-medium">{o.offerName}</span>
                <Badge variant={badgeVariantFor(status)}>{status}</Badge>
              </div>
              <p className="text-fg-2 text-[length:var(--fs-body)] mb-2">{o.offerDescription}</p>
              <dl className="grid grid-cols-3 gap-2 text-[length:var(--fs-caption)] text-muted mb-3">
                <div>Campaign: {o.campaignCode}</div>
                <div>Promotion: {o.promotionId}</div>
                <div>MSISDN: {o.serviceIdentifier}</div>
                <div>Monthly Rental: {formatQarAny(o.monthlyRental)}</div>
                <div>Add-on Monthly: {formatQarAny(o.addOnMonthly ?? 0)}</div>
              </dl>
              {status === 'Offered' && (
                <div className="flex gap-2">
                  <Button variant="primary" compact onClick={() => disposition(o, 'Accepted')}>Accept</Button>
                  <Button variant="secondary" compact onClick={() => disposition(o, 'Interested')}>Interested</Button>
                  <Button variant="secondary" compact className="!text-danger !border-danger" onClick={() => disposition(o, 'Rejected')}>Reject</Button>
                </div>
              )}
            </div>
          );
        })}
        {migrationOffers.length === 0 && <p className="text-muted">No migration offers on this account.</p>}
      </div>
    </div>
  );
}
