/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: 'a0.muscache.com'
      },
      {
        hostname: 'thispersondoesnotexist.com'
      },
      {
        hostname: 'images.unsplash.com'
      },
      {
        hostname: 'i.pravatar.cc'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
