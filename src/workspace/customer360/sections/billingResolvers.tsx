import type { ReactNode } from 'react';
import { computeBillingSummary, withinBillHistoryWindow, type Customer360Data } from '../../../engines/customer360Engine';
import { formatAmountAny } from '../../../lib/format';

type Resolver = (data: Customer360Data) => ReactNode | undefined;

function capitalize(value: unknown): string {
  const s = String(value ?? '');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '-';
}

/** customer360-fields.json's Billing & Payments topic. No new joins needed -
 * `computeBillingSummary` (customer360Engine.ts) already covers most of
 * these; the rest read `bills.json`'s own mrc/currentChargesQAR fields
 * directly. Prepaid recharge fields and "Amount Required to Pay" have no
 * matching field anywhere in this corpus - left unmapped, renders "Not
 * available". */
export const billingResolvers: Record<string, Resolver> = {
  'Due Date': (data) => computeBillingSummary(data).latestBill?.dueDate as string | undefined,
  'Postpaid - Monthly Recurring Charge': (data) => {
    const { latestBill } = computeBillingSummary(data);
    return latestBill?.mrc !== undefined ? `${formatAmountAny(String(latestBill.mrc))} QAR` : undefined;
  },
  'Postpaid - Average Bill/Spend': (data) => {
    const billsInWindow = data.bills.filter((b) => withinBillHistoryWindow(b.billPeriod));
    if (billsInWindow.length === 0) return undefined;
    const avg = billsInWindow.reduce((sum, b) => sum + Number(b.totalAmount ?? 0), 0) / billsInWindow.length;
    return `${formatAmountAny(avg.toFixed(2))} QAR (avg over ${billsInWindow.length} bill${billsInWindow.length === 1 ? '' : 's'})`;
  },
  'Latest Bill': (data) => {
    const { latestBill, formattedBillPeriod } = computeBillingSummary(data);
    return latestBill ? `${formatAmountAny(String(latestBill.totalAmount ?? '-'))} QAR - ${formattedBillPeriod} - ${capitalize(latestBill.status)}` : undefined;
  },
  'Outstanding Balance': (data) => `${formatAmountAny(computeBillingSummary(data).outstanding)} QAR`,
  'Unbilled Usage': (data) => {
    const { latestBill } = computeBillingSummary(data);
    const charges = latestBill?.currentChargesQAR;
    return charges !== undefined ? `${formatAmountAny(String(charges))} QAR` : undefined;
  },
  'PTP Eligible (Y/N)': (data) => {
    const status = data.billingProfiles[0]?.promiseToPayStatus;
    return status !== undefined ? String(status) : undefined;
  },
  'Last Payment & Channel': (data) => {
    const { previousPayment } = computeBillingSummary(data);
    if (!previousPayment) return undefined;
    return `${formatAmountAny(String(previousPayment.amountQar ?? '-'))} QAR via ${String(previousPayment.paymentMethod ?? '-')} on ${String(previousPayment.capturedAt ?? '-')}`;
  },
};
