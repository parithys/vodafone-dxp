import { useState } from 'react';
import { BulkOperationPortal } from '../../../components/patterns/BulkOperationPortal';
import type { BulkRow } from '../../../components/patterns/BulkOperationPortal';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { PageHeader } from '../../../components/patterns/PageHeader';

// SCR-001: Bulk Adjustment Portal (DXP, Target State) - UJ-001 "Bulk Adjustment
// Submission (Target State)," high confidence: agent uses a bulk adjustment
// portal in DXP integrated with BRM - fixed template, multi-bucket
// adjustments, unit of measurement, free-text comment, billing profile
// filtration, request status tracking, failure reports for re-upload.
export function BulkAdjustmentPortal() {
  const [rows, setRows] = useState<BulkRow[]>([]);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);

  const submitRow = async (row: BulkRow) => {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
    if (!row.billingProfileId || !row.amount) {
      return { ok: false, reason: 'Billing Profile and Amount are required.' };
    }
    if (!row.billingProfileId.startsWith('BILL-')) {
      return { ok: false, reason: 'Billing Profile not found in BRM - expected format BILL-xxxx.' };
    }
    await createRecord('adjustments', {
      adjustmentId: `ADJ-${Date.now().toString().slice(-6)}-${row.rowId}`,
      billingProfileId: row.billingProfileId,
      unitOfMeasurement: row.unitOfMeasurement,
      amount: Number(row.amount),
      buckets: [row.bucket],
      multiBucketSubmission: false,
      freeTextComment: row.comment,
      status: 'Approved',
    });
    return { ok: true };
  };

  return (
    <div className="p-8">
      <PageHeader title={<>Bulk Adjustment Portal</>} description={<>DXP target-state bulk adjustment submission, integrated with BRM.</>} />
      <BulkOperationPortal
        rows={rows}
        onChange={setRows}
        onSubmitRow={async (row) => {
          const result = await submitRow(row);
          if (result.ok) pushToast('success', `Row ${row.rowId}: adjustment applied in BRM.`);
          return result;
        }}
      />
    </div>
  );
}
