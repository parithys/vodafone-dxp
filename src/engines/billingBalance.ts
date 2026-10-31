// What a customer OWES, defined once. Customer 360's totals, the eligibility dues check and the demo summaries all read this; none sums bills
// on a status string of its own.
//
// Evidence in the data: a bill record has a `type` ('bill' is the tax invoice; 'hotBill' is the unbilled charges so far; 'billSimulation' is a
// what-if) and a `status` ('billed', 'overdue', 'unbilled', 'simulated'). Only an invoice that has been issued and not settled is owed:
// type 'bill' with status 'billed' or 'overdue'. A hot bill or a simulation is not a debt. A payment settles an invoice only when it is a
// 'Monthly Bill' charge that was authorised; the other charge types (deposit, HRN advance, number charge, first-month subscription) are
// collected for orders, not against an invoice, and a payment that is still 'Pending Authorization' has not been collected.

export interface BillLike {
  type?: unknown;
  status?: unknown;
  totalAmount?: unknown;
}
export interface PaymentLike {
  chargeType?: unknown;
  status?: unknown;
  amountQar?: unknown;
}

/** An invoice that has been issued and is not settled. */
export const isUnpaidInvoice = (b: BillLike): boolean => b.type === 'bill' && (b.status === 'billed' || b.status === 'overdue');

/** A collected payment against an invoice. */
export const isBillPayment = (p: PaymentLike): boolean => p.chargeType === 'Monthly Bill' && p.status === 'Authorized';

const sum = <T,>(list: T[], pick: (x: T) => unknown): number => list.reduce((s, x) => s + (Number(pick(x)) || 0), 0);

/** The total of the issued, unsettled invoices (before any payment). */
export const unpaidInvoiceTotal = (bills: BillLike[]): number => sum(bills.filter(isUnpaidInvoice), (b) => b.totalAmount);

/** What the customer owes: the unsettled invoices less the payments collected against invoices, never below zero. */
export function outstandingBalance(bills: BillLike[], payments: PaymentLike[] = []): number {
  return Math.max(0, unpaidInvoiceTotal(bills) - sum(payments.filter(isBillPayment), (p) => p.amountQar));
}
