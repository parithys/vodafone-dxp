// ENT-057 Lead - attributes per domain-model.md: Lead Num, Mobile Number, Service
// Needed, First/Last Name, Preferred Time/CallBack Date-Time, Zone/Street/Building/
// Unit, Fixed Pre Sales, Description, Lead Status, Lead Sub Status, Lead Owner,
// Created By, Created date, OrderId, Date Converted, Convert Agent Id, Reject
// Reason Code, Reject Comment, Alternate Mobile#, Outlet Id, Assigned Team,
// Manager, Lead Channel, Lead Contact. Mock seed data (leads.json) only populates
// a subset - the rest are optional here to match what's actually seeded.
export interface Lead {
  leadId: string;
  serviceNeeded: string;
  status: string;
  subStatus?: string;
  ownerId: string;
  createdBy?: string;
  createdVia: string;
  fixedPreSalesRequested?: boolean;
  callbackDate?: string;
  description?: string;
  rejectReasonCode?: string;
  rejectComment?: string;
  mobileNumber?: string;
  contactName?: string;
}
