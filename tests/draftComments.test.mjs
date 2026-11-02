// A task list holds only the signed-in agent's own tasks, so it shows the comment left when the order was saved as a draft, not a department.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

await boot();
after(close);

test('the task list has a Comments column (the draft comment) and no Department column', () => {
  const list = fs.readFileSync('src/workspace/tasks/TaskListView.tsx', 'utf8');
  assert.match(list, /header: 'Comments'[^\n]*draftComment/);
  assert.doesNotMatch(list, /header: 'Department'/);
});

test('saving a draft stores its comment on the Draft Order task', () => {
  const actions = fs.readFileSync('src/components/patterns/wizard/useWizardDraftActions.ts', 'utf8');
  assert.match(actions, /draftComment: comments\.trim\(\)/);
  assert.match(actions, /persistDraft\(comments \?\? '', saved\)/);
});

test('Save as Draft stays on the page: it saves, keeps the journey open and confirms with the Task ID', () => {
  const actions = fs.readFileSync('src/components/patterns/wizard/useWizardDraftActions.ts', 'utf8');
  const here = actions.slice(actions.indexOf('const saveDraftHere'), actions.indexOf('// `stay` saves without'));
  // The toast comes as soon as the draft is saved, before the (slower) activity log write.
  assert.ok(here.indexOf('pushToast') < here.indexOf("recordActivity('saved-exit'"), 'toast first');
  assert.match(here, /detailLink: \{ prefix: 'Task ID: ', label: saved\.taskId, to: '\/tasks\?filter=draft-orders' \}/);
  assert.doesNotMatch(here, /endJourney|clearDraft|onSaveExit/, 'the journey stays open and nothing navigates');
  assert.match(fs.readFileSync('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx', 'utf8'), /void saveDraftHere\(activityComments\)/);
});

test('after Save as Draft nothing is unsaved, so leaving the journey does not warn - until something changes', async () => {
  {
    const { useWorkflowStore, draftNeedsSaving } = await load('/src/stores/workflowStore.ts');
    const id = 'test-wizard';
    useWorkflowStore.getState().patchDraft(id, { set: { name: 'Ahmed' }, progressTo: 2 });
    assert.equal(draftNeedsSaving(useWorkflowStore.getState().drafts[id]), true, 'progress that is not saved warns');
    useWorkflowStore.getState().markDraftSaved(id);
    assert.equal(draftNeedsSaving(useWorkflowStore.getState().drafts[id]), false, 'saved: no warning');
    useWorkflowStore.getState().patchDraft(id, { set: { name: 'Ahmed Ali' } });
    assert.equal(draftNeedsSaving(useWorkflowStore.getState().drafts[id]), true, 'a later change is unsaved again');
  }
});

test('resuming a draft opens on ID verification and must pass it again; Continue then restores the saved step', async () => {
  {
    const { withoutIdVerification } = await load('/src/components/patterns/wizard/resumeModel.ts');
    const values = { contact: { idType: 'QID', idNumber: '29303051200106', moiResult: { name: 'A' }, qidScans: { frontScanned: true }, firstName: 'A' }, msisdn: '55551234' };
    const resumed = withoutIdVerification(values);
    assert.deepEqual(Object.keys(resumed.contact).sort(), ['firstName', 'idNumber', 'idType'], 'the earlier verification is dropped, the ID to start from stays');
    assert.equal(resumed.msisdn, '55551234', 'everything else is kept for after the check');
    const nav = fs.readFileSync('src/components/patterns/wizard/useWizardStepNavigation.ts', 'utf8');
    assert.match(nav, /consumeResumeTarget\(wizardId\)/);
    const lock = fs.readFileSync('src/capabilities/JourneyCustomerLock/useJourneyCustomerLock.ts', 'utf8');
    assert.match(lock, /resumeTaskId \?\? newTaskId\(\)/, 'the journey keeps the draft\'s own Task ID');
    assert.match(lock, /detailLink: \{ prefix: 'Task ID: ', label: active\.taskId, to: active\.path/);
  }
});
