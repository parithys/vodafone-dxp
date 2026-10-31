import { formatBytes } from '../../lib/format';

/**
 * The one place that says what a document upload accepts: which file types, how large, and what is said when a file is refused. Every upload in
 * the app (the identity document, the signed CAF, Additional Documents) reads its rules from here, so a limit is changed once.
 * Part of the Document Upload capability (capabilities/DocumentUpload).
 */
export interface UploadRules {
  /** The `accept` attribute of the file input. */
  accept: string;
  extensions: readonly string[];
  maxBytes: number;
  /** "PDF or JPG" - the types in words, for helper text and messages. */
  formatsLabel: string;
  /** "2 MB" - the size limit in words. */
  maxLabel: string;
}

function rules(extensions: readonly string[], maxMb: number, formatsLabel: string): UploadRules {
  return {
    accept: extensions.map((e) => `.${e}`).join(','),
    extensions,
    maxBytes: maxMb * 1024 * 1024,
    formatsLabel,
    maxLabel: `${maxMb} MB`,
  };
}

export const UPLOAD_RULES = {
  /** An identity document (scan alternative): PDF or JPG, 2 MB. */
  identity: rules(['pdf', 'jpg', 'jpeg'], 2, 'PDF or JPG'),
  /** Supporting paperwork (signed CAF, additional documents): PDF or JPG, 2 MB. */
  supporting: rules(['pdf', 'jpg', 'jpeg'], 2, 'PDF or JPG'),
} as const satisfies Record<string, UploadRules>;

/** What is wrong with a file under the rules, or null when it can be uploaded. */
export function uploadFileProblem(file: { name: string; size: number }, r: UploadRules): string | null {
  const ext = /\.([^.]+)$/.exec(file.name)?.[1]?.toLowerCase();
  if (!ext || !r.extensions.includes(ext)) return `${file.name}: only ${r.formatsLabel} files can be uploaded.`;
  if (file.size === 0) return `${file.name}: the file is empty.`;
  if (file.size > r.maxBytes) return `${file.name} is ${formatBytes(file.size)}. The limit is ${r.maxLabel} per file.`;
  return null;
}
