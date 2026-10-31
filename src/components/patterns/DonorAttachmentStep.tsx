import { useEffect } from 'react';
import { detectSignatureMode } from './cafTypes';
import { SignatureCapture } from './SignatureCapture';
import { Badge } from '../primitives/Badge';
import { normalizePortInNumber, newMnpFormNumber } from '../../data/portInRules';
import { useEntityStore } from '../../stores/entityStore';
import type { DonorDetailsValue } from './DonorDetailsStep';

export type MnpFormType = 'MNP-Digital' | 'MNP-Touch Screen';

export interface DonorAttachmentValue {
  mnpFormType?: MnpFormType;
  signatureDataUrl?: string;
  /** DF-MNP-025: the unique reference generated with the form. */
  formNumber?: string;
  generatedAt?: string;
  /** The journey data the form was generated from; a change to any of it regenerates the form and clears the signature. */
  snapshotKey?: string;
  /** DF-MNP-026: recorded True when the customer signs. */
  signed?: boolean;
  signedAt?: string;
}

/** What the MNP Form is generated from (MNP_PI_001_CAF_02): the validated customer, donor, Port-In number, product and order details. */
export interface MnpFormInput {
  customerName?: string;
  idType?: string;
  idNumber?: string;
  mnpType: 'postpaid' | 'prepaid';
  productId?: string;
  simSerial?: string;
  donor?: DonorDetailsValue;
}

/** What is still missing for the form to be generated: generation is blocked until the list is empty. */
export function mnpFormMissing(f: MnpFormInput): string[] {
  const d = f.donor;
  const missing: string[] = [];
  if (!f.customerName || !f.idNumber) missing.push('Customer verification');
  if (!d?.portInNumber || !normalizePortInNumber(d.portInNumber)) missing.push('Port-in number');
  if (!d?.donorId || !d.donorIdType || !d.donorCustomerType || !d.donorOperator || !d.donorSubscriptionType) missing.push('Donor details');
  if (!f.productId) missing.push('Plan');
  if (!f.simSerial) missing.push('SIM serial');
  return missing;
}

/** A stable key over everything the form shows, so the form can tell that the journey data it was generated from has changed. */
export function mnpFormSnapshotKey(f: MnpFormInput): string {
  const d = f.donor ?? {};
  return JSON.stringify([
    f.customerName, f.idType, f.idNumber, f.mnpType, f.productId, f.simSerial,
    normalizePortInNumber(d.portInNumber ?? ''), d.donorId, d.donorIdType, d.donorCustomerType, d.donorOperator, d.donorSubscriptionType, d.scheduledPortInDate,
  ]);
}

/** The signed MNP Form is valid for submission only when it was generated from the data the journey holds now. */
export function mnpFormSigned(v: DonorAttachmentValue | undefined, f: MnpFormInput): boolean {
  return Boolean(v?.formNumber && v.signed && v.signatureDataUrl && v.mnpFormType && v.snapshotKey === mnpFormSnapshotKey(f));
}

interface DonorAttachmentStepProps {
  value: DonorAttachmentValue;
  onChange: (value: DonorAttachmentValue) => void;
  form: MnpFormInput;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[length:var(--fs-caption)] text-muted">{label}</div>
      <div className="text-fg text-[length:var(--fs-body)] break-words">{children || '-'}</div>
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
        <p className="text-fg text-[length:var(--fs-body)] font-medium">The MNP Form cannot be generated yet</p>
        <p className="text-fg-2 text-[length:var(--fs-caption)] mt-1">Complete these first: {missing.join(', ')}.</p>
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
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-fg text-[length:var(--fs-body)] font-medium">Mobile Number Portability Application Form</p>
            <p className="text-fg-2 text-[length:var(--fs-caption)] mt-0.5">Review the details with the customer before they sign.</p>
          </div>
          <div className="text-right">
            <div className="text-[length:var(--fs-caption)] text-muted">Form Number</div>
            <div className="text-fg text-[length:var(--fs-body)] font-medium" data-testid="mnp-form-number">{current ? value.formNumber : 'Generating...'}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t border-border-soft">
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
        <p className="text-fg-2 text-[length:var(--fs-caption)] pt-3 border-t border-border-soft">
          By signing below, the subscriber authorizes the port-in request to Vodafone Qatar.
        </p>
      </div>

      {current && (
        <div className="card p-4 card-surface">
          {signed ? (
            <div className="flex items-center gap-3">
              <Badge variant="success">Signed</Badge>
              <img src={value.signatureDataUrl} alt="Customer signature" className="h-10 border border-border-soft rounded-[var(--radius-sm)]" />
            </div>
          ) : (
            <SignatureCapture onSave={(dataUrl) => onChange({ ...value, signatureDataUrl: dataUrl, signed: true, signedAt: new Date().toISOString() })} />
          )}
        </div>
      )}
    </div>
  );
}
