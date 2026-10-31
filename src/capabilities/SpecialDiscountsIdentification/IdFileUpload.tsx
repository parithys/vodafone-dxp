import { UPLOAD_RULES } from '../../components/domain/documentUploadRules';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { detectDeviceType } from '../../lib/deviceType';
import { ID_UPLOAD_ACCEPT, idCaptureOptions, idFileProblem, readIdFile } from './idUploadModel';
import type { IdUploadResult, IdUploadSides, UploadedIdFile } from './idUploadModel';

const UPLOAD_ICON = 'M12 16V4 M7 9l5-5 5 5 M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3';

const SIDE_CHOICES: { sides: IdUploadSides; label: string }[] = [
  { sides: 'both', label: 'Front and Back' },
  { sides: 'front', label: 'Front Only' },
  { sides: 'back', label: 'Back Only' },
];

/**
 * "Upload" for an identity document: a button that takes the file(s) instead of the reader. Checks them (type, size), reads them and hands
 * over an IdUploadResult, whichever way the ID arrives:
 *
 *   `side` absent (the whole document): two files are the front and the back, in that order; ONE file - an image or a PDF - is asked
 *   "what does this show?": both sides (a single image or a PDF of both), the front only or the back only.
 *   `side` set: one file for that side.
 *
 * A problem is reported next to the button, and nothing is handed over.
 */
export function IdFileUpload({
  label = 'Upload document',
  side,
  disabled,
  align = 'center',
  leading,
  scanner = leading !== undefined,
  onUpload,
}: {
  label?: string;
  side?: 'front' | 'back';
  disabled?: boolean;
  /** Where the note and any problem sit under the button: centred (default) or at the end (the button is at the right of a row). */
  align?: 'center' | 'end';
  /** Shown immediately before the button, in the same row, so the two always stay together (e.g. Initiate scan). */
  leading?: ReactNode;
  /** The reader is offered at this step (defaults to whether `leading` is given). The reader is offered on every device and upload on a tablet only; upload also stays when there is no reader. */
  scanner?: boolean;
  onUpload: (result: IdUploadResult) => void;
}) {
  const { scan, upload } = idCaptureOptions(scanner, detectDeviceType());
  const input = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // One file picked for the whole document: waiting to be told which sides it shows.
  const [pending, setPending] = useState<UploadedIdFile | null>(null);

  const take = async (list: FileList | null) => {
    const files = list ? [...list] : [];
    if (input.current) input.current.value = '';
    if (!files.length) return;
    setPending(null);
    if (files.length > (side ? 1 : 2)) {
      setProblem(side ? 'Select one file.' : 'Select one file, or two: the front then the back.');
      return;
    }
    const bad = files.map(idFileProblem).find(Boolean);
    if (bad) {
      setProblem(bad);
      return;
    }
    setProblem(null);
    setBusy(true);
    try {
      const read: UploadedIdFile[] = await Promise.all(files.map(async (f) => ({ name: f.name, image: await readIdFile(f) })));
      if (side) onUpload({ sides: side, files: read });
      else if (read.length === 2) onUpload({ sides: 'pair', files: read });
      else setPending(read[0]);
    } catch {
      setProblem('A file could not be read. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${align === 'end' ? 'items-end text-right shrink-0' : 'items-center'}`}>
      <input ref={input} type="file" accept={ID_UPLOAD_ACCEPT} multiple={!side} className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => void take(e.target.files)} />
      <div className="flex flex-nowrap items-start gap-3">
        {scan && leading}
        {upload && (
          <Button variant="secondary" compact className="shrink-0" disabled={disabled || busy} onClick={() => input.current?.click()}>
            <Icon path={UPLOAD_ICON} className="w-4 h-4" />
            {busy ? 'Reading…' : label}
          </Button>
        )}
      </div>
      {upload && !side && !pending && (
        <span className="text-muted text-[length:var(--fs-caption)]">{UPLOAD_RULES.identity.formatsLabel}, up to {UPLOAD_RULES.identity.maxLabel} per file</span>
      )}
      {pending && (
        <div role="group" aria-label={`What ${pending.name} shows`} className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
          <span className="text-fg-2 text-[length:var(--fs-caption)] max-w-[14rem] truncate">{pending.name} shows:</span>
          <div className="flex flex-wrap justify-end gap-2">
            {SIDE_CHOICES.map((c) => (
              <Button
                key={c.sides}
                variant="secondary"
                compact
                onClick={() => {
                  onUpload({ sides: c.sides, files: [pending] });
                  setPending(null);
                }}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {problem && (
        <p role="alert" className="text-danger text-[length:var(--fs-caption)] text-center">
          {problem}
        </p>
      )}
    </div>
  );
}
