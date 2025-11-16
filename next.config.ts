import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    MONGO_URL:""
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};



export default nextConfig;
