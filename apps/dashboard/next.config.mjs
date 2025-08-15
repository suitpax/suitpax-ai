/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@suitpax/ui', '@suitpax/utils', '@suitpax/domains', '@suitpax/shared'],
  experimental: {
    optimizePackageImports: ['@suitpax/ui']
  },
  images: {
    domains: ['images.unsplash.com', 'api.qrserver.com', 'ui-avatars.com'],
    unoptimized: false
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/ui': '../../packages/ui/src/components',
      '@/components/prompt-kit': '../../packages/ui/src/components/prompt-kit',
      '@/lib': '../../packages/utils/src',
      '@/hooks': '../../packages/ui/src/hooks',
      '@/contexts': '../../packages/ui/src/contexts',
      '@/types': '../../packages/shared/src/types',
      '@/domains': '../../packages/domains/src'
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