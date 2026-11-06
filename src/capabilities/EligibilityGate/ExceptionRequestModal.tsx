import { useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import { DocumentCaptureActions, UPLOAD_RULES, uploadFileProblem, type AdditionalDocument } from '../DocumentUpload';
import { forgetDocumentFile, readFileAsDataUrl, rememberDocumentFile } from '../../lib/documentFileStore';
import { formatBytes } from '../../lib/format';

/**
 * The Exception Request for an applicant under 18: the agent attaches the mandatory supporting document (the Court Type Order) and submits the
 * request for approval. Submit for Approval stays off until the document is uploaded. The request does not lift the age rule: it is the controlled
 * approval path for this customer - the order is held for the approver and cannot complete until they decide.
 */
export function ExceptionRequestModal({
  open,
  onClose,
  onSubmit,
  requirement,
  approverRole,
  document,
}: {
  open: boolean;
  onClose: () => void;
  /** Called with the uploaded supporting document when the agent submits the request. */
  onSubmit: (document: AdditionalDocument) => void;
  /** The configured document the exception requires (Court Type Order): the upload is attached under it. */
  requirement: { id: string; label: string } | undefined;
  /** Whose queue the request goes to, named to the agent. */
  approverRole: string;
  /** A document already attached to this exception, when there is one. */
  document?: AdditionalDocument;
}) {
  const [draftDoc, setDraftDoc] = useState<AdditionalDocument | undefined>(document);
  const [fileError, setFileError] = useState<string | null>(null);
  const label = requirement?.label ?? 'Supporting Document';
  // A file chosen here is held in memory at once (to be opened later); one that is never submitted is forgotten again.
  const dropDraft = () => {
    if (draftDoc && draftDoc.id !== document?.id) forgetDocumentFile(draftDoc.id);
  };
  const chooseFile = async (file: File | undefined) => {
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
    setDraftDoc({ id, label, fileName: file.name, sizeBytes: file.size, requirementId: requirement?.id });
  };
  const close = () => {
    dropDraft();
    setFileError(null);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={close}
      title="Exception Request"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!draftDoc} onClick={() => draftDoc && onSubmit(draftDoc)}>
            Submit for Approval
          </Button>
        </>
      }
    >
      <p className="text-secondary">
        The customer is under 18. Upload the {label} to request an exception. The order is held for approval by the {approverRole} and cannot be completed until it is approved.
      </p>
      <div className="mt-4 space-y-1">
        <p className="text-[length:var(--fs-label)] text-fg">
          {label}
          <span className="text-[var(--field-border-error)]" aria-hidden="true"> *</span>
        </p>
        <div className="document-slot">
          <DocumentCaptureActions what={label} hasDocument={Boolean(draftDoc)} onFile={(f) => void chooseFile(f)} />
          {draftDoc ? (
            <>
              <span className="line-fg-caption">
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
            <span className="caption-muted">
              {UPLOAD_RULES.supporting.formatsLabel}, up to {UPLOAD_RULES.supporting.maxLabel}
            </span>
          )}
        </div>
        {fileError && (
          <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
            {fileError}
          </p>
        )}
      </div>
    </Modal>
  );
}
