import { useRef, useState } from 'react';
import { useCustomerVerificationStore } from '../../stores/customerVerificationStore';
import { Drawer } from '../primitives/Drawer';
import { Button } from '../primitives/Button';
import { CustomerIdentification } from '../../capabilities/CustomerIdentification';
import { EligibilityGateStep } from '../../capabilities/EligibilityGate/EligibilityGateStep';
import type { IdLookupValue } from './idLookupModel';
import type { EligibilityResult } from '../domain/eligibilityTypes';
import { useEnterToSubmit } from '../../hooks/useEnterToSubmit';

interface VerificationGateProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

// CUS-001-KYC-02/03 / BR-01: re-confirms the identified customer's identity
// before any demographic/contact/address/billing maintenance proceeds, with
// the Customer Verification capability the activation journeys use (scan or
// upload, verify, Fetch from MOI - bound to THIS customer) and the eligibility
// checks on the identified customer. Once
// verified, useCustomerVerificationStore never un-verifies - matches
// Annex_02's Unverified -> Verified, no transition out of Verified.
export function VerificationGate({ customerId, customerName, open, onClose, onVerified }: VerificationGateProps) {
  const verifyCustomer = useCustomerVerificationStore((s) => s.verifyCustomer);
  // The same Customer Verification capability the activation journeys use, bound to THIS customer: the scan reads their own document, the
  // number and expiry are verified against it, and Fetch resolves them from MOI. The eligibility checks then run on the identified customer.
  const [value, setValue] = useState<IdLookupValue>({});
  const [eligibility, setEligibility] = useState<EligibilityResult | undefined>();

  const identified = value.moiResult?.customerId === customerId;
  // A hard stop (blacklist, expired ID, under 18 ...) blocks the maintenance action; a stop that only concerns a new sale (collections) or an approval does not.
  const eligible = Boolean(eligibility) && !eligibility!.hardStop;
  const canVerify = identified && eligible;

  const runVerification = () => {
    if (!canVerify) return;
    verifyCustomer(customerId);
    setValue({});
    setEligibility(undefined);
    onVerified();
  };

  const handleKeyDown = useEnterToSubmit(canVerify, runVerification);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Verify Customer Identity"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!canVerify} onClick={runVerification}>
            Verify &amp; Continue
          </Button>
        </>
      }
    >
      <div className="space-y-4" onKeyDown={handleKeyDown}>
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          {customerName}'s identity must be verified before any demographic, contact, address, or billing
          maintenance action can proceed.
        </p>
        <CustomerIdentification
          value={value}
          onChange={(v) => {
            setValue(v);
            // Another ID or a retake discards what was checked for the last one.
            if (!v.moiResult) setEligibility(undefined);
          }}
          asCustomerId={customerId}
          allowNewCustomer={false}
        />
        {identified && (
          <EligibilityGateStep
            asCustomerId={customerId}
            idNumber={value.idNumber}
            // Maintenance adds no line: the line limit is not judged.
            skipLineLimit
            announcePass={false}
            result={eligibility}
            onResult={setEligibility}
          />
        )}
      </div>
    </Drawer>
  );
}

/** Shared gate hook - call requireVerification(action) at any edit-entry
 * point; action runs immediately if already verified this session,
 * otherwise the gate drawer opens and action runs once verification
 * succeeds. Render `gate` once per screen. */
export function useVerificationGate(customerId: string, customerName: string) {
  const isVerified = useCustomerVerificationStore((s) => s.isVerified(customerId));
  const [open, setOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const requireVerification = (action: () => void) => {
    if (isVerified) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setOpen(true);
  };

  const gate = (
    <VerificationGate
      customerId={customerId}
      customerName={customerName}
      open={open}
      onClose={() => setOpen(false)}
      onVerified={() => {
        setOpen(false);
        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        action?.();
      }}
    />
  );

  return { isVerified, requireVerification, gate };
}
