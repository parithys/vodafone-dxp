import { create } from 'zustand';
import { buildEligibilityRows } from '../../components/domain/eligibilityRowsModel';
import type { EligibilityRow } from '../../components/domain/eligibilityRowsModel';
import { evaluateEligibilityChecks } from '../../engines/eligibilityEngine';
import type { EligibilityContext } from '../../engines/eligibilityEngine';
import { evaluateRule } from '../../engines/ruleEngine';

const SAMPLE_ASOF = new Date('2026-09-30');

const baseCtx = (): EligibilityContext => ({
  customer: { customerId: 'SAMPLE', idType: 'QID', dob: '1985-03-12', blacklisted: false },
  doc: { documentType: 'QID', documentNumber: 'SAMPLE', expiryDate: '2029-11-30' },
  deals: [],
  outstandingQar: 0,
  lineCapReached: false,
  activeLinesDetail: '',
});

function rowFor(checkId: string, ctx: EligibilityContext): EligibilityRow {
  const c = evaluateEligibilityChecks(ctx, SAMPLE_ASOF).find((x) => x.id === checkId)!;
  return { id: c.id, title: c.label, detail: c.message, tone: c.outcome };
}

export type OutcomeKey = 'Hard Stop' | 'Soft Stop' | 'Approval Routing' | 'Advisory Only';

export function outcomeRows(key: OutcomeKey): EligibilityRow[] {
  const b = baseCtx();
  switch (key) {
    case 'Hard Stop':
      return [
        rowFor('id-validity', { ...b, doc: { ...b.doc, expiryDate: '2025-08-31' } }),
        rowFor('blacklist-security', { ...b, customer: { ...b.customer, blacklisted: true, blacklistCategory: 'security' } }),
        rowFor('deals', { ...b, deals: [{ customerId: 'SAMPLE', blocksNewConnection: true }] }),
      ];
    case 'Soft Stop':
      return [
        rowFor('blacklist-collections', {
          ...b,
          customer: { ...b.customer, blacklisted: true, blacklistCategory: 'collections' },
          outstandingQar: 350,
        }),
      ];
    case 'Approval Routing':
      return [
        rowFor('age', { ...b, customer: { ...b.customer, dob: '2012-05-01' } }),
        rowFor('id-type-routing', { ...b, doc: { ...b.doc, documentType: 'Passport' } }),
        rowFor('active-lines', {
          ...b,
          lineCapReached: true,
          activeLinesDetail: evaluateRule('BR-288', { nationality: 'Indian', activePostpaidLines: 2 }).message ?? '',
        }),
      ];
    case 'Advisory Only':
      return buildEligibilityRows([], true, undefined).filter((r) => r.id === 'hrn');
  }
}

// The footer links and the inline panel live in different parts of the wizard
// (footer vs step body), so the selected outcome is shared through a tiny store.
export const useOutcomePreview = create<{ open: OutcomeKey | null; toggle: (k: OutcomeKey) => void; close: () => void }>((set) => ({
  open: null,
  toggle: (k) => set((st) => ({ open: st.open === k ? null : k })),
  close: () => set({ open: null }),
}));
