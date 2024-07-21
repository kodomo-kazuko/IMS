/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.147.17.74",
        port: "8080",
        pathname: "/uploads/images/**",
      },
    ],
  },
};

export default nextConfig;
