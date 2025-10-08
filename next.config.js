const withNextIntl = require('next-intl/plugin')('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
      },
    ],
  },
  // Ensure proper routing for Vercel deployment
  trailingSlash: false,
  // Optimize for production
  poweredByHeader: false,
}

module.exports = withNextIntl(nextConfig)
