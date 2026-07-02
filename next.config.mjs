/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets validation builds run alongside `next dev` without clobbering the
  // dev server's .next cache (e.g. NEXT_DIST_DIR=.next-build npm run build).
  distDir: process.env.NEXT_DIST_DIR || ".next"
};

export default nextConfig;
