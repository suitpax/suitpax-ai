/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@suitpax/ui', '@suitpax/utils', '@suitpax/domains', '@suitpax/shared'],
  experimental: {
    optimizePackageImports: ['@suitpax/ui']
  },
  images: {
    domains: ['images.unsplash.com', 'api.qrserver.com'],
    unoptimized: false
  },
  async rewrites() {
    return [
      {
        source: '/api/travel/:path*',
        destination: '/api/travel/:path*'
      }
    ];
  }
};

export default nextConfig;