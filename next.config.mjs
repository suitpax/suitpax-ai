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
    domains: ['images.unsplash.com', 'source.unsplash.com', 'ui-avatars.com', 'cdn.brandfetch.io', 'assets.duffel.com', 'static.duffel.com'],
  }
};

export default nextConfig;
