import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/px-widget-builder',
  images: { unoptimized: true },
};

export default nextConfig;
