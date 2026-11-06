import { useEffect } from 'react';
import { detectSignatureMode } from './cafTypes';
import { SignatureCapture } from './SignatureCapture';
import { Badge } from '../primitives/Badge';
import { newMnpFormNumber, normalizePortInNumber } from '../../data/portInRules';
import { useEntityStore } from '../../stores/entityStore';
import { mnpFormMissing, mnpFormSnapshotKey } from './donorModel';
import type { DonorAttachmentValue, MnpFormInput, MnpFormType } from './donorModel';

interface DonorAttachmentStepProps {
  value: DonorAttachmentValue;
  onChange: (value: DonorAttachmentValue) => void;
  form: MnpFormInput;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="caption-muted">{label}</div>
      <div className="body-text break-words">{children || '-'}</div>
    </div>
  );
}

// SCR-127 / SCR-128 - MNP BRSD V1.1 (MNP_PI_001_CAF_02 / CAF_03): the MNP Port-In Form is generated from the validated journey data with
// a unique form number, shown to the agent and customer for review, and signed before the order is submitted. Generation is blocked
// while mandatory data is missing; changing that data afterwards regenerates the form and clears the signature, so what was signed is
// always what is submitted. The two signature modes (MNP-Digital / MNP-Touch Screen) are from the Guided Journey evidence.
export function DonorAttachmentStep({ value, onChange, form }: DonorAttachmentStepProps) {
  const loadKind = useEntityStore((s) => s.loadKind);
  const products = useEntityStore((s) => s.records['products']);
  useEffect(() => {
    void loadKind('products');
  }, [loadKind]);

  const missing = mnpFormMissing(form);
  const key = mnpFormSnapshotKey(form);
  const ready = missing.length === 0;

  // The form's signature mode is the device's (Digital on the web, Touch Screen on a tablet); it is never chosen.
  const mnpFormType: MnpFormType = `MNP-${detectSignatureMode()}`;
  useEffect(() => {
    if (!ready || value.snapshotKey === key) return;
    onChange({
      mnpFormType,
      formNumber: value.formNumber ?? newMnpFormNumber(),
      generatedAt: new Date().toISOString(),
      snapshotKey: key,
      signed: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key, value.snapshotKey]);
  // A draft saved on another device (or before this was automatic) follows the device it is now on.
  useEffect(() => {
    if (ready && value.snapshotKey === key && value.mnpFormType !== mnpFormType) onChange({ ...value, mnpFormType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key, value.snapshotKey, value.mnpFormType]);

  if (!ready) {
    return (
      <div className="card p-4 card-surface" role="status">
        <p className="value-text">The MNP Form cannot be generated yet</p>
        <p className="caption-secondary mt-1">Complete these first: {missing.join(', ')}.</p>
      </div>
    );
  }

  const d = form.donor!;
  const plan = (products ?? []).find((p) => p.productId === form.productId);
  const current = value.snapshotKey === key;
  const signed = current && Boolean(value.signed && value.signatureDataUrl);

  return (
    <div className="space-y-4">
      <div className="card p-4 card-surface space-y-4">
        <div className="wrap-loose gap-2 items-start justify-between">
          <div>
            <p className="value-text">Mobile Number Portability Application Form</p>
            <p className="caption-secondary mt-0.5">Review the details with the customer before they sign.</p>
          </div>
          <div className="text-right">
            <div className="caption-muted">Form Number</div>
            <div className="value-text" data-testid="mnp-form-number">{current ? value.formNumber : 'Generating...'}</div>
          </div>
        </div>
        <div className="pair-grid gap-x-6 gap-y-3 pt-3 divider-top">
          <Row label="Customer">{form.customerName}</Row>
          <Row label={form.idType ?? 'ID Number'}>{form.idNumber}</Row>
          <Row label="Port-In Number">{normalizePortInNumber(d.portInNumber ?? '')}</Row>
          <Row label="Plan Type">{form.mnpType === 'prepaid' ? 'Prepaid' : 'Postpaid'}</Row>
          <Row label="Donor Customer ID">{d.donorId}</Row>
          <Row label="Donor ID Type">{d.donorIdType}</Row>
          <Row label="Donor Customer Type">{d.donorCustomerType}</Row>
          <Row label="Donor Operator">{d.donorOperator}</Row>
          <Row label="Donor Subscription Type">{d.donorSubscriptionType}</Row>
          <Row label="Scheduled Port-In Date">{d.scheduledPortInDate ?? 'First window after NPAS approval'}</Row>
          <Row label="Plan">{plan ? String(plan.name) : form.productId}</Row>
          <Row label="SIM Serial">{form.simSerial}</Row>
        </div>
        <p className="caption-secondary pt-3 divider-top">
          By signing below, the subscriber authorizes the port-in request to Vodafone Qatar.
        </p>
      </div>

      {current && (
        <div className="card p-4 card-surface">
          {signed ? (
            <div className="row">
              <Badge variant="success">Signed</Badge>
              <img src={value.signatureDataUrl} alt="Customer signature" className="signature-thumb" />
            </div>
          ) : (
            <SignatureCapture onSave={(dataUrl) => onChange({ ...value, signatureDataUrl: dataUrl, signed: true, signedAt: new Date().toISOString() })} />
          )}
        </div>
      )}
    </div>
  );
}
