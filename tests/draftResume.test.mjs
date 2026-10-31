// A resumed draft has its eligibility dropped (it is re-judged on the first page): it reopens there, with the saved step kept as the furthest reached.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
let m;
before(async () => { await boot(); m = await load('/src/components/patterns/wizard/useJourneyStartResume.ts'); });
after(close);

test('every saved step reopens on the first page and stays reachable', () => {
  for (const saved of [0, 1, 4, 7, 11]) assert.deepEqual(m.resumePosition(saved), { currentStep: 0, maxStepReached: saved });
  assert.deepEqual(m.resumePosition(-1), { currentStep: 0, maxStepReached: 0 }, 'a step not found is the first');
});

test('the resume applies it, and still drops the saved eligibility', () => {
  const src = fs.readFileSync('src/components/patterns/wizard/useJourneyStartResume.ts', 'utf8');
  assert.match(src, /const \{ eligibility: _staleEligibility, \.\.\.resumedValues \} = order\.draftValues;/);
  assert.match(src, /const position = resumePosition\(stepIndex\);[\s\S]*currentStep: position\.currentStep,[\s\S]*maxStepReached: position\.maxStepReached,/);
});
