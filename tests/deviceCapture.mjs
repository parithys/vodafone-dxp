// Helper (not a test): renders Customer Verification's scanner for each ID type as ONE device and prints which capture actions it offers.
//   node tests/deviceCapture.mjs web|tablet
// The device is read once per process (lib/deviceType.ts), so each device needs its own process; customerVerificationDevice.test.mjs runs both.
import { boot, load, close } from './harness.mjs';

const device = process.argv[2];
globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
// The review aid the app itself uses (?device=tablet): decided before anything reads the device.
globalThis.window.location = { search: `?device=${device}` };

await boot();
const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const { detectDeviceType } = await load('/src/lib/deviceType.ts');
const { IdScannerPanel } = await load('/src/components/patterns/IdScannerPanel.tsx');
const noop = () => {};
const buttons = (html) => [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);

const out = { device: detectDeviceType(), types: {} };
for (const idType of ['QID', 'Passport', 'GCC ID', 'Diplomatic ID']) {
  // Exactly how Customer Verification mounts the scanner (IdLookupStep -> IdScannerPanel): no override of what the device decides.
  const html = renderToStaticMarkup(
    React.createElement(IdScannerPanel, {
      value: {}, onChange: noop, latest: { current: {} }, idType, verifyThenFetch: true, autoDetectIdType: false, contextNoDocument: undefined, contextHeldTypes: [], contextIdentity: undefined,
      scanComplete: false, setNotFound: noop, clearReconciliation: noop, demoType: null, handleScanAttempt: () => true, handleRetakeDone: noop, handleDemoScan: noop, scanBudgetSpent: false,
    }),
  );
  out.types[idType] = buttons(html).filter((t) => /scan|upload|retake/i.test(t));
}
console.log(JSON.stringify(out));
await close();
