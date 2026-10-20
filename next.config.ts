import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: no `output: "standalone"` — that's for Docker self-hosting.
  // Vercel handles the build output automatically.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "z-cdn.chatglm.cn",
      },
      {
        protocol: "https",
        hostname: "sfile.chatglm.cn",
      },
    ],
  },
};

export default nextConfig;
