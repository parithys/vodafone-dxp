import { useState, type ReactNode } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import type { FieldGroup } from '../sections/customer360Layouts';
import { TopicFieldsSection } from '../sections/TopicFieldsSection';
import { MasonryGrid } from './TelesalesOverview';
import { ToolbarShell } from './TelesalesKit';
import { CHEVRON_DOWN, CHEVRON_UP } from '../../../assets/icons';
import { visibleCount, type TelesalesContext } from './telesalesContext';

export function Block({
  ctx,
  topic,
  groups,
  resolve,
  rich,
  plain,
}: {
  ctx: TelesalesContext;
  topic: string;
  groups: FieldGroup[];
  resolve?: (details: string) => ReactNode | undefined;
  rich?: Record<string, ReactNode>;
  plain?: boolean;
}) {
  const only = groups.flatMap((g) => g.fields);
  if (visibleCount(ctx.personaId, topic, only) === 0) return null;
  return <TopicFieldsSection personaId={ctx.personaId} topic={topic} only={only} layout={groups} resolveValue={resolve} richFields={rich} plain={plain} />;
}

export function DeepDiveRow({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="list-row justify-between pad-row body-text"
      >
        {title}
        <Icon path={open ? CHEVRON_UP : CHEVRON_DOWN} className="size-4 text-muted" />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/** A toolbar for the tab's page-level actions, then a masonry of its cards (wide blocks drop to a full-width area). */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <ToolbarShell>
      <MasonryGrid>{children}</MasonryGrid>
    </ToolbarShell>
  );
}
