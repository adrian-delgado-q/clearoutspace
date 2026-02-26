import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Emit a self-contained output folder — optimal for Docker images
  output: "standalone",
  turbopack: {
    // Prevent Next.js from scanning parent directories for lockfiles
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
