import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applyCrossSalesDecision, useCustomerBenefits, useJourneySession } from '../../../capabilities';
import type { CrossSalesValue } from '../../../capabilities';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { HOME_WIZARD_ID_BY_FLOW, WIZARD_ID_BY_FLOW } from '../newConnectionModel';
import type { ConnectionJourney, NewConnectionFlow, Product, ConfirmedOrder } from '../newConnectionModel';
import { isPlanOfferedTo } from '../../../components/patterns/postpaidPlanModel';

// New Connection's journey state: the shared journey session (customer lock, draft, confirmed order) under its own
// wizard id, plus what is specific to this journey - the fetched plan catalogue, the customer's benefits and how an
// accepted offer is applied.
export function useNewConnectionJourney(flow: NewConnectionFlow, journey: ConnectionJourney = 'connection') {
  const { customerId: existingCustomerId } = useParams<{ customerId: string }>();
  // The Existing flow's draft belongs to ONE customer: keyed by the customer id, so a draft left by another
  // customer's journey (same browser session) can never carry its applicant name, identity or eligibility into this one.
  const ids = journey === 'home' ? HOME_WIZARD_ID_BY_FLOW : WIZARD_ID_BY_FLOW;
  const WIZARD_ID = flow === 'existing' && existingCustomerId ? `${ids.existing}-${existingCustomerId}` : ids[flow];
  const session = useJourneySession<ConfirmedOrder>({ wizardId: WIZARD_ID, flow, existingCustomerId });
  // Discounts follow the customer this journey is for: the route's customer, or the one the identity check resolved.
  const benefitsOnRecord = useCustomerBenefits(flow === 'existing' ? existingCustomerId : session.draftCustomerId);
  // A new customer holds no benefit (an existing-customer discount such as Loyalty is not offered); unknown stays unknown only while a customer is being loaded.
  const customerBenefits = session.draftIsNewCustomer ? [] : benefitsOnRecord;
  // Fetched once at the wizard level (2026-09-28) rather than inside a single step, so Number Selection can resolve
  // the selected plan's MRC for BR-115's star-number entitlement without re-fetching the catalogue the plan step reads.
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    mockDataEngine.list<Product>('products').then(setProducts);
  }, []);
  // An accepted offer's plan is the first linked one that is a postpaid plan this customer may have (a nationality promotion is theirs only): a linked
  // prepaid, fixed-line or add-on product, or a plan of another nationality, is never taken as the order's plan.
  const applyCrossSales = (setValue: (field: string, value: unknown) => void, v: CrossSalesValue) =>
    applyCrossSalesDecision(setValue, v, products.filter((p) => p.type === 'Postpaid Plan' && isPlanOfferedTo(p, session.draftNationality)));
  return { ...session, existingCustomerId, WIZARD_ID, customerBenefits, products, applyCrossSales };
}
