import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Required for Docker deployment
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "motivated-health-e41c7505c5.media.strapiapp.com",
      },
      {
        // Production Strapi uploads
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
      {
        // Allow any domain for production flexibility
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
