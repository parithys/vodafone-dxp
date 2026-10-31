import { IconButton } from '../../components/primitives/IconButton';
import { Tooltip } from '../../components/primitives/Tooltip';
import { usePersonaStore } from '../../stores/personaStore';
import { canUseInvoiceActions } from '../../engines/agentPrivilegeEngine';
import { useNotificationStore } from '../../stores/notificationStore';
import { downloadCsv } from '../../engines/csvExport';
import { DOWNLOAD_ICON, PRINT_ICON, RESEND_ICON } from '../../assets/icons';


// CUS-001-BIV-28, BR-06: no real Bill Formatter / Invoice Repository
// integration exists (INT-C360-005 is a genuine Missing gap even as a mock,
// unlike the other 7 interfaces) - Download produces the one real invoice
// artifact this app can honestly generate (a CSV export of the bill's own
// fields, reusing the same csvExport engine as Profile Export); Print/Resend
// are mocked as toast-confirmed actions rather than fabricating a print
// dialog or an outbound email/SMS send. All three are gated to authorised
// agents per BR-06.
export function InvoiceActions({ bill, customerName }: { bill: Record<string, unknown>; customerName: string }) {
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const pushToast = useNotificationStore((s) => s.pushToast);
  // BR-06 now has its own capability (`invoice-actions`) instead of
  // reusing the customer-record edit gate: billing and credit-control
  // roles own invoice actions, which is narrower than "may edit a
  // customer record".
  const authorised = canUseInvoiceActions(activePersonaId);

  if (!authorised) {
    return (
      <Tooltip content="Not authorised to download/print/resend invoices" placement="top">
        <span className="text-muted text-[length:var(--fs-caption)] cursor-not-allowed">Restricted</span>
      </Tooltip>
    );
  }

  const download = () => {
    downloadCsv(`invoice-${bill.billId}.csv`, [{ ...bill, customerName }]);
    pushToast('success', `Invoice ${bill.billId} downloaded.`);
  };
  const resend = () => pushToast('success', `Invoice ${bill.billId} resent to ${customerName}.`);
  const print = () => pushToast('success', `Invoice ${bill.billId} sent to print.`);

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Tooltip content="Download invoice" placement="top">
        <IconButton onClick={download} label="Download Invoice" icon={DOWNLOAD_ICON} />
      </Tooltip>
      <Tooltip content="Print invoice" placement="top">
        <IconButton onClick={print} label="Print Invoice" icon={PRINT_ICON} />
      </Tooltip>
      <Tooltip content="Resend invoice" placement="top">
        <IconButton onClick={resend} label="Resend Invoice" icon={RESEND_ICON} />
      </Tooltip>
    </div>
  );
}
