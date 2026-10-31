import { EntityMissing } from '../../components/patterns/EntityMissing';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEntityStore } from '../../stores/entityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Drawer } from '../../capabilities';
import { Select } from '../../components/primitives/Select';
import { Textarea } from '../../components/primitives/Textarea';
import { Input } from '../../components/primitives/Input';
import * as mockDataEngine from '../../engines/mockDataEngine';
import type { Lead } from './types';
import { useSubmitGuard } from '../../hooks/useSubmit';

interface RejectReason {
  reasonCode: string;
  reasonLabel: string;
}
interface Agent {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
}

// SCR-141 Lead Details View + its four evidenced sub-actions:
// SCR-145 Reject Lead modal, SCR-146 Lead Owner reassignment picker,
// SCR-148 Description edit popup, SCR-149 CallBack Date/Time picker.
export function LeadDetailsView() {
  const [params] = useSearchParams();
  const leadId = params.get('id');
  const leadRecords = useEntityStore((s) => s.records.leads);
  const leadsLoading = useEntityStore((s) => s.loading.leads);
  const leads = (leadRecords ?? []) as unknown as Lead[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const { guard } = useSubmitGuard();

  const [reasons, setReasons] = useState<RejectReason[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [modal, setModal] = useState<'reject' | 'reassign' | 'description' | 'callback' | null>(null);
  const [rejectCode, setRejectCode] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [callbackDraft, setCallbackDraft] = useState('');

  useEffect(() => {
    loadKind('leads');
    mockDataEngine.list<RejectReason>('reject-reasons').then(setReasons);
    mockDataEngine.list<Agent>('users-agents').then(setAgents);
  }, [loadKind]);

  // Never fall back to another lead: acting on the wrong one (reject, reassign) is worse than an error.
  const lead = leadId ? leads.find((l) => l.leadId === leadId) : undefined;

  if (!lead) {
    return <EntityMissing what="lead" loading={leadRecords === undefined || Boolean(leadsLoading)} backTo="/leads" backLabel="Back to leads" />;
  }

  const filteredAgents = agents.filter((a) => a.lastName.toLowerCase().includes(ownerFilter.toLowerCase()));

  const submitReject = () =>
    guard(async () => {
      await updateRecord('leads', 'leadId', lead.leadId, {
        status: 'Rejected',
        rejectReasonCode: rejectCode,
        rejectComment,
      });
      pushToast('warning', `Lead ${lead.leadId} rejected: ${reasons.find((r) => r.reasonCode === rejectCode)?.reasonLabel ?? rejectCode}`);
      setModal(null);
    });

  const submitReassign = (agent: Agent) =>
    guard(async () => {
      await updateRecord('leads', 'leadId', lead.leadId, { ownerId: agent.userId });
      pushToast('success', `Lead ${lead.leadId} reassigned to ${agent.firstName} ${agent.lastName}`);
      setModal(null);
    });

  const submitDescription = () =>
    guard(async () => {
      await updateRecord('leads', 'leadId', lead.leadId, { description: descriptionDraft });
      pushToast('success', 'Description updated.');
      setModal(null);
    });

  const submitCallback = () =>
    guard(async () => {
      await updateRecord('leads', 'leadId', lead.leadId, { callbackDate: callbackDraft, status: 'In Progress', subStatus: 'Call Back' });
      pushToast('success', `Callback set for ${callbackDraft} - Lead Status auto-transitioned to In Progress / Call Back.`);
      setModal(null);
    });

  return (
    <div className="p-8 w-full">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[length:var(--fs-h4)] font-bold text-fg">Lead {lead.leadId}</h1>
              <Badge variant={lead.status === 'Rejected' ? 'danger' : 'outlined-red'}>{lead.status}</Badge>
            </div>
            <p className="text-fg-2">{lead.serviceNeeded} - owned by {lead.ownerId}</p>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-[length:var(--fs-body)] card p-5">
            <div>
              <dt className="text-[length:var(--fs-caption)] text-fg">Sub Status</dt>
              <dd className="text-fg">{lead.subStatus ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-[length:var(--fs-caption)] text-fg">Callback Date</dt>
              <dd className="text-fg">{lead.callbackDate ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-[length:var(--fs-caption)] text-fg">Fixed Pre-Sales</dt>
              <dd className="text-fg">{lead.fixedPreSalesRequested ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-[length:var(--fs-caption)] text-fg">Created Via</dt>
              <dd className="text-fg">{lead.createdVia}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[length:var(--fs-caption)] text-fg">Description</dt>
              <dd className="text-fg">{lead.description ?? '-'}</dd>
            </div>
          </dl>
        </div>

        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="card p-5">
            <h2 className="text-[length:var(--fs-body-lg)] text-fg font-bold mb-3">Actions</h2>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => { setDescriptionDraft(lead.description ?? ''); setModal('description'); }}
              >
                Edit Description
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => { setCallbackDraft(lead.callbackDate ?? ''); setModal('callback'); }}
              >
                Set Callback
              </Button>
              <Button variant="secondary" className="w-full justify-center" onClick={() => setModal('reassign')}>
                Reassign Owner
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center !text-danger !border-danger"
                onClick={() => setModal('reject')}
              >
                Reject
              </Button>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-[length:var(--fs-body-lg)] text-fg font-bold mb-3">Overview</h2>
            <div className="space-y-3 text-[length:var(--fs-body)]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">Status</span>
                <Badge variant={lead.status === 'Rejected' ? 'danger' : 'outlined-red'}>{lead.status}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">Lead #</span>
                <span className="text-accent font-medium">{lead.leadId}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">Service Needed</span>
                <span className="text-fg text-right">{lead.serviceNeeded}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">Owner</span>
                <span className="text-fg">{lead.ownerId}</span>
              </div>
              {lead.contactName && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted">Contact</span>
                  <span className="text-fg">{lead.contactName}</span>
                </div>
              )}
              {lead.mobileNumber && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted">Mobile</span>
                  <span className="text-fg">{lead.mobileNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">Created Via</span>
                <span className="text-fg">{lead.createdVia}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={modal === 'reject'} onClose={() => setModal(null)} title="Reject Lead">
        <div className="space-y-3">
          <Select
            label="Reject Reason Code"
            value={rejectCode}
            onChange={(e) => setRejectCode(e.target.value)}
            placeholder="Select a reason"
            options={reasons.map((r) => ({ value: r.reasonCode, label: r.reasonLabel }))}
          />
          <Textarea label="Reject Comment" value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={submitReject} disabled={!rejectCode}>Confirm Rejection</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'reassign'} onClose={() => setModal(null)} title="Lead Owner">
        <Input aria-label="Filter by Last Name" placeholder="Filter by Last Name" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} />
        <div className="mt-3 divide-y divide-border-soft max-h-64 overflow-y-auto">
          {filteredAgents.map((a) => (
            <button type="button"
              key={a.userId}
              onClick={() => submitReassign(a)}
              className="w-full text-left px-2 py-2 hover:bg-surface flex justify-between"
            >
              <span className="text-fg">{a.firstName} {a.lastName}</span>
              <span className="text-muted text-[length:var(--fs-caption)]">{a.jobTitle}</span>
            </button>
          ))}
          {filteredAgents.length === 0 && <p className="text-muted py-3 text-center">No matching candidates.</p>}
        </div>
      </Drawer>

      <Drawer
        open={modal === 'description'}
        onClose={() => setModal(null)}
        title="Description"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={submitDescription}>Save Description</Button>
          </>
        }
      >
        <Textarea aria-label="Description" value={descriptionDraft} onChange={(e) => setDescriptionDraft(e.target.value)} />
      </Drawer>

      <Drawer
        open={modal === 'callback'}
        onClose={() => setModal(null)}
        title="CallBack Date/Time"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={submitCallback} disabled={!callbackDraft}>Done</Button>
          </>
        }
      >
        <Input aria-label="Callback date and time" type="datetime-local" value={callbackDraft} onChange={(e) => setCallbackDraft(e.target.value)} />
      </Drawer>
    </div>
  );
}
