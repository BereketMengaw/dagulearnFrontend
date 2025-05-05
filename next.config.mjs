/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dagulearnbackend-production.up.railway.app",
        pathname: "/uploads/**",
      },
      
    ],
    domains: [
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;
