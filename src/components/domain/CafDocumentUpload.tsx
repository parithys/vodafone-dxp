import { IconButton } from '../primitives/IconButton';
import { formatBytes as formatSize } from '../../lib/format';
import { useRef, useState } from 'react';
import { ID_TYPES } from '../../data/idTypes';
import { Button } from '../primitives/Button';
import { Select } from '../primitives/Select';
import { Icon } from '../primitives/Icon';
import { UPLOAD_RULES, uploadFileProblem } from './documentUploadRules';

export interface CafDocument {
  /** Local id - these are session artefacts, not persisted records. */
  id: string;
  docType: string;
  fileName: string;
  sizeBytes: number;
}

interface CafDocumentUploadProps {
  documents: CafDocument[];
  onChange: (documents: CafDocument[]) => void;
}

/**
 * Document types offered for a signed CAF.
 *
 * Grounded rather than invented: the identity types are the `documentType`
 * vocabulary that identity-documents.json already uses (QID / Passport / GCC
 * ID / Diplomatic ID / Other ID), and "Signed CAF" is the artefact this step
 * exists to collect. No CAF-attachment taxonomy exists in the corpus, so this
 * reuses the one that does rather than minting a parallel set of labels.
 */
const DOC_TYPES = ['Signed CAF', ...ID_TYPES.map((t) => t.label), 'Other ID'];

// The size and type rules are the Document Upload capability's (documentUploadRules.ts), shared with every other upload.
const RULES = UPLOAD_RULES.supporting;
// 5, matching the New Connection journey's document upload.
const MAX_DOCUMENTS = 5;

const TRASH = 'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6';
const DOC = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6';

// Upload of the signed CAF and its supporting documents. Type is chosen FIRST,
// then the file: a file with no type is an unfiled attachment, and asking for
// the type afterwards means the agent can walk away having uploaded something
// nobody can classify.
export function CafDocumentUpload({ documents, onChange }: CafDocumentUploadProps) {
  const [docType, setDocType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const atLimit = documents.length >= MAX_DOCUMENTS;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    // Belt as well as braces. The Browse button is disabled without a type, so
    // this should be unreachable through the UI - but it IS reachable by
    // setting the input's files directly, and an untyped document is exactly
    // the unclassifiable attachment this component is ordered to prevent.
    // Without it the row renders as " · 200 KB" with nothing before the dot.
    if (!docType) {
      setError('Choose a document type before uploading.');
      return;
    }
    const problem = uploadFileProblem(file, RULES);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    onChange([
      ...documents,
      { id: `${Date.now()}-${file.name}`, docType, fileName: file.name, sizeBytes: file.size },
    ]);
    setDocType('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="card p-4 space-y-3">
      <div>
        <h4 className="text-fg font-medium text-[length:var(--fs-body)]">Signed Documents</h4>
        <p className="text-muted text-[length:var(--fs-caption)]">
          Up to {MAX_DOCUMENTS} files, {RULES.maxLabel} each. {RULES.formatsLabel}.
        </p>
      </div>

      {documents.length > 0 && (
        <ul className="divide-y divide-border-soft card ">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-3 py-2">
              <Icon path={DOC} className="w-4 h-4 text-muted shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-fg text-[length:var(--fs-body)] truncate">{doc.fileName}</span>
                <span className="block text-muted text-[length:var(--fs-caption)]">
                  {doc.docType} · {formatSize(doc.sizeBytes)}
                </span>
              </span>
              <IconButton tone="danger" icon={TRASH} label={`Remove ${doc.fileName}`} onClick={() => onChange(documents.filter((d) => d.id !== doc.id))} />
            </li>
          ))}
        </ul>
      )}

      {atLimit ? (
        <p className="text-muted text-[length:var(--fs-caption)]">
          Maximum of {MAX_DOCUMENTS} documents reached. Remove one to upload another.
        </p>
      ) : (
        <div className="flex items-end gap-3">
          <div className="flex-1 min-w-0">
            <Select
              label="Document Type"
              // A type already uploaded is not offered again (as in New Connection).
              options={DOC_TYPES.filter((t) => !documents.some((d) => d.docType === t)).map((t) => ({ value: t, label: t }))}
              placeholder="Select a document type"
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value);
                setError(null);
              }}
            />
          </div>
          {/* The real <input type=file> is visually hidden and driven by the
              Button, so the control matches every other action on this screen
              instead of rendering the browser's default file widget. Disabled
              until a type is chosen - see the note on ordering above. */}
          <input
            ref={fileRef}
            type="file"
            accept={RULES.accept}
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            disabled={!docType}
            title={!docType ? 'Choose a document type first' : undefined}
          >
            Browse…
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
          {error}
        </p>
      )}
    </div>
  );
}
