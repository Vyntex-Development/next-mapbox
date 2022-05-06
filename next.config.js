/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [567, 768, 992, 1200, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: "/_next/image",
    loader: "default",
    domains: ["www.worldatlas.com"],
  },
};

module.exports = nextConfig;
