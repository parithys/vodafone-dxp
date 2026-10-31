import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { SimSerialScanner } from './SimSerialScanner';
import * as mockDataEngine from '../../engines/mockDataEngine';
import type { DeviceType } from '../../lib/deviceType';

export type SimType = 'Physical' | 'eSIM';

export interface SimTypeValue {
  simType?: SimType;
  simSerial?: string;
  simValid?: boolean;
  /** Captured alongside simValid (2026-09-28 request: display ICCID and
   * Stock Status after validation) - see SimSerialScanner's onChange. */
  simIccid?: string;
  simStockStatus?: string;
  /** What the scanned serial is in stock as: 'Physical', or 'Printed eSIM' (a stocked card carrying an eSIM profile). */
  simKind?: string;
  /** A Pre-Paired SIM: the MSISDN comes from the SIM, so Number Selection was bypassed. */
  prePaired?: boolean;
  prePairedMsisdn?: string;
  esimIssued?: boolean;
  esimActivationCode?: string;
}

interface SimTypeStepProps {
  value: SimTypeValue;
  customerEmail: string | undefined;
  onChange: (value: SimTypeValue) => void;
  /** Passed to the serial field: scan-led on a tablet, type-led on the web. Omitted, the field is unchanged. */
  device?: DeviceType;
  /**
   * The agent chose a Pre-Paired SIM on the Number step (Mobile Prepaid BRSD MPRA_001_NUM_02 / SIM_02): this step
   * scans it from the Pre-Paired inventory and shows the SIM and the MSISDN already on it, read-only. eSIM is not
   * offered, since a Pre-Paired SIM is a card.
   */
  prePaired?: boolean;
  /** The order will be held for approval, so an eSIM's QR code is released on approval rather than on submission. */
  approvalRequired?: boolean;
}

// Mock GSMA SGP.22-style activation string (LPA:1$smdp-address$matching-id) -
// not a real SM-DP+ call, see the note below on not fabricating an eSIM
// provisioning API. Random per issuance so the QR code is distinct each time.
function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let matchingId = '';
  for (let i = 0; i < 16; i++) {
    matchingId += chars[Math.floor(Math.random() * chars.length)];
  }
  return `LPA:1$smdp.vodafone.qa$${matchingId}`;
}

// "SIM Type" (reference flow step 8). Reworked 2026-09-28 from a Physical/
// eSIM TAB pair (agent picks a path before seeing either control) to both
// paths shown SIDE BY SIDE from the start - Physical's scan field is the
// default-focused, primary action; eSIM's "Select eSIM" sits beside it as
// the explicit alternative, not a second screen behind a tab click.
//
// Physical issuance keeps the existing, evidenced real-time-inventory serial
// scan (Pattern 11), now auto-advancing the wizard the moment a scan
// validates - the agent no longer clicks Continue on a step this step's own
// two checks (serial validity + stock) already resolved for them. eSIM has
// no evidenced inventory/serial check in this corpus - generating a QR/
// activation code and optionally emailing it is the standard telco pattern,
// kept deliberately lightweight (no fabricated eSIM provisioning API), and
// still does NOT auto-advance: selecting eSIM is a choice to review, not a
// validation result to act on immediately.
export function SimTypeStep({ value, customerEmail, onChange, device, prePaired, approvalRequired = false }: SimTypeStepProps) {
  const [issuing, setIssuing] = useState(false);

  if (prePaired) {
    return (
      <div className="max-w-xl space-y-3">
        <h4 className="text-fg font-medium text-[length:var(--fs-body)]">Pre-Paired SIM</h4>
        <SimSerialScanner
          value={value.simSerial ?? ''}
          device={device}
          inventory="pre-paired"
          label="Pre-Paired SIM Serial Number"
          onChange={(serial, valid, details) =>
            onChange({
              ...value,
              simType: 'Physical',
              simSerial: serial,
              simValid: valid,
              simIccid: details?.iccid,
              simStockStatus: details?.stockStatus,
              simKind: details?.simKind,
              prePaired: true,
              prePairedMsisdn: valid ? details?.msisdn : undefined,
            })
          }
        />
        {value.prePaired && value.simValid && (
          <dl className="rounded-[var(--radius-card)] border border-success bg-tone-success p-3 space-y-1 text-[length:var(--fs-caption)]">
            <div className="flex justify-between gap-3">
              <dt className="text-fg">SIM Type</dt>
              <dd className="text-fg font-medium">Pre-Paired SIM</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg">SIM Serial Number</dt>
              <dd className="text-fg font-medium">{value.simSerial}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg">ICCID</dt>
              <dd className="text-fg font-medium">{value.simIccid ?? '-'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg">Mobile Number</dt>
              {/* Read-only: the number is the one already on the SIM and cannot be edited here. */}
              <dd className="text-fg font-medium">{value.prePairedMsisdn ?? '-'}</dd>
            </div>
          </dl>
        )}
      </div>
    );
  }

  const generateEsim = async () => {
    setIssuing(true);
    await new Promise((r) => setTimeout(r, 500));
    // The eSIM profile takes its ICCID from the eSIM stock (a stocked, unassigned "Printed eSIM"); with none in stock it stays unknown, shown as "-".
    const stock = await mockDataEngine.list<{ iccid: string; type?: string; stockStatus: string; prePaired?: boolean }>('sims').catch(() => []);
    const profile = stock.find((x) => x.type === 'Printed eSIM' && x.stockStatus === 'Available' && !x.prePaired);
    setIssuing(false);
    onChange({ ...value, simType: 'eSIM', esimIssued: true, esimActivationCode: generateActivationCode(), simIccid: profile?.iccid, simSerial: undefined, simValid: undefined });
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-1.5rem)/2)),1fr))] gap-6">
      {/* Physical SIM - the default-focused, primary path. */}
      <div className="space-y-3">
        <h4 className="text-fg font-medium text-[length:var(--fs-body)]">Physical SIM</h4>
        <SimSerialScanner
          value={value.simSerial ?? ''}
          device={device}
          // eSIM is a valid alternative to a Physical serial, not an
          // additional requirement on top of it (2026-09-28 "Require either
          // eSIM selection or SIM Serial Number") - this panel's own blur
          // validation should stay quiet while the agent has gone the eSIM
          // route, rather than complain about a field they were never
          // going to fill in.
          suppressValidation={value.simType === 'eSIM'}
          onChange={(serial, valid, details) =>
            onChange({
              ...value,
              simType: 'Physical',
              simSerial: serial,
              simValid: valid,
              simIccid: details?.iccid,
              simStockStatus: details?.stockStatus,
              simKind: details?.simKind,
            })
          }
        />
        {/* The validated serial's read-back (SIM Type, SIM Serial Number, ICCID) is the SIM Serial capability's own: SimSerialScanner. */}
      </div>

      {/* eSIM - the explicit alternative, not a second tab behind a click. */}
      <div className="space-y-3">
        <h4 className="text-fg font-medium text-[length:var(--fs-body)]">eSIM</h4>
        {/* The QR code and send-to-email controls have moved to the
            activation-complete screen (EsimActivationPanel). This step only
            issues the code; showing a scannable QR here meant the customer
            could install an eSIM for an order still four steps from being
            submitted. What stays is the confirmation that it was issued. */}
        {value.simType === 'eSIM' && value.esimIssued && value.esimActivationCode ? (
          <>
            {/* "eSIM selected", not "eSIM issued" (2026-09-27). Nothing has
                been handed over at this point and the profile is not live -
                the walkthrough is explicit that an eSIM must not reach the
                customer before payment. Calling it "issued" four steps early
                described a handover that has not happened. */}
            <Badge variant="success">eSIM selected</Badge>
            <dl className="rounded-[var(--radius-card)] border border-success bg-tone-success p-3 space-y-1 text-[length:var(--fs-caption)]">
              <div className="flex justify-between gap-3">
                <dt className="text-fg">SIM Type</dt>
                <dd className="text-fg font-medium">eSIM</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-fg">SIM Serial Number</dt>
                <dd className="text-fg font-medium">{value.simIccid ?? '-'}</dd>
              </div>
            </dl>
            <p className="text-fg-2 text-[length:var(--fs-body)]">
              The eSIM activation QR code will be generated only after successful payment and order {approvalRequired ? 'approval' : 'submission'}, and will then be sent to {customerEmail ?? 'the customer'}.
            </p>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={generateEsim} disabled={issuing}>
              {issuing ? 'Selecting eSIM…' : 'Select eSIM'}
            </Button>
            {/* Stated up front (2026-09-28 request), not only after
                selecting - the agent should know this before choosing eSIM,
                not discover it afterward. */}
            <p className="text-muted text-[length:var(--fs-caption)]">
              The eSIM QR code will be generated only after successful payment and order {approvalRequired ? 'approval' : 'submission'}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
