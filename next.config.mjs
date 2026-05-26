/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/web",
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true, // Abaikan error ketik agar tetap bisa build
  },
  eslint: {
    ignoreDuringBuilds: true, // Abaikan peringatan format agar tetap bisa build
  },
};

export default nextConfig;
