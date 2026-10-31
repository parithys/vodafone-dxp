// The SIM Serial step: a validated scan moves the journey on by itself and carries the SIM's details forward.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load, close } from './harness.mjs';

test('a validated serial advances the step and stores its ICCID, stock status and kind; an invalid one does neither', async () => {
  const { simSerialStep } = await load('/src/capabilities/SimType/step.tsx');
  const step = simSerialStep();
  const store = {};
  const setValue = (k, v) => { store[k] = v; };
  const props = step.render({ values: store, setValue }).props;

  props.onChange('8974412009900129000', true, { iccid: '8974412009900129000', stockStatus: 'In Stock', simKind: 'Physical' });
  assert.equal(step.isValid(store), true);
  assert.equal(step.autoAdvanceWhen(store), true);
  assert.deepEqual(store.simDetails, { iccid: '8974412009900129000', stockStatus: 'In Stock', simKind: 'Physical' });

  props.onChange('8974412009900129001', false);
  assert.equal(step.autoAdvanceWhen(store), false);
  assert.equal(store.simDetails, undefined);
  assert.equal(step.isValid(store), false);
  assert.equal(step.autoAdvanceWhen({ simValid: true, simSerial: '' }), false);
});

test.after(close);
