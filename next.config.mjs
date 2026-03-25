import { setupPlatform } from '@cloudflare/next-on-pages';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

const withCloudflare = setupPlatform();
export default withCloudflare(nextConfig);