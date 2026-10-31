import { useEffect, useState } from 'react';
import { Icon } from '../../components/primitives/Icon';
import { ScannedIdPreview, type IdVariant, type SpecimenIdentity } from '../../components/domain/ScannedIdPreview';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { formatDateTime } from '../../lib/format';

/** One document recorded on an order. `previewUrl` is the captured image itself when the journey kept one (the CAF signature). */
export interface OrderAttachment {
  label: string;
  detail?: string;
  /** The name the file is stored under (an identity scan: type, side, number, day). */
  fileName?: string;
  previewUrl?: string;
}

/** The order facts a preview draws on. */
export interface AttachmentOrder {
  orderId: string;
  customerId?: string;
  customerName?: string;
  idNumber?: string;
  createdAt?: number | string;
}

const DOC_ICON = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6';
const ID_SCAN = /^(Qatar ID \(QID\)|Passport|GCC ID|Diplomatic ID|Other ID) - (Front|Back)$/;
const SCAN_TYPE: Record<string, string> = { 'Qatar ID (QID)': 'QID', Passport: 'Passport', 'GCC ID': 'GCC ID', 'Diplomatic ID': 'Diplomatic ID' };

/** What a recorded attachment is, read from its label - the same words the journeys write. */
export type AttachmentShape =
  | { kind: 'id-scan'; documentType: string | undefined; name: string; side: 'front' | 'back' }
  | { kind: 'office-id'; variant: IdVariant }
  | { kind: 'caf' }
  | { kind: 'file' };

export function attachmentShape(doc: OrderAttachment): AttachmentShape {
  const scan = doc.label.match(ID_SCAN);
  if (scan) return { kind: 'id-scan', documentType: SCAN_TYPE[scan[1]], name: scan[1], side: scan[2] === 'Back' ? 'back' : 'front' };
  if (/^Office ID card$/i.test(doc.label)) {
    const v = /B2B2C/i.test(doc.detail ?? '') ? 'b2b2c' : /Retired/i.test(doc.detail ?? '') ? 'retired' : 'mada';
    return { kind: 'office-id', variant: v };
  }
  if (/^Signed CAF$/i.test(doc.label)) return { kind: 'caf' };
  return { kind: 'file' };
}

const dmy = (iso?: string): string => {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};

/** The person on the card: the order's customer, with date of birth, nationality and the document's expiry from their records. */
function useOrderIdentity(order: AttachmentOrder): SpecimenIdentity | undefined {
  const [identity, setIdentity] = useState<SpecimenIdentity | undefined>();
  useEffect(() => {
    let live = true;
    void (async () => {
      const customer = order.customerId
        ? await mockDataEngine.get<{ name?: string; dob?: string; nationality?: string }>('customers', order.customerId)
        : undefined;
      const docs = await mockDataEngine.list<{ documentNumber: string; expiryDate?: string }>('identity-documents');
      const doc = docs.find((d) => d.documentNumber === order.idNumber);
      if (!live || !order.idNumber || !(order.customerName ?? customer?.name)) return;
      setIdentity({
        name: order.customerName ?? customer?.name ?? '',
        idNo: order.idNumber,
        nationality: customer?.nationality ?? '',
        dob: dmy(customer?.dob),
        expiry: dmy(doc?.expiryDate),
      });
    })();
    return () => {
      live = false;
    };
  }, [order.customerId, order.customerName, order.idNumber]);
  return identity;
}

/** A sheet of paper standing in for a document the journey recorded but did not keep the file of. */
function Sheet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-[var(--radius-card)] border border-border-soft bg-bg p-5 text-left shadow-raised">
      <div className="mb-3 flex items-center gap-2 border-b border-border-soft pb-3">
        <Icon path={DOC_ICON} className="h-5 w-5 text-muted" strokeWidth={1.5} />
        <p className="text-fg font-semibold text-[length:var(--fs-body-lg)]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-[length:var(--fs-body)]">
      <span className="text-muted">{label}</span>
      <span className="text-fg text-right break-words min-w-0">{value}</span>
    </div>
  );
}

/** The preview pane of the Attachments tab: the document itself where there is one to draw, never a "no preview" notice. */
export function AttachmentPreview({ doc, order }: { doc: OrderAttachment; order: AttachmentOrder }) {
  const identity = useOrderIdentity(order);
  const shape = attachmentShape(doc);
  const created = order.createdAt ? formatDateTime(order.createdAt) : undefined;

  if (shape.kind === 'id-scan' && shape.documentType) {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full max-w-md">
          <ScannedIdPreview side={shape.side} documentType={shape.documentType} identity={identity} />
        </div>
        <p className="text-fg-2 text-[length:var(--fs-caption)]">{doc.label} - {doc.detail}</p>
      </div>
    );
  }
  if (shape.kind === 'office-id') {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full max-w-md">
          <ScannedIdPreview side="front" variant={shape.variant} identity={identity} />
        </div>
        <p className="text-fg-2 text-[length:var(--fs-caption)]">{doc.label} - {doc.detail}</p>
      </div>
    );
  }
  if (shape.kind === 'caf') {
    return (
      <Sheet title="Customer Application Form">
        <Row label="Customer" value={order.customerName} />
        <Row label="ID Number" value={order.idNumber} />
        <Row label="Order" value={order.orderId} />
        <Row label="Signed" value={created} />
        <p className="mt-3 text-muted text-[length:var(--fs-caption)]">Customer Signature</p>
        <div className="mt-1 flex h-24 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-border bg-surface">
          {doc.previewUrl ? (
            <img src={doc.previewUrl} alt={`Signature of ${order.customerName ?? 'the customer'}`} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-fg-2 text-[length:var(--fs-body)]">{doc.detail ?? 'Signed'}</span>
          )}
        </div>
      </Sheet>
    );
  }
  // Any other document (an "Other ID", a supporting or additional document): its recorded details on a sheet. The uploaded
  // file itself is not held by this app, so what is drawn is what the order recorded about it.
  return (
    <Sheet title={doc.label}>
      <Row label="Customer" value={order.customerName} />
      <Row label="Order" value={order.orderId} />
      <Row label="Details" value={doc.detail} />
      <Row label="Added" value={created} />
    </Sheet>
  );
}
