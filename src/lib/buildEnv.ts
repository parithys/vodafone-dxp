// Build-time flags, read in ONE place so the host that builds the app (Vite today, Next.js in the spike) is the only thing that differs.
// Vite replaces `import.meta.env`; Next defines none and exposes `process.env.NEXT_PUBLIC_*` instead. Imports nothing from the app.
// Next inlines `process.env.*` at build time; Vite never evaluates these branches (viteEnv is set there).
declare const process: { env: Record<string, string | undefined> };

const viteEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;

/** A development build (the extra consistency warnings run only here). */
export const IS_DEV: boolean = viteEnv ? Boolean(viteEnv.DEV) : process.env.NODE_ENV === 'development';

/** `VITE_SHOW_DEMO` / `NEXT_PUBLIC_SHOW_DEMO`: the string 'false' hides demo-only UI; anything else shows it. */
export const SHOW_DEMO_FLAG: string | undefined = viteEnv ? (viteEnv.VITE_SHOW_DEMO as string | undefined) : process.env.NEXT_PUBLIC_SHOW_DEMO;
