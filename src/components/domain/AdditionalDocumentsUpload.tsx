import { formatBytes as formatSize } from '../../lib/format';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../primitives/Input';
import { Select } from '../primitives/Select';
import { Button } from '../primitives/Button';
import { Drawer } from '../primitives/Drawer';
import { ScannedIdPreview } from './ScannedIdPreview';
import { Icon } from '../primitives/Icon';
import { UPLOAD_RULES, uploadFileProblem } from './documentUploadRules';
import { documentFileOf, forgetDocumentFile, readFileAsDataUrl, rememberDocumentFile } from '../../lib/documentFileStore';
import type { DocumentRequirement, JourneyDocument } from '../../engines/journeyDocuments';

const escapeXml = (t: string) => t.replace(/[<>&"']/g, '');
/** Stand-in for a scan whose image was not kept: says what it is and that it is a specimen. */
const scanSpecimen = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" rx="16" fill="whitesmoke" stroke="gray" stroke-width="2"/><text x="320" y="190" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="dimgray">${escapeXml(label)}</text><text x="320" y="230" text-anchor="middle" font-family="sans-serif" font-size="18" fill="gray">Specimen - the scanner kept no image of this capture</text></svg>`,
  )}`;
/** "QID Document (Front)" -> "QID Document"; the side is shown on the tile. */
const kindOf = (label: string) => label.replace(/\s*\((Front|Back|Both Sides)\)$/, '');
const sideOf = (label: string) => /\((Front|Back|Both Sides)\)$/.exec(label)?.[1] ?? label;

export interface AdditionalDocument {
  /** Local id - a session artefact, not a persisted record, same as CafDocument. */
  id: string;
  /** Agent-typed, not from a fixed vocabulary (2026-09-28 request) - e.g.
   * "Employer Letter", "Utility Bill". Unlike CafDocumentUpload's signed-
   * paperwork types, this app has no fixed taxonomy for post-signature
   * supporting documents, so the agent names each one as it is added. */
  label: string;
  fileName: string;
  sizeBytes: number;
  /** The requirement this document satisfies (see engines/journeyDocuments.ts), when it was uploaded for one. */
  requirementId?: string;
}

interface AdditionalDocumentsUploadProps {
  documents: AdditionalDocument[];
  onChange: (documents: AdditionalDocument[]) => void;
  /** When given, the label is picked from this list of values instead of typed. */
  labelOptions?: string[];
  /** Overrides the default 10-document cap. */
  maxDocuments?: number;
  /** White card instead of the grey surface. */
  whiteBackground?: boolean;
  /** Called with true while a document type is chosen but its document has not been uploaded yet. */
  onPendingChange?: (pending: boolean) => void;
  /** The documents this order requires, for its scenario and the role working it: each is asked for here, once. */
  requirements?: DocumentRequirement[];
  /** Called with how many required documents are still missing; the caller holds Continue until it is 0. */
  onMissingRequiredChange?: (missing: number) => void;
  /** Every document the journey already holds (ID scans, evidence, the signed CAF): listed here to be viewed and downloaded. */
  journeyDocuments?: JourneyDocument[];
}

const MAX_DOCUMENTS = 10;
const RULES = UPLOAD_RULES.supporting;

const DOC = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6';

/** A data URL as an object URL: browsers will not open a data: URL as a page, but they open a blob. */
function blobUrlOf(dataUrl: string): string | undefined {
  const m = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!m) return undefined;
  const bytes = m[2] ? Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0)) : new TextEncoder().encode(decodeURIComponent(m[3]));
  return URL.createObjectURL(new Blob([bytes], { type: m[1] || 'application/octet-stream' }));
}

// Additional Documents: the end of the journey, after the CAF is signed. It holds (1) what this order requires the agent to attach, decided by
// its scenario and the role - asked for here and nowhere earlier; (2) every document the journey holds, consolidated, each one viewable; and (3) anything else the agent wants to attach, labelled by type. No signature is needed for any of it.
export function AdditionalDocumentsUpload({
  documents,
  onChange,
  labelOptions,
  maxDocuments = MAX_DOCUMENTS,
  whiteBackground = false,
  onPendingChange,
  requirements = [],
  onMissingRequiredChange,
  journeyDocuments = [],
}: AdditionalDocumentsUploadProps) {
  const [label, setLabel] = useState('');
  // The file chosen or dropped but not uploaded yet.
  const [staged, setStaged] = useState<File | null>(null);
  // The document opened from Journey Documents, shown in the side drawer.
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
  const [journeyOpen, setJourneyOpen] = useState(false);
  // 0-100 while a document is being uploaded; undefined when none is.
  const [progress, setProgress] = useState<number | undefined>();
  const [viewing, setViewing] = useState<{ title: string; dataUrl?: string; scan?: JourneyDocument['scan'] } | undefined>();
  // A type picked with no file yet is an unfinished upload: the caller blocks Continue until it is uploaded.
  useEffect(() => {
    onPendingChange?.(Boolean(label.trim() || staged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, staged]);
  useEffect(() => () => onPendingChange?.(false), []);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const requiredFileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | undefined>();
  const atLimit = documents.length >= maxDocuments;
  // A configured list with nothing left to offer for this role, journey and customer: there is nothing to upload as, so the panel is not shown.
  const noTypesToOffer = labelOptions !== undefined && labelOptions.every((o) => documents.some((d) => d.label === o));

  const uploadedFor = (requirementId: string) => documents.find((d) => d.requirementId === requirementId);
  const missing = requirements.filter((r) => !uploadedFor(r.id));
  useEffect(() => {
    onMissingRequiredChange?.(missing.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing.length]);
  useEffect(() => () => onMissingRequiredChange?.(0), []);

  const add = async (file: File, doc: { label: string; requirementId?: string }) => {
    const problem = uploadFileProblem(file, RULES);
    if (problem) {
      setError(problem);
      return false;
    }
    setError(null);
    const id = `${Date.now()}-${file.name}`;
    // The content is kept in memory for viewing and download; only the name, size and label go with the draft.
    try {
      rememberDocumentFile(id, await readFileAsDataUrl(file), file.type);
    } catch {
      /* the document is still attached; it just cannot be opened */
    }
    // Appended to what is held NOW, not to the list this render saw: the file is read asynchronously, and a stale list would drop a document added meanwhile.
    onChange([...documentsRef.current, { id, label: doc.label, fileName: file.name, sizeBytes: file.size, requirementId: doc.requirementId }]);
    return true;
  };

  // Choosing or dropping a file only stages it; "Upload documents" attaches it under the chosen type.
  const stageFile = (file: File | undefined) => {
    if (!file) return;
    const problem = uploadFileProblem(file, RULES);
    if (problem) {
      setStaged(null);
      setError(problem);
      return;
    }
    setError(null);
    setStaged(file);
  };

  const uploadStaged = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError(labelOptions ? 'Select a document type before uploading.' : 'Enter a label for this document before uploading.');
      return;
    }
    if (!staged) {
      setError('Choose a file to upload.');
      return;
    }
    // The bar climbs while the file is read and attached (never past 90 until it is done), then fills and clears. A larger file takes visibly longer.
    setProgress(0);
    const step = Math.max(2, Math.round(60000 / Math.max(staged.size, 60000) * 6));
    const timer = window.setInterval(() => setProgress((p) => (p === undefined ? p : Math.min(90, p + step))), 80);
    const ok = await add(staged, { label: trimmed });
    window.clearInterval(timer);
    if (!ok) {
      setProgress(undefined);
      return;
    }
    setProgress(100);
    await new Promise((r) => window.setTimeout(r, 350));
    setProgress(undefined);
    setLabel('');
    setStaged(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRequiredFile = async (file: File | undefined) => {
    const req = requirements.find((r) => r.id === uploadingFor);
    if (requiredFileRef.current) requiredFileRef.current.value = '';
    setUploadingFor(undefined);
    if (file && req) await add(file, { label: req.label, requirementId: req.id });
  };

  const remove = (id: string) => {
    forgetDocumentFile(id);
    onChange(documentsRef.current.filter((d) => d.id !== id));
  };

  // Everything the journey holds, then what was uploaded here.
  const rows: (JourneyDocument & { removable?: boolean; sizeBytes?: number })[] = [
    ...journeyDocuments,
    ...documents.map((d) => ({ id: `upload-${d.id}`, label: d.label, source: d.requirementId ? 'Additional Documents · Required' : 'Additional Documents · Uploaded', fileName: d.fileName, fileId: d.id, removable: true, sizeBytes: d.sizeBytes })),
  ];

  // One section per kind of document within the page that produced it: "Customer Verification: QID Document".
  const sections = (() => {
    const out: { key: string; name: string; kind: string; title: string; how: string; items: typeof rows }[] = [];
    // Journey documents only: what the journey scanned or signed. They can be opened, never removed; what was uploaded here is listed apart, with Remove.
    for (const d of rows.filter((r) => !r.removable)) {
      const name = d.source.split(' · ')[0];
      const kind = kindOf(d.label);
      let g = out.find((x) => x.name === name && x.kind === kind);
      if (!g) out.push((g = { key: `${name}|${kind}`, name, kind, title: `${name}: ${kind}`, how: '', items: [] }));
      g.items.push(d);
    }
    // How the section was captured, from its documents: all scanned, all uploaded, or a mix.
    for (const g of out) {
      const hows = new Set(g.items.map((d) => d.source.split(' · ')[1]).filter(Boolean));
      g.how = hows.size === 1 ? [...hows][0].toLowerCase() : 'scanned or uploaded';
    }
    return out;
  })();

  return (
    <div className={`card ${whiteBackground ? '' : 'bg-surface'} p-4 space-y-4`}>
      <div>
        <h4 className="text-fg font-bold text-[length:var(--fs-body)]">Additional Documents</h4>
      </div>

      {missing.length > 0 && (
        <section aria-label="Required documents" className="space-y-3">
          <input ref={requiredFileRef} type="file" accept={RULES.accept} className="sr-only" aria-hidden tabIndex={-1} onChange={(e) => void handleRequiredFile(e.target.files?.[0])} />
          <p role="status" className="sr-only">
            {missing.length === 1 ? '1 required document is still to be uploaded.' : `${missing.length} required documents are still to be uploaded.`}
          </p>
          {missing.map((r) => (
            <div key={r.id} className="card flex items-center gap-3 px-3 py-3">
              <Icon path={DOC} className="w-4 h-4 text-muted shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-fg font-semibold text-[length:var(--fs-body)]">{r.label}</span>
                <span className="block text-muted text-[length:var(--fs-caption)]">{r.reason}</span>
              </span>
              <Button
                variant="primary"
                compact
                onClick={() => {
                  setUploadingFor(r.id);
                  requiredFileRef.current?.click();
                }}
              >
                Upload
              </Button>
            </div>
          ))}
        </section>
      )}

      <div className="@container">
        <div className="grid grid-cols-1 items-start gap-4">
        {noTypesToOffer ? null : !atLimit ? (
          <section aria-label="Upload new documents" className="space-y-4">
              {/* Row 1: the Document Type (or label) beside Browse files, the button on the field's baseline. Row 2: the helper, or the chosen file. */}
              <div className="flex items-end gap-3">
                <div className="min-w-0 flex-1">
                  {labelOptions ? (
                    <Select
                      label="Document Type"
                      // A type already uploaded is not offered again.
                      options={[
                        { value: '', label: 'Choose Document Type' },
                        ...labelOptions.filter((o) => !documents.some((d) => d.label === o)).map((o) => ({ value: o, label: o })),
                      ]}
                      value={label}
                      onChange={(e) => {
                        setLabel(e.target.value);
                        setError(null);
                      }}
                    />
                  ) : (
                    <Input
                      label="Document Label"
                      placeholder="e.g. Employer Letter"
                      value={label}
                      onChange={(e) => {
                        setLabel(e.target.value);
                        setError(null);
                      }}
                    />
                  )}
                </div>
                <input ref={fileRef} type="file" accept={RULES.accept} className="sr-only" aria-label="Choose a document to upload" onChange={(e) => stageFile(e.target.files?.[0])} />
                <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={!label.trim()} title={label.trim() ? undefined : labelOptions ? 'Choose a Document Type first' : 'Enter a Document Label first'}>
                  {staged ? 'Choose another file' : 'Browse files'}
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {staged ? (
                  <span className="min-w-0 truncate text-fg text-[length:var(--fs-caption)]">
                    {staged.name} <span className="text-muted">({formatSize(staged.size)})</span>
                  </span>
                ) : (
                  <span className="text-muted text-[length:var(--fs-caption)]">{RULES.formatsLabel}, up to {RULES.maxLabel}</span>
                )}
                {staged && (
                  <Button
                    variant="tertiary"
                    compact
                    onClick={() => {
                      setStaged(null);
                      setError(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {progress !== undefined && (
                <div className="space-y-1">
                  <div role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 w-full overflow-hidden rounded-[var(--radius-pill)] bg-surface">
                    <div className="h-full rounded-[var(--radius-pill)] bg-accent transition-[width] duration-[var(--motion-base)] ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-muted text-[length:var(--fs-caption)]">Uploading {staged?.name} - {progress}%</p>
                </div>
              )}
              <Button variant="primary" className="w-full" onClick={() => void uploadStaged()} disabled={!label.trim() || !staged || progress !== undefined}>
                Upload Document
              </Button>
          </section>
        ) : (
          <p className="text-muted text-[length:var(--fs-caption)]">Maximum of {maxDocuments} documents reached. Remove one to upload another.</p>
        )}
        {(rows.some((r) => !r.removable) || documents.length > 0) && (
          // One flat list of every document scanned or uploaded earlier in the journey: no container per document or per group.
          <section aria-label="Journey documents" className="space-y-2">
            {documents.length > 0 && (
              <div className="space-y-1.5" aria-label="Uploaded documents" role="group">
                <p className="text-fg font-semibold text-[length:var(--fs-body)]">Uploaded Documents</p>
                <ul className="space-y-1.5">
                  {documents.map((d) => {
                    const dataUrl = documentFileOf(d.id)?.dataUrl;
                    return (
                      <li key={d.id} className="text-[length:var(--fs-body)]">
                        {dataUrl ? (
                          <button type="button" className="text-link underline text-left" onClick={() => setViewing({ title: `${d.label} - ${d.fileName}`, dataUrl })}>
                            {d.label}
                          </button>
                        ) : (
                          <span className="text-fg-2">{d.label}</span>
                        )}
                        <span className="text-muted text-[length:var(--fs-caption)]"> ({d.fileName})</span>{' '}
                        <button type="button" className="text-[length:var(--fs-caption)] text-fg-2 underline hover:text-fg" aria-label={`Remove ${d.fileName}`} onClick={() => remove(d.id)}>
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {/* Collapsed until asked for: one toggle under the upload, then the list of everything the journey scanned or uploaded. */}
            <button
              type="button"
              aria-expanded={journeyOpen}
              aria-controls="journey-documents-list"
              onClick={() => setJourneyOpen((o) => !o)}
              className="inline-flex items-center gap-1 text-link font-medium text-[length:var(--fs-body)] hover:underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-[var(--radius-sm)]"
            >
              View All Journey Documents <span className="text-muted font-normal text-[length:var(--fs-caption)]">({rows.filter((r) => !r.removable).length})</span>
              <Icon path={journeyOpen ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} className="w-4 h-4" />
            </button>
            <ul id="journey-documents-list" hidden={!journeyOpen} className="space-y-1.5">
              {sections.flatMap((g) =>
                g.items.map((d) => {
                  const held = d.dataUrl ?? (d.fileId ? documentFileOf(d.fileId)?.dataUrl : undefined);
                  // A capture the reader kept no image of (the demo scanner) opens as a labelled specimen, never as someone's document.
                  // (it is drawn again from what the reader showed - see `scan` - rather than a grey specimen note.)
                  const dataUrl = held ?? (d.source.endsWith('Scanned') && !d.scan ? scanSpecimen(d.label) : undefined);
                  const viewable = Boolean(dataUrl) || Boolean(d.scan);
                  // The document, then which side when the group holds several.
                  // Only the document, not the journey step it came from ("QID Document - Front", not "Customer Verification: QID Document - Front").
                  const docTitle = g.title.includes(': ') ? g.title.slice(g.title.indexOf(': ') + 2) : g.title;
                  const title = g.items.length > 1 || g.kind !== d.label ? `${docTitle} - ${sideOf(d.label)}` : docTitle;
                  return (
                    // A plain text link that opens the document; a document no copy is held of is just its name.
                    <li key={d.id} className="text-[length:var(--fs-body)]">
                      {viewable ? (
                        <button type="button" className="text-link underline text-left" onClick={() => setViewing({ title, dataUrl, scan: dataUrl ? undefined : d.scan })}>
                          {title}
                        </button>
                      ) : (
                        <span className="text-fg-2">{title}</span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        )}
        </div>
      </div>

      <Drawer open={Boolean(viewing)} onClose={() => setViewing(undefined)} title={viewing?.title ?? 'Document'}>
        {viewing &&
          (viewing.scan ? (
            <div className="mx-auto max-w-md">
              <ScannedIdPreview side={viewing.scan.side} documentType={viewing.scan.documentType} variant={viewing.scan.variant} clear />
            </div>
          ) : viewing.dataUrl && /^data:application\/pdf/.test(viewing.dataUrl) ? (
            <iframe title={viewing.title} src={blobUrlOf(viewing.dataUrl)} className="h-[70vh] w-full rounded-[var(--radius-card)] border border-border-soft bg-bg" />
          ) : viewing.dataUrl ? (
            <img src={viewing.dataUrl} alt={viewing.title} className="mx-auto max-h-[75vh] max-w-full rounded-[var(--radius-card)] border border-border-soft bg-bg" />
          ) : null)}
      </Drawer>

      {error && (
        <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
          {error}
        </p>
      )}
    </div>
  );
}
