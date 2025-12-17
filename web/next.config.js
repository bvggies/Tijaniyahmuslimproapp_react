const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Match your backend API URL; override via process.env.API_URL at build time
      urlPattern: /^https:\/\/REPLACE_WITH_BACKEND_API_URL\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['REPLACE_WITH_BACKEND_API_HOST'],
  },
  env: {
    // Backend API URL – override via process.env.API_URL in each environment
    API_URL: process.env.API_URL || 'https://REPLACE_WITH_BACKEND_API_URL',
  },
};

module.exports = withPWA(nextConfig);

