/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === '1';

// Only import contentlayer when not on Vercel
let withContentlayer;
if (!isVercel) {
  withContentlayer = require('next-contentlayer').withContentlayer;
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['gwetfkan2dovfoiz.public.blob.vercel-storage.com'],
  },
  swcMinify: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Sec-WebSocket-Accept, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/guides/index',
        permanent: true,
      },
    ];
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

const { withSentryConfig } = require("@sentry/nextjs");

// Export the config with or without ContentLayer based on environment
module.exports = isVercel ? nextConfig : withContentlayer(nextConfig);