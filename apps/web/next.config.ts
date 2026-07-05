import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo is bind-mounted into Docker; keep the container's build cache
  // separate from host-side `next build` output so they don't corrupt each other.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  async rewrites() {
    // Proxy API calls through the web origin so the session cookie is
    // first-party everywhere (Docker in dev, Vercel -> Render in prod).
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:4000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
