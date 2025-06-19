import type { NextConfig } from "next";
import path from "path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config: NextConfig) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  images: {
    domains: ["localhost", "res.cloudinary.com", "i.pravatar.cc"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
      },
    ],
  },
};

export default nextConfig;
