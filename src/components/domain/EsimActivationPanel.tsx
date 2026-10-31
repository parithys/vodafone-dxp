import { QRCodeSVG } from 'qrcode.react';

interface EsimActivationPanelProps {
  activationCode: string;
}

// The scannable half of eSIM issuance: QR, the LPA string to key in by hand, and the notice that
// the details were emailed. Rendered on the activation-complete screen rather than the SIM Type
// step, because by then the provisioning has happened, so the code shown is one that will work.
export function EsimActivationPanel({ activationCode }: EsimActivationPanelProps) {
  // One card holding the QR, the code to key in by hand and the email notice; it fills the height of its grid cell so it
  // matches the receipt card beside it.
  return (
    <div className="flex flex-1 flex-col items-start gap-4 card card-surface p-4">
      {/* bg-paper, not --bg: a QR has to stay dark-on-light to scan, so this
          one surface does not follow the theme. */}
      <div className="rounded-[var(--radius-card)] bg-paper p-2 shrink-0">
        <QRCodeSVG value={activationCode} size={160} />
      </div>
      <div className="space-y-1.5 min-w-0 w-full">
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          Scan this QR code on the customer's device to install the eSIM, or enter the activation code manually.
        </p>
        <code className="block break-all rounded-[var(--radius-button)] bg-surface-warm px-2 py-1 text-[length:var(--fs-caption)] text-fg">
          {activationCode}
        </code>
      </div>
    </div>
  );
}
