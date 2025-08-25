/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com', 'images.pexels.com', 'ui-avatars.com', 'cdn.brandfetch.io', 'assets.duffel.com', 'static.duffel.com', 'images.duffel.com', 'duffel.com'],
  }
};

export default nextConfig;
