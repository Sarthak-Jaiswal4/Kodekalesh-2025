import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    MONGO_URL:"mongodb+srv://Sarthak:mbtzpMzdhkXJscT9@cluster0.p3l1rki.mongodb.net/JUD_RAG?retryWrites=true&w=majority&appName=Cluster0"
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
