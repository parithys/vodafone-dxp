import { useRef, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { Modal } from '../../components/primitives/Modal';
import { chargeAfterWaiverQar, waivedQar, waiverAmountProblem, type NumberWaiver } from '../../engines/numberWaiver';
import { formatQar } from '../../engines/postpaidPricing';
import { UPLOAD_RULES, uploadFileProblem, type AdditionalDocument } from '../DocumentUpload';
import { forgetDocumentFile, readFileAsDataUrl, rememberDocumentFile } from '../../lib/documentFileStore';
import { formatBytes } from '../../lib/format';

/**
 * The "Waive Off" action beside Continue on Number Selection: the agent enters a FIXED AMOUNT (QAR) to waive off the Star number's upfront charge - not a
 * percentage. The amount is kept on the journey (`numberWaiver`) and read by Checkout, Payment and the order. Shown only when the chosen number has an
 * upfront charge to waive.
 */
export function WaiveOff({
  chargeQar,
  numberChosen = false,
  waiver,
  onChange,
  document,
  documentRequirement,
  onDocumentChange,
}: {
  chargeQar: number;
  /** A number is chosen: the button then shows even when it has no charge (disabled, saying why). */
  numberChosen?: boolean;
  waiver: NumberWaiver | undefined;
  onChange: (w: NumberWaiver | undefined) => void;
  /** The supporting document already attached to this Additional Discount, when there is one. Given together with `onDocumentChange`, the dialog offers the upload. */
  document?: AdditionalDocument;
  /** The configured document this Additional Discount requires: the upload is attached under it, which is what satisfies Additional Documents later. */
  documentRequirement?: { id: string; label: string };
  onDocumentChange?: (d: AdditionalDocument | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  // The document chosen in the dialog: attached to the journey on Apply only, so Cancel leaves what was attached as it was.
  const [draftDoc, setDraftDoc] = useState<AdditionalDocument | undefined>(document);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // A file chosen in the dialog is held in memory at once (to be opened later); one that is not applied is forgotten again.
  const dropDraft = () => {
    if (draftDoc && draftDoc.id !== document?.id) forgetDocumentFile(draftDoc.id);
  };
  const chooseFile = async (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;
    const problem = uploadFileProblem(file, UPLOAD_RULES.supporting);
    if (problem) {
      setFileError(problem);
      return;
    }
    setFileError(null);
    dropDraft();
    const id = `${Date.now()}-${file.name}`;
    try {
      rememberDocumentFile(id, await readFileAsDataUrl(file), file.type);
    } catch {
      /* the document is still attached; it just cannot be opened */
    }
    setDraftDoc({ id, label: documentRequirement?.label ?? 'Supporting Document', fileName: file.name, sizeBytes: file.size, requirementId: documentRequirement?.id });
  };
  const close = () => {
    dropDraft();
    setOpen(false);
  };
  if (chargeQar <= 0) {
    return numberChosen ? (
      <Button variant="secondary" disabled title="This number has no upfront charge to discount.">
        Additional Discount
      </Button>
    ) : null;
  }
  const amount = text.trim() === '' ? undefined : Number(text.replace(/,/g, ''));
  const problem = waiverAmountProblem(amount, chargeQar);
  const openDialog = () => {
    setText(waiver ? String(waiver) : '');
    setDraftDoc(document);
    setFileError(null);
    setOpen(true);
  };
  return (
    <>
      <Button variant="secondary" onClick={openDialog}>
        {waiver ? `Additional Discount: ${formatQar(waiver)}` : 'Additional Discount'}
      </Button>
      <Modal
        open={open}
        onClose={close}
        title="Additional Discount"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div>
              {waiver && (
                <Button
                  variant="tertiary"
                  onClick={() => {
                    onChange(undefined);
                    if (document) forgetDocumentFile(document.id);
                    onDocumentChange?.(undefined);
                    setOpen(false);
                  }}
                >
                  Remove Additional Discount
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={Boolean(problem) || (onDocumentChange !== undefined && !draftDoc)}
                onClick={() => {
                  if (amount !== undefined) onChange(waivedQar(chargeQar, amount));
                  if (onDocumentChange) {
                    if (document && document.id !== draftDoc?.id) forgetDocumentFile(document.id);
                    onDocumentChange(draftDoc);
                  }
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        }
      >
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          The Star Number’s upfront charge is <strong className="text-fg">{formatQar(chargeQar)}</strong>. Enter the additional discount amount you would like to apply. The order will be sent for approval, and a supporting document must be attached.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="Additional Discount Amount (QAR)"
            required
            inputMode="decimal"
            value={text}
            onChange={(e) => setText(e.target.value.replace(/[^0-9.,]/g, ''))}
            error={text.trim() !== '' ? problem : undefined}
          />
          {onDocumentChange && (
            <div className="space-y-1">
              <p className="text-[length:var(--fs-label)] text-fg">
                Supporting Document<span className="text-[var(--field-border-error)]" aria-hidden="true"> *</span>
              </p>
              <input ref={fileRef} type="file" accept={UPLOAD_RULES.supporting.accept} className="sr-only" aria-label="Choose the supporting document" onChange={(e) => void chooseFile(e.target.files?.[0])} />
              <div className="flex w-full flex-wrap items-center gap-3 rounded-[var(--field-radius)] border border-dashed border-[var(--field-border)] px-3 py-3">
                <Button variant="secondary" compact onClick={() => fileRef.current?.click()}>
                  {draftDoc ? 'Replace Document' : 'Upload Document'}
                </Button>
                {draftDoc ? (
                  <>
                    <span className="min-w-0 truncate text-fg text-[length:var(--fs-caption)]">
                      {draftDoc.fileName} <span className="text-muted">({formatBytes(draftDoc.sizeBytes)})</span>
                    </span>
                    <Button
                      variant="tertiary"
                      compact
                      onClick={() => {
                        dropDraft();
                        setDraftDoc(undefined);
                      }}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <span className="text-muted text-[length:var(--fs-caption)]">{UPLOAD_RULES.supporting.formatsLabel}, up to {UPLOAD_RULES.supporting.maxLabel}</span>
                )}
              </div>
              {fileError && (
                <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
                  {fileError}
                </p>
              )}
            </div>
          )}
          <dl className="grid w-full grid-cols-2 text-[length:var(--fs-caption)] [&>*]:border-t [&>*]:border-border-soft [&>*]:py-1">
            <dt className="text-fg-2">Upfront Charge</dt>
            <dd className="text-right font-semibold text-fg">{formatQar(chargeQar)}</dd>
            <dt className="text-fg-2">Additional Discount</dt>
            <dd className="text-right font-semibold text-fg">{formatQar(problem ? 0 : waivedQar(chargeQar, amount))}</dd>
            <dt className="text-fg-2">Payable</dt>
            <dd className="text-right font-semibold text-fg">{formatQar(problem ? chargeQar : chargeAfterWaiverQar(chargeQar, amount))}</dd>
          </dl>
        </div>
      </Modal>
    </>
  );
}
