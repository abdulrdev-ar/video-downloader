import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  devIndicators: false,
  output: "standalone",
  images: {
    domains: [
      "i.ytimg.com",
      "img.youtube.com",
      "fbcdn.net",
      "cdninstagram.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
