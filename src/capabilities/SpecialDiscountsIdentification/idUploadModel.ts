/**
 * Uploading the identity document as an alternative to scanning it: the files a customer's ID can arrive as, and how one is read.
 * One definition for every ID type, so the rules are the same wherever Customer Verification is used.
 */
import { UPLOAD_RULES, uploadFileProblem } from '../../components/domain/documentUploadRules';

export const ID_UPLOAD_ACCEPT = UPLOAD_RULES.identity.accept;
export const ID_UPLOAD_MAX_BYTES = UPLOAD_RULES.identity.maxBytes;

/** What is wrong with a file as an ID upload, or null when it can be used (the rules are the Document Upload capability's). */
export const idFileProblem = (file: { name: string; size: number }): string | null => uploadFileProblem(file, UPLOAD_RULES.identity);

/** A data URL the preview can draw: an image, or a PDF (shown by the browser's PDF viewer). */
export function readIdFile(file: File): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : undefined;
      // A PDF is read with whatever type the browser reports; the preview needs it to say so.
      resolve(url && /\.pdf$/i.test(file.name) ? url.replace(/^data:[^;,]*/, 'data:application/pdf') : url);
    };
    reader.onerror = () => reject(reader.error ?? new Error('The file could not be read.'));
    reader.readAsDataURL(file);
  });
}

/** A file taken as (part of) the ID: its name and a data URL of it, when it could be read. */
export interface UploadedIdFile {
  name: string;
  image?: string;
}

/**
 * What an upload covers, whatever the files are - the scenarios an ID arrives in:
 *   'pair'   two files, the front then the back;
 *   'both'   one file (one image, or a PDF) that shows both sides;
 *   'front'  one file that shows only the front (a passport's data page);
 *   'back'   one file that shows only the back.
 */
export type IdUploadSides = 'pair' | 'both' | 'front' | 'back';
export interface IdUploadResult {
  sides: IdUploadSides;
  files: UploadedIdFile[];
}

interface UploadValue {
  frontScanned?: boolean;
  backScanned?: boolean;
  frontImage?: string;
  backImage?: string;
  source?: 'scan' | 'upload';
  combined?: boolean;
  frontFile?: string;
  backFile?: string;
  /** The front/back assignment of an uploaded pair has been settled (by the names, or by the agent): it is not second-guessed again. */
  sidesSet?: boolean;
  clear?: boolean;
}

/**
 * The capture after an upload. A pair or a both-sides file completes the document; a single side is recorded on its own, keeping a side
 * already uploaded, so the document is complete once both sides are in (the other side is then asked for). Nothing is written to a
 * capture that came from the reader: a first upload replaces it whole.
 */
export function applyIdUpload<T extends UploadValue>(value: T, { sides, files }: IdUploadResult): T {
  const base = value.source === 'upload' ? value : { ...value, frontScanned: false, backScanned: false, frontImage: undefined, backImage: undefined, frontFile: undefined, backFile: undefined, combined: undefined };
  const [first, second] = sides === 'pair' ? orderPair(files) : files;
  if (sides === 'pair' && first && second) {
    return { ...base, frontScanned: true, backScanned: true, frontImage: first.image, backImage: second.image, frontFile: first.name, backFile: second.name, combined: false, sidesSet: true, source: 'upload', clear: true };
  }
  if (sides === 'both' && first) {
    return { ...base, frontScanned: true, backScanned: true, frontImage: first.image, backImage: first.image, frontFile: first.name, backFile: first.name, combined: true, source: 'upload', clear: true };
  }
  if (sides === 'front' && first) return { ...base, frontScanned: true, frontImage: first.image, frontFile: first.name, combined: false, source: 'upload', clear: true };
  if (sides === 'back' && first) return { ...base, backScanned: true, backImage: first.image, backFile: first.name, combined: false, source: 'upload', clear: true };
  return value;
}

/** The side an upload still needs once one side is in, or null when the document is complete (or nothing is uploaded). */
export function missingUploadSide(value: Pick<UploadValue, 'frontScanned' | 'backScanned' | 'source'>): 'front' | 'back' | null {
  if (value.source !== 'upload' || Boolean(value.frontScanned) === Boolean(value.backScanned)) return null;
  return value.frontScanned ? 'back' : 'front';
}

/**
 * Two files picked together arrive in the order the file picker lists them (usually by name, so "…-Back" before "…-Front"), which says nothing
 * about the sides. When the names say which is which ("front" / "back"), they decide; otherwise the order picked stands (and the agent can swap them).
 */
export function orderPair(files: UploadedIdFile[]): UploadedIdFile[] {
  const [a, b] = files;
  if (!a || !b) return files;
  const side = (f: UploadedIdFile) => (/front/i.test(f.name) && !/back/i.test(f.name) ? 'front' : /back/i.test(f.name) && !/front/i.test(f.name) ? 'back' : undefined);
  if (side(a) === 'back' && side(b) !== 'back') return [b, a];
  if (side(b) === 'front' && side(a) !== 'front') return [b, a];
  return files;
}

/** The front and back of an uploaded pair exchanged: for two files whose names did not say which side each is. */
export function swapUploadedSides<T extends UploadValue>(value: T): T {
  return { ...value, frontImage: value.backImage, backImage: value.frontImage, frontFile: value.backFile, backFile: value.frontFile, sidesSet: true };
}

/** An uploaded pair whose file names put the sides the wrong way round (the front slot holds the file named "back"): it is put right. */
export function uploadedSidesInverted(value: Pick<UploadValue, 'source' | 'combined' | 'frontFile' | 'backFile' | 'sidesSet'>): boolean {
  // Once settled - by the names at upload, or by the agent's own swap - the assignment stands.
  if (value.source !== 'upload' || value.combined || value.sidesSet || !value.frontFile || !value.backFile) return false;
  const ordered = orderPair([{ name: value.frontFile }, { name: value.backFile }]);
  return ordered[0].name !== value.frontFile;
}

/**
 * Takes an uploaded file back out: one side, or the whole upload (`'all'`, and always for a file that showed both sides). What is left stays
 * as it was - removing the back of a pair leaves the front, and the back is asked for again - and removing the last file leaves nothing.
 */
export function removeIdUpload<T extends UploadValue>(value: T, side: 'front' | 'back' | 'all'): T {
  const cleared = { frontScanned: false, backScanned: false, frontImage: undefined, backImage: undefined, frontFile: undefined, backFile: undefined, combined: undefined, sidesSet: undefined, source: undefined, clear: undefined };
  if (side === 'all' || value.combined) return { ...value, ...cleared };
  const next = side === 'front'
    ? { ...value, frontScanned: false, frontImage: undefined, frontFile: undefined }
    : { ...value, backScanned: false, backImage: undefined, backFile: undefined };
  return next.frontScanned || next.backScanned ? { ...next, sidesSet: undefined } : { ...value, ...cleared };
}

/**
 * Which capture actions the Special Discounts step offers (2026-10-27): the reader ("Initiate scan", when it is available) on every device, and
 * "Upload document" on a tablet only. On the web the reader is the one way in - except when it is not available (it failed, or the step has none),
 * where upload stays so the agent is never left without a way in.
 */
export function idCaptureOptions(readerAvailable: boolean, device: 'web' | 'tablet' = 'web'): { scan: boolean; upload: boolean } {
  return { scan: readerAvailable, upload: device === 'tablet' || !readerAvailable };
}
