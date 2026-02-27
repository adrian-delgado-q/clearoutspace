import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Allow the image optimizer to fetch from localhost (PocketBase in local/Docker dev).
    // In production the src URLs point to cms.clearoutspaces.ca, not localhost.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // Local development – PocketBase on localhost:8090
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      },
      // Production – PocketBase behind Cloudflare tunnel at cms.clearoutspaces.ca
      {
        protocol: "https",
        hostname: "cms.clearoutspaces.ca",
        port: "",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
