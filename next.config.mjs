// Next.js spike configuration. Static export only: the application is a front-end prototype and needs no Next server.
// `react-router-dom` is aliased to src/next/routerCompat.tsx so application code is unchanged (see that file).
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  typescript: { tsconfigPath: 'tsconfig.next.json' },
  turbopack: { resolveAlias: { 'react-router-dom': './src/next/routerCompat.tsx' } },
};
export default nextConfig;
