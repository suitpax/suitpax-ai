/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'assets.duffel.com', 'duffel-platform-public-assets.s3.eu-west-1.amazonaws.com', 'ui-avatars.com'],
  },
};

export default nextConfig;
