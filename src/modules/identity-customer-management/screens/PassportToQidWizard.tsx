import { useNavigate } from 'react-router-dom';
import * as sums from '../../../components/patterns/wizard/commonSummaries';
import { attachSummaries } from '../../../components/patterns/wizard/stepSummary';
import { CustomerIdentification } from '../../../capabilities';
import { CUSTOMER_IDENTIFICATION_LABEL } from '../../../data/stepLabels';
import { PassportOwnerCheck } from './PassportOwnerCheck';
import { passportToQidWrites, qidProblem, type PassportCheck } from '../passportToQidModel';
import { qidDocumentRecord } from '../../../components/patterns/idLinkModel';
import type { IdLookupValue } from '../../../components/patterns/idLookupModel';
import { GuidedActivationWizard } from '../../../capabilities';
import { Input } from '../../../components/primitives/Input';
import { PhoneNumberInput } from '../../../components/primitives/PhoneNumberInput';
import { QidImageUpload, type QidImageUploadValue } from '../../../capabilities';
import { SignatureCapture } from '../../../components/patterns/SignatureCapture';
import { Badge } from '../../../components/primitives/Badge';
import { useState } from 'react';
import { useEntityStore } from '../../../stores/entityStore';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { useNotificationStore } from '../../../stores/notificationStore';

const WIZARD_ID = 'passport-to-qid';

// SCR-151: Passport to QID Update wizard (UJ-076, high confidence): enter
// MSISDN & Passport Number -> enter QID Number, Update ID (MOI validation
// fetches customer details) -> scan/upload QID Front & Back -> Identification
// number change form generated, customer signs -> Finish (form attached).
export function PassportToQidWizard() {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>();

  return (
    <div className="min-h-full flex flex-col">
      <GuidedActivationWizard
        wizardId={WIZARD_ID}
        title="Passport to QID Update"
        steps={attachSummaries([
          {
            key: 'msisdn-passport',
            label: 'MSISDN & Passport',
            render: ({ values, setValue }) => (
              <div className="grid grid-cols-2 gap-4">
                <PhoneNumberInput
                  label="MSISDN"
                  value={(values.msisdn as string) ?? ''}
                  placeholder="33001001"
                  onChange={(e) => setValue('msisdn', e.target.value)}
                />
                <Input
                  label="Passport Number"
                  value={(values.passportNumber as string) ?? ''}
                  placeholder="P1234567"
                  onChange={(e) => setValue('passportNumber', e.target.value)}
                />
                <PassportOwnerCheck
                  msisdn={(values.msisdn as string) ?? ''}
                  passportNumber={(values.passportNumber as string) ?? ''}
                  result={values.passportOwner as PassportCheck | undefined}
                  onResult={(r) => setValue('passportOwner', r)}
                />
              </div>
            ),
            // The line's owner must hold this Passport: checked against the records, not just typed in.
            isValid: (values) => Boolean(values.msisdn && values.passportNumber && (values.passportOwner as PassportCheck | undefined)?.ok),
          },
          {
            key: 'qid-entry',
            label: CUSTOMER_IDENTIFICATION_LABEL,
            render: ({ values, setValue }) => {
              const owner = (values.passportOwner as PassportCheck | undefined);
              const problem = owner?.ok ? qidProblem(owner.owner, (values.qid as IdLookupValue | undefined)?.moiResult) : undefined;
              return (
                <div className="space-y-3">
                  {/* This journey updates an EXISTING customer: it never creates one, and a QID that belongs to someone else is refused. */}
                  <CustomerIdentification value={(values.qid as IdLookupValue) ?? {}} onChange={(v) => setValue('qid', v)} allowNewCustomer={false} />
                  {problem && (
                    <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
                      {problem}
                    </p>
                  )}
                </div>
              );
            },
            isValid: (values) => {
              const owner = values.passportOwner as PassportCheck | undefined;
              const moi = (values.qid as IdLookupValue | undefined)?.moiResult;
              return Boolean(moi && owner?.ok && !qidProblem(owner.owner, moi));
            },
          },
          {
            key: 'qid-images',
            label: 'QID Front & Back',
            render: ({ values, setValue }) => (
              <QidImageUpload
                bothCaptureActions
                value={(values.qidImages as QidImageUploadValue) ?? {}}
                onChange={(v) => setValue('qidImages', v)}
              />
            ),
            isValid: (values) => {
              const v = values.qidImages as QidImageUploadValue | undefined;
              return Boolean(v?.frontScanned && v?.backScanned);
            },
          },
          {
            key: 'change-form',
            label: 'Identification Number Change Form',
            render: ({ values }) => (
              <div className="space-y-4">
                <div className="card p-4 card-surface">
                  <p className="text-fg font-medium">Identification Number Change Form</p>
                  <p className="text-fg-2 text-[length:var(--fs-caption)] mt-1">
                    Customer: {(values.qid as IdLookupValue | undefined)?.moiResult?.name ?? '-'} - updating identification
                    from Passport {(values.passportNumber as string) ?? '-'} to QID{' '}
                    {(values.qid as IdLookupValue | undefined)?.idNumber ?? '-'}.
                  </p>
                  {signatureDataUrl ? (
                    <div className="mt-3 flex items-center gap-3">
                      <Badge variant="success">Signed</Badge>
                      <img src={signatureDataUrl} alt="Signature" className="h-10 border border-border-soft rounded-[var(--radius-sm)]" />
                    </div>
                  ) : (
                    <SignatureCapture onSave={(dataUrl) => setSignatureDataUrl(dataUrl)} />
                  )}
                </div>
              </div>
            ),
            isValid: () => Boolean(signatureDataUrl),
          },
        ], {
          'msisdn-passport': [
            { key: 'msisdn', label: 'MSISDN', type: 'text', value: (v) => v.msisdn },
            { key: 'passport', label: 'Passport Number', type: 'text', sensitive: true, value: (v) => v.passportNumber },
          ],
          'qid-entry': sums.identitySummary('qid'),
          'qid-images': sums.idImagesSummary('qidImages'),
        })}
        onSubmit={async (values) => {
          const qid = values.qid as IdLookupValue;
          const owner = (values.passportOwner as PassportCheck | undefined);
          if (!owner?.ok || !qid.idNumber) return;
          const updateId = `PQU-${Date.now().toString().slice(-6)}`;
          // The customer is updated, not just a log written: the QID joins their documents (once), the Passport is retired, their ID details follow.
          const writes = passportToQidWrites(owner.owner, { number: qid.idNumber, expiryDate: qid.moiResult?.expiryDate });
          const held = await mockDataEngine.list<{ customerId: string; documentNumber: string }>('identity-documents');
          if (!held.some((d) => d.customerId === owner.owner.customerId && d.documentNumber === qid.idNumber)) {
            await createRecord('identity-documents', qidDocumentRecord(writes.qidDocument));
          }
          if (writes.retirePassport) await updateRecord('identity-documents', 'identityDocumentId', writes.retirePassport.id, writes.retirePassport.patch, { how: 'Passport to QID update' });
          await updateRecord('customers', 'customerId', owner.owner.customerId, writes.customerPatch, { how: 'Passport to QID update' });
          await createRecord('passport-to-qid-updates', {
            updateId,
            customerId: owner.owner.customerId,
            msisdn: values.msisdn,
            passportNumber: values.passportNumber,
            qidNumber: qid.idNumber,
            eSignature: qid.moiResult?.name,
            status: 'Attached/Finished',
          });
          pushToast('success', `Passport to QID update ${updateId} finished - identification change form attached.`);
          navigate('/identity-customer-management');
        }}
      />
    </div>
  );
}
