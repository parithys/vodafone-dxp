import { useEffect, useState } from 'react';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from './RestrictedCustomerNotice';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { usePersonaStore } from '../../stores/personaStore';
import { Drawer } from '../primitives/Drawer';
import { Select } from '../primitives/Select';
import { Textarea } from '../primitives/Textarea';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Badge } from '../primitives/Badge';
import { evaluateRule } from '../../engines/ruleEngine';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useNotificationStore } from '../../stores/notificationStore';
import { TT_AREAS, TT_ACTUAL_ISSUES, derivePriorityFromSegment, slaTargetHours } from '../../data/reference/ticketReferenceData';

// Slide 15 "Type of Tickets" taxonomy (vodafone-process-overview-290626-ec-1ed338b9).
const ISSUE_TYPES = [
  'Disconnection',
  'Migration (Pre-to-Post)',
  'Plan Downgrade',
  'Language Change',
  'End Data Session',
  'Mobile Complaints',
  'Fixed/5G Complaints',
  'SOC',
  'Human Error Complaints',
];

// Slide 36's two named example templates - evidenced only for the two
// complaint categories ("200+ issue types" each); other issue types get a
// free-text template field since no canned template is evidenced for them.
const TEMPLATES: Record<string, string> = {
  'Slow Data Performance': 'Customer reports slow mobile data speeds. Confirm network coverage, run a speed test, and check for active data-throttling flags on the account.',
  'Incorrect Charges': 'Customer disputes a charge on their latest bill. Confirm the billed amount against the account’s active plan/add-ons and check for pending adjustments.',
};

const QUEUES = ['FL Agents', 'Complaints Team'];

interface CustomerRecord {
  customerId: string;
  segment?: string;
  nationality?: string;
}

interface TicketRecord {
  customerId: string;
  category: string;
  area?: string;
  status: string;
}

export interface NewTicketValue {
  customerId: string;
  issueType: string;
  area: string;
  template: string;
  templateContent: string;
  actualIssue: string;
  queue: string;
  priority: string;
  slaTargetHours: number;
  severity?: string;
}

interface TicketCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: NewTicketValue) => void | Promise<void>;
  /** Pre-fills Customer ID when opened from Customer 360, where the customer
   * is already on screen - the agent shouldn't have to re-type an ID they
   * already looked up to get here. */
  initialCustomerId?: string;
  /** Pre-filled when the ticket is started from a Customer 360 query (the agent can still change them). */
  initialIssueType?: string;
  initialActualIssue?: string;
  /** Queue chosen by the Customer 360 routing rules, with the reason shown under the field. */
  initialQueue?: string;
  routingNote?: string;
  /** Primary severity from the categorization workbook, stored on the ticket. */
  severity?: string;
}

// SCR-213: Open UI Tickets Fields (per-issue-type template) - modal where
// agents select the ticket's issue type and paste/edit the matching template
// content; Confirm/Save commits, Cancel discards (screen-behaviour-catalogue.md).
// BR-068 gates commit on Issue Type + template content both being present -
// an unsubmitted ticket never routes to a queue. Extended per the Trouble
// Ticket BRSD gap analysis (2026-09-11) to close: MPRA_001_CRE-08/09 (Area
// picklist, cascaded from Issue Type - BRSD's own Sub-Area tier isn't
// enumerated anywhere in the source, so this models the one confirmed level,
// Area), CRE-01 (3-char smart search over the issue-type list, BR-002),
// CRE-05 (Knowledge Base access - no real KB integration exists anywhere in
// this app, so the button surfaces an honest "pending" message rather than
// linking to a fabricated URL), CRE-16 (Priority derived and locked from
// Customer Type, not freely picked), and ASC-02/04 (duplicate-ticket
// candidate detection by Customer + Category + Area match).
export function TicketCreationModal({ open, onClose, onSubmit, initialCustomerId = '', initialIssueType = '', initialActualIssue = '', initialQueue = '', routingNote, severity }: TicketCreationModalProps) {
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [searchQuery, setSearchQuery] = useState('');
  const [issueType, setIssueType] = useState(initialIssueType);
  const [area, setArea] = useState('');
  const [template, setTemplate] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [actualIssue, setActualIssue] = useState(initialActualIssue);
  const [queue, setQueue] = useState(initialQueue);
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  // A customer ID that belongs to a protected segment this role may not see: nothing about them is derived or shown, and no ticket can be raised.
  const restrictedCustomers = useRestrictedCustomers();
  const blocked = restrictedCustomers.ready && Boolean(customerId.trim()) && restrictedCustomers.isRestricted(customerId.trim());
  const [duplicates, setDuplicates] = useState<TicketRecord[]>([]);
  const pushToast = useNotificationStore((s) => s.pushToast);

  const showTemplatePicker = issueType === 'Mobile Complaints' || issueType === 'Fixed/5G Complaints';
  const gate = evaluateRule('BR-068', { issueType, templateContent });
  const [submitting, setSubmitting] = useState(false);

  // CRE-16: resolve the customer once an ID is entered, to derive Priority
  // and the SLA target - same identity-lookup shape as the rest of the app,
  // just keyed directly by customerId since this modal has no MOI/ID-scan
  // step of its own to resolve one from.
  useEffect(() => {
    if (!customerId.trim()) {
      setCustomer(null);
      return;
    }
    let cancelled = false;
    mockDataEngine.list<CustomerRecord>('customers').then((all) => {
      if (cancelled) return;
      const found = all.find((c) => c.customerId === customerId.trim()) ?? null;
      // Authorisation before anything is derived from the record (priority, SLA, segment text).
      setCustomer(found && canViewCustomerSegment(usePersonaStore.getState().activePersonaId, found.segment) ? found : null);
    });
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  // ASC-02/04: a ticket is a duplicate candidate when Category + Area match
  // for the same customer on a still-open ticket (MSISDN/Sub-Area aren't
  // captured anywhere in this simplified schema, so this checks the two
  // matching fields the app's ticket schema actually has).
  useEffect(() => {
    if (!customerId.trim() || !issueType || blocked) {
      setDuplicates([]);
      return;
    }
    let cancelled = false;
    mockDataEngine.list<TicketRecord>('trouble-tickets').then((all) => {
      if (cancelled) return;
      setDuplicates(
        all.filter(
          (t) =>
            t.customerId === customerId.trim() &&
            t.category === issueType &&
            (!area || t.area === area) &&
            t.status !== 'Closed' &&
            t.status !== 'Cancelled'
        )
      );
    });
    return () => {
      cancelled = true;
    };
  }, [customerId, issueType, area, blocked]);

  const areaOptions = TT_AREAS[issueType] ?? [];
  const derivedPriority = derivePriorityFromSegment(customer?.segment);
  const derivedSlaHours = slaTargetHours(customer?.nationality);
  const matchingIssueTypes =
    searchQuery.trim().length >= 3 ? ISSUE_TYPES.filter((t) => t.toLowerCase().includes(searchQuery.trim().toLowerCase())) : ISSUE_TYPES;

  const reset = () => {
    setCustomerId('');
    setSearchQuery('');
    setIssueType('');
    setArea('');
    setTemplate('');
    setTemplateContent('');
    setActualIssue('');
    setQueue('');
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ customerId, issueType, area, template, templateContent, actualIssue, queue, priority: derivedPriority, slaTargetHours: derivedSlaHours, severity });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} title="New Trouble Ticket">
      <div className="space-y-4">
        <Input
          label="Customer ID"
          placeholder="e.g. CUST-1001"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        {blocked && <RestrictedCustomerNotice compact />}
        <Input
          label="Search Ticket Category"
          placeholder="Type at least 3 characters to filter…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          helperText="Knowledge-base-assisted category search (MPRA_001_CRE-01)."
        />
        <Select
          label="Issue Type"
          value={issueType}
          onChange={(e) => {
            setIssueType(e.target.value);
            setArea('');
            setTemplate('');
            setTemplateContent('');
          }}
          placeholder="Select an issue type"
          options={matchingIssueTypes.map((t) => ({ value: t, label: t }))}
        />
        {issueType && (
          <Select
            label="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Select an area"
            options={areaOptions.map((a) => ({ value: a, label: a }))}
          />
        )}
        <Select
          label="Actual Issue (Optional)"
          value={actualIssue}
          onChange={(e) => setActualIssue(e.target.value)}
          placeholder="Select the real root-cause classification"
          options={[...new Set([...TT_ACTUAL_ISSUES, ...(initialActualIssue ? [initialActualIssue] : [])])].map((i) => ({ value: i, label: i }))}
          helperText="Real (partial sample) Siebel VFQA_TT_ACTUAL_ISSUE values - see ticketReferenceData.ts."
        />
        {duplicates.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft p-3">
            <p className="text-[length:var(--fs-caption)] text-fg font-medium">
              {duplicates.length} potential duplicate {duplicates.length === 1 ? 'ticket' : 'tickets'} found for this customer/category/area (ASC-02/04):
            </p>
            <ul className="list-disc list-inside text-[length:var(--fs-caption)] text-fg-2">
              {duplicates.map((d) => (
                <li key={d.customerId + d.category}>{d.category}{d.area ? ` - ${d.area}` : ''}</li>
              ))}
            </ul>
          </div>
        )}
        {showTemplatePicker && (
          <Select
            label="Template"
            value={template}
            onChange={(e) => {
              const t = e.target.value;
              setTemplate(t);
              setTemplateContent(TEMPLATES[t] ?? '');
            }}
            placeholder="Select a template"
            options={Object.keys(TEMPLATES).map((t) => ({ value: t, label: t }))}
          />
        )}
        <Textarea
          label="Template Content"
          placeholder="Paste or edit the ticket template content."
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
        />
        <Select
          label="Queue"
          value={queue}
          onChange={(e) => setQueue(e.target.value)}
          placeholder="Select a queue"
          options={[...new Set([...QUEUES, ...(initialQueue ? [initialQueue] : [])])].map((q) => ({ value: q, label: q }))}
          helperText={routingNote}
        />
        <div>
          <div className="text-[length:var(--fs-caption)] text-muted mb-1">Priority (derived from Customer Type, CRE-16)</div>
          <div className="flex items-center gap-2">
            <Badge variant={derivedPriority === '1-ASAP' ? 'danger' : derivedPriority === '2-High' ? 'warning' : 'filled-neutral'}>
              {derivedPriority}
            </Badge>
            <span className="text-[length:var(--fs-caption)] text-muted">
              {customer ? `Segment: ${customer.segment}` : 'Enter a Customer ID to derive priority'} - not overridable by a non-privileged agent.
            </span>
          </div>
        </div>
        <Button variant="tertiary" compact onClick={() => pushToast('info', 'The Knowledge Base is not available yet.')}>
          Open Knowledge Base ↗
        </Button>
        {!gate.pass && <p className="text-[length:var(--fs-caption)] text-danger">{gate.message}</p>}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => { reset(); onClose(); }}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={!gate.pass || !customerId || !queue || submitting || blocked || !restrictedCustomers.ready}>
          {submitting ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Drawer>
  );
}
