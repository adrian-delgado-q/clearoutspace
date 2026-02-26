import type { NextConfig } from "next";
import path from "path";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

let strapiHostname = "localhost";
try {
  strapiHostname = new URL(STRAPI_HOST).hostname;
} catch {
  // keep default
}

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: strapiHostname,
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: strapiHostname,
        port: "",
        pathname: "/uploads/**",
      },
      // Cloudinary fallback
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
