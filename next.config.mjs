/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api.tixogame.com/api/:path*',
      },
    ];
  },
  images: {
    domains: [ 'api.tixogame.com'], // ✅ allow images from your API
  },
};

export default nextConfig;
