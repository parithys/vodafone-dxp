import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { usePersonaStore } from '../../../stores/personaStore';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { useTicketSlaEscalationSweep } from '../slaEscalationSweep';
import type { Ticket, AuditRecord, OsbNotification } from './ticketDetailModel';

// Store bindings, local state and data-loading effects for TicketDetail.
// Hook order here is the original component's order - do not reorder.
export function useTicketDetailState() {
  const [params] = useSearchParams();
  const ticketId = params.get('id');
  const tickets = (useEntityStore((s) => s.records['trouble-tickets']) ?? []) as unknown as Ticket[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const [noteText, setNoteText] = useState('');
  const [activityText, setActivityText] = useState('');
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolutionCode, setResolutionCode] = useState('');
  const [resolutionHashtags, setResolutionHashtags] = useState<string[]>([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [retentionCloseOpen, setRetentionCloseOpen] = useState(false);
  const [retentionResolutionCode, setRetentionResolutionCode] = useState('');
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reassignQueue, setReassignQueue] = useState('');
  const [surveyNotifications, setSurveyNotifications] = useState<OsbNotification[]>([]);
  useTicketSlaEscalationSweep();

  useEffect(() => {
    loadKind('trouble-tickets');
  }, [loadKind]);

  useEffect(() => {
    if (!ticketId) return;
    mockDataEngine.list<AuditRecord>('audit-trail').then((all) => {
      setAuditRecords(all.filter((a) => a.recordType === 'Ticket' && a.recordId === ticketId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    });
  }, [ticketId, tickets]);

  // Screen 14 (System Event: Customer Feedback Status) - surfaces the
  // survey-triggered notify() call closeTicket() already makes (see its own
  // comment below) directly on the ticket, instead of it only showing up
  // generically under Customer 360 -> Notifications.
  useEffect(() => {
    if (!ticketId) return;
    mockDataEngine.list<OsbNotification>('osb-notifications').then((all) => {
      setSurveyNotifications(all.filter((n) => n.orderId === ticketId && n.smsText.includes('satisfaction survey')));
    });
  }, [ticketId, tickets]);

  const ticket = tickets.find((t) => t.ticketId === ticketId);
  return {
    ticket,
    updateRecord,
    createRecord,
    pushToast,
    activePersonaId,
    noteText,
    setNoteText,
    activityText,
    setActivityText,
    auditRecords,
    escalateOpen,
    setEscalateOpen,
    escalateReason,
    setEscalateReason,
    resolveOpen,
    setResolveOpen,
    resolutionCode,
    setResolutionCode,
    resolutionHashtags,
    setResolutionHashtags,
    cancelOpen,
    setCancelOpen,
    cancelReason,
    setCancelReason,
    retentionCloseOpen,
    setRetentionCloseOpen,
    retentionResolutionCode,
    setRetentionResolutionCode,
    reopenOpen,
    setReopenOpen,
    reopenReason,
    setReopenReason,
    reassignQueue,
    setReassignQueue,
    surveyNotifications,
  };
}

export type TicketDetailState = ReturnType<typeof useTicketDetailState>;
