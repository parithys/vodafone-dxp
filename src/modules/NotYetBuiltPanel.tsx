import type { ReactNode } from 'react';
import { Badge } from '../components/primitives/Badge';

// The presentational half of the not-yet-built placeholder, extracted verbatim
// from ScreenNotYetBuilt so the screen-level and workspace-level placeholders
// are the same component rather than two that drift apart. No token or
// primitive change - same Badge, same --fs-h3 heading, same text-fg-2 body.
export interface NotYetBuiltPanelProps {
  badge?: string;
  title: string;
  body: ReactNode;
  details?: { term: string; value: ReactNode }[];
  footnote?: ReactNode;
  children?: ReactNode;
}

export function NotYetBuiltPanel({
  badge = 'Not yet implemented',
  title,
  body,
  details,
  footnote,
  children,
}: NotYetBuiltPanelProps) {
  return (
    <div className="p-8 w-full">
      <Badge variant="filled-neutral">{badge}</Badge>
      <h1 className="text-[length:var(--fs-h4)] font-bold text-fg mt-3 mb-2">{title}</h1>
      <p className="text-fg-2 mb-4">{body}</p>
      {details && details.length > 0 && (
        <dl className="text-[length:var(--fs-body)] text-fg-2 space-y-1">
          {details.map((d) => (
            <div key={d.term}>
              <dt className="inline font-medium text-fg">{d.term}: </dt>
              <dd className="inline">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
      {footnote && <p className="text-[length:var(--fs-caption)] text-muted mt-4">{footnote}</p>}
    </div>
  );
}
