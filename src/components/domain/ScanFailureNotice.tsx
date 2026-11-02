import { Icon } from '../primitives/Icon';
import { ALERT_ICON } from '../../assets/icons';


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
    <div role="alert" className="notice-panel notice-danger">
      <p className="row-start gap-2 danger-heading">
        <Icon path={ALERT_ICON} className="icon-md mt-0.5" />
        <span>{what}</span>
      </p>
      {next.map((line) => (
        <p key={line} className="text-fg text-[length:var(--fs-caption)] pl-7">
          {line}
        </p>
      ))}
      {condition && <p className="notice-foot">{condition}</p>}
    </div>
  );
}
