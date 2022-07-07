/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_TOKEN_LOCAL: process.env.MAPBOX_TOKEN_LOCAL,
    MAPBOX_TOKEN_PRODUCTION: process.env.MAPBOX_TOKEN_PRODUCTION,
    AIRTABLE_ACCESS_KEY: process.env.AIRTABLE_ACCESS_KEY,
    SUPABASE_JWT_TOKEN_SECRET: process.env.SUPABASE_JWT_TOKEN_SECRET,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    SUPABASE_PUBLIC_KEY: process.env.SUPABASE_PUBLIC_KEY,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_SECRET_KEY: process.env.TWITTER_SECRET_KEY,
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET_TOKEN: process.env.TWITTER_ACCESS_SECRET_TOKEN,
  },
  images: {
    deviceSizes: [567, 768, 992, 1200, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: "/_next/image",
    loader: "default",
    domains: ["www.worldatlas.com"],
  },
  async headers() {
    return [
      {
        source: "/public/VCR_OSD_MONO_1.001.ttf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
