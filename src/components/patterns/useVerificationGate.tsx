import { useRef, useState } from 'react';
import { useCustomerVerificationStore } from '../../stores/customerVerificationStore';
import { VerificationGate } from './VerificationGate';

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
