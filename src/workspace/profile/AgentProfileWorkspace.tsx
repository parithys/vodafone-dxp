import { useEffect, useState } from 'react';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { useAuthStore } from '../../stores/authStore';
import { useEntityStore } from '../../stores/entityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { usePersonaStore } from '../../stores/personaStore';
import { DEMO_LOGIN_PASSWORD } from '../../auth/staffIdRoleMap';
import { passwordPolicyError } from '../../auth/passwordPolicy';
import { downloadCsv } from '../../engines/csvExport';
import { isInternalAgentPersona } from '../../engines/agentPrivilegeEngine';
import { grantedFeaturesFor } from '../../engines/personaEngine';
import { Input } from '../../components/primitives/Input';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { Select } from '../../components/primitives/Select';
import { PageHeader } from '../../components/patterns/PageHeader';

// Agent 360 AEX-03: "Order, Ticket until VFQ confirms the complete list"
// (OI-AGN-07) - the entity kinds and their entityStore keys are the only
// two named as examples anywhere in the BRSD. `featureKeyPrefix` backs
// AEX-01: an entity only appears as an export option if this role actually
// holds a granted feature in that area. Previously this matched a keyword
// against the persona's rbac.json screen names; grants are now the access
// model, so it matches the feature-key namespace instead.
const EXPORTABLE_ENTITIES = [
  { value: 'orders', label: 'Orders', featureKeyPrefix: 'orders.' },
  { value: 'trouble-tickets', label: 'Tickets', featureKeyPrefix: 'tickets.' },
] as const;

// Placeholder verification code - same open item as Forgot Password
// (OI-AGN-05/OI-AGN-06): VFQ Security has not confirmed the real
// Authcode/OTP mechanism for either forgot-password or in-session
// change-password/MFA identity verification.
const DEMO_VERIFICATION_CODE = '123456';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="caption-muted">{label}</div>
      <div className="body-text">{value || '-'}</div>
    </div>
  );
}

// Agent 360 BRSD APM-01/05/06/07/10: role-based profile view, initiate edit,
// change password (current/new/confirm), identity verification via
// Authcode/OTP, save. Previously there was no profile screen at all - an
// agent could only sign out or (as a demo affordance) switch role from the
// top-bar menu. MFA settings live alongside this on the same screen (see
// MfaSettingsSection).
export function AgentProfileWorkspace() {
  const staffId = useAuthStore((s) => s.staffId);
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const loadKind = useEntityStore((s) => s.loadKind);
  const orders = useEntityStore((s) => s.records.orders) ?? [];
  const tickets = useEntityStore((s) => s.records['trouble-tickets']) ?? [];
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  // APM-01/05/08, BR-01/BR-02: role-based view - password/MFA editing is
  // restricted to genuine internal Vodafone agent personas (see
  // agentPrivilegeEngine.ts for exactly which persona types this excludes
  // and why). Identity display, language, and export stay available to
  // everyone since those requirements carry no role-gating clause of their own.
  const canEditProfile = isInternalAgentPersona(activePersonaId);

  // AEX-01: "Entity list displays as per access rights" - an entity type only
  // appears as an export option if this role holds a granted feature in that
  // area, reusing the same grant data every other gating check relies on
  // rather than a static list identical for every role.
  const personaGrants = grantedFeaturesFor(activePersonaId);
  const eligibleEntities = EXPORTABLE_ENTITIES.filter((entity) =>
    personaGrants.some((g) => g.key.startsWith(entity.featureKeyPrefix))
  );

  const [exportEntity, setExportEntity] = useState<(typeof EXPORTABLE_ENTITIES)[number]['value'] | ''>('orders');

  useEffect(() => {
    if (eligibleEntities.length === 0) {
      setExportEntity('');
      return;
    }
    if (!eligibleEntities.some((e) => e.value === exportEntity)) {
      setExportEntity(eligibleEntities[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePersonaId]);

  useEffect(() => {
    loadKind('orders');
    loadKind('trouble-tickets');
  }, [loadKind]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [mfaEditing, setMfaEditing] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<'Authenticator App' | 'SMS OTP'>(profile?.mfaMethod ?? 'Authenticator App');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState<string | null>(null);

  const submitPasswordChange = () => {
    setSaved(false);
    if (currentPassword !== DEMO_LOGIN_PASSWORD) {
      setError('Current password is incorrect.');
      return;
    }
    if (verificationCode !== DEMO_VERIFICATION_CODE) {
      setError('Invalid or expired verification code.');
      return;
    }
    const policyError = passwordPolicyError(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setError(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setSaved(true);
    pushToast('success', 'Password changed.');
  };

  // BR-02 / APM-07/08: MFA change requires identity verification (the OTP
  // step below) AND now a role check (canEditProfile, see component top) -
  // "privileges approved by VFQ Security" (BR-02) resolves to "genuine
  // internal agent persona" per agentPrivilegeEngine.ts, pending a more
  // specific matrix from VFQ Security (OI-AGN-06).
  const toggleMfa = () => {
    if (profile?.mfaEnabled) {
      setProfile({ ...profile, mfaEnabled: false });
      pushToast('info', 'MFA disabled.');
      return;
    }
    setMfaEditing(true);
  };

  const submitMfaEnable = () => {
    if (mfaCode !== DEMO_VERIFICATION_CODE) {
      setMfaError('Invalid or expired verification code.');
      return;
    }
    if (!profile) return;
    setMfaError(null);
    setProfile({ ...profile, mfaEnabled: true, mfaMethod });
    setMfaEditing(false);
    setMfaCode('');
    pushToast('success', `MFA enabled via ${mfaMethod}.`);
  };

  // The export holds ONLY what this role may see: a record of a protected-segment customer the role may not see is left out (and counted), and
  // nothing is exported until the customers are known.
  const restricted = useRestrictedCustomers();
  const exportRows = exportEntity === 'orders' ? orders : exportEntity === 'trouble-tickets' ? tickets : [];
  const { visible: exportRecords, hiddenCount: exportHidden } = restricted.filter(exportRows as { customerId?: string }[], (r) => r.customerId);

  // AEX-02: "export all visible entity records... irrespective of whether
  // they are assigned to the logged-in agent" - every record this agent's
  // session has already loaded counts as visible, matching the app's
  // existing lack of per-agent row filtering on these two entities.
  const exportEntities = () => {
    downloadCsv(`${exportEntity}-export-${new Date().toISOString().slice(0, 10)}.csv`, exportRecords);
    pushToast('success', `Exported ${exportRecords.length} ${exportEntity === 'orders' ? 'order(s)' : 'ticket(s)'}.${exportHidden > 0 ? ` ${exportHidden} left out: access restricted for your role.` : ''}`);
  };

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Agent Profile</>} description={<>View your details and manage your password and MFA settings.</>} />

      <div className="card p-5 mb-6">
        <div className="pair-grid">
          <Field label="Name" value={profile?.name ?? ''} />
          <Field label="Staff ID" value={staffId} />
          <Field label="Job Title" value={profile?.jobTitle ?? ''} />
          <Field label="Team" value={profile?.team ?? ''} />
        </div>
      </div>

      {canEditProfile ? (
        <>
          <div className="card p-5">
            <h2 className="title-md mb-1">Change Password</h2>
            <p className="caption-secondary mb-4">
              Requires your current password and a verification code. (Demo code: {DEMO_VERIFICATION_CODE} - pending VFQ Security's
              real Authcode/OTP method.)
            </p>
            <div className="space-y-3">
              <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Input id="password-verification-code" label="Verification Code" inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              {error && <p className="text-danger text-[length:var(--fs-caption)]">{error}</p>}
              {saved && <Badge variant="success">Password Updated</Badge>}
              <div className="pt-1">
                <Button
                  variant="primary"
                  onClick={submitPasswordChange}
                  disabled={!currentPassword || !newPassword || !confirmPassword || !verificationCode}
                >
                  Save Password
                </Button>
              </div>
            </div>
          </div>

          <div className="card p-5 mt-6">
            <div className="row-between mb-1">
              <h2 className="title-md">Multi-Factor Authentication</h2>
              <Badge variant={profile?.mfaEnabled ? 'success' : 'filled-neutral'}>{profile?.mfaEnabled ? 'Enabled' : 'Disabled'}</Badge>
            </div>
            {profile?.mfaEnabled && (
              <p className="caption-secondary mb-4">Method: {profile.mfaMethod}</p>
            )}
            {!mfaEditing && (
              <Button variant="secondary" onClick={toggleMfa}>
                {profile?.mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
              </Button>
            )}
            {mfaEditing && (
              <div className="space-y-3 mt-2">
                <Select
                  label="Authenticator Method"
                  value={mfaMethod}
                  onChange={(e) => setMfaMethod(e.target.value as 'Authenticator App' | 'SMS OTP')}
                  options={[
                    { value: 'Authenticator App', label: 'Authenticator App' },
                    { value: 'SMS OTP', label: 'SMS OTP' },
                  ]}
                />
                <Input id="mfa-verification-code" label="Verification Code" inputMode="numeric" autoComplete="one-time-code" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
                {mfaError && <p className="text-danger text-[length:var(--fs-caption)]">{mfaError}</p>}
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" onClick={() => { setMfaEditing(false); setMfaCode(''); setMfaError(null); }}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={submitMfaEnable} disabled={!mfaCode}>
                    Save MFA Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card p-5">
          <h2 className="title-md mb-1">Change Password &amp; MFA</h2>
          <p className="caption-secondary">
            Profile editing (password, MFA) is available to internal Vodafone agent roles. This persona is an external or
            system-type contact (Agent 360 APM-01/05/08) and does not have edit access here.
          </p>
        </div>
      )}

      <div className="card p-5 mt-6">
        <h2 className="title-md mb-1">Export Your Data</h2>
        <p className="caption-secondary mb-4">
          Download a CSV of every visible record for an entity type. Which of these you can export depends on your role's access rights.
        </p>
        {eligibleEntities.length === 0 ? (
          <p className="text-muted text-[length:var(--fs-body)]">No exportable entities are available for your current role.</p>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Select
                label="Entity Type"
                value={exportEntity}
                onChange={(e) => setExportEntity(e.target.value as (typeof EXPORTABLE_ENTITIES)[number]['value'])}
                options={eligibleEntities.map(({ value, label }) => ({ value, label }))}
              />
            </div>
            <Button variant="primary" onClick={exportEntities} disabled={exportRecords.length === 0}>
              Export {exportRecords.length} record{exportRecords.length === 1 ? '' : 's'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
