/** @type {import('next').NextConfig} */
// inlineCss: the two stylesheets are under 7 KB together; inlining them removes two render-blocking round trips on slow 4G.
const nextConfig = { reactStrictMode: true, experimental: { inlineCss: true } };
export default nextConfig;
