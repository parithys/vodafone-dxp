import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Select } from '../primitives/Select';
import { Badge } from '../primitives/Badge';
import { DataTable } from '../primitives/DataTable';
import type { Column } from '../primitives/DataTable';

export interface BulkRow {
  rowId: string;
  billingProfileId: string;
  bucket: string;
  unitOfMeasurement: string;
  amount: string;
  comment: string;
  status: 'Pending' | 'Success' | 'Failed';
  failureReason?: string;
}

interface BulkOperationPortalProps {
  rows: BulkRow[];
  /** Functional-updater style (like React's setState), NOT a plain array setter
   * - submitBatch below awaits each row sequentially, so a plain `(rows) =>
   * void` closing over a `rows` snapshot captured once at submit time would
   * have every update in the loop overwrite the previous one's result (see
   * the bug note below). */
  onChange: (updater: (prev: BulkRow[]) => BulkRow[]) => void;
  onSubmitRow: (row: BulkRow) => Promise<{ ok: boolean; reason?: string }>;
}

const BUCKETS = ['Rental', 'Usage', 'One-Time Charge', 'Penalty Waiver'];
const UNITS = ['QAR', 'Minutes', 'GB'];

// Pattern 17: Bulk Operation Portal - fixed-template rows (billing profile,
// bucket, unit of measurement, free-text comment; FLD-009–013), async
// processing, per-row success/failure reporting with re-upload of failed rows
// only (SCR-001, UJ-001 "Bulk Adjustment Submission (Target State)," high
// confidence). Row entry here stands in for the evidenced file-upload template
// (no real file I/O in a front-end-only app) - same rows, same fields.
//
// Bug fixed here: submitBatch used to call a plain-array `updateRow` that
// closed over the `rows` prop captured once when submitBatch started. Since
// the loop awaits each row's async inventory-style check sequentially, every
// updateRow call after the first recomputed from that same stale snapshot -
// each row's result overwrote all rows updated earlier in the same batch
// (confirmed live: submitting 2 rows left row 1 stuck on "Pending" even
// though it had actually succeeded, because row 2's update replaced the
// whole array from the pre-batch snapshot). Fixed by switching to a
// functional updater, exactly like DualPlaySerialCheckStep's fix.
export function BulkOperationPortal({ rows, onChange, onSubmitRow }: BulkOperationPortalProps) {
  const [submitting, setSubmitting] = useState(false);

  const addRow = () =>
    onChange((prev) => [
      ...prev,
      { rowId: `ROW-${prev.length + 1}`, billingProfileId: '', bucket: BUCKETS[0], unitOfMeasurement: UNITS[0], amount: '', comment: '', status: 'Pending' },
    ]);

  const updateRow = (rowId: string, patch: Partial<BulkRow>) =>
    onChange((prev) => prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)));

  const removeRow = (rowId: string) => onChange((prev) => prev.filter((r) => r.rowId !== rowId));

  const submitBatch = async (targetRows: BulkRow[]) => {
    setSubmitting(true);
    for (const row of targetRows) {
      updateRow(row.rowId, { status: 'Pending' });
      const result = await onSubmitRow(row);
      updateRow(row.rowId, result.ok ? { status: 'Success', failureReason: undefined } : { status: 'Failed', failureReason: result.reason });
    }
    setSubmitting(false);
  };

  const failedRows = rows.filter((r) => r.status === 'Failed');
  const columns: Column<BulkRow>[] = [
    {
      key: 'billingProfileId',
      header: 'Billing Profile',
      render: (r) => (
        <Input aria-label="Billing Profile" value={r.billingProfileId} onChange={(e) => updateRow(r.rowId, { billingProfileId: e.target.value })} placeholder="BILL-xxxx" />
      ),
    },
    {
      key: 'bucket',
      header: 'Bucket',
      render: (r) => <Select aria-label="Bucket" value={r.bucket} onChange={(e) => updateRow(r.rowId, { bucket: e.target.value })} options={BUCKETS.map((b) => ({ value: b, label: b }))} />,
    },
    {
      key: 'unitOfMeasurement',
      header: 'Unit',
      render: (r) => (
        <Select aria-label="Unit" value={r.unitOfMeasurement} onChange={(e) => updateRow(r.rowId, { unitOfMeasurement: e.target.value })} options={UNITS.map((u) => ({ value: u, label: u }))} />
      ),
    },
    { key: 'amount', header: 'Amount', render: (r) => <Input aria-label="Amount" type="number" value={r.amount} onChange={(e) => updateRow(r.rowId, { amount: e.target.value })} /> },
    { key: 'comment', header: 'Comment', render: (r) => <Input aria-label="Comment" value={r.comment} onChange={(e) => updateRow(r.rowId, { comment: e.target.value })} /> },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div>
          <Badge variant={r.status === 'Success' ? 'success' : r.status === 'Failed' ? 'danger' : 'filled-neutral'}>{r.status}</Badge>
          {r.failureReason && <div className="text-[length:var(--fs-caption)] text-danger mt-1">{r.failureReason}</div>}
        </div>
      ),
    },
    {
      key: 'remove',
      header: '',
      render: (r) => (
        <button type="button" onClick={() => removeRow(r.rowId)} aria-label="Remove row" className="text-muted hover:text-danger">
          ×
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.rowId} emptyMessage="No rows in the template - Add Row to start." />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={addRow}>
          Add Row
        </Button>
        <Button variant="primary" onClick={() => submitBatch(rows.filter((r) => r.status !== 'Success'))} disabled={submitting || rows.length === 0}>
          {submitting ? 'Processing…' : 'Submit Batch'}
        </Button>
        {failedRows.length > 0 && (
          <Button variant="secondary" onClick={() => submitBatch(failedRows)} disabled={submitting}>
            Re-upload Failed Rows ({failedRows.length})
          </Button>
        )}
      </div>
    </div>
  );
}
