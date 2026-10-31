// Simulates a backend entirely in the browser (frontend-architecture.md §7).
// Each mock-data/*.json file is keyed by its own filename (e.g. "leads" -> leads.json).
import { appPath } from '../lib/basePath';

const SEED_FILES = [
  'accounts', 'account-level-products', 'addons-discounts', 'addresses', 'adjustments',
  'apn-records', 'appointments', 'audit-trail', 'authorised-contacts', 'bell-notifications', 'big-data-credit-risk',
  'billing-buckets', 'billing-profiles', 'bills', 'bulk-activation-orders', 'bulk-notes',
  'bulk-sms-orders', 'caf-forms', 'call-detail-records', 'campaigns',
  'catalog-change-requests', 'catalog-items', 'channel-performance',
  'commitment-penalties', 'consumer-deposits', 'contacts-b2b2c', 'cpe-devices', 'credit-limits',
  'cross-sales-offers', 'customer-activities', 'customer-communications', 'customer-contacts',
  'customers', 'deposit-bundles', 'digital-engagement', 'customer-overview-extras', 'customer-overview-demo', 'telesales-demo-catalog', 'device-installments',
  'donor-details', 'enterprise-accounts', 'enterprise-form-types', 'enterprise-invoices',
  'fnp-portin-orders', 'future-dated-orders', 'gigahome-acceptance-forms', 'gigahome-osntv-subscriptions',
  'home-move-cases', 'identity-documents', 'ims-site-zsb', 'in-platform-balances', 'installation-checklists',
  'installed-assets',
  'inventory-transfers', 'iot-sim-devices', 'iptv-stb-bundles', 'kid-address-records', 'kid-service-points',
  'leads', 'line-items', 'nas-records', 'mnp-application-forms', 'mnp-portin-orders', 'multi-sim-lines', 'numbers',
  'order-approvals', 'orders', 'osb-notifications', 'park-my-number-plans', 'passport-to-qid-updates',
  'payments', 'port-out-tickets', 'price-exceptions', 'products', 'qtickets', 'reject-reasons',
  'rfs-records',
  'service-usage', 'sim-swap-orders', 'sims', 'smart-devices', 'sms-templates', 'star-number-tiers',
  'statements-of-account', 'tasks', 'technician-resources', 'tnc-summary-bullets', 'tnc-full-text', 'qatar-areas', 'ton-cases', 'trouble-tickets',
  'uim-inventory-records', 'users-agents', 'vodafone-ids', 'volumetric-discounts', 'wfm-activities',
] as const;

/** Where a mock-data file is served from. */
export const mockDataUrl = (name: string): string => appPath(`/mock-data/${name}.json`);

export type EntityKind = (typeof SEED_FILES)[number];

type Store = Record<string, Record<string, unknown>[]>;

let store: Store | null = null;
let seeding: Promise<Store> | null = null;

// ---- Session journal -------------------------------------------------------------------------------------------------
// Everything created, changed or removed during the browser session is also written to a small journal in
// sessionStorage and replayed on top of the seed files at the next boot. That is what lets an order created as one role
// still be there after a page reload or after signing out and back in as another role (to approve it, say).
//
// The key deliberately does NOT start with "vfq-": sign-out clears every "vfq-" key (auth, persona, journeys ...) and
// reloads, which is right for the signed-in state but would throw away the records the demo is being driven with. The
// journal lives as long as the browser tab; closing the tab (or clearJournal) gives the next session the plain seeds.
const JOURNAL_KEY = 'dxp-session-records';

type JournalEntry =
  | { op: 'create'; kind: string; field: string; record: Record<string, unknown> }
  | { op: 'update'; kind: string; field: string; id: string; patch: Record<string, unknown> }
  | { op: 'remove'; kind: string; field: string; id: string };

function readJournal(): JournalEntry[] {
  try {
    const raw = sessionStorage.getItem(JOURNAL_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function writeJournal(entries: JournalEntry[]): void {
  try {
    sessionStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked: the record stays in memory for this page load, as it always did.
  }
}

/** Records one change, folding it into an earlier entry for the same record so the journal stays as small as the data. */
function journal(entry: JournalEntry): void {
  const entries = readJournal();
  const same = (e: JournalEntry) => e.kind === entry.kind && (e.op === 'create' ? e.record[e.field] : e.id) === (entry.op === 'create' ? entry.record[entry.field] : entry.id);
  if (entry.op === 'update') {
    const owner = entries.find((e) => same(e) && (e.op === 'create' || e.op === 'update'));
    if (owner?.op === 'create') owner.record = { ...owner.record, ...entry.patch };
    else if (owner?.op === 'update') owner.patch = { ...owner.patch, ...entry.patch };
    else entries.push(entry);
  } else if (entry.op === 'remove') {
    const created = entries.some((e) => e.op === 'create' && same(e));
    // Removing something this session created leaves no trace; removing a seeded record is remembered.
    const rest = entries.filter((e) => !same(e));
    writeJournal(created ? rest : [...rest, entry]);
    return;
  } else {
    entries.push(entry);
  }
  writeJournal(entries);
}

function applyJournal(target: Store): void {
  for (const e of readJournal()) {
    const list = (target[e.kind] ??= []);
    if (e.op === 'create') {
      if (!list.some((r) => r[e.field] === e.record[e.field])) list.push(e.record);
    } else if (e.op === 'update') {
      const i = list.findIndex((r) => r[e.field] === e.id);
      if (i >= 0) list[i] = { ...list[i], ...e.patch };
    } else {
      const i = list.findIndex((r) => r[e.field] === e.id);
      if (i >= 0) list.splice(i, 1);
    }
  }
}

/** Drops this session's created / changed records, so the next boot shows the plain seed data. */
export function clearJournal(): void {
  try {
    sessionStorage.removeItem(JOURNAL_KEY);
  } catch {
    // nothing to clear
  }
}

const LATENCY_MIN = 200;
const LATENCY_MAX = 600;

function latency<T>(value: T): Promise<T> {
  const ms = LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function idFieldFor(records: Record<string, unknown>[]): string {
  if (!records.length) return 'id';
  const keys = Object.keys(records[0]);
  return keys.find((k) => /Id$/.test(k)) ?? keys[0];
}

export async function seedMockData(): Promise<Store> {
  if (store) return store;
  if (seeding) return seeding;
  seeding = (async (): Promise<Store> => {
    const entries = await Promise.all(
      SEED_FILES.map(async (name) => {
        // A missing or malformed file is an error, not an empty list: screens would otherwise show "no records"
        // for data that failed to load. The caller (app boot) shows the failure.
        const res = await fetch(mockDataUrl(name));
        if (!res.ok) throw new Error(`Could not load ${name}.json (HTTP ${res.status})`);
        const data = (await res.json()) as Record<string, unknown>[];
        return [name, data] as const;
      })
    );
    const seeded: Store = Object.fromEntries(entries);
    applyJournal(seeded);
    store = seeded;
    return seeded;
  })();
  // A failed seed must not be cached: the next call retries instead of replaying the same rejection.
  seeding.catch(() => {
    seeding = null;
  });
  return seeding;
}

function requireStore(): Store {
  if (!store) throw new Error('Mock data not seeded yet - call seedMockData() during app boot.');
  return store;
}

export async function list<T = Record<string, unknown>>(kind: EntityKind): Promise<T[]> {
  // Waits for the seed rather than throwing when a screen asks before boot has finished.
  if (!store) await seedMockData();
  // A copy, not the engine's own array: a caller (the entity store) that caches the list and ALSO sees create() push into
  // the engine's array would otherwise show every created record twice.
  return latency([...(requireStore()[kind] ?? [])] as T[]);
}

export async function get<T = Record<string, unknown>>(kind: EntityKind, id: string, idField?: string): Promise<T | undefined> {
  if (!store) await seedMockData();
  const records = requireStore()[kind] ?? [];
  const field = idField ?? idFieldFor(records);
  return latency(records.find((r) => r[field] === id) as T | undefined);
}

export async function create<T extends Record<string, unknown>>(kind: EntityKind, record: T): Promise<T> {
  const s = requireStore();
  if (!s[kind]) s[kind] = [];
  s[kind].push(record);
  journal({ op: 'create', kind, field: idFieldFor(s[kind]), record });
  return latency(record);
}

export async function update<T extends Record<string, unknown>>(
  kind: EntityKind,
  id: string,
  patch: Partial<T>,
  idField?: string
): Promise<T | undefined> {
  const records = requireStore()[kind] ?? [];
  // The caller's own id field when it names one. Guessing (the first key ending in "Id") is only the fallback: in several kinds that key is
  // a foreign key (accountId, contactId), so an update by the record's real id found nothing and was silently lost.
  const field = idField ?? idFieldFor(records);
  const idx = records.findIndex((r) => r[field] === id);
  if (idx === -1) return latency(undefined);
  records[idx] = { ...records[idx], ...patch };
  journal({ op: 'update', kind, field, id, patch: patch as Record<string, unknown> });
  return latency(records[idx] as T);
}

/**
 * Delete a record outright. Added 2026-09-27 for "Abandon Order", which
 * discards a DRAFT order the agent has decided not to place.
 *
 * Deliberately a real delete and not a status flip: a draft was never an order
 * anyone placed, so leaving an 'Abandoned' row behind would put records in the
 * order list for activations that never happened. A SUBMITTED order should
 * still be cancelled via its own lifecycle (see `transition`) rather than
 * removed - this is for the pre-submission draft only.
 *
 * Returns whether anything was removed, so a caller can tell a real deletion
 * from a no-op on an id that had already gone.
 */
export async function remove(kind: EntityKind, id: string, idField?: string): Promise<boolean> {
  const records = requireStore()[kind] ?? [];
  const field = idField ?? idFieldFor(records);
  const idx = records.findIndex((r) => r[field] === id);
  if (idx === -1) return latency(false);
  records.splice(idx, 1);
  journal({ op: 'remove', kind, field, id });
  return latency(true);
}

// Validates an entity's lifecycle transition against domain-model.md's evidenced
// state machine (frontend-architecture.md §7) rather than allowing any-to-any state change.
export function transition(
  allowedStates: string[][],
  currentState: string,
  toState: string
): { ok: boolean; reason?: string } {
  const legal = allowedStates.some(([from, to]) => from === currentState && to === toState);
  if (!legal) {
    return { ok: false, reason: `Illegal transition: ${currentState} -> ${toState}` };
  }
  return { ok: true };
}
