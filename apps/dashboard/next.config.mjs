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
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  }
};

export default nextConfig;