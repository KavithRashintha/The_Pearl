import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8003/api/:path*',
            },
        ];
    },
    images: {
        domains: [
            'upload.wikimedia.org',
            'www.tourism.cp.gov.lk',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pearl-app-user-images.s3.eu-north-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
