import { useState } from 'react';
import { Drawer } from '../components/primitives/Drawer';
import { Input } from '../components/primitives/Input';
import { Button } from '../components/primitives/Button';
import { resolveRoleFromStaffId } from './staffIdRoleMap';
import { passwordPolicyError } from './passwordPolicy';
import { useNotificationStore } from '../stores/notificationStore';

// Placeholder verification code - VFQ Security has not confirmed whether an
// Authcode or OTP is used for forgot-password identification (OI-AGN-05).
const DEMO_VERIFICATION_CODE = '123456';

type Step = 'identify' | 'verify' | 'reset' | 'done';

interface ForgotPasswordFlowProps {
  open: boolean;
  onClose: () => void;
  initialStaffId?: string;
}

// Agent 360 BRSD APM-02/03/04: initiate forgotten-password flow, verify
// identity via Authcode/OTP, then create a new password per policy. This
// replaces what used to be a single toast ("would be sent... no real reset
// flow") with a real, if necessarily mocked, multi-step recovery.
export function ForgotPasswordFlow({ open, onClose, initialStaffId = '' }: ForgotPasswordFlowProps) {
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [step, setStep] = useState<Step>('identify');
  const [staffId, setStaffId] = useState(initialStaffId);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const reset = () => {
    setStep('identify');
    setStaffId(initialStaffId);
    setIdentifyError(null);
    setCode('');
    setCodeError(null);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submitIdentify = () => {
    if (!resolveRoleFromStaffId(staffId)) {
      setIdentifyError('Staff ID not recognised.');
      return;
    }
    setIdentifyError(null);
    setStep('verify');
  };

  const submitVerify = () => {
    if (code !== DEMO_VERIFICATION_CODE) {
      setCodeError('Invalid or expired code.');
      return;
    }
    setCodeError(null);
    setStep('reset');
  };

  const submitReset = () => {
    const policyError = passwordPolicyError(newPassword);
    if (policyError) {
      setPasswordError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError(null);
    setStep('done');
    pushToast('success', 'Password reset - sign in with your new password.');
  };

  const titleFor: Record<Step, string> = {
    identify: 'Forgot password - identify yourself',
    verify: 'Forgot password - verify identity',
    reset: 'Forgot password - create new password',
    done: 'Password reset',
  };

  return (
    <Drawer open={open} onClose={close} title={titleFor[step]}>
      {step === 'identify' && (
        <div className="space-y-3">
          <p className="text-fg-2 text-[length:var(--fs-body)]">Enter your Staff ID to begin password recovery.</p>
          <Input label="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} error={identifyError ?? undefined} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button variant="primary" onClick={submitIdentify} disabled={!staffId.trim()}>Continue</Button>
          </div>
        </div>
      )}
      {step === 'verify' && (
        <div className="space-y-3">
          <p className="text-fg-2 text-[length:var(--fs-body)]">
            Enter the verification code sent to your registered contact. (Demo code: {DEMO_VERIFICATION_CODE} - pending VFQ
            Security's real Authcode/OTP method.)
          </p>
          <Input label="Verification Code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} error={codeError ?? undefined} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setStep('identify')}>Back</Button>
            <Button variant="primary" onClick={submitVerify} disabled={!code}>Verify</Button>
          </div>
        </div>
      )}
      {step === 'reset' && (
        <div className="space-y-3">
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordError ?? undefined}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setStep('verify')}>Back</Button>
            <Button variant="primary" onClick={submitReset} disabled={!newPassword || !confirmPassword}>
              Reset Password
            </Button>
          </div>
        </div>
      )}
      {step === 'done' && (
        <div className="space-y-3">
          <p className="text-fg text-[length:var(--fs-body)]">Your password has been reset. You can now sign in with your new password.</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={close}>Done</Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
