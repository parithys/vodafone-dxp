// One height for every single-line text field and dropdown, defined at the component level (--field-height, applied to .form-control, .field-box,
// .select-field, .field-wrap and .input-shell in ui-components.css) and never set per screen. A call site that gives a field its own height or
// vertical padding is how two fields in a row came out different (an ID Number box taller than the Company Name beside it).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), 'utf8');
const walk = (d) => readdirSync(join(root, d)).flatMap((n) => {
  const p = `${d}/${n}`;
  return statSync(join(root, p)).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
});
const css = read('src/ui-components.css');

test('the field height is one token, applied to every field class with !important', () => {
  assert.match(read('src/tokens.css'), /--field-height:\s*var\(--control-h-md\)/);
  const rule = css.match(/\.form-control:not\(textarea\),([^{]+)\{([^}]+)\}/);
  assert.ok(rule, 'the shared field-height rule is missing');
  for (const sel of ['.field-box', '.select-field', '.field-wrap', '.input-shell']) assert.ok(rule[1].includes(sel), `${sel} is not in the rule`);
  assert.match(rule[2], /height:\s*var\(--field-height\)\s*!important/);
});

const FIELDS = ['Input', 'Select', 'PhoneNumberInput', 'SearchField', 'CompanySearchInput', 'ContactPhoneInput', 'QidInput'];
const SIZING = /(^|[\s"'`{])!?(h|min-h|max-h|py|pt|pb)-[^\s"'`}]+/;

/** The opening tag of every <Field ...> in a file (brace-aware, so an arrow function's `>` does not end it). */
function openingTags(src, name) {
  const out = [];
  const re = new RegExp(`<${name}(?=[\\s/>])`, 'g');
  for (let m; (m = re.exec(src)); ) {
    let depth = 0;
    let i = m.index;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    out.push(src.slice(m.index, i + 1));
  }
  return out;
}

test('no call site gives a text field or dropdown its own height or vertical padding', () => {
  const offenders = [];
  for (const f of walk('src').filter((p) => !p.startsWith('src/components/primitives/'))) {
    const src = read(f);
    for (const name of FIELDS) {
      for (const tag of openingTags(src, name)) {
        const cls = [...tag.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g)].map((m) => m[1] ?? m[2] ?? m[3]).join(' ');
        if (SIZING.test(cls)) offenders.push(`${f}: <${name} className="${cls.trim()}">`);
      }
    }
  }
  assert.deepEqual(offenders, [], 'size fields through the component (--field-height), not per call site');
});
