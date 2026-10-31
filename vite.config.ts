import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// One app, one codebase. The three dev servers (web 5173, tablet 5174, mobile 5175 - see package.json) are only separate
// addresses for opening and testing each device view side by side; nothing here or in the app depends on the port, and the
// layout and behaviour adapt to the real viewport and device. Each port gets its own dependency cache (cacheDir) so servers
// started together don't race to pre-bundle into one shared folder, and a fixed port (strictPort) so a view never moves.
const port = process.env.PORT ? Number(process.env.PORT) : 5173
const previewViteClient = `
const hotData = new Map()

export class ErrorOverlay extends HTMLElement {}

export function createHotContext(ownerPath) {
  if (!hotData.has(ownerPath)) hotData.set(ownerPath, {})
  return {
    data: hotData.get(ownerPath),
    accept() {},
    acceptExports() {},
    decline() {},
    dispose() {},
    invalidate() {},
    on() {},
    off() {},
    prune() {},
    send() { return Promise.resolve() },
  }
}

export function updateStyle(id, content) {
  let style = document.querySelector(\`style[data-vite-dev-id="\${id}"]\`)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('data-vite-dev-id', id)
    document.head.appendChild(style)
  }
  style.textContent = content
}

export function removeStyle(id) {
  document.querySelector(\`style[data-vite-dev-id="\${id}"]\`)?.remove()
}

export function injectQuery(url, query) {
  const [path, hash = ''] = url.split('#', 2)
  return \`\${path}\${path.includes('?') ? '&' : '?'}\${query}\${hash ? \`#\${hash}\` : ''}\`
}
`

function basePathCompatibility(figmaPreview: boolean): Plugin {
  return {
    name: 'base-path-compatibility',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname] = (req.url ?? '').split('?', 2)
        if (figmaPreview && pathname === '/@vite/client') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/javascript')
          res.setHeader('Cache-Control', 'no-store')
          res.end(previewViteClient)
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const figmaPreview = command === 'serve' && process.env.FIGMA_MAKE_PREVIEW === '1'
  return {
    // The app is served from the domain root (e.g. /mobile/start-connection).
    base: '/',
    plugins: [basePathCompatibility(figmaPreview), react(), tailwindcss()],
    // Tailwind runs through its Vite plugin; ignore postcss.config.mjs (that file is for the Next.js spike only).
    css: { postcss: { plugins: [] } },
    resolve: {
      // Lazy route chunks and the eagerly loaded shell must share one React
      // module identity, including after Vite rebuilds its dependency cache.
      dedupe: ['react', 'react-dom'],
    },
    cacheDir: `node_modules/.vite-${port}`,
    server: {
      port,
      strictPort: true,
      allowedHosts: ['.devtunnels.ms'],
      // Make's public proxy duplicates WebSocket Upgrade response headers.
      // Disable its unusable socket; the preview client shim above preserves
      // the runtime exports needed by transformed modules.
      hmr: figmaPreview ? false : undefined,
    },
  }
})
