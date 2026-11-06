import { useState } from 'react';
import { DocumentCaptureActions } from './DocumentCaptureActions';
import { Button } from '../primitives/Button';
import { UPLOAD_RULES, uploadFileProblem } from './documentUploadRules';
import { forgetDocumentFile, readFileAsDataUrl, rememberDocumentFile } from '../../lib/documentFileStore';
import { formatBytes } from '../../lib/format';
import type { AdditionalDocument } from './AdditionalDocumentsUpload';

/**
 * One supporting document, uploaded where the data it supports is entered (a VAT registration number, say) rather than only at the end of the
 * journey. The file is checked against the shared upload rules and attached at once under the document requirement it satisfies, so Additional
 * Documents later shows it as already attached. Required: the caller gates its own Continue on `document` being present.
 */
export function SupportingDocumentField({
  label,
  requirement,
  document,
  onChange,
}: {
  label: string;
  /** The configured document type this upload satisfies (its id is what Additional Documents matches on). */
  requirement?: { id: string; label: string };
  document: AdditionalDocument | undefined;
  onChange: (document: AdditionalDocument | undefined) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const choose = async (file: File | undefined) => {
    if (!file) return;
    const problem = uploadFileProblem(file, UPLOAD_RULES.supporting);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    if (document) forgetDocumentFile(document.id);
    const id = `${Date.now()}-${file.name}`;
    try {
      rememberDocumentFile(id, await readFileAsDataUrl(file), file.type);
    } catch {
      /* the document is still attached; it just cannot be opened */
    }
    onChange({ id, label: requirement?.label ?? label, fileName: file.name, sizeBytes: file.size, requirementId: requirement?.id });
  };
  return (
    <div className="space-y-1">
      <p className="text-[length:var(--fs-label)] text-fg">
        {label}
        <span className="text-[var(--field-border-error)]" aria-hidden="true">{' *'}</span>
      </p>
      <div className="document-slot">
        <DocumentCaptureActions what={label.toLowerCase()} hasDocument={Boolean(document)} onFile={(f) => void choose(f)} />
        {document ? (
          <>
            <span className="line-fg-caption">
              {document.fileName} <span className="text-muted">({formatBytes(document.sizeBytes)})</span>
            </span>
            <Button
              variant="tertiary"
              compact
              onClick={() => {
                forgetDocumentFile(document.id);
                onChange(undefined);
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
      {error && (
        <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
          {error}
        </p>
      )}
    </div>
  );
}
