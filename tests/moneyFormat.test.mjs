// Money with decimals always has two decimal places ("QAR 10.50"); whole amounts have none. One formatter set, and no screen formats money by hand.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

let f;
before(async () => { await boot(); f = await load('/src/lib/format.ts'); });
after(close);

test('formatQar, formatAmount and their loose forms: two decimals whenever there are decimals, none for whole amounts', () => {
  assert.equal(f.formatQar(10.5), 'QAR 10.50');
  assert.equal(f.formatQar(10), 'QAR 10');
  assert.equal(f.formatQar(23562.5), 'QAR 23,562.50');
  assert.equal(f.formatQar(0.1 + 0.2), 'QAR 0.30');
  assert.equal(f.formatAmount(112.5), '112.50');
  assert.equal(f.formatAmount(1500), '1,500');
  assert.equal(f.formatQarAny('10.5'), 'QAR 10.50');
  assert.equal(f.formatQarAny(7), 'QAR 7');
  assert.equal(f.formatQarAny('TBC'), 'QAR TBC');
  assert.equal(f.formatAmountAny('12.3'), '12.30');
  assert.equal(f.formatAmountAny('n/a'), 'n/a');
});

test('no screen or message builds "QAR <number>" by hand: every money value goes through the formatters', () => {
  const offenders = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!p.includes(path.join('src', 'data', 'synthetic'))) walk(p); continue; }
      if (!/\.(ts|tsx)$/.test(e.name) || p.endsWith(path.join('lib', 'format.ts'))) continue;
      const lines = fs.readFileSync(p, 'utf8').split('\n');
      lines.forEach((l, i) => { if (/QAR \$\{(?![^}]*format)/.test(l) || /QAR \{(?![^}]*format)/.test(l) || /\$\{[^{}]+\} QAR/.test(l.replace(/\$\{formatAmountAny\([^{}]*\)\} QAR/g, ''))) offenders.push(`${p}:${i + 1}`); });
    }
  };
  walk('src');
  assert.deepEqual(offenders, []);
});
