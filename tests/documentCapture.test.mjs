import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

after(close);
const h = React.createElement;

// Supporting documents are captured the way the device does it, and uploaded: Scan + Upload on the web, Camera + Upload on a tablet or phone.
test('web: Scan Document and Upload Document, no camera input', async () => {
  const { DocumentCaptureActions } = await load('/src/components/domain/DocumentCaptureActions.tsx');
  const out = html(h(DocumentCaptureActions, { device: 'web', onFile() {} }));
  assert.match(out, />Scan Document</);
  assert.match(out, />Upload Document</);
  assert.doesNotMatch(out, /Capture With Camera/);
  assert.doesNotMatch(out, /capture="environment"/);
});

test('tablet / mobile: Capture With Camera (the rear camera) and Upload Document, no scan', async () => {
  const { DocumentCaptureActions } = await load('/src/components/domain/DocumentCaptureActions.tsx');
  const out = html(h(DocumentCaptureActions, { device: 'tablet', onFile() {} }));
  assert.match(out, />Capture With Camera</);
  assert.match(out, />Upload Document</);
  assert.match(out, /accept="image\/\*" capture="environment"/);
  assert.doesNotMatch(out, /Scan Document/);
});

test('an attached document turns Upload into Replace; disabled controls say why', async () => {
  const { DocumentCaptureActions } = await load('/src/components/domain/DocumentCaptureActions.tsx');
  assert.match(html(h(DocumentCaptureActions, { device: 'web', hasDocument: true, onFile() {} })), />Replace Document</);
  const off = html(h(DocumentCaptureActions, { device: 'tablet', disabled: true, disabledTitle: 'Choose a document type first', onFile() {} }));
  assert.equal((off.match(/disabled=""/g) ?? []).length, 2);
  assert.match(off, /title="Choose a document type first"/);
});

test('every supporting-document surface uses the capture actions: no upload-only button is left', () => {
  const surfaces = [
    'src/capabilities/NumberSelection/WaiveOff.tsx', // number discount document
    'src/capabilities/EligibilityGate/ExceptionRequestModal.tsx', // exception / court order document
    'src/components/domain/SupportingDocumentField.tsx',
    'src/components/domain/AdditionalDocumentsUpload.tsx',
    'src/components/domain/CafDocumentUpload.tsx',
    'src/modules/order-management/MissingInformationPanel.tsx',
  ];
  for (const f of surfaces) {
    const src = fs.readFileSync(f, 'utf8');
    assert.match(src, /<DocumentCaptureActions/, f);
    assert.doesNotMatch(src, /type="file"/, `${f} owns no file input of its own`);
  }
});
