/** @type {import('next').NextConfig} */
const nextConfig = {
    // Эта секция у вас уже может быть
    images: {
        // --- ДОБАВЬТЕ ЭТОТ ОБЪЕКТ В МАССИВ remotePatterns ---
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001', // Укажите порт вашего API!
                pathname: '/images/**', // Разрешаем все пути, начинающиеся с /images/
            },
            // Сюда в будущем вы добавите домен вашего продакшен-API
            // {
            //   protocol: 'https',
            //   hostname: 'api.moms-helper.ru',
            //   port: '',
            //   pathname: '/images/**',
            // }
        ],
    },
};

export default nextConfig;
