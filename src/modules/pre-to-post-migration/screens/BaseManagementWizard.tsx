import { CUSTOMER_IDENTIFICATION_LABEL } from '../../../data/stepLabels';
import { defaultCreditLimitFor } from '../../../engines/creditLimit';
import { useNavigate } from 'react-router-dom';
import * as sums from '../../../components/patterns/wizard/commonSummaries';
import { attachSummaries } from '../../../components/patterns/wizard/stepSummary';
import { GuidedActivationWizard } from '../../../capabilities';
import { CustomerIdentification } from '../../../capabilities';
import { activityStep } from '../../../capabilities';
import type { IdLookupValue } from '../../../components/patterns/idLookupModel';
import { BillLimitEditor } from '../../../components/domain/BillLimitEditor';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useWorkflowStore } from '../../../stores/workflowStore';
import { formatQarAny, formatQar } from '../../../lib/format';

interface MigrationOffer {
  offerId: string;
  offerName: string;
  offerDescription?: string;
  monthlyRental: number;
  addOnMonthly?: number;
  promotionId: string;
  serviceIdentifier: string;
}

const WIZARD_ID = 'base-management';

// SCR-180: Base Management wizard - UJ-087 Autobase, 3-step accordion
// ("1. Contact", "2. Offer Summary", "3. Activity"). Offer Summary's Bill
// Limit follows the same evidenced "Default Smart Limit should be
// communicated to the customer" behaviour as Postpaid/MNP (BR-AGENT-MIN-THRESHOLD),
// so it's left unset rather than pre-filled with the walkthrough's illustrative
// value of 20, which would fail the Agent Minimum check on load.
export function BaseManagementWizard() {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const offer = useWorkflowStore((s) => s.getDraft(WIZARD_ID).values.offer) as MigrationOffer | undefined;

  if (!offer) {
    return (
      <div className="p-8 text-fg-2">
        No migration offer accepted yet - go to the Migration Offer tab and Accept an offer first.
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <GuidedActivationWizard
        wizardId={WIZARD_ID}
        title="Base Management"
        steps={attachSummaries([
          {
            key: 'contact',
            label: CUSTOMER_IDENTIFICATION_LABEL,
            render: ({ values, setValue }) => (
              <div className="space-y-4">
                <CustomerIdentification value={(values.qid as IdLookupValue) ?? {}} onChange={(v) => setValue('qid', v)} allowNewCustomer={false} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" value={(values.email as string) ?? ''} onChange={(e) => setValue('email', e.target.value)} />
                  <Select
                    label="Language"
                    value={(values.language as string) ?? ''}
                    onChange={(e) => setValue('language', e.target.value)}
                    placeholder="Select language"
                    options={[{ value: 'English', label: 'English' }, { value: 'Arabic', label: 'Arabic' }]}
                  />
                </div>
              </div>
            ),
            isValid: (values) => Boolean((values.qid as IdLookupValue | undefined)?.moiResult),
          },
          {
            key: 'offer-summary',
            label: 'Offer Summary',
            render: ({ values, setValue }) => (
              <div className="space-y-4">
                <div className="card p-4 card-surface">
                  <p className="text-fg font-medium">{offer.offerName}</p>
                  <p className="text-fg-2 text-[length:var(--fs-body)] mt-1">{offer.offerDescription}</p>
                  <p className="text-fg text-[length:var(--fs-body)] mt-2">
                    Monthly Rental: {formatQarAny(offer.monthlyRental)} + Add-on {formatQarAny(offer.addOnMonthly ?? 0)}
                  </p>
                </div>
                <BillLimitEditor
                  product="Mobile"
                  value={values.billLimit as number | undefined}
                  onChange={(v, pass) => { setValue('billLimit', v); setValue('billLimitValid', pass); }}
                />
                <div className="card p-3">
                  <span className="text-fg">Credit Limit</span>
                  <div className="text-fg mt-1">QAR 1000</div>
                </div>
              </div>
            ),
            isValid: (values) => Boolean(values.billLimit && values.billLimitValid),
          },
          activityStep({ required: false, channels: ['Appointment', 'Walk-in', 'Call Center'] }),
        ], {
          contact: [
            ...sums.identitySummary('qid'),
            { key: 'email', label: 'Email', type: 'text', optional: true, value: (v) => v.email },
            { key: 'language', label: 'Language', type: 'text', optional: true, value: (v) => v.language },
          ],
          'offer-summary': [
            { key: 'offer', label: 'Offer', type: 'text', value: () => offer?.offerName },
            { key: 'rental', label: 'Monthly Rental', type: 'text', value: () => (offer ? formatQar(offer.monthlyRental) : undefined) },
            { key: 'billLimit', label: 'Bill Limit', type: 'text', optional: true, value: (v) => (typeof v.billLimit === 'number' ? formatQar(v.billLimit) : undefined) },
          ],
          activity: [{ key: 'channel', label: 'Channel', type: 'text', value: (v) => v.channel ?? 'Appointment' }],
        })}
        onSubmit={async (values) => {
          const qid = values.qid as IdLookupValue;
          const orderId = `ORD-${Date.now().toString().slice(-6)}`;
          await createRecord('orders', {
            orderId,
            orderType: 'Plan Change',
            orderSubType: 'Pre2Post',
            customerName: qid.moiResult?.name,
            msisdn: offer.serviceIdentifier,
            productId: offer.promotionId,
            billLimit: values.billLimit,
            // The credit limit the rules give this customer (HRN 50, Qatari 4,000, Expat 1,000), not a fixed figure.
            creditLimit: defaultCreditLimitFor(qid.moiResult?.nationality),
            channel: values.channel ?? 'Appointment',
            comments: values.comments,
            status: 'Processing',
          });
          const bulkOrderId = `BLK-${Date.now().toString().slice(-6)}`;
          await createRecord('bulk-activation-orders', {
            bulkOrderId,
            jobType: 'PreToPost',
            msisdn: offer.serviceIdentifier,
            promotionId: offer.promotionId,
            billLimit: values.billLimit,
            overallStatus: 'Processed',
            updatedAt: new Date().toISOString(),
          });
          pushToast('success', `Order ${orderId} created - migration handed off to Bulk Job ${bulkOrderId} (PreToPost).`);
          navigate('/pre-to-post-migration/bulk-jobs-bulk-processing-screen-tm-bulk-batch-list-applet');
        }}
      />
    </div>
  );
}
