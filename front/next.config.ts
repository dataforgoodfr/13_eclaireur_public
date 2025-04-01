import type { NextConfig } from "next";





const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // unoptimized: true,
    // loader: 'custom',
    // loaderFile: './src/app/my-loader.ts',
    remotePatterns: [
      {
        // replace remote patterns when production
        // patterns for production just below
        // protocol: 'https',
        // hostname: 'strapi-reunion-pingenerator.onrender.com',
        protocol: 'https',
        hostname: 'placehold.co',
        // pathname: '/dlm2lmaxc/image/upload/**',
        // patterns for local dev just below
        // protocol: 'http',
        // hostname: '127.0.0.1',
        // port: '1337',
        // keep line below for all environments but cloudinary
        // pathname: '/uploads/**',
      },
    ],
    // disableStaticImages: true,
  },
};

export default nextConfig;