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
  }
}

module.exports = nextConfig
