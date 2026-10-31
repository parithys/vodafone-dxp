// Test harness: loads the app's TypeScript modules through Vite's SSR loader (the app's own aliasing and transforms),
// with `fetch` and `localStorage` stubbed to read the repo's public/ folder. No extra dependencies: the test runner is
// node:test and the DOM-free render checks use react-dom/server.
import { createServer } from 'vite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

globalThis.fetch = async (url) => {
  const pathname = new URL(String(url), 'http://localhost').pathname.replace(/^\/vfq-dxp-app\//, '/');
  const file = path.join(ROOT, 'public', pathname);
  if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
  const body = fs.readFileSync(file, 'utf8');
  return { ok: true, status: 200, json: async () => JSON.parse(body), text: async () => body };
};
const store = new Map();
const mem = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => void store.set(k, String(v)), removeItem: (k) => void store.delete(k), clear: () => store.clear() };
globalThis.localStorage = mem;
globalThis.sessionStorage = { ...mem };
globalThis.window = globalThis.window ?? globalThis;

// node --test runs each file in its own process, and each starts its own Vite server. Sharing node_modules/.vite, they race to
// pre-bundle React into it and stall on a cold cache (e.g. right after `npm ci`), so each process gets a private cache dir.
const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vfq-vite-'));
process.on('exit', () => fs.rmSync(cacheDir, { recursive: true, force: true }));

let server;
export async function load(modulePath) {
  server ??= await createServer({ root: ROOT, cacheDir, logLevel: 'silent', appType: 'custom', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true } });
  return server.ssrLoadModule(modulePath);
}
export async function close() {
  await server?.close();
}

/** Boots the app's config + mock data the same way App.tsx does at start-up. */
export async function boot() {
  const cfg = await load('/src/engines/configEngine.ts');
  await cfg.loadConfig();
  const db = await load('/src/engines/mockDataEngine.ts');
  await db.seedMockData();
  return { cfg, db };
}
