import { Tabs, type TabItem } from '../../components/primitives/Tabs';
import { TicketsDashboard } from '../../modules/trouble-ticketing-complaints/screens/TicketsDashboard';
import { TicketApprovalQueue } from '../../modules/trouble-ticketing-complaints/screens/TicketApprovalQueue';
import { PageHeader } from '../../components/patterns/PageHeader';

// Cross-customer ticket queue - the standalone counterpart to Customer 360's
// Tickets tab (same `trouble-tickets` records, unfiltered here vs. filtered
// there). Converted to a Tabs host (Screen 16 - Approval Queue & Ticket
// Review, 2026-09-30) mirroring OrdersWorkspace.tsx's identical two-tab
// structure exactly (own submitted-items view vs. the approval queue).
const TABS: TabItem[] = [
  { key: 'tickets', label: 'Tickets', content: <TicketsDashboard padded={false} /> },
  { key: 'approval', label: 'Approval Queue', content: <TicketApprovalQueue padded={false} /> },
];

export function SupportWorkspace() {
  return (
    <div className="p-8">
      <PageHeader title={<>Support</>} />
      <Tabs items={TABS} label="Support Views" />
    </div>
  );
}
