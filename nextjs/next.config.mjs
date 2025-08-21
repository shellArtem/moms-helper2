/** @type {import('next').NextConfig} */
const nextConfig = {
    // Эта секция у вас уже может быть
    images: {
        // --- ДОБАВЬТЕ ЭТОТ ОБЪЕКТ В МАССИВ remotePatterns ---
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'moms-helper.ru',
                port: '', // для https порт не нужен
                pathname: '/images/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001', // Укажите порт вашего API!
                pathname: '/images/**', // Разрешаем все пути, начинающиеся с /images/
            },
        ],
    },
};

export default nextConfig;
