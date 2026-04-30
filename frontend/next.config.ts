import type { NextConfig } from "next";

if (process.env.VERCEL === "1" && !process.env.BACKEND_URL) {
  console.warn(
    "[next.config] BACKEND_URL is unset on Vercel — set it in Project → Settings → Environment Variables (Render/API origin, no trailing slash). API routes under app/api-proxy/ read it at runtime.",
  );
}

const nextConfig: NextConfig = {};

export default nextConfig;
