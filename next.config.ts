import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === 'development'
        ? 'https://caanip.api.kamilereon.net/api/:path*'
        : 'https://caanip.api.kamilereon.net/api/:path*',
      }
    ]
  }
};

export default nextConfig;
