import { useState } from 'react';
import { Drawer } from '../../capabilities';
import { ChoiceCards } from '../../components/primitives/ChoiceCards';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import { useEntityStore } from '../../stores/entityStore';
import { useProfileChangeTicket } from '../../engines/profileChangeTicket';
import { useSubmit } from '../../hooks/useSubmit';
import { useNotificationStore } from '../../stores/notificationStore';
import { currentAgentId } from '../../stores/authStore';
import { creditLimitPolicy, defaultCreditLimitFor } from '../../engines/creditLimit';
import { applyAgentCreditLimitChange, CREDIT_LIMIT_CHANGE_ORDER_TYPE } from './creditLimitChange';
import { COLLECTION_TEAM_ROLE } from '../../capabilities/CustomerType/customerTypeModel';
import { Input } from '../../components/primitives/Input';
import * as mockDataEngine from '../../engines/mockDataEngine';
import type { CustomerRecord } from '../../engines/customer360Engine';
import { EDITABLE_ACCOUNT_STATUSES, diffAccountEdits } from './accountEditModel';
import { formatQar } from '../../lib/format';

// Icon tiles of the choice cards (24px grid paths).
const STATUS_ICON: Record<string, string> = {
  Active: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  Suspended: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M10 9v6 M14 9v6',
  Closed: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15 9l-6 6 M9 9l6 6',
};
// An account status reads at a glance: Active green, Suspended amber, Closed grey.
const STATUS_TONE: Record<string, 'success' | 'warn' | 'danger' | 'neutral'> = { Active: 'success', Suspended: 'warn', Closed: 'neutral' };

/**
 * Edit Account Details (Customer 360 > Account Information): Credit Limit and Account Status. The Account Type and the Customer Segment of an
 * existing account are shown but cannot be changed. The credit limit is chosen from the values that apply to the customer - and not at all for a
 * Safwa / Safwa+ / Royal customer, an HRN customer, or a limit the Credit Control Team set. Every change is written to the audit trail. The caller has
 * already verified the customer (the verification drawer).
 */
export function AccountEditDrawer({
  open,
  onClose,
  customer,
  account,
  creditLimit,
  onSaved,
  onTicketCreated,
}: {
  open: boolean;
  onClose: () => void;
  customer: CustomerRecord;
  account: { accountId: string; status?: string; accountType?: string } | undefined;
  /** The credit-limit record on file for the customer, when there is one. */
  creditLimit: { id?: string; creditLimitQar?: number; creditControlLimitQar?: number | null } | undefined;
  onSaved: (patch: { accountStatus?: string; creditLimitQar?: number; selectedCreditLimitQar?: number | null }) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const createChangeTicket = useProfileChangeTicket();
  const nationality = (customer as { nationality?: string }).nationality;
  const policy = creditLimitPolicy({ segment: customer.segment, nationality, creditControlLimitQar: creditLimit?.creditControlLimitQar });
  // The limit in force: the one on file, else the default for the customer.
  const effectiveCurrent = creditLimit?.creditLimitQar ?? defaultCreditLimitFor(nationality);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [limit, setLimit] = useState(String(effectiveCurrent));
  const [status, setStatus] = useState(account?.status ?? '');
  const [error, setError] = useState<string | undefined>();
  // A limit the agent asks the Credit Control Team to set (outside the options, or over one they set): an approval order, not a change.
  const [request, setRequest] = useState('');
  const [requestError, setRequestError] = useState<string | undefined>();
  const canRequest = policy.lock !== 'protected-segment' && policy.lock !== 'hrn';
  // The limit on file may not be one of today's options (an older record): it is still shown, as the current one.
  const optionValues = [...new Set([...policy.options, effectiveCurrent])].sort((a, b) => a - b);

  const { run: save, pending: saving } = useSubmit(async () => {
    const { changed, edits, error: problem } = diffAccountEdits(
      { creditLimitQar: effectiveCurrent, accountStatus: account?.status, segment: customer.segment },
      { creditLimit: limit, accountStatus: status, segment: customer.segment }
    );
    if (problem) {
      setError(problem);
      return;
    }
    // The Credit Control request is checked BEFORE anything is saved, so a bad number never leaves the other changes half-applied.
    const requested = request.trim();
    let requestedQar: number | undefined;
    if (requested !== '') {
      const n = Number(requested);
      if (!canRequest || !Number.isInteger(n) || n < 0) {
        setRequestError('Enter the limit to request as a whole number of QAR, zero or more.');
        return;
      }
      requestedQar = n;
    }
    if (edits.accountStatus && account) await updateRecord('accounts', 'accountId', account.accountId, { status: edits.accountStatus });
    // The credit limit is applied by the policy: an agent may choose it only when it is theirs to change, from the values offered, and it is audited.
    let savedLimit: number | undefined;
    if (edits.creditLimitQar !== undefined) {
      const result = await applyAgentCreditLimitChange(
        { customer: { customerId: customer.customerId, segment: customer.segment, nationality }, record: creditLimit, accountId: account?.accountId, toQar: edits.creditLimitQar, agentId: currentAgentId() ?? 'agent' },
        {
          list: (k) => mockDataEngine.list(k) as never,
          updateRecord: updateRecord as never,
          createRecord: createRecord as never,
        }
      );
      if (!result.ok) {
        setError(result.message);
        return;
      }
      savedLimit = edits.creditLimitQar;
      pushToast('success', `Credit limit changed to ${formatQar(savedLimit)}.`);
    }
    // A Credit Control request: an order Credit Control approves; approving it sets THEIR limit (applyCreditLimitChange), which an agent cannot then change.
    if (requestedQar !== undefined) {
      const n = requestedQar;
      if (n !== effectiveCurrent) {
        const requestId = `ORD-${Date.now().toString().slice(-6)}`;
        await createRecord('orders', {
          orderId: requestId,
          orderType: CREDIT_LIMIT_CHANGE_ORDER_TYPE,
          orderSubType: 'Credit Control',
          status: 'Submitted for Approval',
          approverRole: COLLECTION_TEAM_ROLE,
          createdAt: new Date().toISOString(),
          createdBy: currentAgentId(),
          customerId: customer.customerId,
          customerName: customer.name,
          accountId: account?.accountId,
          currentCreditLimitQar: effectiveCurrent,
          requestedCreditLimitQar: n,
          approvalReason: `Credit limit change requested: ${formatQar(effectiveCurrent)} to ${formatQar(n)}. Needs Credit Control approval.`,
        });
        pushToast('success', `Credit limit request sent (${requestId}) - it takes effect once ${COLLECTION_TEAM_ROLE} approves it.`);
      }
    }
    if (changed.length > 0) {
      const { record } = await createChangeTicket(customer.customerId, 'Account', changed);
      onTicketCreated(record);
    }
    onSaved({ accountStatus: edits.accountStatus, creditLimitQar: savedLimit, selectedCreditLimitQar: savedLimit === undefined ? undefined : savedLimit === policy.defaultQar ? null : savedLimit });
    onClose();
  }, 'Could not save the account details. Please try again.');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit Account Details"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={saving} onClick={save}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <dl className="divide-y divide-border-soft text-[length:var(--fs-body)]">
          <div className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="text-fg-2">Account Type</dt>
            <dd className="text-fg font-medium">{account?.accountType ?? '-'}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="text-fg-2">Customer Segment</dt>
            <dd className="text-fg font-medium">{customer.segment}</dd>
          </div>
        </dl>
        <p className="text-[length:var(--fs-caption)] text-muted">The account type and customer segment of an existing account cannot be changed.</p>
        <Select
          label="Credit Limit (QAR)"
          value={limit}
          disabled={!policy.editable}
          error={error}
          helperText={policy.editable ? `Choose from the limits that apply to this customer (up to ${formatQar(policy.defaultQar)}). The change is recorded in the audit trail.` : policy.message}
          options={optionValues.map((v) => ({ value: String(v), label: `${formatQar(v)}` }))}
          onChange={(e) => {
            setLimit(e.target.value);
            setError(undefined);
          }}
        />
        {canRequest && (
          <Input
            label="Request a different limit from Credit Control (QAR, optional)"
            helperText="Sent to the Credit Control Team for approval. If approved it becomes their limit, which an agent cannot change."
            type="number"
            min={0}
            value={request}
            error={requestError}
            onChange={(e) => {
              setRequest(e.target.value);
              setRequestError(undefined);
            }}
          />
        )}
        <ChoiceCards
          legend="Account Status"
          items={[...new Set([...(account?.status ? [account.status] : []), ...EDITABLE_ACCOUNT_STATUSES])].map((st) => ({ key: st, label: st, icon: STATUS_ICON[st] ?? STATUS_ICON.Active, tone: STATUS_TONE[st] ?? 'neutral' }))}
          value={status}
          onChange={setStatus}
        />
        <p className="pt-2 border-t border-border-soft text-[length:var(--fs-caption)] text-muted">
          Only these account details can be changed here. Saving creates a reference ticket for follow-up.
        </p>
      </div>
    </Drawer>
  );
}
