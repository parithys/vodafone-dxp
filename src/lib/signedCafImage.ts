// The signed CAF as one image: the "Key Terms & Conditions: Primary Contact" form as it was shown (heading, customer, every key term, the agreements the
// customer ticked) with the signature they drew and who signed. Drawn on a canvas in the browser; imports nothing from the app.

export interface SignedCafImageInput {
  heading: string;
  customerName?: string;
  sections: { title: string; body: string }[];
  /** The agreement lines, each with whether it was ticked. */
  agreements: { text: string; agreed: boolean }[];
  signatureDataUrl: string;
  signedAt?: Date;
}

const WIDTH = 900;
const PAD = 40;
// Canvas 2D cannot resolve var(): the tokens are read once per drawing, with a named colour as the fallback. The form is drawn on white whatever the theme,
// so the paper and the ink are the document's own, not the theme's.
const token = (name: string, fallback: string) =>
  (typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() : '') || fallback;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('The signature could not be read.'));
    img.src = src;
  });

/** The signed form as a PNG data URL; the bare signature when there is no canvas to draw it on. */
export async function composeSignedCafImage(input: SignedCafImageInput): Promise<string> {
  if (typeof document === 'undefined') return input.signatureDataUrl;
  const INK = token('--fg', 'black');
  const MUTED = token('--fg-2', 'dimgray');
  const RULE = token('--border-soft', 'lightgray');
  const GREEN = token('--success', 'green');
  const font = (px: number, weight = 400) => `${weight} ${px}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
  const sig = await loadImage(input.signatureDataUrl);
  const sigW = Math.min(sig.width, 320);
  const sigH = Math.round((sig.height * sigW) / sig.width);
  const measure = document.createElement('canvas').getContext('2d')!;
  const inner = WIDTH - PAD * 2;
  type Row = { text: string; font: string; color: string; gap: number };
  const rows: Row[] = [];
  const push = (text: string, px: number, weight: number, color: string, gap: number) => {
    measure.font = font(px, weight);
    for (const l of wrap(measure, text, inner)) rows.push({ text: l, font: font(px, weight), color, gap });
  };
  push(input.heading, 22, 700, INK, 8);
  if (input.customerName) push(input.customerName, 16, 600, INK, 18);
  for (const s of input.sections) {
    push(s.title, 16, 600, INK, 4);
    push(s.body, 14, 400, MUTED, 14);
  }
  for (const a of input.agreements) push(`${a.agreed ? '[x]' : '[ ]'}  ${a.text}`, 14, 400, INK, 8);
  const lineH = (r: Row) => Math.round(parseInt(r.font.split(' ')[1], 10) * 1.45);
  const textH = rows.reduce((h, r) => h + lineH(r) + r.gap, 0);
  const height = PAD + textH + 24 + sigH + 56 + PAD;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, height);
  ctx.textBaseline = 'top';
  let y = PAD;
  for (const r of rows) {
    ctx.font = r.font;
    ctx.fillStyle = r.color;
    ctx.fillText(r.text, PAD, y);
    y += lineH(r) + r.gap;
  }
  ctx.strokeStyle = RULE;
  ctx.beginPath();
  ctx.moveTo(PAD, y + 8);
  ctx.lineTo(WIDTH - PAD, y + 8);
  ctx.stroke();
  y += 24;
  ctx.drawImage(sig, PAD, y, sigW, sigH);
  y += sigH + 12;
  ctx.font = font(14, 600);
  ctx.fillStyle = GREEN;
  const when = (input.signedAt ?? new Date()).toISOString().slice(0, 10);
  ctx.fillText(`Signed by ${input.customerName ?? 'the primary customer'} - ${when}`, PAD, y);
  return canvas.toDataURL('image/png');
}
