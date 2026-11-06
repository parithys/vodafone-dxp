/**
 * A scan from the desk scanner, as a file. The scanner is not integrated yet (there is no scanner service to call from a browser), so the scan is a stand-in: one A4-proportioned
 * JPEG page stamped "Scanned document" with the time, small enough to pass the upload rules. It is the one place to replace with the real scanner's output; every
 * "Scan Document" control reads its file from here.
 */
export async function scanDocument(now: Date = new Date()): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 620;
  canvas.height = 877;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Scanning is not available in this browser.');
  // The page is drawn in the design tokens' colours (the canvas cannot take var()).
  const tokens = getComputedStyle(document.documentElement);
  const token = (name: string) => tokens.getPropertyValue(name).trim() || 'currentColor';
  ctx.fillStyle = token('--paper');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = token('--field-card-border');
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.fillStyle = token('--fg');
  ctx.font = '600 28px sans-serif';
  ctx.fillText('Scanned document', 50, 90);
  ctx.font = '16px sans-serif';
  ctx.fillText(now.toISOString().replace('T', ' ').slice(0, 19), 50, 125);
  ctx.fillStyle = token('--icon-tile-bg');
  for (let y = 180; y < 800; y += 34) ctx.fillRect(50, y, canvas.width - 100, 10);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
  if (!blob) throw new Error('The scan could not be read.');
  const stamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  return new File([blob], `scan-${stamp}.jpg`, { type: 'image/jpeg' });
}
