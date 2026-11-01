import { POSTPAID_MILESTONES, SUBMITTED_FOR_APPROVAL_MESSAGE, postpaidMilestonesApply } from './milestones';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { usePersonaStore } from '../../stores/personaStore';
import { reachMilestoneOnEvent } from '../../components/patterns/wizard/useJourneyMilestones';
import type { JourneyMilestones } from '../../engines/milestoneEngine';
import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { useEntityStore } from '../../stores/entityStore';
import { useWorkflowStore } from '../../stores/workflowStore';
import { DemoFaultPanel } from '../../components/patterns/DemoFaultPanel';
import type { ConnectionJourney, NewConnectionFlow } from './newConnectionModel';
import { submitNewConnectionOrder } from './submitNewConnectionOrder';
import { useNewConnectionJourney } from './hooks/useNewConnectionJourney';
import { buildConnectionSteps } from './connectionSteps';
import { submitPrepaidOrder } from '../mobile-prepaid/screens/submitPrepaidOrder';
import { submitFixedActivationOrder } from '../fixed-line-fibre/fixedActivation/submitFixedActivationOrder';
import { submitMnpOrder } from '../mnp-fnp-porting/screens/submitMnpOrder';
import { detectDeviceType } from '../../lib/deviceType';
import { homeProductLabel, productLabel } from './products';
import { productStepIndex } from './steps/productChoice';
import type { ConnectionProduct, HomeProduct } from './products';
import {
  ActivationComplete,
  GuidedActivationWizard,
  JourneyCustomerBadge,
  DRAFT_ORDERS_PATH,
  POST_EXIT_DESTINATION,
} from '../../capabilities';
import type { ConfirmedOrder } from '../../capabilities';

// New Connection: ONE continuous journey for every new connection. It begins with Customer Verification - ID scan, MOI
// validation, the eligibility checks common to every product, special discounts - and, once the customer is identified, the
// agent chooses the product by the customer's intent (Product Selection). The journey then continues in this same wizard
// with that product's steps: the draft, the customer lock and the title never change, and nothing exits or restarts.
// `initialProduct` is for an entry point that already names the product (a Prepaid or Fixed Line link): Identification still
// comes first, then the product step passes itself over (Back returns to it).
// Mobile Postpaid Activation's milestones (see milestones.ts); they apply while the product is Postpaid or not yet chosen.
const POSTPAID_MILESTONE_CONFIG: JourneyMilestones = { defs: POSTPAID_MILESTONES, applies: postpaidMilestonesApply };

export function NewConnectionWizard({
  flow = 'new',
  journey = 'connection',
  initialProduct,
  initialValues,
  title,
  fixedFooter,
}: {
  flow?: NewConnectionFlow;
  /** 'home' is New Home Connection (Fibre, Fixed-Line, FWA, 5G Home); the default is New Connection. */
  journey?: ConnectionJourney;
  initialProduct?: ConnectionProduct;
  /** Values the entry point already knows for that product (an FWA link starts Fixed Line with the FWA service type). */
  initialValues?: Record<string, unknown>;
  /** The journey's name when an entry point has its own (MNP Port-In, New Prepaid Activation); New Connection is the default. */
  title?: string;
  /** Back/Continue float at the bottom of the viewport in every journey; pass false to leave them under the step card. */
  fixedFooter?: boolean;
}) {
  const {
    navigate,
    existingCustomerId,
    WIZARD_ID,
    createRecord,
    confirmedOrder,
    setConfirmedOrder,
    isMirrorWindow,
    draftStep,
    heldByAnotherJourney,
    guardedContactChange,
    customerBenefits,
    products,
    applyCrossSales,
  } = useNewConnectionJourney(flow, journey);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  // Fixed for the life of the journey, so steps never change under the agent.
  const [device] = useState(detectDeviceType);
  const product = useWorkflowStore((s) => s.drafts[WIZARD_ID]?.values?.product) as ConnectionProduct | undefined;
  const homeProduct = useWorkflowStore((s) => s.drafts[WIZARD_ID]?.values?.homeProduct) as HomeProduct | undefined;
  const productPreselected = useWorkflowStore((s) => s.drafts[WIZARD_ID]?.values?.productPreselected) as boolean | undefined;
  const draftValues = useWorkflowStore((s) => s.drafts[WIZARD_ID]?.values);

  // Existing Customer: the route names the customer, so their name sits under the title from the start.
  const [routeCustomerName, setRouteCustomerName] = useState<string | undefined>();
  // The route names the customer: if they are in a protected segment this role may not see, the journey is blocked here - before the badge, the scanner's
  // card or any other detail of them is drawn.
  const restricted = useRestrictedCustomers();
  useEffect(() => {
    if (flow !== 'existing' || !existingCustomerId) return;
    let cancelled = false;
    void mockDataEngine.list<{ customerId: string; name: string }>('customers').then((all) => {
      if (!cancelled) setRouteCustomerName(all.find((c) => c.customerId === existingCustomerId && canViewCustomerSegment(usePersonaStore.getState().activePersonaId, (c as { segment?: string }).segment))?.name);
    });
    return () => {
      cancelled = true;
    };
  }, [flow, existingCustomerId]);

  // An entry point that names the product starts the draft with it chosen (an agent's later choice, once identified, is never undone).
  useEffect(() => {
    if (!initialProduct || isMirrorWindow) return;
    const draft = useWorkflowStore.getState().getDraft(WIZARD_ID);
    // A draft that has not identified anyone yet has nothing to lose: the entry point's product replaces a leftover one.
    const identified = Boolean((draft.values.contact as { moiResult?: unknown } | undefined)?.moiResult);
    if (draft.values.product === undefined || (!identified && draft.values.product !== initialProduct)) {
      useWorkflowStore.getState().patchDraft(WIZARD_ID, { set: { product: initialProduct, productPreselected: true, ...(initialProduct === 'mnp' ? { mnpType: 'postpaid' } : {}), ...initialValues } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct, isMirrorWindow, WIZARD_ID]);

  // The page title names the journey the agent chose (New Postpaid, New Fixed Line, New MNP, New Prepaid) from the screen after the choice
  // onward, and stays for the rest of the journey. On the Product Selection page itself, where the choice is still being made, it stays
  // the generic New Connection - unless an entry point already chose the product.
  const onProductStep = journey !== 'home' && (draftStep ?? 0) === productStepIndex(journey, draftValues ?? {});
  const chosenLabel = productLabel(product);
  const journeyTitle =
    journey === 'home' ? 'New Home Connection' : chosenLabel && (!onProductStep || productPreselected) ? chosenLabel : 'New Connection';

  if (heldByAnotherJourney && !isMirrorWindow) return null; // redirecting to the journey that holds the customer

  if (confirmedOrder) {
    return <ActivationComplete order={confirmedOrder} service={confirmedOrder.service} showActivityId={!isMirrorWindow} allowCustomerView={device === 'web'} />;
  }

  const confirm = async (values: Record<string, unknown>): Promise<ConfirmedOrder> => {
    switch (values.product as ConnectionProduct | undefined) {
      case 'prepaid':
        return submitPrepaidOrder(values, { createRecord, updateRecord }, device);
      case 'fixed-line':
        return submitFixedActivationOrder(values, { createRecord, updateRecord });
      case 'mnp':
        return submitMnpOrder(values, { createRecord, updateRecord });
      default:
        return submitNewConnectionOrder(values, { flow, createRecord, updateRecord });
    }
  };

  if (flow === 'existing' && existingCustomerId) {
    if (!restricted.ready) return <div className="p-8 text-fg-2" role="status">Loading…</div>;
    if (restricted.isRestricted(existingCustomerId)) {
      return (
        <div className="p-8 max-w-2xl">
          <RestrictedCustomerNotice backTo="/customer-search" backLabel="Back to Customer Search" />
        </div>
      );
    }
  }

  return (
    <div className="min-h-full flex flex-col" data-device={device}>
      <GuidedActivationWizard
        belowPanel={(draftStep ?? 0) === 0 && !isMirrorWindow ? <DemoFaultPanel /> : undefined}
        wizardId={WIZARD_ID}
        fixedFooter={fixedFooter}
        showSelectedAddonsTray={product === 'postpaid'}
        allowCustomerView={device === 'web'} // a second customer-facing window has no use on a tablet or phone
        title={title ?? journeyTitle}
        draftActionLabel={
          product === 'fixed-line' && homeProduct
            ? `${homeProductLabel(homeProduct)} Activation`.replace('New ', '')
            : product
              ? `${productLabel(product)} Activation`.replace('New ', '')
              : journey === 'home'
                ? 'Home Connection'
                : 'New Connection'
        }
        // Not on Customer Verification (step 0, always the first step): the customer is only confirmed there, so naming them in the header is premature.
        titleAside={
          (draftStep ?? 0) > 0 ? (
            <JourneyCustomerBadge
              wizardId={WIZARD_ID}
              routeCustomer={flow === 'existing' ? { name: routeCustomerName, customerId: existingCustomerId } : undefined}
            />
          ) : undefined
        }
        onAbandon={() => navigate(POST_EXIT_DESTINATION)}
        hideAbandonFrom="payment"
        onSaveExit={() => navigate(DRAFT_ORDERS_PATH)}
        steps={buildConnectionSteps({
          wizardId: WIZARD_ID,
          journey,
          flow,
          existingCustomerId,
          guardedContactChange,
          applyCrossSales,
          navigate,
          createRecord,
          products,
          customerBenefits,
          device,
        })}
        milestones={journey === 'home' ? undefined : POSTPAID_MILESTONE_CONFIG}
        onSubmit={async (values) => {
          const confirmed = await confirm(values);
          // Milestone 5: the order is in. Held for approval is "submitted", never "approved".
          if (values.product === 'postpaid') {
            reachMilestoneOnEvent(WIZARD_ID, POSTPAID_MILESTONE_CONFIG, values, 'submitted', confirmed.pendingApproval ? SUBMITTED_FOR_APPROVAL_MESSAGE : undefined);
          }
          setConfirmedOrder(confirmed);
          // Kept with the customer context so the Activity Final page returns until Close Activity.
          useCustomerContext.getState().patchJourney(WIZARD_ID, { finalOrder: confirmed as unknown as Record<string, unknown> });
        }}
      />
    </div>
  );
}
