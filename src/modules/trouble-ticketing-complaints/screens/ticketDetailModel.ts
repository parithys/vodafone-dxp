interface PublicNote {
  author: string;
  text: string;
  createdAt: string;
}

export interface Activity {
  type: 'Manual' | 'Auto';
  description: string;
  createdAt: string;
  createdBy: string;
  open: boolean;
}

export interface Escalation {
  reason: string;
  escalatedAt: string;
  escalatedBy: string;
}

export interface Attachment {
  name: string;
  size: number;
  uploadedAt: string;
}

export interface Ticket {
  ticketId: string;
  customerId: string;
  status: string;
  category: string;
  area?: string;
  actualIssue?: string;
  queue: string;
  priority: string;
  createdAt?: string;
  assignedTo?: string | null;
  assignedAt?: string | null;
  slaTargetHours?: number;
  slaDueAt?: string;
  resolutionCode?: string | null;
  l3Reference?: string | null;
  escalations?: Escalation[];
  activities?: Activity[];
  attachments?: Attachment[];
  reopenCount?: number;
  closedAt?: string | null;
  cancelReason?: string | null;
  publicNotes?: PublicNote[];
  hashtags?: string[];
  assignedApproverId?: string | null;
  approvalDecision?: 'Approved' | 'Rejected' | 'Returned' | null;
  approvalReasonCode?: string | null;
  approvalNotes?: string | null;
  approvalDecidedAt?: string | null;
  retentionResolutionCode?: string | null;
}

export interface AuditRecord {
  auditId: string;
  recordType: string;
  recordId: string;
  employeeUser: string;
  fieldModified: string;
  newValue: string;
  timestamp: string;
}

export interface OsbNotification {
  orderId: string;
  dbTimestamp: string;
  smsText: string;
}
