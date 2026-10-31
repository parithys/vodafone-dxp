// Opens the web, tablet and mobile dev servers (npm run dev:all) in Chrome app windows pre-sized to each device, so they
// can be viewed side by side without DevTools. It only sizes the windows: the app is the same one on every port and
// adapts to the real window size, so nothing here is read by the app.
//   npm run open:web | open:tablet | open:mobile | open:all
// Each view gets its own throwaway Chrome profile - a window of an already-running profile ignores --window-size - so its
// sign-in and storage are separate from your normal Chrome and from the other views.
// Not emulated: touch. A pre-sized desktop window has a mouse, so the touch-only behaviour (the tablet device type) needs
// DevTools device emulation or a real device.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Ports match the dev:* scripts in package.json.
const VIEWS = {
  web: { port: 5173, width: 1440, height: 900, x: 0, y: 40 },
  tablet: { port: 5174, width: 820, height: 1180, x: 60, y: 40 }, // iPad Air, portrait
  mobile: { port: 5175, width: 390, height: 844, x: 120, y: 40 }, // iPhone 14
};

const CHROME_CANDIDATES = {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
  linux: ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'],
  win32: ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'],
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const found = (CHROME_CANDIDATES[process.platform] ?? []).find((c) => !path.isAbsolute(c) || fs.existsSync(c));
  if (!found) throw new Error('Chrome not found. Set CHROME_PATH to its executable.');
  return found;
}

function open(name, chrome) {
  const v = VIEWS[name];
  const url = `http://localhost:${process.env[`PORT_${name.toUpperCase()}`] ?? v.port}/vfq-dxp-app/`;
  const child = spawn(
    chrome,
    [
      `--app=${url}`,
      `--window-size=${v.width},${v.height}`,
      `--window-position=${v.x},${v.y}`,
      `--user-data-dir=${path.join(os.tmpdir(), `vfq-view-${name}`)}`,
      '--no-first-run',
      '--no-default-browser-check',
    ],
    { detached: true, stdio: 'ignore' },
  );
  child.unref();
  console.log(`${name.padEnd(6)} ${v.width}x${v.height}  ${url}`);
}

const arg = process.argv[2];
const names = arg === 'all' ? Object.keys(VIEWS) : [arg];
if (!names.every((n) => n in VIEWS)) {
  console.error('Usage: node scripts/open-views.mjs <web|tablet|mobile|all>');
  process.exit(1);
}
const chrome = findChrome();
for (const n of names) open(n, chrome);
