import { currentAgentId } from '../../../stores/authStore';
import { badgeVariantFor } from '../../../lib/statusTone';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { useEntityStore } from '../../../stores/entityStore';
import { TicketCreationModal, type NewTicketValue } from '../../../components/patterns/TicketCreationModal';
import { buildNewTicketRecord } from '../../../data/reference/ticketReferenceData';
import type { Customer360Data } from '../../../engines/customer360Engine';

// Create Ticket and Track Ticket are the two real Support actions available
// from Customer 360 - both reuse the exact same TicketCreationModal/entity
// records the standalone Support workspace uses, just pre-scoped to this
// customer. Escalation/Complaints/Service Requests are ticket *categories*
// selected inside that same modal, not separate screens, so they aren't
// listed as distinct actions here.
export function TicketsSection({
  data,
  onTicketCreated,
}: {
  data: Customer360Data;
  /** Without this, a ticket created here would persist correctly but stay
   * invisible in this same table (and the header's Open Tickets count) until
   * the agent navigated away and back - data.tickets is Customer360Layout's
   * one-time fetch snapshot, not entityStore-reactive. */
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  const [modalOpen, setModalOpen] = useState(false);

  const createTicket = async (value: NewTicketValue) => {
    const ticketId = `TT-${Date.now().toString().slice(-6)}`;
    const record = buildNewTicketRecord({ ticketId, ...value, createdBy: currentAgentId() });
    await createRecord('trouble-tickets', record);
    onTicketCreated(record);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">Tickets</h3>
        <Button variant="primary" compact onClick={() => setModalOpen(true)}>
          Create Ticket
        </Button>
      </div>
      <DataTable
        rows={data.tickets}
        rowKey={(r) => String(r.ticketId)}
        emptyMessage="No tickets on file for this customer."
        onRowClick={(r) => navigate(`/trouble-ticketing-complaints/ticket-homepage?id=${r.ticketId}`)}
        columns={[
          { key: 'ticketId', header: 'Ticket #' },
          { key: 'category', header: 'Category' },
          { key: 'actualIssue', header: 'Issue' },
          { key: 'priority', header: 'Priority' },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge variant={badgeVariantFor(String(r.status))}>{String(r.status)}</Badge>,
          },
        ]}
      />
      <TicketCreationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createTicket}
        initialCustomerId={data.customer.customerId}
      />
    </div>
  );
}
