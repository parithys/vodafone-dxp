/** Escapes text for interpolation into the HTML a printable document is built from. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

const PRINT_STYLES = `
  body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
  h1 { font-size: 1.4rem; margin: 0 0 0.25rem; }
  h2 { font-size: 1rem; margin: 1.25rem 0 0.25rem; }
  p { margin: 0.25rem 0; }
  dl { margin: 1rem 0; }
  dl div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.35rem 0; border-bottom: 1px solid; }
  dt { font-weight: 600; }
  .meta { font-size: 0.9rem; }
  .note { font-size: 0.8rem; font-style: italic; margin-top: 2rem; }
`;

/**
 * Prints a document that is not on screen: `bodyHtml` is written into a hidden iframe and that frame is printed, so the page
 * the agent is looking at is not touched (and the browser's print dialog shows just the document). Build `bodyHtml` with
 * `escapeHtml` for every value that comes from data.
 */
export function printHtmlDocument(title: string, bodyHtml: string): void {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    return;
  }
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${PRINT_STYLES}</style></head><body>${bodyHtml}</body></html>`);
  doc.close();
  win.onafterprint = () => frame.remove();
  // Let the frame lay out before the dialog opens.
  window.setTimeout(() => {
    win.focus();
    win.print();
  }, 0);
}
