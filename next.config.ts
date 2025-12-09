import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'images.unsplash.com',
         },
         {
            protocol: 'https',
            hostname: 'picsum.photos',
         },
         {
            protocol: 'https',
            hostname: 'source.unsplash.com',
         },
         {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
         },
      ],
   },
   async rewrites() {
      return [
         {
            source: '/api/chat',
            destination: 'http://localhost:5000/api/chat',
         },
      ];
   },
};

export default nextConfig;
