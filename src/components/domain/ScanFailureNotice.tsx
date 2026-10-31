import { Icon } from '../primitives/Icon';

const ALERT_ICON = 'M12 3l9.5 17H2.5z M12 9v5 M12 17h.01';

/**
 * A scan that could not be completed, laid out as what happened, what to do next and any condition that applies - instead of one
 * bulleted list of red text. The wording is the caller's: first line = what happened, last line (when there are three or more) =
 * the condition, the lines between = what to do. One line renders as a plain message. role="alert" so the failure is announced:
 * the agent's attention is on the physical reader, not the screen.
 */
export function ScanFailureNotice({ lines }: { lines: string[] }) {
  const [what, ...rest] = lines;
  const condition = rest.length >= 2 ? rest[rest.length - 1] : undefined;
  const next = condition ? rest.slice(0, -1) : rest;
  return (
    <div role="alert" className="w-full rounded-[var(--radius-card)] border border-danger bg-tone-danger-soft p-4 text-left space-y-2">
      <p className="flex items-start gap-2 text-danger text-[length:var(--fs-body)] font-semibold">
        <Icon path={ALERT_ICON} className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{what}</span>
      </p>
      {next.map((line) => (
        <p key={line} className="text-fg text-[length:var(--fs-caption)] pl-7">
          {line}
        </p>
      ))}
      {condition && <p className="text-fg-2 text-[length:var(--fs-caption)] pl-7 pt-2 border-t border-[var(--border-soft)]">{condition}</p>}
    </div>
  );
}
