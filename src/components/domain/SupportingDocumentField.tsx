import { useRef, useState } from 'react';
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const choose = async (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = '';
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
      <input ref={fileRef} type="file" accept={UPLOAD_RULES.supporting.accept} className="sr-only" aria-label={`Choose the ${label.toLowerCase()}`} onChange={(e) => void choose(e.target.files?.[0])} />
      <div className="flex w-full flex-wrap items-center gap-3 rounded-[var(--field-radius)] border border-dashed border-[var(--field-border)] px-3 py-3">
        <Button variant="secondary" compact onClick={() => fileRef.current?.click()}>
          {document ? 'Replace Document' : 'Upload Document'}
        </Button>
        {document ? (
          <>
            <span className="min-w-0 truncate text-fg text-[length:var(--fs-caption)]">
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
          <span className="text-muted text-[length:var(--fs-caption)]">
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
