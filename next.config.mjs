/** @type {import('next').NextConfig} */
// Static export for GitHub Pages: every route is prerendered into out/. trailingSlash gives
// /privacy/index.html, which Pages serves without any rewrite rules. inlineCss: the two stylesheets
// are under 7 KB together; inlining them removes two render-blocking round trips on slow 4G.
const nextConfig = {
  reactStrictMode: true,
  // A second build directory on request (NEXT_DIST_DIR=.next-build): `next build` into the default .next while a
  // `next dev` is running corrupts the dev server. scripts/run-checks.sh builds this way. The static site then lands in that directory instead of out/.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { inlineCss: true },
};
export default nextConfig;
