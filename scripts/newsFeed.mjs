// Reads the Vodafone Qatar investor-relations news list. The page (https://www.vodafone.qa/en/investor-relations/news)
// has no separate data feed: its own script holds the whole list as a `const newsData = [...]` literal and draws the cards
// from it. These functions take that literal out of the page's HTML and turn it into the newest-first list the login
// screen shows. Pure (no network or disk), so tests/loginNews.test.mjs can run them on a fixture.
import vm from 'node:vm';

export const SITE = 'https://www.vodafone.qa';
export const NEWS_PAGE = `${SITE}/en/investor-relations/news`;

/** The page's `newsData` array, as the objects the page itself uses. Throws if the page no longer has it. */
export function extractNewsData(html) {
  const start = html.indexOf('const newsData');
  if (start < 0) throw new Error('The news page no longer contains a `const newsData` list - its layout has changed.');
  const open = html.indexOf('[', start);
  const close = html.indexOf('\n];', open);
  if (open < 0 || close < 0) throw new Error('Could not find the end of the `newsData` list on the news page.');
  // Evaluated in an empty context with a time limit: it is a plain object literal, and gets no access to this process.
  const data = vm.runInNewContext(`(${html.slice(open, close + 2)})`, Object.create(null), { timeout: 1000 });
  if (!Array.isArray(data) || data.length === 0) throw new Error('The news page\'s `newsData` list is empty.');
  return JSON.parse(JSON.stringify(data)); // plain objects of this realm, not the evaluation context's
}

/** "August 29, 2026" -> "2026-08-29". Throws on anything else rather than guessing a date. */
export function isoDate(text) {
  const t = Date.parse(`${String(text).trim()} 00:00:00 UTC`);
  if (Number.isNaN(t)) throw new Error(`Unreadable news date: "${text}"`);
  return new Date(t).toISOString().slice(0, 10);
}

const absolute = (href) => new URL(href, SITE).href;

/**
 * The `limit` newest items, newest first. The page lists them newest first already, but the order is not relied on:
 * items are sorted by their date (the page's own id breaks ties, lower id = listed earlier = newer).
 */
export function latestNews(rawItems, limit) {
  const items = rawItems.map((n) => {
    for (const k of ['title', 'date', 'href', 'image']) if (!n[k]) throw new Error(`News item ${n.id ?? '?'} has no ${k}.`);
    return {
      id: n.id,
      date: isoDate(n.date),
      title: String(n.title).replace(/\s+/g, ' ').trim(),
      summary: String(n.subtext ?? '').replace(/\s+/g, ' ').trim(),
      url: absolute(n.href),
      imageUrl: absolute(n.image),
    };
  });
  items.sort((a, b) => b.date.localeCompare(a.date) || a.id - b.id);
  return items.slice(0, limit);
}
