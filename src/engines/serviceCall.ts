import { create } from 'zustand';

// One place that turns "something went wrong calling a system" into a TYPED
// failure, so Customer Verification and everything that depends on it can tell
// apart:
//   - a BUSINESS result (the system answered: not found, expired ID, retired
//     status not confirmed, not eligible) - handled by each caller as before, and
//   - a TECHNICAL failure (the system did not give a usable answer) - which is
//     never read as success, as a business failure, as eligible/ineligible, or as
//     new/existing. The caller keeps the validation UNRESOLVED instead.
//
// Prototype note: every lookup here reads local mock data, which cannot really
// fail. `useServiceFaults` (below) lets a demo inject each failure kind so the
// recovery states can be shown; it is inert unless a fault is armed.

export type ServiceName = 'moi' | 'nas' | 'customer-lookup' | 'eligibility';

export type FailureKind =
  | 'timeout'
  | 'unavailable'
  | 'network'
  | 'api'
  | 'partial'
  | 'expired'
  | 'interrupted'
  | 'unexpected';

/** Kinds a demo can arm. 'duplicate' is not a failure: the lookup answers with more than one match. */
export type FaultKind = FailureKind | 'duplicate';

/** Retries offered before a failure is treated as persistent and a controlled fallback is shown instead. */
export const MAX_RETRIES = 3;

/** How long a successful MOI validation stays valid before it must be repeated (ms). */
export const VALIDATION_TTL_MS = 30 * 60 * 1000;

const CALL_TIMEOUT_MS = 8000;

export const SERVICE_LABEL: Record<ServiceName, string> = {
  moi: 'MOI',
  nas: 'NAS (National Address System)',
  'customer-lookup': 'Customer lookup',
  eligibility: 'Eligibility service',
};

export class ServiceError extends Error {
  readonly service: ServiceName;
  readonly kind: FailureKind;
  /** A new attempt can plausibly succeed. False for 'expired' (needs a fresh validation, not a repeat). */
  readonly retryable: boolean;
  constructor(service: ServiceName, kind: FailureKind, retryable = true) {
    super(`${service}: ${kind}`);
    this.name = 'ServiceError';
    this.service = service;
    this.kind = kind;
    this.retryable = retryable;
  }
}

/** Plain-language title + message for a failure, never mentioning internals. */
export function describeFailure(service: ServiceName, kind: FailureKind): { title: string; message: string } {
  const who = SERVICE_LABEL[service];
  switch (kind) {
    case 'timeout':
      return { title: `${who} did not respond`, message: `${who} took too long to respond. Nothing has been decided about this customer - try again.` };
    case 'unavailable':
      return { title: `${who} is unavailable`, message: `${who} is not available right now. The check has not been completed - try again shortly.` };
    case 'network':
      return { title: 'Connection Problem', message: 'The connection was lost before the check could finish. Check the connection and try again.' };
    case 'api':
      return { title: `${who} returned an error`, message: `${who} could not process the request. The check has not been completed - try again.` };
    case 'partial':
      return { title: `${who} returned incomplete information`, message: `${who} answered with incomplete details, so the result cannot be relied on. Try again.` };
    case 'expired':
      return { title: 'Validation Has Expired', message: 'This validation is no longer current. Validate again to continue.' };
    case 'interrupted':
      return { title: 'Validation Was Interrupted', message: 'The check was interrupted before it finished. Try again.' };
    default:
      return { title: 'Something Went Wrong', message: 'An unexpected problem stopped the check. Nothing has been decided - try again.' };
  }
}

/** A short reference an agent can quote when escalating. Derived from the failure, stable per service+kind+minute. */
export function failureReference(service: ServiceName, kind: FailureKind): string {
  const stamp = new Date().toISOString().slice(11, 16).replace(':', '');
  return `VAL-${service.slice(0, 3).toUpperCase()}-${kind.slice(0, 3).toUpperCase()}-${stamp}`;
}

// --------------------------------------------------------------- fault injection

interface Fault {
  kind: FaultKind;
  /** Calls left that will fail (or return duplicates) before the service recovers. */
  remaining: number;
}

interface FaultState {
  faults: Partial<Record<ServiceName, Fault>>;
  arm: (service: ServiceName, kind: FaultKind, remaining: number) => void;
  clear: () => void;
}

export const useServiceFaults = create<FaultState>((set) => ({
  faults: {},
  arm: (service, kind, remaining) => set((s) => ({ faults: { ...s.faults, [service]: { kind, remaining } } })),
  clear: () => set({ faults: {} }),
}));

/** Consumes one use of a duplicate fault for `service`, if one is armed. */
export function takeDuplicateFault(service: ServiceName): boolean {
  const f = useServiceFaults.getState().faults[service];
  if (!f || f.kind !== 'duplicate' || f.remaining <= 0) return false;
  useServiceFaults.setState((s) => ({ faults: { ...s.faults, [service]: { ...f, remaining: f.remaining - 1 } } }));
  return true;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs one call to a system, converting EVERY way it can fail into a ServiceError.
 * Callers catch ServiceError and keep their validation unresolved; they never
 * catch it to "assume" a result.
 */
export async function callService<T>(service: ServiceName, fn: () => Promise<T>, timeoutMs = CALL_TIMEOUT_MS): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new ServiceError(service, 'network');

  const fault = useServiceFaults.getState().faults[service];
  if (fault && fault.kind !== 'duplicate' && fault.remaining > 0) {
    useServiceFaults.setState((s) => ({ faults: { ...s.faults, [service]: { ...fault, remaining: fault.remaining - 1 } } }));
    await sleep(fault.kind === 'timeout' ? 1500 : 600);
    throw new ServiceError(service, fault.kind as FailureKind, fault.kind !== 'expired');
  }

  try {
    return await Promise.race([
      fn(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new ServiceError(service, 'timeout')), timeoutMs)),
    ]);
  } catch (err) {
    if (err instanceof ServiceError) throw err;
    // fetch() rejects with a TypeError on a dropped connection.
    if (err instanceof TypeError) throw new ServiceError(service, 'network');
    throw new ServiceError(service, 'unexpected');
  }
}
