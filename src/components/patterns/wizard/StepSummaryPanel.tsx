import { useEffect, useId, useMemo, useState } from 'react';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { formatDate } from '../../../lib/format';
import { useSummaryPanelStore } from '../../../stores/summaryPanelStore';
import { Icon } from '../../primitives/Icon';
import { PanelIcon } from '../../primitives/PanelIcon';
import { Tooltip } from '../../primitives/Tooltip';
import { StepSummarySection } from './StepSummarySection';
import { SummaryFieldRow } from './SummaryFieldRow';
import { formatSummaryValue } from './stepSummary';
import { stepIcon } from '../../../assets/icons/stepIcons';
import type { SummaryField, SummaryLabelSource } from './stepSummary';
import type { WizardStep } from './guidedWizardTypes';

export interface CompletedSummaryStep {
  index: number;
  step: WizardStep;
}

const sourceKey = (s: SummaryLabelSource) => `${s.kind}|${s.idField}|${s.labelField}`;

/** id -> label maps for every data-backed field in view. Loaded once per source; nothing about the order is copied. */
function useSummaryLabels(fields: SummaryField[]) {
  const [labels, setLabels] = useState<Record<string, Record<string, string>>>({});
  const sources = useMemo(() => {
    const m = new Map<string, SummaryLabelSource>();
    for (const f of fields) if (f.labelFrom) m.set(sourceKey(f.labelFrom), f.labelFrom);
    return [...m.values()];
  }, [fields]);
  useEffect(() => {
    let cancelled = false;
    for (const s of sources) {
      void mockDataEngine.list<Record<string, unknown>>(s.kind).then((rows) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        for (const r of rows) map[String(r[s.idField])] = String(r[s.labelField] ?? r[s.idField]);
        setLabels((prev) => ({ ...prev, [sourceKey(s)]: map }));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [sources]);
  return labels;
}

/**
 * Running summary of the steps already completed. Everything shown is derived on render from the wizard's single
 * draft-values object and each step's own `summary` declaration, so an edit to an earlier step shows immediately and
 * a new step or field appears here without touching this component.
 */
export function StepSummaryPanel({
  completed,
  totalSteps,
  values,
  onEdit,
  returnTo,
  milestoneSteps,
  current,
  variant = 'aside',
}: {
  /** Completed steps that declare a summary, in step order. */
  completed: CompletedSummaryStep[];
  /** Steps in the journey, for "N of M steps completed". */
  totalSteps: number;
  values: Record<string, unknown>;
  /** Go back to a step. Absent when editing is not allowed. */
  onEdit?: (index: number) => void;
  /** Shown after going back to edit: jumps to the furthest step reached. */
  returnTo?: { label: string; key: string; onReturn: () => void; index: number };
  /** Keys of the steps that reached a journey milestone: their rows show a flag in place of the tick. */
  milestoneSteps?: ReadonlySet<string>;
  /** The page the agent is on now: listed in step order with the completed ones, marked as current, showing what has been entered on it so far. */
  current?: CompletedSummaryStep;
  /** 'aside': the fixed side panel. 'accordion': the collapsible block shown above the action buttons on small screens. */
  variant?: 'aside' | 'accordion';
}) {
  // Which details the agent has expanded, remembered only for the page they were on: moving to another page starts everything collapsed again.
  const [expanded, setExpanded] = useState<{ page: string | undefined; open: Record<string, boolean> }>({ page: undefined, open: {} });
  const [accordionOpen, setAccordionOpen] = useState(false);
  const collapsed = useSummaryPanelStore((s) => s.collapsed);
  const toggleCollapsed = useSummaryPanelStore((s) => s.toggleCollapsed);
  const bodyId = useId();
  const currentKey = current?.step.key;
  const openOverride = expanded.page === currentKey ? expanded.open : {};
  const setOpenOverride = (update: (o: Record<string, boolean>) => Record<string, boolean>) =>
    setExpanded((e) => ({ page: currentKey, open: update(e.page === currentKey ? e.open : {}) }));
  const isOpen = (key: string) => openOverride[key] ?? false;

  const allFields = useMemo(() => [...completed, ...(current ? [current] : [])].flatMap((c) => c.step.summary ?? []), [completed, current]);
  const labels = useSummaryLabels(allFields);

  const heading = `Journey Summary`;
  const count = `${completed.length} of ${totalSteps} steps completed`;

  const fieldRows = (step: WizardStep, skipEmpty: boolean) =>
    (step.summary ?? [])
      .filter((f) => f.when?.(values) !== false)
      .map((f) => ({ f, value: formatSummaryValue(f, f.value(values), f.labelFrom ? labels[sourceKey(f.labelFrom)] : undefined, (v) => (v === undefined || v === null || v === '' ? undefined : formatDate(v))) }))
      .filter(({ value }) => !(skipEmpty && value.empty))
      .map(({ f, value }) => <SummaryFieldRow key={f.key} label={f.label} value={value} />);

  // Completed steps and the current page in step order. The current page is a name-only tinted band: no details, no Edit, no toggle.
  const entries = [...completed.map((c) => ({ ...c, isCurrent: false })), ...(current ? [{ ...current, isCurrent: true }] : [])].sort((a, b) => a.index - b.index);
  // After going back to edit, the furthest step reached keeps its place after the current page, as a name that goes straight to it.
  const returnEntry = returnTo && !entries.some((e) => e.index === returnTo.index) ? returnTo : undefined;
  const returnRow = returnEntry ? (
    <StepSummarySection title={returnEntry.label} open={false} onToggle={() => undefined} onGo={returnEntry.onReturn} icon={stepIcon(returnEntry.key)}>
      {null}
    </StepSummarySection>
  ) : null;
  const body =
    entries.length === 0 ? (
      <p className="px-4 py-6 text-muted text-[length:var(--fs-body)]">Your details will appear here as you complete each step.</p>
    ) : (
      entries.map(({ index, step, isCurrent }) => {
        const rows = isCurrent ? [] : fieldRows(step, false);
        return (
          <StepSummarySection
            key={step.key}
            title={step.label}
            icon={stepIcon(step.key)}
            open={isCurrent ? openOverride[step.key] ?? true : isOpen(step.key)}
            onToggle={() => setOpenOverride((o) => ({ ...o, [step.key]: !(isCurrent ? o[step.key] ?? true : isOpen(step.key)) }))}
            onEdit={onEdit && !isCurrent ? () => onEdit(index) : undefined}
            milestone={!isCurrent && milestoneSteps?.has(step.key)}
            current={isCurrent}
          >
            {rows.length > 0 ? rows : isCurrent ? null : <p className="py-2 caption-muted">Nothing entered on this page yet.</p>}
          </StepSummarySection>
        );
      })
    );

  const live = (
    <span className="sr-only" aria-live="polite" role="status">
      {completed.length === 0 ? 'No steps completed yet.' : `Summary updated: ${count}.`}{current ? ` Current step: ${current.step.label}.` : ''}
    </span>
  );

  if (variant === 'accordion') {
    return (
      <aside aria-label="Summary of completed steps" className="lg:hidden mt-6 card ">
        <button
          type="button"
          onClick={() => setAccordionOpen((o) => !o)}
          aria-expanded={accordionOpen}
          className="split-nowrap w-full pad-row text-left rounded-[var(--radius-card)] focus-ring"
        >
          <span className="heading-strong">{accordionOpen ? 'Hide summary' : 'View summary'}</span>
          <span className="caption-secondary">{count}</span>
        </button>
        {live}
        {accordionOpen && <div className="divider-top max-h-96 overflow-y-auto">{body}{returnRow}</div>}
      </aside>
    );
  }

  const toggleLabel = collapsed ? 'Expand journey summary' : 'Collapse journey summary';
  const tileClass = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-bg text-[var(--brand-plum)] shadow-[var(--shadow-icon-tile)]';
  const tileIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 4h6v3H9z M7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1 M9 12h6 M9 16h4" />
    </svg>
  );

  return (
    // Collapses and expands sideways like the left navigation: the card narrows to a rail that keeps the header tile (now the expand control).
    <aside
      aria-label="Summary of completed steps"
      className={`rail-end card ${collapsed ? 'w-16' : 'w-80'}`}
    >
      {collapsed ? (
        <header className="icon-tile h-14">
          <Tooltip content={toggleLabel} placement="left">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={toggleLabel}
              aria-expanded={false}
              aria-controls={bodyId}
              className="relative nav-icon-tile-lg nav-ghost focus-ring"
            >
              {/* The navigation's panel icon, mirrored: this panel is on the right, so the chevron points back towards the content to open it. */}
              <PanelIcon expanded={false} className="w-6 h-6 -scale-x-100" />
            </button>
          </Tooltip>
        </header>
      ) : (
        /* The header stays put; only the sections below it scroll. Its content keeps a fixed width so the title does not reflow while the card narrows. */
        <header className="shrink-0 border-b border-on-dark-line-2 bg-[var(--title-band-bg)] px-4 py-4">
          <div className="row w-72">
            <span className={tileClass} aria-hidden="true">
              {tileIcon}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-on-dark font-bold text-[length:var(--fs-h5)]">{heading}</h2>
            </div>
            <Tooltip content={toggleLabel} placement="bottom">
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={toggleLabel}
                aria-expanded
                aria-controls={bodyId}
                className="relative nav-icon-tile on-dark-ghost focus-ring"
              >
                {/* The navigation's panel icon, mirrored: this panel is on the right, so the chevron points away from the content to fold it. */}
                <PanelIcon expanded className="w-6 h-6 -scale-x-100" />
              </button>
            </Tooltip>
          </div>
        </header>
      )}
      {live}
      {collapsed ? (
        <nav id={bodyId} aria-label="Journey steps" className="scroll-area pb-2">
          <ul>
            {entries.map(({ step, isCurrent }) => {
              const rowClass = `flex h-12 w-full items-center justify-center transition-colors duration-[var(--motion-base)] focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                isCurrent ? 'bg-[var(--nav-active-bg)] bg-[image:var(--nav-active-image)] text-[var(--nav-active-fg)]' : 'text-[var(--nav-fg-muted)] hover:bg-[var(--nav-hover-bg)]'
              }`;
              // The step's own icon: white on the red band for the page the agent is on, muted for a completed step, orange when it reached a milestone.
              const glyph = <Icon path={stepIcon(step.key)} className={`w-6 h-6 ${!isCurrent && milestoneSteps?.has(step.key) ? 'text-[var(--summary-milestone)]' : ''}`} />;
              // Every row just opens the panel: the detail and the Edit actions live there.
              return (
                <li key={step.key}>
                  <Tooltip content={step.label} placement="left">
                    <button
                      type="button"
                      onClick={toggleCollapsed}
                      aria-label={`${step.label}, ${isCurrent ? 'current step' : 'completed'}. Expand journey summary`}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-expanded={false}
                      aria-controls={bodyId}
                      className={rowClass}
                    >
                      {glyph}
                    </button>
                  </Tooltip>
                </li>
              );
            })}
            {returnEntry && (
              <li>
                <Tooltip content={returnEntry.label} placement="left">
                  <button type="button" onClick={toggleCollapsed} aria-label={`${returnEntry.label}, not completed. Expand journey summary`} aria-expanded={false} aria-controls={bodyId} className="row-button h-12 justify-center text-[var(--nav-fg-muted)] hover:bg-[var(--nav-hover-bg)]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </Tooltip>
              </li>
            )}
          </ul>
        </nav>
      ) : (
        <div id={bodyId} className="scroll-area w-80">
          {body}
          {returnRow}
        </div>
      )}
    </aside>
  );
}
