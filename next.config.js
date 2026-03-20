/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16: use remotePatterns instead of deprecated domains
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
    // Allow the explicit quality={90} used in several components
    qualities: [75, 90],
  },
}

module.exports = nextConfig

