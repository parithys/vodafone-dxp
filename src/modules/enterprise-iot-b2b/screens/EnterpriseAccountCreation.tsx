import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { Button } from '../../../components/primitives/Button';
import { Badge } from '../../../components/primitives/Badge';
import { evaluateRule } from '../../../engines/ruleEngine';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { Checkbox } from '../../../components/primitives/Checkbox';
import { PageHeader } from '../../../components/patterns/PageHeader';

// SCR-007: Account Creation Screen (Enterprise) - FLD-023–028 (UJ-004, high
// confidence): Account/Company name, CR type/ID type, CR number (mandatory
// search before creation), Agent ID (commission), Business type (incl.
// B2B2C), Credit limit - no default for enterprise, requires Business Finance
// approval (BR-ENTERPRISE-CREDIT-LIMIT-APPROVAL).
export function EnterpriseAccountCreation() {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);

  const [name, setName] = useState('');
  const [crType, setCrType] = useState('Commercial Registration');
  const [crNumber, setCrNumber] = useState('');
  const [crSearched, setCrSearched] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [businessType, setBusinessType] = useState('Enterprise');
  const [creditLimit, setCreditLimit] = useState('');
  const [financeApproved, setFinanceApproved] = useState(false);

  const searchCr = () => {
    if (!crNumber) return;
    setCrSearched(true);
  };

  const approvalResult = evaluateRule('BR-ENTERPRISE-CREDIT-LIMIT-APPROVAL', { approved: financeApproved });
  const canCreate = Boolean(name && crSearched && agentId && businessType) && (!creditLimit || approvalResult.pass);

  const create = async () => {
    const accountId = `ACC-${Date.now().toString().slice(-6)}`;
    await createRecord('enterprise-accounts', {
      accountId,
      name,
      crType,
      crNumber,
      agentId,
      businessType,
      creditLimitQAR: creditLimit ? Number(creditLimit) : null,
      financeApproved,
    });
    pushToast('success', `Enterprise account ${accountId} created for ${name}.`);
    navigate('/enterprise-iot-b2b');
  };

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Enterprise Account Creation</>} />

      <div className="space-y-4">
        <Input label="Account/Company Name" value={name} onChange={(e) => setName(e.target.value)} />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="CR Type / ID Type"
              value={crType}
              onChange={(e) => setCrType(e.target.value)}
              options={[
                { value: 'Commercial Registration', label: 'Commercial Registration' },
                { value: 'Trade License', label: 'Trade License' },
              ]}
            />
          </div>
          <div className="flex-1">
            <Input
              label="CR Number"
              value={crNumber}
              onChange={(e) => {
                setCrNumber(e.target.value);
                setCrSearched(false);
              }}
            />
          </div>
          <Button variant="secondary" onClick={searchCr} disabled={!crNumber}>
            Search
          </Button>
        </div>
        {crSearched && <Badge variant="success">CR Verified</Badge>}
        {!crSearched && crNumber && <p className="text-[length:var(--fs-caption)] text-muted">Mandatory CR-number search required before account creation.</p>}

        <Input label="Agent ID (for Commission)" value={agentId} onChange={(e) => setAgentId(e.target.value)} />

        <Select
          label="Business Type"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          options={[
            { value: 'Enterprise', label: 'Enterprise' },
            { value: 'SME', label: 'SME' },
            { value: 'B2B2C', label: 'B2B2C' },
          ]}
        />

        <Input
          label="Credit Limit (QAR) - no default for enterprise"
          type="number"
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
        />

        {creditLimit && (
          <div className="card p-3">
            <label className="flex items-center gap-2 text-[length:var(--fs-body)] text-fg">
              <Checkbox checked={financeApproved} onChange={(e) => setFinanceApproved(e.target.checked)} />
              Business Finance has approved this credit limit
            </label>
            {!approvalResult.pass && <p className="text-danger text-[length:var(--fs-caption)] mt-2">{approvalResult.message}</p>}
          </div>
        )}

        <Button variant="primary" onClick={create} disabled={!canCreate}>
          Create Account
        </Button>
      </div>
    </div>
  );
}
