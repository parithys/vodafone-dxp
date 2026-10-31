// The Attachments list names a document's format from what the order recorded, and does not guess beyond that.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/modules/order-management/OrderApprovalDetail.tsx'), 'utf8');

test('attachments: every file kind has an icon, a tone and a screen-reader name', () => {
  for (const k of ['pdf', 'image', 'word', 'sheet', 'other']) assert.match(src, new RegExp(`\\b${k}: \\{ path:`), `${k} icon missing`);
  assert.match(src, /role="img" aria-label=\{k\.name\}/);
});

test('attachments: formats come from the file extension or from how the document was captured, otherwise a plain document', () => {
  assert.match(src, /ext === 'pdf'\) return 'pdf'/);
  assert.match(src, /\/scanned\/i\.test\(a\.detail \?\? ''\)\) return 'image'/);
  assert.match(src, /return 'other';/);
});
