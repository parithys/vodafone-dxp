import { useEffect, useRef, useState } from 'react';
import { EmptyState } from '../../components/primitives/EmptyState';
import { Badge } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import type { CustomerService } from '../../engines/customerServicesEngine';
import { TopicFieldsSection } from './sections/TopicFieldsSection';

const CHEVRON_UP = 'M18 15l-6-6-6 6';
const CHEVRON_DOWN = 'M6 9l6 6 6-6';

interface ServiceListProps {
  services: CustomerService[];
  /** The service a deep link asked for, highlighted and scrolled to. */
  selectedRef?: string;
  emptyMessage: string;
  /** When both are given, each row expands to the full Assets field set for
   * that specific line (2026-09-29 rebuild) - customer360-fields.json's
   * Assets topic is per-line, so this is scoped to one service at a time
   * rather than one flat panel for the whole tab. */
  personaId?: string;
  resolveField?: (service: CustomerService, details: string) => React.ReactNode | undefined;
}

// The customer's actual services for one tab, above that tab's action groups.
//
// These tabs were action CATALOGUES only: Mobile said "1 active postpaid line
// on file" without saying which line, and Fibre & Home listed no services at
// all. So a link that opened a tab had nothing to land on, and an agent had no
// way to see what the customer actually holds.
//
// The selected row is marked with the same --field-card-selected treatment the
// choice cards use, so "this is the one you clicked" reads the same way here
// as it does in the wizards.
export function ServiceList({ services, selectedRef, emptyMessage, personaId, resolveField }: ServiceListProps) {
  const selectedEl = useRef<HTMLLIElement>(null);
  const [expandedRef, setExpandedRef] = useState<string | undefined>(undefined);
  const expandable = Boolean(personaId && resolveField);

  // A deep-linked service can be below the fold on a long tab. Scrolled only
  // when one is actually selected, and only on mount/change - never on every
  // render, which would fight the agent's own scrolling.
  useEffect(() => {
    if (!selectedRef || !selectedEl.current) return;
    selectedEl.current.scrollIntoView({ block: 'nearest' });
  }, [selectedRef]);

  if (services.length === 0) {
    return <EmptyState compact message={emptyMessage} className="mb-4" />;
  }

  return (
    <ul className="mb-6 space-y-2">
      {services.map((service) => {
        const selected = service.ref === selectedRef;
        const isOpen = expandedRef === service.ref;
        return (
          <li
            key={service.ref}
            ref={selected ? selectedEl : undefined}
            aria-current={selected ? 'true' : undefined}
            className={`rounded-[var(--radius-card)] border ${
              selected
                ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)] shadow-[var(--shadow-selected-ring)]'
                : 'border-border-soft bg-bg'
            }`}
          >
            <div
              role={expandable ? 'button' : undefined}
              tabIndex={expandable ? 0 : undefined}
              aria-expanded={expandable ? isOpen : undefined}
              onClick={expandable ? () => setExpandedRef(isOpen ? undefined : service.ref) : undefined}
              onKeyDown={
                expandable
                  ? (e) => {
                      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setExpandedRef(isOpen ? undefined : service.ref);
                      }
                    }
                  : undefined
              }
              className={`flex items-center justify-between gap-3 p-3 ${expandable ? 'cursor-pointer' : ''}`}
            >
              <span className="flex items-center gap-2 min-w-0">
                {expandable && <Icon path={isOpen ? CHEVRON_UP : CHEVRON_DOWN} className="w-4 h-4 text-muted shrink-0" />}
                <span className="min-w-0">
                  <span className="block text-fg text-[length:var(--fs-body)] font-semibold truncate">{service.label}</span>
                  <span className="block text-muted text-[length:var(--fs-caption)] truncate">{service.identifier}</span>
                </span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                {/* Source statuses are not one vocabulary - 'Active' from
                    installed assets, 'active subscription' / 'Try & Buy trial' /
                    'Home Move / TON' from GigaHome - so the raw value is shown
                    rather than normalised into a status that was never recorded.
                    Only a literal 'Active' gets the success variant. */}
                {service.status && (
                  <Badge variant={service.status === 'Active' ? 'success' : 'filled-neutral'}>{service.status}</Badge>
                )}
                {selected && <Badge variant="outlined-red">Selected</Badge>}
              </span>
            </div>
            {expandable && isOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-border-soft">
                <TopicFieldsSection personaId={personaId} topic="Assets" resolveValue={(details) => resolveField!(service, details)} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
