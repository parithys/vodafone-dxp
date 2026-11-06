import { useRef, useState } from 'react';
import { AdditionalDocumentsUpload, UPLOAD_RULES, uploadFileProblem, type AdditionalDocument } from '../../capabilities';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Textarea } from '../../components/primitives/Textarea';
import { SignatureCapture } from '../../components/patterns/SignatureCapture';
import { readFileAsDataUrl } from '../../lib/documentFileStore';
import { isMissingInformationComplete, type MissingInformationAnswer, type MissingInformationRequest } from '../../engines/approvalAuthority';
import type { OrderAttachment } from './attachmentModel';

// What the agent who submitted an order does when the approver marked it Missing Information: only what was asked for - a document captured
// again, a new signature on the CAF, supporting documents with their type. Nothing else about the order is shown as editable here or anywhere
// while the request is open. Resubmitting goes back to the Approval Queue.

export interface MissingInformationSubmit {
  answer: MissingInformationAnswer;
  comment: string;
}

export function MissingInformationPanel({
  request,
  attachments,
  approverComment,
  busy,
  onResubmit,
}: {
  request: MissingInformationRequest;
  attachments: OrderAttachment[];
  approverComment?: string;
  busy: boolean;
  onResubmit: (s: MissingInformationSubmit) => void;
}) {
  const [reuploaded, setReuploaded] = useState<MissingInformationAnswer['reuploaded']>({});
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>();
  const [documents, setDocuments] = useState<AdditionalDocument[]>([]);
  const [comment, setComment] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<number | undefined>();

  const answer: MissingInformationAnswer = { reuploaded, signatureDataUrl, supporting: documents.map((d) => ({ label: d.label, fileName: d.fileName })) };
  const complete = isMissingInformationComplete(request, answer);
  const outstanding =
    request.attachmentIndexes.filter((i) => !reuploaded[i]).length + (request.resignCaf && !signatureDataUrl ? 1 : 0) + (request.supportingDocuments && documents.length === 0 ? 1 : 0);

  const choose = (i: number) => {
    setTarget(i);
    fileRef.current?.click();
  };
  const take = async (file: File | undefined) => {
    const i = target;
    if (!file || i === undefined) return;
    const issue = uploadFileProblem(file, UPLOAD_RULES.supporting);
    if (issue) return setProblem(issue);
    setProblem(null);
    const previewUrl = /^image\//.test(file.type) ? await readFileAsDataUrl(file) : undefined;
    setReuploaded((r) => ({ ...r, [i]: { fileName: file.name, previewUrl } }));
  };

  return (
    <section className="mt-4 card pad-row space-y-4" aria-label="Information requested by the approver">
      <div className="split">
        <div className="min-w-0">
          <h3 className="title title-md font-semibold">Information Requested</h3>
          <p className="caption-secondary">Contact the customer, then provide only what is listed. The order itself is locked: its lines and details cannot be changed here.</p>
        </div>
        <Badge variant={outstanding === 0 ? 'success' : 'warning'}>{outstanding === 0 ? 'All provided' : `${outstanding} to provide`}</Badge>
      </div>
      {approverComment && (
        <div className="notice-warning pad-row">
          <p className="warn-title">Approver's Comment</p>
          <p className="label-caption">{approverComment}</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept={UPLOAD_RULES.supporting.accept} className="sr-only" aria-hidden tabIndex={-1} onChange={(e) => { void take(e.target.files?.[0]); e.target.value = ''; }} />
      {problem && <p role="alert" className="text-danger caption-secondary">{problem}</p>}

      {request.attachmentIndexes.length > 0 && (
        <div className="space-y-2">
          <p className="title title-sm font-semibold">Recapture or Re-Upload</p>
          <ul className="space-y-2">
            {request.attachmentIndexes.map((i) => {
              const a = attachments[i];
              const done = reuploaded[i];
              return (
                <li key={i} className="row-between">
                  <span className="min-w-0">
                    <span className="value-text">{a?.label ?? `Document ${i + 1}`}</span>
                    <span className="caption-muted"> {done ? `Replaced with ${done.fileName}` : a?.detail ? `Current: ${a.detail}` : ''}</span>
                  </span>
                  <Button variant="secondary" onClick={() => choose(i)} aria-label={`${done ? 'Replace again' : 'Re-upload'}: ${a?.label ?? `Document ${i + 1}`}`}>
                    {done ? 'Replace Again' : 'Re-upload'}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {request.resignCaf && (
        <div className="space-y-2">
          <p className="title title-sm font-semibold">Re-Sign the CAF</p>
          {signatureDataUrl ? (
            <div className="row">
              <Badge variant="success">New Signature Captured</Badge>
              <img src={signatureDataUrl} alt="New customer signature" className="signature-thumb" />
              <Button variant="secondary" onClick={() => setSignatureDataUrl(undefined)}>Sign Again</Button>
            </div>
          ) : (
            <SignatureCapture label="Customer Signature" onSave={setSignatureDataUrl} />
          )}
        </div>
      )}

      {request.supportingDocuments && (
        <div className="space-y-2">
          <p className="title title-sm font-semibold">Supporting Documents</p>
          <AdditionalDocumentsUpload documents={documents} onChange={setDocuments} whiteBackground />
        </div>
      )}

      <Textarea label="What Was Provided (Required)" required value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="actions-end">
        <Button variant="primary" onClick={() => onResubmit({ answer, comment: comment.trim() })} disabled={!complete || !comment.trim() || busy}>
          Resubmit for Approval
        </Button>
      </div>
    </section>
  );
}
