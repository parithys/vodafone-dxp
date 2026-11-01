import { Fragment, useState } from 'react';
import { useBlocker, useLocation } from 'react-router-dom';
import { draftHasProgress, useWorkflowStore } from '../../stores/workflowStore';
import { AbandonDialog, LeaveJourneyDialog, SaveExitDialog } from '../../components/patterns/wizard/WizardDialogs';
import { CustomerMirrorPanel } from '../../components/patterns/wizard/CustomerMirrorPanel';
import { WizardTitleBand } from '../../components/patterns/wizard/WizardTitleBand';
import { SelectedAddonsHeader } from '../../components/patterns/wizard/SelectedAddonsHeader';
import { WizardStepHeader } from '../../components/patterns/wizard/WizardStepHeader';
import { WizardFooter } from '../../components/patterns/wizard/WizardFooter';
import { WizardStepPanel } from '../../components/patterns/wizard/WizardStepPanel';
import { StepSummaryPanel } from '../../components/patterns/wizard/StepSummaryPanel';
import { useEnterToSubmit } from '../../hooks/useEnterToSubmit';
import { useMinWidth } from '../../hooks/useMinWidth';
import { useJourneyStartResume } from '../../components/patterns/wizard/useJourneyStartResume';
import { useDraftStepSync } from '../../components/patterns/wizard/useDraftStepSync';
import { useCustomerViewShare } from '../../components/patterns/wizard/useCustomerViewShare';
import { useMirrorChannel } from '../../components/patterns/wizard/useMirrorChannel';
import { useStepFocus } from '../../components/patterns/wizard/useStepFocus';
import { useWizardStepNavigation } from '../../components/patterns/wizard/useWizardStepNavigation';
import { useJourneyMilestones } from '../../components/patterns/wizard/useJourneyMilestones';
import { useWizardDraftActions } from '../../components/patterns/wizard/useWizardDraftActions';
import { deriveWizardNav } from '../../components/patterns/wizard/wizardNavigation';
import type { GuidedActivationWizardProps } from '../../components/patterns/wizard/guidedWizardTypes';

// Pattern 1: Guided Multi-Step Wizard - the single most-repeated shape in the
// entire corpus (SCR-043–050, SCR-121–134, SCR-152–162, SCR-190–192, etc.).
// Left-hand step list (numbered, with a secondary description line) + a
// single content panel for the active step's fields and Back/Continue
// footer - matches the reference layout supplied for this pattern.
export function GuidedActivationWizard({
  wizardId,
  title,
  titleAside,
  belowPanel,
  showSelectedAddonsTray = false,
  fixedFooter = true,
  allowCustomerView,
  draftActionLabel,
  steps,
  onSubmit,
  onAbandon,
  hideAbandonFrom,
  onSaveExit,
  hideTitleBand = false,
  confirmLeave = true,
  milestones,
}: GuidedActivationWizardProps) {
  const draft = useWorkflowStore((s) => s.getDraft(wizardId));
  const setFieldValue = useWorkflowStore((s) => s.setFieldValue);
  const location = useLocation();

  useJourneyStartResume(wizardId, steps);

  // The customer's pop-up (?mirror=1) - see useCustomerViewShare.
  const isMirror = Boolean(allowCustomerView && new URLSearchParams(location.search).get('mirror') === '1');
  const draftOrderId = draft.draftOrderId;
  useDraftStepSync(isMirror, draftOrderId, draft, steps);

  const { activeSteps, currentIndex, maxReached, currentStep, canProceed, isCustomerFacing, isLocked, abandonHidden } =
    deriveWizardNav(steps, draft, hideAbandonFrom);

  const { popupBlocked, viewOpen, shareAnnouncement, toggleCustomerView } = useCustomerViewShare(currentStep?.key);
  const mirrorCh = useMirrorChannel(allowCustomerView, isMirror, wizardId);
  const { stepHeadingRef, stepPanelRef } = useStepFocus(currentIndex);

  const setValue = (field: string, value: unknown) => setFieldValue(wizardId, field, value);

  // Milestones are still reached and recorded with the draft; the Summary no longer flags a step for one (see summaryProps).
  useJourneyMilestones({
    journeyId: draftOrderId ? `${wizardId}/${draftOrderId}` : wizardId,
    config: milestones,
    values: draft.values,
    setValue,
    activeSteps,
    currentIndex,
    disabled: isMirror,
  });


  const {
    setAbandonOpen,
    abandonOpen,
    exitOpen,
    setExitOpen,
    activityComments,
    setActivityComments,
    abandonNoKeep,
    setAbandonNoKeep,
    abandonOrder,
    saveAndExit,
    saveDraft,
    requestAbandon,
    abandonOnLeave,
    savePage,
    discardSavedDraft,
  } = useWizardDraftActions({
    wizardId,
    title,
    draftActionLabel,
    isMirror,
    draftOrderId,
    values: draft.values,
    activeSteps,
    currentIndex,
    onAbandon,
    onSaveExit,
  });

  const { submitting, goNext, goBack, goToStep, goToStepKey } = useWizardStepNavigation({
    wizardId,
    onSubmit,
    isMirror,
    activeSteps,
    currentIndex,
    maxReached,
    values: draft.values,
    savePage,
    discardSavedDraft,
    draftOrderId,
  });

  // Leaving a journey that has progress asks first (Save as Draft / Abandon Journey) instead of navigating at once. Any
  // route change counts - a menu link, Back, a link in the page. Finishing, Save as Draft and Abandon Order clear the draft
  // before they navigate, so they pass straight through. The customer-view pop-up never blocks.
  const [leaveBusy, setLeaveBusy] = useState(false);
  const isDesktop = useMinWidth(1024);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!confirmLeave || isMirror || currentLocation.pathname === nextLocation.pathname) return false;
    return draftHasProgress(useWorkflowStore.getState().drafts[wizardId]);
  });
  const leaveModal = (
    <LeaveJourneyDialog
      open={blocker.state === 'blocked'}
      busy={leaveBusy}
      onStay={() => blocker.reset?.()}
      onSave={() => {
        setLeaveBusy(true);
        void saveAndExit(undefined, { stay: true }).then(() => {
          setLeaveBusy(false);
          blocker.proceed?.();
        });
      }}
      onAbandon={() => {
        setLeaveBusy(true);
        void abandonOnLeave().then(() => {
          setLeaveBusy(false);
          blocker.proceed?.();
        });
      }}
    />
  );

  const handleStepKeyDown = useEnterToSubmit(canProceed && !submitting, goNext);

  // The abandon confirmation, shared by the normal layout and the customer-facing one.
  const abandonModal = (
    <AbandonDialog
      open={abandonOpen}
      noKeep={abandonNoKeep}
      comments={activityComments}
      onCommentsChange={setActivityComments}
      onClose={() => setAbandonOpen(false)}
      onConfirm={() => void abandonOrder()}
    />
  );

  // Save as Draft: confirms with an optional comment, then saves the draft and records the activity.
  const exitModal = (
    <SaveExitDialog
      open={exitOpen}
      comments={activityComments}
      onCommentsChange={setActivityComments}
      onClose={() => setExitOpen(false)}
      onConfirm={() => {
        setExitOpen(false);
        void saveAndExit(activityComments).then(() => setActivityComments(''));
      }}
    />
  );

  // Customer-facing: ONLY this step's own render() output, full stop. No
  // rail (which names every other step and product discussed), no Abandon/
  // Save as Draft, no wizard Back/Continue footer - the step's own content is
  // responsible for whatever action it needs (e.g. CafSignatureCapture's own
  // "Please Sign"), because nothing here should invite the customer to
  // interact with wizard chrome meant for the agent.
  if (isMirror) {
    // The customer's pop-up. Scrollable everywhere. Read-only on every step except CAF & Signature,
    // where the customer reads the terms, ticks the agreement and signs: those edits are sent to the
    // agent's window, which owns the order.
    const interactive = currentStep?.key === 'caf';
    const mirrorSetValue = (field: string, value: unknown) => {
      setFieldValue(wizardId, field, value);
      mirrorCh.current?.postMessage({ type: 'set', field, value });
    };
    return (
      <div className="p-8">
        <CustomerMirrorPanel step={currentStep} values={draft.values} interactive={interactive} onSetValue={mirrorSetValue} />
      </div>
    );
  }
  // Running summary: steps the user has moved past (never the active one, never ones not yet reached) that declare a
  // summary. Derived from the draft values on render - nothing is stored for it.
  const hasSummary = activeSteps.some((s) => s.summary?.length);
  // The postpaid add-on tray, mounted on the add-ons step only: in the step card's header on desktop, floating at the bottom on a small screen.
  const selectedAddonsTray =
    showSelectedAddonsTray && currentStep?.key === 'planExtras'
      ? (variant: 'floating' | 'header') => (
          <SelectedAddonsHeader
            variant={variant}
            selectedIds={(draft.values.addonIds as string[] | undefined) ?? []}
            selectedBilling={(draft.values.addonBilling as Record<string, import('../../engines/addonCategories').AddonBillingFrequency> | undefined) ?? {}}
            onChange={(ids) => setValue('addonIds', ids)}
          />
        )
      : undefined;
  const completedSummarySteps = activeSteps
    .map((step, index) => ({ step, index }))
    .filter(({ step, index }) => index < maxReached && index !== currentIndex && Boolean(step.summary?.length));
  const summaryProps = {
    // Page-level saving replaces milestone saving: a finished, saved page is the green tick, so no step row is flagged.
    completed: completedSummarySteps,
    // The page the agent is on, shown (marked as current) among the completed ones.
    current: currentStep ? { step: currentStep, index: currentIndex } : undefined,
    totalSteps: activeSteps.length,
    values: draft.values,
    onEdit: isLocked ? undefined : goToStep,
    // After going back to edit, the furthest step reached stays listed and one click returns to it.
    returnTo: !isLocked && currentIndex < maxReached && activeSteps[maxReached] ? { label: activeSteps[maxReached].label, key: activeSteps[maxReached].key, onReturn: () => goToStep(maxReached), index: maxReached } : undefined,
  };

  if (isCustomerFacing) {
    // The signed view keeps the running summary in the right column (read-only: the order is locked once signed). The
    // content sits in the same full-width step card as every other step.
    return (
      <div className="flex-1 flex items-start">
        <div className="flex-1 min-w-0">
          <div className="m-8 card p-6" onKeyDown={handleStepKeyDown}>
            {currentStep?.render({ values: draft.values, setValue, goNext: () => void goNext(), goToStepKey, saveDraft, saveAndExit, requestAbandon })}
            {abandonModal}
            {leaveModal}
          </div>
          {/* Below lg the side panel is hidden; the same summary (with its Edit actions) is offered as an accordion. */}
          {hasSummary && (
            <div className="mx-8 mb-8 lg:hidden">
              <StepSummaryPanel {...summaryProps} variant="accordion" />
            </div>
          )}
        </div>
        {hasSummary && <StepSummaryPanel {...summaryProps} />}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-full flex flex-col">
      {!hideTitleBand && (
      <WizardTitleBand
        title={title}
        titleAside={titleAside}
        popupBlocked={popupBlocked}
        onSaveExit={onSaveExit}
        saveHidden={currentStep?.canSaveDraft ? !currentStep.canSaveDraft(draft.values) : false}
        onAbandon={onAbandon}
        abandonHidden={abandonHidden}
        onRequestSaveExit={() => {
          setActivityComments('');
          setExitOpen(true);
        }}
        onRequestAbandon={() => {
          setAbandonNoKeep(false);
          setAbandonOpen(true);
        }}
      />
      )}

      {/* Below lg the tray floats at the bottom of the screen (the footer sits above it); from lg it is in the step card's header instead. */}
      {selectedAddonsTray && !isDesktop && selectedAddonsTray('floating')}

      <span className="sr-only" aria-live="polite" role="status">
        {shareAnnouncement}
      </span>
      <span className="sr-only" aria-live="polite">
        {currentStep && `Step ${currentIndex + 1} of ${activeSteps.length}: ${currentStep.label}`}
      </span>

      <WizardStepPanel
        panelRef={stepPanelRef}
        onKeyDown={handleStepKeyDown}
        cardClassName={viewOpen ? 'outline outline-2 outline-accent' : ''}
        bottomClass={fixedFooter ? (showSelectedAddonsTray && currentStep?.key === 'planExtras' ? 'pb-44 lg:pb-24' : 'pb-24') : ''}
        below={
          <>
            {belowPanel && <div className="px-8 pb-8">{belowPanel}</div>}
            {/* Below lg the side panel is hidden; the same summary (with its Edit actions) is offered as an accordion. */}
            {hasSummary && (
              <div className="mx-8 mb-8 lg:hidden">
                <StepSummaryPanel {...summaryProps} variant="accordion" />
              </div>
            )}
          </>
        }
        aside={hasSummary ? <StepSummaryPanel {...summaryProps} /> : undefined}
      >
          <WizardStepHeader
            currentStep={currentStep}
            allowCustomerView={allowCustomerView}
            viewOpen={viewOpen}
            toggleCustomerView={toggleCustomerView}
            stepHeadingRef={stepHeadingRef}
            values={draft.values}
            setValue={setValue}
            trayAside={selectedAddonsTray && isDesktop ? selectedAddonsTray('header') : undefined}
          />
          {currentStep?.render({ values: draft.values, setValue, goNext: () => void goNext(), goToStepKey, saveDraft, saveAndExit, requestAbandon })}
          <WizardFooter
            fixedToViewport={fixedFooter}
            avoidBottomTray={showSelectedAddonsTray && currentStep?.key === 'planExtras'}
            currentStep={currentStep}
            currentIndex={currentIndex}
            stepCount={activeSteps.length}
            values={draft.values}
            isLocked={isLocked}
            canProceed={canProceed}
            submitting={submitting}
            goBack={goBack}
            goNext={goNext}
            setValue={setValue}
            onAbandonStep={(opts) => {
              setAbandonNoKeep(Boolean(opts?.hideKeepWorking));
              setAbandonOpen(true);
            }}
          />
      </WizardStepPanel>

      {/* Each step's invisible work, whether or not the step is on screen (see WizardStep.headless). */}
      {activeSteps.map((s) => (s.headless ? <Fragment key={s.key}>{s.headless({ values: draft.values, setValue })}</Fragment> : null))}

      {/* Confirmed, not immediate: this discards every field the agent has
          entered and, once a draft order exists, deletes that row. Modal
          rather than Drawer per Modal.tsx's own note - it is reserved for
          exactly this short confirmation. */}
      {abandonModal}
      {exitModal}
      {leaveModal}
    </div>
  );
}
