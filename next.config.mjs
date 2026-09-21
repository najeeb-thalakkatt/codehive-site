/** @type {import('next').NextConfig} */
// Static export for GitHub Pages: every route is prerendered into out/. trailingSlash gives
// /privacy/index.html, which Pages serves without any rewrite rules. inlineCss: the two stylesheets
// are under 7 KB together; inlining them removes two render-blocking round trips on slow 4G.
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { inlineCss: true },
};
export default nextConfig;
