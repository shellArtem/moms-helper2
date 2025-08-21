/** @type {import('next').NextConfig} */
const nextConfig = {
    // Эта секция у вас уже может быть
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'moms-helper.ru',
                pathname: '/images/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/images/**',
            },
        ],
    },
};

export default nextConfig;
