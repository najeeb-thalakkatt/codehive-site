/** @type {import('next').NextConfig} */
// Static export for GitHub Pages: every route is prerendered into out/. trailingSlash gives
// /privacy/index.html, which Pages serves without any rewrite rules. inlineCss: the two stylesheets
// are under 7 KB together; inlining them removes two render-blocking round trips on slow 4G.
const nextConfig = {
  reactStrictMode: true,
  // A second build directory on request (NEXT_DIST_DIR=.next-build): `next build` into the default .next while a
  // `next dev` is running corrupts the dev server. scripts/run-checks.sh builds this way. The export still goes to out/.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { inlineCss: true },
  // Lab routes: a `page.lab.tsx` is a page only when DESIGN_NEW=1 (see .env.example) adds `lab.tsx` here.
  // Without it the file is an ordinary module, so the deploy (no such variable) never builds the route.
  pageExtensions: process.env.DESIGN_NEW === "1" ? ["lab.tsx", "tsx", "ts", "jsx", "js"] : ["tsx", "ts", "jsx", "js"],
};
export default nextConfig;
