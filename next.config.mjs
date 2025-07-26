/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'suitpax.com', 'app.suitpax.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
        has: [
          {
            type: 'host',
            value: 'app.suitpax.com',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/dashboard/:path*',
        destination: 'https://app.suitpax.com/dashboard/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'suitpax.com',
          },
        ],
      },
    ]
  },
}

export default nextConfig
