// Customer Verification on a touch device: the reader ("Initiate scan") is replaced by "Upload document" on a tablet or a phone, for every ID type; on web it is the reader.
// The device is decided once per process (lib/deviceType.ts), so each device is rendered in its own process by tests/deviceCapture.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const run = (device) => JSON.parse(execFileSync(process.execPath, ['tests/deviceCapture.mjs', device], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n').pop());
const web = run('web');
const tablet = run('tablet');

// The business rule, written independently of the code (idUploadModel / BRSD): a web agent uses the reader; a tablet or mobile agent uploads the document.
const ID_TYPES = ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'];

test('the helper really rendered each device', () => {
  assert.equal(web.device, 'web');
  assert.equal(tablet.device, 'tablet');
  assert.deepEqual(Object.keys(web.types), ID_TYPES);
  assert.deepEqual(Object.keys(tablet.types), ID_TYPES);
});

test('tablet / mobile: "Initiate scan" is replaced by "Upload document" for every ID type, and no reader action is offered', () => {
  for (const t of ID_TYPES) {
    const actions = tablet.types[t];
    assert.ok(actions.includes('Upload document'), `${t}: Upload document is offered`);
    assert.ok(!actions.some((a) => /scan|retake/i.test(a)), `${t}: no scan or retake action on a touch device (${actions.join(' | ')})`);
  }
  // A Passport takes each side as its own upload, the same way it is scanned side by side on web.
  assert.deepEqual(tablet.types.Passport, ['Upload document', 'Upload front side', 'Upload back side']);
});

test('web: the reader is offered ("Initiate scan", or each Passport side), and no upload is offered while the reader is available', () => {
  for (const t of ['QID', 'GCC ID', 'Diplomatic ID']) assert.deepEqual(web.types[t], ['Initiate scan'], t);
  assert.deepEqual(web.types.Passport, ['Scan front side', 'Scan back side']);
  for (const t of ID_TYPES) assert.ok(!web.types[t].some((a) => /upload/i.test(a)), `${t}: no upload beside a working reader`);
});

test('the same ID types are covered on both devices: the device changes how a step is operated, never which types there are', () => {
  assert.deepEqual(Object.keys(web.types), Object.keys(tablet.types));
});

test('Customer Verification takes what the device decides: it passes no override, and only the named screens ever offer both actions on every device', () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
  // The text of each opening tag, brace-aware (a prop's arrow function holds ">" that does not end the tag).
  const openingTags = (src, name) => {
    const tags = [];
    for (let at = src.indexOf(`<${name}`); at !== -1; at = src.indexOf(`<${name}`, at + 1)) {
      if (/[\w$]/.test(src[at + name.length + 1] ?? '')) continue;
      let depth = 0;
      let quote = '';
      let i = at;
      for (; i < src.length; i++) {
        const c = src[i];
        if (quote) { if (c === quote && src[i - 1] !== '\\') quote = ''; continue; }
        if (c === '"' || c === "'" || c === '`') quote = c;
        else if (c === '{') depth++;
        else if (c === '}') depth--;
        else if (c === '>' && depth === 0 && src[i - 1] !== '=') break;
      }
      tags.push(src.slice(at, i + 1));
    }
    return tags;
  };
  const overriders = walk('src')
    .filter((f) => /\.tsx$/.test(f) && !f.includes('componentCatalogue'))
    .filter((f) => !/^src\/components\/domain\/(IdFileUpload|QidImageUpload|PassportScanSections)\.tsx$/.test(f))
    .filter((f) => {
      const src = strip(fs.readFileSync(f, 'utf8'));
      return ['QidImageUpload', 'PassportScanSections', 'IdFileUpload'].some((n) => openingTags(src, n).some((t) => /\b(bothCaptureActions|readerEverywhere|bothActions)\b/.test(t)));
    })
    .sort();
  // Each of these has its own documented need for both actions on every device; Customer Verification (IdScannerPanel) is not among them.
  assert.deepEqual(overriders, [
    'src/capabilities/CustomerType/CustomerTypeStep.tsx', // the office ID card: scan or upload
    'src/capabilities/SpecialDiscountsIdentification/SpecialDiscountsStep.tsx', // "always offers both Initiate scan and Upload document on every device"
    'src/modules/identity-customer-management/screens/PassportToQidWizard.tsx', // the new QID being linked to the Passport
    'src/modules/sim-number-management/screens/NewSimSwapWizard.tsx', // the QID & Bank Statement documents
  ]);
  assert.ok(!overriders.includes('src/components/patterns/IdScannerPanel.tsx'));
});
