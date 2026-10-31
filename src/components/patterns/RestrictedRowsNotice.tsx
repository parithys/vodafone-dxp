import { Icon } from '../primitives/Icon';

const LOCK = 'M6 11h12v10H6z M8 11V8a4 4 0 0 1 8 0v3 M12 15v2';

/** Above a list: how many entries were left out because they belong to a protected-segment customer this role may not see. Nothing about them is named. */
export function RestrictedRowsNotice({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <p role="status" className="mb-3 flex items-center gap-2 text-fg-2 text-[length:var(--fs-caption)]">
      <Icon path={LOCK} className="w-4 h-4 shrink-0" />
      {count} {count === 1 ? 'entry is' : 'entries are'} hidden: access restricted for your role.
    </p>
  );
}
