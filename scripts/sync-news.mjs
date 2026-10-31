// Synchronises the sign-in screen's "Latest Updates" with the Vodafone Qatar news page (the only source):
//   npm run sync:news           fetch, write public/news/news.json and the banner images; fails loudly if it cannot
//   npm run sync:news -- --soft keep the last snapshot and carry on if the page cannot be reached (used by predev/prebuild)
//   npm run sync:news -- --limit=8
// The browser cannot read vodafone.qa itself (no CORS), so the list is brought in at dev/build time and served as static
// files. Nothing is typed in by hand: titles, dates, summaries, banners and article links all come from the page.
import fs from 'node:fs';
import path from 'node:path';
import { NEWS_PAGE, extractNewsData, latestNews } from './newsFeed.mjs';

const OUT_DIR = path.resolve(import.meta.dirname, '..', 'public', 'news');
const OUT_FILE = path.join(OUT_DIR, 'news.json');
const soft = process.argv.includes('--soft');
const limit = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? 6);
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; vfq-dxp-news-sync)' };

async function get(url, kind) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return kind === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
}

try {
  const items = latestNews(extractNewsData(await get(NEWS_PAGE, 'text')), limit);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const kept = new Set();
  const out = [];
  for (const { imageUrl, ...item } of items) {
    // Named after the page's own media path (".../image/<mediaId>/<file>"), so two articles sharing a banner share a file.
    const parts = new URL(imageUrl).pathname.split('/').filter(Boolean);
    const name = `${parts.at(-2)}-${parts.at(-1)}`;
    const file = path.join(OUT_DIR, name);
    if (!fs.existsSync(file)) fs.writeFileSync(file, await get(imageUrl, 'bytes'));
    kept.add(name);
    out.push({ ...item, image: `/news/${name}` });
  }
  const json = `${JSON.stringify({ source: NEWS_PAGE, items: out }, null, 2)}\n`;
  const before = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, 'utf8') : '';
  if (json !== before) fs.writeFileSync(OUT_FILE, json);
  for (const f of fs.readdirSync(OUT_DIR)) if (f !== 'news.json' && !kept.has(f)) fs.rmSync(path.join(OUT_DIR, f));
  console.log(`news: ${json === before ? 'already up to date' : 'updated'} - ${out.length} latest of the page's list, newest ${out[0].date} "${out[0].title}"`);
} catch (err) {
  if (soft && fs.existsSync(OUT_FILE)) {
    console.warn(`news: could not refresh (${err.message}) - keeping the last snapshot in public/news/`);
  } else {
    console.error(`news: sync failed - ${err.message}`);
    process.exit(1);
  }
}
