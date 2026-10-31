// Refactor safety net, part 2 (rendered UI). Paste into the browser via the preview tool's eval (or
// DevTools) while signed in as the persona under test. It visits each route (and each Customer 360
// tab), waits for it to settle, and returns per-screen fingerprints:
//   text  - hash of the visible text
//   style - hash of tag/colour/background/font/spacing/border for every element
//   nodes - element count
// Run before and after a refactor phase for the same persona and compare the two results: any
// screen whose hash changed is a visible change to investigate.
// Usage: await captureUi({ routes: ['/', '/customer/CUS-1001'], customerTabs: true })
async function captureUi({ routes = ['/'], customerTabs = true, settleMs = 500 } = {}) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const h = (s) => { let x = 7; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x.toString(16); };
  const STYLE_PROPS = ['color', 'backgroundColor', 'fontSize', 'fontWeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopColor', 'borderTopWidth', 'borderRadius', 'boxShadow', 'display'];
  const fingerprint = () => {
    const root = document.querySelector('main') ?? document.body;
    const els = [root, ...root.querySelectorAll('*')];
    let style = '';
    for (const el of els) {
      const cs = getComputedStyle(el);
      style += el.tagName + STYLE_PROPS.map((p) => cs[p]).join('|') + ';';
    }
    return { text: h(root.innerText.replace(/\s+/g, ' ')), style: h(style), nodes: els.length };
  };
  // Wait until two fingerprints 400ms apart agree (loading spinners / async data done), max ~6s.
  const settled = async () => {
    await wait(settleMs);
    let prev = JSON.stringify(fingerprint());
    for (let i = 0; i < 10; i++) {
      await wait(400);
      const cur = JSON.stringify(fingerprint());
      if (cur === prev) return JSON.parse(cur);
      prev = cur;
    }
    return JSON.parse(prev);
  };
  const go = async (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  const out = {};
  for (const path of routes) {
    await go(path);
    out[path] = await settled();
    if (customerTabs && /^\/customer\//.test(path)) {
      const tabs = [...document.querySelectorAll('ol button')];
      for (let i = 0; i < tabs.length; i++) {
        const label = tabs[i].textContent.trim();
        tabs[i].click();
        out[`${path}#${label}`] = await settled();
      }
    }
  }
  return out;
}
