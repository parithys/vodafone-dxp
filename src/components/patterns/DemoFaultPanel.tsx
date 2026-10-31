import { useState } from 'react';
import { Button } from '../primitives/Button';
import { SERVICE_LABEL, useServiceFaults, type FaultKind, type ServiceName } from '../../engines/serviceCall';
import { SHOW_DEMO_FAULT_PANEL } from './demoFaultConfig';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';

const KINDS: { value: FaultKind; label: string }[] = [
  { value: 'timeout', label: 'Timeout' },
  { value: 'unavailable', label: 'Service Unavailable' },
  { value: 'network', label: 'Connectivity Failure' },
  { value: 'api', label: 'API / Integration Error' },
  { value: 'partial', label: 'Partial / Incomplete Response' },
  { value: 'expired', label: 'Validation Expired' },
  { value: 'interrupted', label: 'Interrupted Validation' },
  { value: 'unexpected', label: 'Unexpected Exception' },
  { value: 'duplicate', label: 'Duplicate Customer Matches' },
];

/**
 * DEMO ONLY. The prototype's lookups read local data and cannot fail, so this arms a
 * failure on one system for the next N calls, to show each recovery state. Carries
 * `demo-only`, so it is violet and disappears with SHOW_DEMO_CONTENT = false.
 */
export function DemoFaultPanel() {
  const { faults, arm, clear } = useServiceFaults();
  const [service, setService] = useState<ServiceName | ''>('');
  const [kind, setKind] = useState<FaultKind | ''>('');
  const [times, setTimes] = useState(0);
  // After every hook: an early return above a hook changes the hook order between renders.
  if (!SHOW_DEMO_FAULT_PANEL) return null;
  const armed = Object.entries(faults).filter(([, f]) => f && f.remaining > 0);
  const select = 'rounded-[var(--radius-button)] border border-border bg-bg px-2 py-1 text-[length:var(--fs-caption)]';
  return (
    <div className={`${SYNTHETIC_CLASS} rounded-[var(--radius-card)] border border-dashed border-current p-3 space-y-2`}>
      <p className="text-[length:var(--fs-micro)] uppercase tracking-wide font-semibold">Demo Only - Simulate a System Failure</p>
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="System" className={select} value={service} onChange={(e) => setService(e.target.value as ServiceName | '')}>
          <option value="">Select System</option>
          {(Object.keys(SERVICE_LABEL) as ServiceName[]).map((s) => (
            <option key={s} value={s}>
              {SERVICE_LABEL[s]}
            </option>
          ))}
        </select>
        <select aria-label="Failure" className={select} value={kind} onChange={(e) => setKind(e.target.value as FaultKind | '')}>
          <option value="">Select Failure</option>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <select aria-label="Times" className={select} value={times} onChange={(e) => setTimes(Number(e.target.value))}>
          <option value={0}># Calls</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              next {n} call{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <Button variant="primary" compact disabled={!service || !kind || !times} onClick={() => service && kind && times > 0 && arm(service, kind, times)}>
          Apply
        </Button>
        <Button variant="secondary" compact
          onClick={() => {
            clear();
            setService('');
            setKind('');
            setTimes(0);
          }}
        >
          Clear
        </Button>
      </div>
      {armed.length > 0 && (
        <p className="text-[length:var(--fs-caption)]">
          Applied: {armed.map(([s, f]) => `${SERVICE_LABEL[s as ServiceName]} - ${f!.kind} (${f!.remaining} left)`).join('; ')}
        </p>
      )}
    </div>
  );
}
