import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any origin during development.
  // Tighten this to specific domains before production.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Suppress the "missing suspense boundary" warning for useSearchParams
  // during static generation. Protected pages are client-rendered anyway.
  experimental: {},
};

export default nextConfig;
