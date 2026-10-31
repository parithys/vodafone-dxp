// User-facing titles stay Title Case: headings (h1-h6), button labels, form-field labels (label/legend/th) and the title/label/heading props and step
// labels of components. Major words are capitalised; minor words (a, an, the, and, but, or, for, of, in, on, at, to, by, as, with, from, into, via, per, vs)
// stay as authored. Acronyms, words with inner capitals or digits, "&amp;" and every dynamic ({...}) value are left alone, and sentences (ending in
// punctuation, or longer than seven words) are not titles. Mock data and code identifiers are out of scope.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const MINOR = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'for', 'to', 'in', 'on', 'at', 'by', 'with', 'as', 'vs', 'via', 'per', 'from', 'into']);
const titleish = (t) => {
  t = t.trim();
  if (t.length < 2 || /[{}<>=@|]|\$\{/.test(t) || /[.?!:;]$/.test(t) || /(\.\.\.|…)$/.test(t) || /[a-z]\.[a-z]/.test(t)) return false;
  if (/\[|var\(|(^|\s)(text|bg|border|font|px|py|pt|pb|mt|mb|ml|mr|gap|w|h|flex|grid|rounded|shadow|ring|min|max)-[a-z[]/.test(t)) return false;
  if (!/^[A-Za-z(]/.test(t)) return false;
  const words = t.split(/\s+/);
  return words.length <= 7 && !(t.includes(',') && words.length > 4);
};
const badWords = (t) => {
  const words = t.trim().split(' ').filter(Boolean);
  const bad = [];
  words.forEach((w, i) => {
    if (w.startsWith('&')) return;
    const core = w.replace(/[^A-Za-z]/g, '').toLowerCase();
    if (!core) return;
    const first = i === 0 || words[i - 1].endsWith(':');
    if (!first && i !== words.length - 1 && MINOR.has(core) && !w.includes('-')) return;
    for (const seg of w.split('-')) {
      const m = /^([^A-Za-z]*)(.*)$/.exec(seg);
      const c = m[2];
      if (!c || /[A-Z]/.test(c.slice(1)) || /\d/.test(c)) continue;
      if (/^[a-z]/.test(c)) bad.push(w);
    }
  });
  return bad;
};

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === 'synthetic' ? [] : walk(path.join(d, e.name))) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
const RULES = [
  /(<h[1-6]\b[^>]*>)([^<{}]+)(<\/h[1-6]>)/gs,
  /(<(?:Button|button)\b[^>]*>)(\s*[^<{}]+?\s*)(<\/(?:Button|button)>)/gs,
  /(<(?:label|th|dt|legend)\b[^>]*>)(\s*[^<{}]+?\s*)(<\/(?:label|th|dt|legend)>)/gs,
  /(<[A-Z][A-Za-z0-9]*\b[^>]*?\s(?:label|title|heading|buttonLabel|actionLabel|submitLabel|confirmLabel|cancelLabel)=")([^"{}]+)(")/gs,
  /(<(span|p|div|dd|li|a|td|option|summary|Badge|Pill|Tag)\b[^>]*>\s*)([A-Z][A-Za-z&'’\- ]{2,40}?)(\s*<\/\2>)/g,
  /((?:^|[\s{,])(?:label|heading|title|tabLabel|buttonLabel|actionLabel):\s*')([^'\\\n]+)(')/gm,
];

test('UI titles, headings, button and field labels are in Title Case', () => {
  const offenders = [];
  for (const file of walk('src')) {
    const src = fs.readFileSync(file, 'utf8');
    for (const rx of RULES) {
      for (const m of src.matchAll(rx)) {
        const text = m.length === 5 ? m[3] : m[2];
        if (!titleish(text) || (m.length === 5 && text.trim().split(/\s+/).length > 4)) continue;
        const bad = badWords(text);
        if (bad.length) offenders.push(`${file}: "${text.trim()}" -> ${bad.join(', ')}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `Title Case needed:\n${offenders.slice(0, 40).join('\n')}`);
});

test('the Title Case checker itself: what it accepts and what it flags', () => {
  assert.deepEqual(badWords('Scan Identity Document'), []);
  assert.deepEqual(badWords('Date of Birth'), []);
  assert.deepEqual(badWords('Save as Draft'), []);
  assert.deepEqual(badWords('Move to In Progress'), []);
  assert.deepEqual(badWords('Terms &amp; Conditions'), []);
  assert.deepEqual(badWords('Verify QID and eSIM'), []);
  assert.deepEqual(badWords('Add-Ons'), []);
  assert.deepEqual(badWords('Scan front side'), ['front', 'side']);
  assert.deepEqual(badWords('Recommended offers'), ['offers']);
  assert.deepEqual(badWords('Add-ons'), ['Add-ons']);
  assert.equal(titleish('Select a plan to see eligible discounts.'), false);
  assert.equal(titleish('Validating the identity document…'), false);
});
