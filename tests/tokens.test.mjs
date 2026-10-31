// Design-token governance. Reads the tokens from the CSS itself (tests/tokenModel.mjs), so adding, renaming or
// deleting a token cannot drift from how the app uses it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTokens, deadTokens, undefinedRefs, colourTokensWithoutDark } from './tokenModel.mjs';

// Raw-colour tokens that are deliberately the SAME in light and dark mode, with the reason. Everything else that holds a
// raw colour must define a dark value in :root.dark (aliases and color-mix() follow their sources and are exempt).
const CONSTANT_ACROSS_THEMES = {
  '--accent': 'brand red; the accent fill is identical in both themes',
  '--accent-on': 'text on the accent fill',
  '--approval-routing': 'eligibility approval-routing wash',
  '--badge-success-solid': 'solid success badge, white label',
  '--success-solid': 'solid green fill under a white label; --success is lightened in dark and would drop to 2.1:1',
  '--danger-solid': 'solid red fill under a white label; --danger is lightened in dark and would drop to 3.4:1',
  '--brand-vodafone': 'brand speech-mark red',
  '--brand-qatar': 'Qatar flag maroon',
  '--summary-milestone': 'Step Summary progress fill and milestone disc; same orange in both themes',
  '--tag-primary-bg': 'Primary marker: solid plum under a white label, same in both themes',
  '--tag-primary-fg': 'white label on the solid plum Primary marker',
  '--charcoal-panel': 'dark panel used in both themes (login help, dark selects)',
  '--divider-on-dark': 'hairline on a dark surface',
  '--field-calendar-range': 'teal range highlight on the dark toast and calendar',
  '--grey-disabled': 'disabled glyph grey, legible on both',
  '--login-bg': 'login hero is dark in both themes',
  '--summary-bg': 'summary card is a dark surface in both themes',
  '--summary-fg': 'text on the summary card',
  '--toast-dot-info': 'dot on the dark toast',
  '--white-glass-10': 'glass fill on a dark surface',
  '--paper': 'a surface that must stay white (QR code, photographed ID)',
  '--signature-ink': 'signature stroke: dark on a white pad and on the printed CAF in both themes',
  '--scrim': 'backdrop',
  '--telesales-amber': 'chart series colour',
  '--telesales-blue': 'chart series colour',
  '--telesales-chart-slate': 'chart series colour',
};
const ON_DARK = /^--on-dark/; // the on-dark family is constant by definition

test('tokens: every var(--x) used in the app is defined', () => {
  assert.deepEqual(undefinedRefs(), []);
});

test('tokens: no dead tokens (declared but never read)', () => {
  assert.deepEqual(deadTokens(), [], 'delete these, or use them');
});

test('tokens: every raw-colour token has a dark value or is listed as constant across themes', () => {
  const missing = colourTokensWithoutDark().filter((t) => !(t in CONSTANT_ACROSS_THEMES) && !ON_DARK.test(t));
  assert.deepEqual(missing, [], 'add a value to :root.dark in tokens.css, or list the token in CONSTANT_ACROSS_THEMES with a reason');
});

test('tokens: the constant-across-themes list has no stale entries', () => {
  const { light, dark } = loadTokens();
  const stale = Object.keys(CONSTANT_ACROSS_THEMES).filter((t) => !light.has(t) || dark.has(t));
  assert.deepEqual(stale, []);
});

test('tokens: spacing, weight and stacking scales exist and Tailwind is bound to them', async () => {
  const { light, theme } = loadTokens();
  for (const t of ['--space-unit', '--fw-regular', '--fw-medium', '--fw-semibold', '--fw-bold', '--z-overlay', '--z-popover', '--z-toast', '--z-tooltip', '--motion-fast', '--motion-base', '--motion-slow'])
    assert.ok(light.has(t), `${t} is missing from tokens.css`);
  assert.equal(theme.get('--spacing'), 'var(--space-unit)');
  assert.equal(theme.get('--font-weight-bold'), 'var(--fw-bold)');
});
