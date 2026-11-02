import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityComments } from './ActivityComments';
import { ActivationComplete } from './ActivationComplete';
import { AddonsPicker } from './AddonsSelection';
import { CrossSalesStep } from './CrossSellOffers';
import { CustomerTypeStep } from './CustomerType';
import { EligibilityGateStep, OutcomeActions } from './EligibilityGate';
import { CARD_HIGHLIGHT, CARD_IDLE, CARD_SELECTED, SelectedTick } from './SelectableCard';
import { Drawer } from './SideDrawer';
import { AdditionalDocumentsUpload } from './DocumentUpload';
import { EmptyState } from './EmptyState';
import type { AdditionalDocument } from './DocumentUpload';
import * as mockDataEngine from '../engines/mockDataEngine';
import { starEntitlementQar } from '../engines/postpaidPricing';
import { useNotificationStore } from '../stores/notificationStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { GuidedActivationWizard } from './GuidedActivationWizard';
import { customerQualificationStep } from './CustomerQualification';
import { Input } from '../components/primitives/Input';
import type { WizardStep } from '../components/patterns/wizard/guidedWizardTypes';
import { Button } from '../components/primitives/Button';
import { SegmentedTabs } from '../components/primitives/SegmentedTabs';
import { AppointmentBooking } from './AppointmentBooking';
import { billingStep } from './Billing';
import { CafSignature } from './CafSignature';
import { LineSelection } from './LineSelection';
import { RechargeSelection } from './RechargeSelection';
import type { CustomerLine } from './LineSelection';
import { CheckoutSummary, PrepaidCheckout } from './CheckoutSummary';
import { CustomerIdentification } from './CustomerIdentification';
import { SpecialDiscountsIdentification } from './SpecialDiscountsIdentification';
import { ActualUser } from './ActualUser';
import { numberSelectionStep } from './NumberSelection';
import { Payment } from './Payment';
import { PlanSelection } from './PlanSelection';
import { ServiceAddress } from './ServiceAddress';
import { SimType } from './SimType';
import { Pagination, usePagination } from './Pagination';

// Live previews for the Capability Library page: the REAL capability component with throwaway local state, so what
// the library shows is exactly what every journey renders - a change to the capability shows here and there.

function Identification() {
  const [v, setV] = useState({});
  // As the journeys use it: the first scan comes back unclear, and Retake gives the clear capture.
  return <CustomerIdentification value={v} onChange={setV} verifyThenFetch />;
}
function SpecialDiscountsId() {
  const [v, setV] = useState({});
  return <SpecialDiscountsIdentification value={v} onChange={setV} />;
}
function ActualUserPreview() {
  const [v, setV] = useState({});
  return <ActualUser value={v} onChange={setV} primaryIdNumber="28456701234" primaryCustomerId="CUST-1001" />;
}
// The Number Selection step exactly as the New Postpaid journey renders it (numberSelectionStep with the same options): the title-row Refresh,
// the plan's Star entitlement note and "Show within my entitlement", the Upfront Charge on each Star card, and Waive Off beside Continue. The
// plan is PROD-107, as in the plan previews, so the entitlement is the one a journey on that plan shows.
function Number() {
  const [values, setValues] = useState<Record<string, unknown>>({ productId: 'PROD-107' });
  const [plan, setPlan] = useState<{ mrcQAR: number; starNumberEntitlementQar?: number } | undefined>();
  useEffect(() => {
    void mockDataEngine.list<{ productId: string; mrcQAR: number; starNumberEntitlementQar?: number }>('products').then((all) => setPlan(all.find((p) => p.productId === 'PROD-107')));
  }, []);
  const setValue = (field: string, value: unknown) => setValues((v) => ({ ...v, [field]: value }));
  const step = useMemo(
    () =>
      numberSelectionStep({
        priceField: 'numberPriceQAR',
        refresh: true,
        waiveOff: true,
        plan: () => (plan ? { mrcQar: plan.mrcQAR, starEntitlementQar: starEntitlementQar(plan) } : undefined),
      }),
    [plan]
  );
  const none = () => {};
  const ctx = { values, setValue, goNext: none, goToStepKey: none, saveDraft: async () => {}, saveAndExit: async () => {}, requestAbandon: none };
  const defaultButton = (
    <Button variant="primary" disabled={!step.isValid?.(values)}>
      Continue
    </Button>
  );
  return (
    <div className="space-y-3">
      <div className="flex justify-end">{step.headerAction?.({ values, setValue })}</div>
      {step.render(ctx as Parameters<typeof step.render>[0])}
      <div className="flex justify-end">{step.primaryAction?.({ values, setValue, goNext: none, abandon: none, defaultButton })}</div>
    </div>
  );
}
// The Billing step exactly as the New Postpaid journey renders it - the step's own render and headless resolver, with the values the journey
// would hold by then (an identified customer who already has a billing account, and the address from the Address step) - so the library
// shows the journey's layout, credit limit, VAT document and auto-selection, never a second hand-assembled copy.
const BILLING_SAMPLE: Record<string, unknown> = {
  contact: { idNumber: '28512345678', moiResult: { name: 'Ahmed Abdulla Hassan Al-Sulaiti', nationality: 'Qatari', phone: '55123456', isNewCustomer: false } },
  eligibility: { customerId: 'CUST-1001', nationality: 'Qatari', segment: 'Consumer' },
  address: { streetNo: '12', zone: '45', area: 'Doha', addressLine: '' },
};
function Billing() {
  const [values, setValues] = useState<Record<string, unknown>>(BILLING_SAMPLE);
  const setValue = (field: string, value: unknown) => setValues((v) => ({ ...v, [field]: value }));
  const step = useMemo(() => billingStep(), []);
  const none = () => {};
  const ctx = { values, setValue, goNext: none, goToStepKey: none, saveDraft: async () => {}, saveAndExit: async () => {}, requestAbandon: none };
  return (
    <>
      {step.headless?.({ values, setValue })}
      {step.render(ctx as Parameters<typeof step.render>[0])}
    </>
  );
}
function Address() {
  const [v, setV] = useState({});
  return <ServiceAddress mode="structured" value={v} onChange={setV} />;
}
// One sample per variant, as the journeys render them (a switcher picks which), so the library never shows a layout no page uses.
function Variants<K extends string>({ items, render }: { items: { key: K; label: string }[]; render: (key: K) => ReactNode }) {
  const [active, setActive] = useState<K>(items[0].key);
  return (
    <div className="space-y-4">
      <SegmentedTabs items={items} active={active} onChange={setActive} label="Variant" />
      <div key={active}>{render(active)}</div>
    </div>
  );
}
function PostpaidPlan({ mode }: { mode: 'plan' | 'extras' }) {
  const [p, setP] = useState<string | undefined>('PROD-107');
  const [d, setD] = useState<string | undefined>();
  const [a, setA] = useState<string[]>([]);
  const [limit, setLimit] = useState<number | undefined>();
  return (
    <PlanSelection
      kind="postpaid"
      mode={mode}
      customerContext={{}}
      customerBenefits={undefined}
      selectedProductId={p}
      onSelectProduct={setP}
      onDeselectProduct={() => setP(undefined)}
      discountId={d}
      onSelectDiscount={setD}
      addonIds={a}
      onAddonsChange={setA}
      billLimit={limit}
      onBillLimitChange={(amount) => setLimit(amount)}
    />
  );
}
function PrepaidPlan({ mode }: { mode: 'plan' | 'extras' }) {
  const [p, setP] = useState<string | undefined>();
  const [d, setD] = useState<string | undefined>();
  const [a, setA] = useState<string[]>([]);
  return <PlanSelection kind="prepaid" mode={mode} selectedProductId={p} onSelectProduct={setP} onDeselectProduct={() => setP(undefined)} discountId={d} onSelectDiscount={setD} addonIds={a} onSelectAddons={setA} />;
}
function FixedPlan() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  return <PlanSelection kind="fixed" values={values} setValue={(field, value) => setValues((v) => ({ ...v, [field]: value }))} />;
}
function Plan() {
  return (
    <Variants
      items={[
        { key: 'postpaid', label: 'Postpaid Plan' },
        { key: 'postpaid-extras', label: 'Postpaid Add-Ons' },
        { key: 'prepaid', label: 'Prepaid Pack' },
        { key: 'prepaid-extras', label: 'Prepaid Add-Ons' },
        { key: 'fixed', label: 'Fixed / Fibre' },
      ]}
      render={(k) =>
        k === 'postpaid' ? <PostpaidPlan mode="plan" /> : k === 'postpaid-extras' ? <PostpaidPlan mode="extras" /> : k === 'prepaid' ? <PrepaidPlan mode="plan" /> : k === 'prepaid-extras' ? <PrepaidPlan mode="extras" /> : <FixedPlan />
      }
    />
  );
}
const SAMPLE_ORDER_ROWS = [
  { label: 'Plan', value: 'Postpaid Essential' },
  { label: 'Monthly Charge', value: 'QAR 200 / month' },
  { label: 'Due Today', value: 'QAR 0' },
];
function Caf() {
  const [standard, setStandard] = useState({});
  const [full, setFull] = useState({});
  return (
    <Variants
      items={[
        { key: 'full', label: 'Full (Postpaid Journeys)' },
        { key: 'standard', label: 'Standard' },
      ]}
      render={(k) =>
        k === 'full' ? (
          <CafSignature variant="full" value={full} onChange={setFull} customerName="Sample Customer" orderSummary={SAMPLE_ORDER_ROWS} fullTerms legalFacts={{ hrnAdvanceQar: 0 }} />
        ) : (
          <CafSignature value={standard} onChange={setStandard} customerName="Sample Customer" />
        )
      }
    />
  );
}
const SAMPLE_ELIGIBILITY = {
  pass: true,
  hardStop: false,
  softStop: false,
  checks: [],
  blacklisted: false,
  lineCapExceeded: false,
  requiresHrnAdvance: false,
  defaultCreditLimitQar: 1000,
  customerId: 'CUST-1001',
  idNumber: '28456701234',
} as Parameters<typeof CheckoutSummary>[0]['eligibility'];
function Checkout() {
  return (
    <Variants
      items={[
        { key: 'postpaid', label: 'Postpaid Read-Back' },
        { key: 'prepaid', label: 'Prepaid Cart' },
      ]}
      render={(k) =>
        k === 'postpaid' ? (
          // The same figures the journey's Checkout shows: a Star number over the plan's entitlement, the Red 350 promotion, an eSIM and
          // the default credit limit with the bill limit the agent set.
          <CheckoutSummary
            layout="detailed"
            customerName="Ahmed, Abdulla Hassan, Al-Sulaiti"
            altPhone={undefined}
            productId="PROD-104"
            discountId={undefined}
            addonIds={[]}
            msisdn="+97459990000"
            numberPriceQar={20000}
            eligibility={SAMPLE_ELIGIBILITY}
            billLimit={1000}
            simType={{ simType: 'eSIM', esimIssued: true }}
            onTotalsComputed={() => {}}
            onEdit={() => {}}
          />
        ) : (
          <PrepaidCheckout customerName="Sample Customer" idType="QID" lines={[]} onTotalsComputed={() => {}} onEdit={() => {}} />
        )
      }
    />
  );
}
function Pay() {
  const [v, setV] = useState({});
  // As the journeys mount it, including "Proceed without WinCash" (the agent took physical cash directly), which records the payment as cash.
  return <Payment amountDueQAR={11250} value={v} onChange={setV} onProceedWithout={() => setV({ paid: true, method: 'Cash', handoffStarted: false, declined: false })} />;
}
function Appointment() {
  const [v, setV] = useState({});
  return <AppointmentBooking value={v} onChange={setV} />;
}
function Activity() {
  const [c, setC] = useState('');
  const [ch, setCh] = useState('Appointment');
  return <ActivityComments value={c} onChange={setC} channel={{ value: ch, onChange: setCh, options: ['Appointment', 'Walk-in', 'Call Center'] }} />;
}

function Sim() {
  const [v, setV] = useState({});
  return <SimType value={v} onChange={setV} customerEmail="sample.customer@example.qa" />;
}


// Samples for the capabilities that were "needs a live order": each mounts the REAL capability with throwaway local state
// and test data (CUST-1001, PROD-107 ...), so a change to the capability shows here and in every journey.
function Addons() {
  const [ids, setIds] = useState<string[]>([]);
  return <AddonsPicker selectedIds={ids} onChange={setIds} layout="rows" eligibilityContext={{ planId: 'PROD-107' }} emptyMessage="No add-ons available for this plan" />;
}
function CustomerType() {
  const [v, setV] = useState<Parameters<typeof CustomerTypeStep>[0]['value']>({});
  return <CustomerTypeStep value={v} onChange={setV} />;
}
function CrossSell() {
  const [v, setV] = useState<Parameters<typeof CrossSalesStep>[0]['value']>({});
  return <CrossSalesStep customerId="CUST-1001" value={v} onChange={setV} onHandOff={() => {}} journey="new-postpaid" />;
}
// Each scenario is a test customer whose result is that outcome. The gate, the outcome the footer carries (Continue, Request
// Approval, Continue Prepaid / Proceed to Payment, Abandon Order) are the ones New Connection uses.
const ELIGIBILITY_SCENARIOS = [
  { key: 'clear', label: 'Clear', idNumber: '28456701234' },
  { key: 'approval', label: 'Approval Routing', idNumber: 'P0998812' },
  { key: 'soft', label: 'Soft Stop', idNumber: '29011122233' },
  { key: 'hard', label: 'Hard Stop', idNumber: 'DIP-QA-004521' },
];
function EligibilityScenario({ idNumber }: { idNumber: string }) {
  const [r, setR] = useState<Parameters<typeof EligibilityGateStep>[0]['result']>(undefined);
  return (
    <div className="space-y-4">
      <EligibilityGateStep idNumber={idNumber} result={r} onResult={setR} announcePass={false} scope="product" />
      <div className="row justify-end divider-top pt-4">
        <OutcomeActions eligibility={r} defaultButton={<Button variant="primary">Continue</Button>} />
      </div>
    </div>
  );
}
function Eligibility() {
  return (
    <Variants
      items={ELIGIBILITY_SCENARIOS.map((x) => ({ key: x.key, label: x.label }))}
      render={(k) => <EligibilityScenario idNumber={ELIGIBILITY_SCENARIOS.find((x) => x.key === k)!.idNumber} />}
    />
  );
}
function Cards() {
  const [on, setOn] = useState<'a' | 'b' | 'c'>('a');
  const card = (k: 'a' | 'b' | 'c', title: string, style: string, note: string) => (
    <button type="button" aria-pressed={on === k} onClick={() => setOn(k)} className={`relative card-frame p-4 text-left ${on === k ? CARD_SELECTED : style}`}>
      {on === k && <SelectedTick />}
      <span className="block text-fg font-semibold">{title}</span>
      <span className="block caption-secondary">{note}</span>
    </button>
  );
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {card('a', 'Idle card', CARD_IDLE, 'Click to select - it takes the selected style.')}
      {card('b', 'Another idle card', CARD_IDLE, 'Only one is selected at a time.')}
      {card('c', 'Highlighted card', CARD_HIGHLIGHT, 'The app singles this one out (Popular, Recommended).')}
    </div>
  );
}
function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sample drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Sample drawer" footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Done</Button>
          </>
        }>
        <p className="text-secondary">Side drawer: reference material or a short form, read beside the page instead of covering it.</p>
      </Drawer>
    </>
  );
}
function ToastDemo() {
  const push = useNotificationStore((s) => s.pushToast);
  return (
    <div className="wrap-loose gap-2">
      {(['success', 'info', 'warning', 'error'] as const).map((k) => (
        <Button key={k} variant="secondary" onClick={() => push(k, `Sample ${k} notification`, { detail: 'Raised from the Capability Library.' })}>
          Show {k}
        </Button>
      ))}
    </div>
  );
}
// The real wizard shell on three sample steps (step list, running Summary panel, Back / Continue footer). Its draft is cleared on
// the way in and out, and leaving is never blocked, so nothing is left behind.
const SAMPLE_WIZARD_ID = 'capability-library-sample';
const SAMPLE_PLANS = [
  { id: 'essential', name: 'Postpaid Essential', note: 'QAR 115 / month' },
  { id: 'plus', name: 'Postpaid Plus', note: 'QAR 200 / month' },
];
function Wizard() {
  const clearDraft = useWorkflowStore((s) => s.clearDraft);
  const push = useNotificationStore((s) => s.pushToast);
  useEffect(() => {
    clearDraft(SAMPLE_WIZARD_ID);
    return () => clearDraft(SAMPLE_WIZARD_ID);
  }, [clearDraft]);
  const steps: WizardStep[] = [
    {
      key: 'identity',
      label: 'Customer Verification',
      render: ({ values, setValue }) => (
        <div className="grid-2-up">
          <Input label="ID Number" value={(values.idNumber as string) ?? ''} onChange={(e) => setValue('idNumber', e.target.value)} />
          <Input label="Full Name" value={(values.name as string) ?? ''} onChange={(e) => setValue('name', e.target.value)} />
        </div>
      ),
      isValid: (values) => Boolean(values.idNumber && values.name),
      summary: [
        { key: 'idNumber', label: 'ID Number', type: 'text', sensitive: true, value: (v) => v.idNumber },
        { key: 'name', label: 'Name', type: 'text', value: (v) => v.name },
      ],
    },
    {
      key: 'plan',
      label: 'Offers & Plans',
      render: ({ values, setValue }) => (
        <div className="grid-2-up-sm">
          {SAMPLE_PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={values.plan === p.id}
              onClick={() => setValue('plan', p.id)}
              className={`relative card-frame p-4 text-left ${values.plan === p.id ? CARD_SELECTED : CARD_IDLE}`}
            >
              {values.plan === p.id && <SelectedTick />}
              <span className="block text-fg font-semibold">{p.name}</span>
              <span className="block caption-secondary">{p.note}</span>
            </button>
          ))}
        </div>
      ),
      isValid: (values) => Boolean(values.plan),
      summary: [{ key: 'plan', label: 'Plan', type: 'text', value: (v) => SAMPLE_PLANS.find((p) => p.id === v.plan)?.name }],
    },
    {
      key: 'review',
      label: 'Checkout',
      render: () => <p className="text-secondary">The last step: Continue becomes Save &amp; Finish and submits the journey.</p>,
    },
  ];
  return (
    <GuidedActivationWizard
      wizardId={SAMPLE_WIZARD_ID}
      fixedFooter={false}
      title="Sample Journey"
      confirmLeave={false}
      steps={steps}
      onSubmit={() => {
        push('success', 'Sample journey submitted.');
        clearDraft(SAMPLE_WIZARD_ID);
      }}
    />
  );
}
// Customer Qualification on the real wizard as a one-step journey, so its outcomes and footer actions (Continue, Proceed to Approval,
// the hard-stop message) work as they do in New Connection. A scan or a typed ID of a test customer runs the checks.
const QUALIFICATION_WIZARD_ID = 'capability-library-qualification';
function Qualification() {
  const clearDraft = useWorkflowStore((s) => s.clearDraft);
  const push = useNotificationStore((s) => s.pushToast);
  useEffect(() => {
    clearDraft(QUALIFICATION_WIZARD_ID);
    return () => clearDraft(QUALIFICATION_WIZARD_ID);
  }, [clearDraft]);
  return (
    <GuidedActivationWizard
      wizardId={QUALIFICATION_WIZARD_ID}
      fixedFooter={false}
      title="Sample Journey"
      confirmLeave={false}
      steps={[customerQualificationStep({ flow: 'new', existingCustomerId: undefined, guardedContactChange: (v, setValue) => setValue('contact', v), productAgnostic: true })]}
      onSubmit={() => {
        push('success', 'Customer qualified (sample journey).');
        clearDraft(QUALIFICATION_WIZARD_ID);
      }}
    />
  );
}
// CUST-1001 holds postpaid and prepaid lines; the switcher is the lineType a journey passes.
function Recharges() {
  const [id, setId] = useState<string | undefined>();
  return (
    <Variants
      items={[
        { key: 'QID', label: 'QID Waived At 20' },
        { key: 'Passport', label: 'Passport Waived At 35' },
      ]}
      render={(k) => <RechargeSelection value={id} onChange={setId} idType={k} />}
    />
  );
}
function Lines() {
  const [line, setLine] = useState<CustomerLine | undefined>();
  return (
    <Variants
      items={[
        { key: 'all', label: 'All Mobile Lines' },
        { key: 'postpaid', label: 'Postpaid Lines' },
        { key: 'prepaid', label: 'Prepaid Lines' },
      ]}
      render={(k) => <LineSelection customerId="CUST-1001" lineType={k === 'all' ? undefined : k} value={line} onChange={setLine} />}
    />
  );
}
function Complete() {
  return (
    <ActivationComplete
      order={{ orderId: 'ORD-SAMPLE', activityId: 'ACT-SAMPLE', pendingApproval: false, customerName: 'Sample Customer', msisdn: '+974 55550100', planName: 'Postpaid Essential', simType: 'eSIM', dueTodayQar: 0, monthlyRecurringQar: 115 }}
      showActivityId
    />
  );
}

function DocumentUploadDemo() {
  const [docs, setDocs] = useState<AdditionalDocument[]>([]);
  return <AdditionalDocumentsUpload documents={docs} onChange={setDocs} labelOptions={['QID', 'Passport', 'Supplementary Form', 'Other']} whiteBackground />;
}

function PaginationDemo() {
  const rows = Array.from({ length: 47 }, (_, i) => `Row ${i + 1}`);
  const paging = usePagination(rows, 10);
  return (
    <div className="space-y-3">
      <ul className="divide-y divide-border-soft card card-inherit-fill">
        {paging.slice.map((r) => (
          <li key={r} className="px-4 py-2 body-text">
            {r}
          </li>
        ))}
      </ul>
      <Pagination page={paging.page} total={paging.total} pageSize={paging.pageSize} onPage={paging.setPage} />
    </div>
  );
}

export const CAPABILITY_PREVIEWS: Record<string, () => ReactNode> = {
  'customer-identification': () => <Identification />,
  'special-discounts-identification': () => <SpecialDiscountsId />,
  'actual-user': () => <ActualUserPreview />,
  'number-selection': () => <Number />,
  billing: () => <Billing />,
  'service-address': () => <Address />,
  'plan-selection': () => <Plan />,
  'caf-signature': () => <Caf />,
  'checkout-summary': () => <Checkout />,
  payment: () => <Pay />,
  'appointment-booking': () => <Appointment />,
  'activity-comments': () => <Activity />,
  'sim-type': () => <Sim />,
  'addons-selection': () => <Addons />,
  'customer-type': () => <CustomerType />,
  'cross-sell-offers': () => <CrossSell />,
  'eligibility-gate': () => <Eligibility />,
  'selectable-card-styling': () => <Cards />,
  pagination: () => <PaginationDemo />,
  'empty-state': () => (
    <div className="space-y-6">
      <EmptyState title="No Reserved Numbers" message="No numbers have been reserved for this customer." />
      <EmptyState compact message="No orders match your search or filters." action={<span className="text-link">Clear Filters</span>} />
    </div>
  ),
  'document-upload': () => <DocumentUploadDemo />,
  'side-drawer': () => <DrawerDemo />,
  toasts: () => <ToastDemo />,
  'activation-complete': () => <Complete />,
  'guided-activation-wizard': () => <Wizard />,
  'customer-qualification': () => <Qualification />,
  'line-selection': () => <Lines />,
  'recharge-selection': () => <Recharges />,
};
