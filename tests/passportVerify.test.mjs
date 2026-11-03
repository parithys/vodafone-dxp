// Passport on web: no Upload; both sides are scanned, then the header's "Validate with MOI" reads the passport and validates it against MOI.
// Tablet / mobile: Upload, validated as before. The QID, GCC ID and Diplomatic ID are unchanged (they validate as soon as their scan completes).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => { await boot(); m = await load('/src/components/domain/idUploadModel.ts'); });
after(close);

const read = (p) => fs.readFileSync(p, 'utf8');

test('only a Passport on a web device is validated on request', () => {
  for (const [doc, device, expected] of [
    ['Passport', 'web', true],
    ['Passport', 'tablet', false],
    ['QID', 'web', false],
    ['GCC ID', 'web', false],
    ['Diplomatic ID', 'web', false],
    [undefined, 'web', false],
  ]) assert.equal(m.passportVerifiesOnDemand(doc, device), expected, `${doc} on ${device}`);
});

test('the capture actions: a web agent has the reader and no upload; a tablet agent uploads', () => {
  assert.deepEqual(m.idCaptureOptions('web', true), { scan: true, upload: false });
  assert.deepEqual(m.idCaptureOptions('tablet', true), { scan: false, upload: true });
  assert.deepEqual(m.idCaptureOptions('web', false), { scan: false, upload: true }, 'no reader: upload stays on any device');
});

test('the Passport card carries the Validate with MOI button, enabled only with both sides scanned and not yet validated', () => {
  const src = read('src/components/domain/PassportScanSections.tsx');
  assert.match(src, /onVerify \? \(/);
  assert.match(src, /disabled=\{!bothScanned \|\| scanning !== null \|\| verifying \|\| verified\}/);
  assert.match(src, /'Validate with MOI'/);
  // The header no longer defaults to an Upload on web: the reader is declared, so upload follows the device.
  assert.match(src, /scanner=\{canScan\}/);
});

test('the lookup waits for the agent before reading and validating a web Passport, and starts over when the scan is cleared', () => {
  const hook = read('src/components/patterns/useIdLookup.ts');
  assert.match(hook, /passportVerifiesOnDemand\(demoType \?\? idType, detectDeviceType\(\)\)/);
  assert.match(hook, /if \(verifyOnDemand && !verifyRequested\) return;/);
  assert.match(hook, /setVerifyRequested\(false\);\n\s+return;/, 'a cleared scan resets the request');
  const step = read('src/components/patterns/IdLookupStep.tsx');
  assert.match(step, /onVerify=\{verifyOnDemand \? startVerification : undefined\}/);
});
