// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'zvyuurbieuionummrcqi.supabase.co', 'picsum.photos', 'fastly.picsum.photos']
  },
};

module.exports = nextConfig;
