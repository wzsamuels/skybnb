/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: 'a0.muscache.com'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
