import test from 'node:test';
import assert from 'node:assert/strict';
import { extractNewsData, isoDate, latestNews } from '../scripts/newsFeed.mjs';

// A cut-down copy of how the vodafone.qa news page holds its list: a `const newsData = [...]` literal in an inline script,
// with comments between years, and deliberately NOT in date order so the sort is what is under test.
const PAGE = `<html><script>
const other = [1];
const newsData = [
  // 2025 News
  { id: 3, image: "/en/investor-relations/media/image/10/a.webp", date: "January 5, 2025", title: "Older  item", subtext: "Old.", cta: "Read More", href: "/en/investor-relations/older", year: "2025" },
  // 2026 News
  { id: 1, image: "/en/investor-relations/media/image/11/b.webp", date: "August 29, 2026", title: "Newest", subtext: "Doha - new.", cta: "Read More", href: "/en/investor-relations/newest", year: "2026" },
  { id: 2, image: "/en/investor-relations/media/image/12/c.webp", date: "August 29, 2026", title: "Same day", subtext: "", cta: "Read More", href: "/en/investor-relations/Same-Day", year: "2026" },
];
function render() {}
</script></html>`;

test('news feed: the list is read out of the page and ordered newest first, ties by the page id', () => {
  const items = latestNews(extractNewsData(PAGE), 10);
  assert.deepEqual(items.map((i) => i.title), ['Newest', 'Same day', 'Older item']);
  assert.equal(items[0].date, '2026-08-29');
});

test('news feed: only the newest `limit` items are kept, each with its own absolute article URL and banner', () => {
  const items = latestNews(extractNewsData(PAGE), 2);
  assert.equal(items.length, 2);
  assert.equal(items[0].url, 'https://www.vodafone.qa/en/investor-relations/newest');
  assert.equal(items[1].url, 'https://www.vodafone.qa/en/investor-relations/Same-Day');
  assert.equal(items[0].imageUrl, 'https://www.vodafone.qa/en/investor-relations/media/image/11/b.webp');
});

test('news feed: a changed page or an unreadable date fails loudly instead of producing a guess', () => {
  assert.throws(() => extractNewsData('<html>no list here</html>'), /no longer contains/);
  assert.throws(() => isoDate('sometime in autumn'), /Unreadable news date/);
  assert.throws(() => latestNews([{ id: 1, title: 'x', date: 'May 1, 2026', image: '/i.webp' }], 6), /no href/);
});
