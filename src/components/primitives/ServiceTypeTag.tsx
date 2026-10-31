import { SERVICE_TYPE_TAGS, type ServiceTypeTagKey } from '../../lib/serviceTypeTag';

/** A service-type tag (Postpaid, Prepaid, New MNP ...). Wording and colours come from lib/serviceTypeTag; use this, never a hand-coloured pill. */
export function ServiceTypeTag({ type, className = '' }: { type: ServiceTypeTagKey; className?: string }) {
  const tag = SERVICE_TYPE_TAGS[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[length:var(--fs-tag)] font-medium whitespace-nowrap shrink-0 ${tag.colour} ${className}`}
    >
      {tag.label}
    </span>
  );
}
