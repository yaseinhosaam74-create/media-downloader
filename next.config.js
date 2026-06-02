/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { domains: ["i.ytimg.com", "img.youtube.com", "i.scdn.co", "p16-sign-va.tiktokcdn.com"] },
};
module.exports = nextConfig;
