import { DataTable } from '../../../components/primitives/DataTable';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { OrdersSection } from './OrdersSection';
import { TicketsSection } from './TicketsSection';
import { InteractionsSection, CommunicationsSection, RecentActivitiesSection } from './MiscSections';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">{children}</h3>;
}

/** Customer 360's "Audit Trail" tab. customer360-fields.json defines the
 * topic's one field as literally "Audit Trail (Orders, Contact, Account,
 * Activity, TT)" - so this tab is that combined drill-down: the field
 * change log (audit-trail.json, new) plus the former Orders, Tickets,
 * Interactions, Communications and Recent Activities tabs, each of which is
 * one of the five things that field names. */
export function AuditTrailSection({
  data,
  onTicketCreated,
  onInteractionLogged,
}: {
  data: Customer360Data;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
  onInteractionLogged: (record: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Field Change Log</SectionTitle>
        <DataTable
          rows={data.auditTrail}
          rowKey={(r) => String(r.auditId)}
          emptyMessage="No field changes on file for this customer's accounts or contacts."
          columns={[
            { key: 'timestamp', header: 'When' },
            { key: 'recordType', header: 'Record' },
            { key: 'recordId', header: 'Record ID' },
            { key: 'fieldModified', header: 'Field' },
            { key: 'oldValue', header: 'Old Value', render: (r) => <span>{r.oldValue ? String(r.oldValue) : '-'}</span> },
            { key: 'newValue', header: 'New Value' },
            { key: 'changeBasis', header: 'How', render: (r) => <span>{r.changeBasis ? String(r.changeBasis) : '-'}</span> },
            { key: 'employeeUser', header: 'Changed By' },
          ]}
        />
      </section>
      <section>
        <SectionTitle>Orders</SectionTitle>
        <OrdersSection data={data} />
      </section>
      <section>
        <TicketsSection data={data} onTicketCreated={onTicketCreated} />
      </section>
      <section>
        <InteractionsSection data={data} onLogged={onInteractionLogged} />
      </section>
      <section>
        <SectionTitle>Communications</SectionTitle>
        <CommunicationsSection data={data} />
      </section>
      <RecentActivitiesSection data={data} />
    </div>
  );
}
