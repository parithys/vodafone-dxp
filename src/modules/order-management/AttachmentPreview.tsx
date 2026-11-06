import { useEffect, useState } from 'react';
import { Icon } from '../../components/primitives/Icon';
import { ScannedIdPreview } from '../../components/domain/ScannedIdPreview';
import type { SpecimenIdentity } from '../../components/domain/scannedIdModel';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { formatDateTime } from '../../lib/format';
import { DOC } from '../../assets/icons';
import { attachmentShape } from './attachmentModel';
import type { AttachmentOrder, OrderAttachment } from './attachmentModel';

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
    <div className="sheet-box panel-soft shadow-raised">
      <div className="mb-3 row gap-2 divider-bottom pb-3">
        <Icon path={DOC} className=" size-5 text-muted" strokeWidth={1.5} />
        <p className="title title-md font-semibold">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="spread py-1 text-[length:var(--fs-body)]">
      <span className="text-muted">{label}</span>
      <span className="value-right">{value}</span>
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
      <div className="stack-center gap-3 w-full">
        <div className="w-full max-w-md">
          <ScannedIdPreview side={shape.side} documentType={shape.documentType} identity={identity} />
        </div>
        <p className="caption-secondary">{doc.label} - {doc.detail}</p>
      </div>
    );
  }
  if (shape.kind === 'office-id') {
    return (
      <div className="stack-center gap-3 w-full">
        <div className="w-full max-w-md">
          <ScannedIdPreview side="front" variant={shape.variant} identity={identity} />
        </div>
        <p className="caption-secondary">{doc.label} - {doc.detail}</p>
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
        <p className="mt-3 caption-muted">Customer Signature</p>
        <div className="mt-1 placeholder-center placeholder-tile">
          {doc.previewUrl ? (
            <img src={doc.previewUrl} alt={`Signature of ${order.customerName ?? 'the customer'}`} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-secondary">{doc.detail ?? 'Signed'}</span>
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
