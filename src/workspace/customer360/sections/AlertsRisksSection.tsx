import type { Customer360Data } from '../../../engines/customer360Engine';
import { BulkNotesSection } from '../BulkNotesSection';
import { NotificationsSection } from './MiscSections';

/** Customer 360's "Alert & Risks" tab - customer360-fields.json's Alerts &
 * Risks topic names "Bell Icon/Bulk Notes" as its own field, so the former
 * Bulk Notes tab moves here alongside order-notification alerts. */
export function AlertsRisksSection({ data }: { data: Customer360Data }) {
  return (
    <div className="space-y-8">
      <BulkNotesSection accountIds={data.accounts.map((a) => a.accountId)} />
      <NotificationsSection data={data} />
    </div>
  );
}
