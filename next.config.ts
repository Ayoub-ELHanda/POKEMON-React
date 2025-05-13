import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'static.wikia.nocookie.net' },
    ],
  },
};

export default nextConfig;
