import { useState, type ReactNode } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import type { Customer360Field } from '../../../types/config';
import { customer360Layouts, type FieldGroup } from './customer360Layouts';

/** The requirement text behind a field is the lookup key; what the agent reads is its name without the long
 * explanatory remark in brackets (kept when the bracket is a short qualifier such as "(Y/N)"). */
export function fieldLabel(details: string): string {
  const open = details.indexOf(' (');
  if (open < 0) return details;
  const tail = details.slice(open);
  return tail.length > 32 || /\b(should|including|based on|It )\b/i.test(tail) ? details.slice(0, open) : details;
}

const CHEVRON_DOWN = 'M6 9l6 6 6-6';
const CHEVRON_UP = 'M18 15l-6-6-6 6';

interface Item {
  key: string;
  field: Customer360Field;
  visibility: 'real-time' | 'drill-down';
  value: ReactNode | undefined;
  rich: ReactNode | undefined;
}

const present = (v: ReactNode | undefined) => v !== undefined && v !== null && v !== '';

/**
 * The single rendering pattern for every Customer 360 tab. The persona's
 * entitlement is unchanged (customer360-fields.json via the visibility engine:
 * each field is real-time or drill-down for that department), but the fields are
 * now GROUPED (customer360Layouts.ts) and presented by kind:
 *
 *  - Real-time fields with data show up front as KPI tiles / rows - no click needed.
 *  - Where a field has a detail view (`richFields`: a table, list or action surface),
 *    clicking its tile expands that detail INLINE, directly beneath it; click again
 *    to collapse. This is also where every pre-existing interactive surface (Create
 *    Ticket, edit drawers, order click-through) stays reachable.
 *  - Drill-down-only fields are collapsed rows under "More detail" in their group;
 *    expanding one shows its value or detail.
 *  - Real-time fields with nothing on file collapse into one muted line per group
 *    instead of a card each, so the tab is not a wall of "not available".
 *
 * Nothing is fabricated: a field with no resolver or no data is reported as such.
 */
export function TopicFieldsSection({
  personaId,
  topic,
  resolveValue,
  richFields,
  layout,
  only,
  plain,
  expandAll,
}: {
  personaId: string | undefined;
  topic: string;
  resolveValue?: (details: string) => ReactNode | undefined;
  /** Detail node per field (keyed by `details`): rendered inline when that field's tile/row is expanded. */
  richFields?: Record<string, ReactNode>;
  /** Overrides the topic's layout in customer360Layouts.ts. */
  layout?: FieldGroup[];
  /** Restricts the section to these fields (by `details`), for views that compose a tab from several topics. */
  only?: string[];
  /** Rows only, no card border or group heading: for a host that already provides the card (e.g. an Overview card). */
  plain?: boolean;
  /** Show every detail and drill-down open, with no expand / collapse controls (tabbed views that must not hide content). */
  expandAll?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const seenOnly = new Set<string>();
  const visible = getVisibleTopicFields(personaId, topic).filter(({ field }) => {
    if (!only) return true;
    // A composed view names each field once; a source field repeated under two components shows once.
    if (!only.includes(field.details) || seenOnly.has(field.details)) return false;
    seenOnly.add(field.details);
    return true;
  });
  if (visible.length === 0) {
    return <p className="text-muted text-[length:var(--fs-body)]">Nothing visible here for your role.</p>;
  }

  // A detail node is attached to the FIRST field carrying that name only: a few
  // source rows repeat (e.g. address Zone under two components) and the same
  // table must not appear twice.
  const richUsed = new Set<string>();
  const items: Item[] = visible.map(({ field, visibility }, index) => {
    const wantsRich = richFields?.[field.details] !== undefined && !richUsed.has(field.details);
    if (wantsRich) richUsed.add(field.details);
    return {
      // sourceId alone can repeat (null ids, duplicate rows) - index keeps keys unique.
      key: `${field.sourceId ?? field.details}-${index}`,
      field,
      visibility,
      value: resolveValue?.(field.details),
      rich: wantsRich ? richFields?.[field.details] : undefined,
    };
  });

  const groups = layout ?? customer360Layouts[topic] ?? [];
  const assigned = new Set<string>();
  const built = groups.map((g) => {
    const members: Item[] = [];
    if (g.component) members.push(...items.filter((i) => !assigned.has(i.key) && i.field.component === g.component));
    for (const name of g.fields) {
      for (const i of items) if (i.field.details === name && !assigned.has(i.key) && !members.includes(i)) members.push(i);
    }
    members.forEach((m) => assigned.add(m.key));
    return { group: g, members };
  });
  const rest = items.filter((i) => !assigned.has(i.key));
  if (rest.length > 0) built.push({ group: { title: groups.length > 0 ? 'Other' : '', fields: [], display: 'list' }, members: rest });

  const rendered = built.filter((b) => b.members.length > 0);
  const halves = rendered.filter((b) => b.group.width === 'half');
  const fulls = rendered.filter((b) => b.group.width !== 'half');

  const renderGroup = ({ group, members }: { group: FieldGroup; members: Item[] }) => (
    <GroupBlock key={group.title + members[0].key} group={group} members={members} open={open} toggle={toggle} plain={plain} expandAll={expandAll} />
  );

  return (
    <div className="space-y-6">
      {fulls.map(renderGroup)}
      {halves.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{halves.map(renderGroup)}</div>}
    </div>
  );
}

function GroupBlock({
  group,
  members,
  open,
  toggle,
  plain,
  expandAll,
}: {
  group: FieldGroup;
  members: Item[];
  open: Set<string>;
  toggle: (key: string) => void;
  plain?: boolean;
  expandAll?: boolean;
}) {
  const live = members.filter((m) => m.visibility === 'real-time' && (present(m.value) || m.rich !== undefined));
  const empty = members.filter((m) => m.visibility === 'real-time' && !present(m.value) && m.rich === undefined);
  const drill = members.filter((m) => m.visibility === 'drill-down');

  return (
    <section>
      {group.title && !plain && (
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">{group.title}</h3>
      )}
      {live.length > 0 &&
        (group.display === 'kpi' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {live.map((m) => (
              <Tile key={m.key} item={m} expanded={expandAll || open.has(m.key)} onToggle={expandAll ? undefined : () => toggle(m.key)} />
            ))}
          </div>
        ) : (
          <div className={plain ? 'divide-y divide-[var(--field-card-border)]' : 'card divide-y divide-[var(--field-card-border)]'}>
            {live.map((m) => (
              <Row key={m.key} item={m} expanded={expandAll || open.has(m.key)} onToggle={expandAll ? undefined : () => toggle(m.key)} />
            ))}
          </div>
        ))}

      {empty.length > 0 && (
        <p className={`text-muted text-[length:var(--fs-caption)] ${plain ? 'px-4 py-3 border-t border-[var(--field-card-border)]' : 'mt-2'}`}>
          No data on file: {empty.map((m) => fieldLabel(m.field.details)).join(' · ')}
        </p>
      )}

      {drill.length > 0 && (
        <div className="mt-3">
          <p className="text-muted text-[length:var(--fs-caption)] mb-1">More Detail</p>
          <div className="card border-dashed divide-y divide-[var(--field-card-border)]">
            {drill.map((m) => (
              <DrillRow key={m.key} item={m} expanded={expandAll || open.has(m.key)} onToggle={expandAll ? undefined : () => toggle(m.key)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return <Icon path={expanded ? CHEVRON_UP : CHEVRON_DOWN} className="w-4 h-4 text-muted shrink-0" />;
}

const summaryOf = (item: Item) =>
  present(item.value) ? item.value : <span className="text-muted">View Details</span>;

/** A KPI tile; expands inline when the field has a detail view. */
function Tile({ item, expanded, onToggle }: { item: Item; expanded: boolean; onToggle?: () => void }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">{fieldLabel(item.field.details)}</div>
        {item.rich !== undefined && onToggle && <Chevron expanded={expanded} />}
      </div>
      <div className="text-fg font-medium text-[length:var(--fs-body-lg)] mt-1 break-words">{summaryOf(item)}</div>
    </>
  );
  const shell = 'card p-4 text-left w-full';
  if (item.rich === undefined) return <div className={shell}>{body}</div>;
  if (!onToggle) {
    return (
      <>
        <div className={`${shell} sm:col-span-2 lg:col-span-3`}>{body}</div>
        <div className="sm:col-span-2 lg:col-span-3 card p-4">{item.rich}</div>
      </>
    );
  }
  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className={`${shell} hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] transition-colors ${expanded ? 'sm:col-span-2 lg:col-span-3' : ''}`}
      >
        {body}
      </button>
      {expanded && <div className="sm:col-span-2 lg:col-span-3 card p-4">{item.rich}</div>}
    </>
  );
}

/** A label/value row inside a list card; expands inline when it has a detail view. */
function Row({ item, expanded, onToggle }: { item: Item; expanded: boolean; onToggle?: () => void }) {
  const content = (
    <div className="flex items-start justify-between gap-4 w-full">
      <div className="min-w-0">
        <div className="text-fg-2 text-[length:var(--fs-caption)]">{fieldLabel(item.field.details)}</div>
        <div className="text-fg text-[length:var(--fs-body)] mt-0.5 break-words">{summaryOf(item)}</div>
      </div>
      {item.rich !== undefined && onToggle && <Chevron expanded={expanded} />}
    </div>
  );
  if (item.rich === undefined) return <div className="px-4 py-3">{content}</div>;
  if (!onToggle) {
    return (
      <div>
        <div className="px-4 py-3">{content}</div>
        <div className="px-4 pb-4">{item.rich}</div>
      </div>
    );
  }
  return (
    <div>
      <button type="button" aria-expanded={expanded} onClick={onToggle} className="w-full text-left px-4 py-3 hover:bg-surface">
        {content}
      </button>
      {expanded && <div className="px-4 pb-4">{item.rich}</div>}
    </div>
  );
}

/** A drill-down-only field: collapsed until the agent opens it. */
function DrillRow({ item, expanded, onToggle }: { item: Item; expanded: boolean; onToggle?: () => void }) {
  const detail = item.rich ?? (present(item.value) ? item.value : <span className="text-muted italic">Not available in this environment</span>);
  if (!onToggle) {
    return (
      <div className="px-4 py-3">
        <div className="text-fg text-[length:var(--fs-body)]">{fieldLabel(item.field.details)}</div>
        <div className="text-fg-2 text-[length:var(--fs-body)] mt-1">{detail}</div>
      </div>
    );
  }
  return (
    <div>
      <button type="button" aria-expanded={expanded} onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left hover:bg-surface">
        <span className="text-fg text-[length:var(--fs-body)]">{fieldLabel(item.field.details)}</span>
        <Chevron expanded={expanded} />
      </button>
      {expanded && <div className="px-4 pb-4 text-fg-2 text-[length:var(--fs-body)]">{detail}</div>}
    </div>
  );
}
