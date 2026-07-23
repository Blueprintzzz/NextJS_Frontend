import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Production backend on Render — update hostname to match your actual Render URL
      {
        protocol: "https",
        hostname: "*.onrender.com",
      },
      // Picsum placeholder images used during development/staging
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Allow any https source as a fallback
      {
        protocol: "https",
        hostname: "**",
      },
      // Allow http for local dev backend images
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
