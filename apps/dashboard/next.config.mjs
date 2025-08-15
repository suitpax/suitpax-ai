/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['ui', 'utils', 'domains', 'shared'],
  experimental: {
    optimizePackageImports: ['ui']
  },
  images: {
    domains: ['images.unsplash.com', 'api.qrserver.com', 'ui-avatars.com'],
    unoptimized: false
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/ui': '../../packages/ui/components',
      '@/lib': '../../packages/utils',
      '@/hooks': '../../packages/ui/hooks',
      '@/contexts': '../../packages/ui/contexts',
      '@/types': '../../packages/shared/types',
      '@/domains': '../../packages/domains'
    };
    return config;
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