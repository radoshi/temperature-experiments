/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  async rewrites() {
    return [
      {
        source: '/api',
        destination: 'http://127.0.0.1:8080/api',
      },
    ];
  },
};

module.exports = nextConfig;
