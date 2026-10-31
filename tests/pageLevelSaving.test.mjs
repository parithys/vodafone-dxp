// Page-level saving: Continue saves the page being left to the Draft Order before the journey moves on; a saved page is the green tick (no milestone flag);
// a submitted or abandoned journey leaves no saved draft behind.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');

test('Continue starts the page save and moves on at once; saves run one after another; a failed save never blocks the journey', () => {
  const nav = read('src/components/patterns/wizard/useWizardStepNavigation.ts');
  const iSave = nav.indexOf('savePage?.()');
  const iStep = nav.indexOf('setStep(wizardId, nextStepIndex(');
  assert.ok(iSave > 0 && iStep > iSave, 'the save is started before the step changes');
  assert.doesNotMatch(nav, /await savePage/, 'Continue does not wait for the write (it took seconds)');
  assert.match(nav, /pendingSaveRef\.current\s*=\s*pendingSaveRef\.current\s*\.then/, 'saves are chained, never concurrent');
  assert.match(nav, /await pendingSaveRef\.current;\s*await onSubmit/, 'the submit waits for a save still running');
  assert.match(nav, /\.catch\(\(e\) => console\.error\('Page save failed'/);
});

test('the draft order is looked up fresh when saving, so a save still running cannot be followed by a second order', () => {
  const d = read('src/components/patterns/wizard/useWizardDraftActions.ts');
  assert.match(d, /const savedId = useWorkflowStore\.getState\(\)\.getDraft\(wizardId\)\.draftOrderId \?\? draftOrderId/);
});

test('the save writes (and then updates) one Draft Order, quietly, only for a journey with something worth keeping', () => {
  const d = read('src/components/patterns/wizard/useWizardDraftActions.ts');
  assert.match(d, /step\.canSaveDraft && !step\.canSaveDraft\(values\)/);
  assert.match(d, /draftHasProgress\(useWorkflowStore\.getState\(\)\.getDraft\(wizardId\)\)/);
  assert.match(d, /if \(id && !useWorkflowStore\.getState\(\)\.getDraft\(wizardId\)\.draftOrderId\) useWorkflowStore\.getState\(\)\.setDraftOrderId\(wizardId, id\)/, 'linked once, then updated (no second order)');
  const savePage = d.slice(d.indexOf('const savePage'), d.indexOf('const requestAbandon'));
  assert.ok(!savePage.includes('pushToast') && !savePage.includes('recordActivity'), 'no toast, no activity');
});

test('submitting or abandoning removes the saved Draft Order and its Draft Orders task', () => {
  const d = read('src/components/patterns/wizard/useWizardDraftActions.ts');
  assert.match(d, /relatedOrderId === orderId\)\) await entity\(\)\.removeRecord\('tasks'/);
  assert.equal((d.match(/await discardSavedDraft\(draftOrderId\)/g) ?? []).length, 2, 'Abandon Order and abandon-on-leave');
  assert.match(read('src/components/patterns/wizard/useWizardStepNavigation.ts'), /await discardSavedDraft\?\.\(savedDraftId\)/);
});

test('the Summary marks a finished page with the green tick: no step row is flagged as a milestone', () => {
  const w = read('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx');
  assert.doesNotMatch(w, /milestoneSteps/);
  const section = read('src/components/patterns/wizard/StepSummarySection.tsx');
  assert.match(section, /text-success/);
});
