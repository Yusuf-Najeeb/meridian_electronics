import type { NextConfig } from "next";

const backend = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(
  /\/$/,
  "",
);

if (process.env.VERCEL === "1" && !process.env.BACKEND_URL) {
  console.warn(
    "[next.config] BACKEND_URL is unset on Vercel — set it in Project → Settings → Environment Variables (your FastAPI / API Gateway origin, no trailing slash).",
  );
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
