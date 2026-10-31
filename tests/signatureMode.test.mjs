// The signature mode is the device's, read in one place; nobody picks it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

test('Digital on a pointer device, Touch Screen on a touch device', async () => {
  const { deviceTypeFrom } = await load('/src/lib/deviceType.ts');
  assert.equal(deviceTypeFrom({ maxTouchPoints: 0, coarsePointer: false }), 'web');
  assert.equal(deviceTypeFrom({ maxTouchPoints: 5 }), 'tablet');
  const { detectSignatureMode } = await load('/src/components/patterns/cafTypes.ts');
  assert.equal(detectSignatureMode(), 'Digital'); // the test process has no touch hardware
});

test('the MNP Form has no signature-type selector and takes its type from the shared detection', () => {
  const src = fs.readFileSync('src/components/patterns/DonorAttachmentStep.tsx', 'utf8');
  assert.doesNotMatch(src, /<Select/);
  assert.match(src, /`MNP-\$\{detectSignatureMode\(\)\}`/);
  assert.doesNotMatch(fs.readFileSync('src/capabilities/CafSignature/CafSignature.tsx', 'utf8'), /props\.autoDetectDeviceType \?/);
});

test('a CAF signed on the device needs its signature, whichever mode the device gave it', async () => {
  const { isCafValid } = await load('/src/capabilities/CafSignature/step.tsx');
  for (const t of ['Digital', 'Touch Screen']) {
    assert.equal(isCafValid({ cafType: t }), false);
    assert.equal(isCafValid({ cafType: t, signatureDataUrl: 'data:x' }), true);
  }
});

test.after(close);
