import type { NextConfig } from "next";
import { normalizeBasePath } from "./lib/base-path";

const normalizedBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Set NEXT_PUBLIC_BASE_PATH to your repo name when deploying to GitHub Pages
  // e.g. NEXT_PUBLIC_BASE_PATH=/merchant-rpg-helper
  basePath: normalizedBasePath,
};

export default nextConfig;
