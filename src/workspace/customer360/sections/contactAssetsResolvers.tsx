import type { ReactNode } from 'react';
import { isFixedLineOffer } from '../../../capabilities';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { formatAmountAny } from '../../../lib/format';

type Resolver = (data: Customer360Data) => ReactNode | undefined;

/** customer360-fields.json's Contact/Assets Information topic. Everything
 * that traces to `data.crossSalesOffers` will render empty for every demo
 * customer - that join is real code over real code over real records, but
 * cross-sales-offers.json's contactId (CONT-3001) matches no
 * contactRecordId in this corpus (customer360Engine.ts's own note on the
 * join). Not a bug here - an honest reflection of the source data. */
export const contactAssetsResolvers: Record<string, Resolver> = {
  'CVM/targeted offers': (data) =>
    data.crossSalesOffers.length > 0 ? data.crossSalesOffers.map((o) => String(o.offerName)).join(', ') : undefined,
  'Eligible Discount': (data) => {
    const withDiscount = data.crossSalesOffers.find((o) => Number(o.addOnMonthly ?? 0) > 0);
    return withDiscount ? `${formatAmountAny(String(withDiscount.addOnMonthly))} QAR/mo` : undefined;
  },
  'Next Best Offer': (data) => {
    const top = [...data.crossSalesOffers].sort((a, b) => String(a.priorityCode ?? '').localeCompare(String(b.priorityCode ?? '')))[0];
    return top ? String(top.offerName) : undefined;
  },
  'DOI Eligibility': (data) => data.deviceInstallments[0]?.eligibilityListMembership as string | undefined,
  'Fixed Line Offer': (data) => {
    const fixed = data.crossSalesOffers.find(isFixedLineOffer);
    return fixed ? String(fixed.offerName) : undefined;
  },
};
