import type { NextConfig } from "next";
// @ts-expect-error - no types available for next-pwa
import withPWA from "next-pwa";


const isProd = process.env.NODE_ENV === "production";

const pwaConfig = {
  dest: "public", // service worker will be at /sw.js
  register: false, // we'll register manually in App Router
  skipWaiting: true,
  disable: !isProd,
  fallbacks: {
    document: "/offline", // route: /offline
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
      },
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.destination === "image",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images",
      },
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.destination === "script" ||
        request.destination === "style",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "assets",
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/"),
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 3,
      },
    },
  ],
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental: { appDir: true }, // only if needed
};

export default withPWA(pwaConfig)(nextConfig);
