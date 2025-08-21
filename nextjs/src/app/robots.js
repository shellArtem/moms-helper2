// Эта функция будет вызвана Next.js во время сборки
export default function robots() {
  return {
    rules: {
      userAgent: '*', // Правила для всех ботов
      allow: '/', // Разрешить индексировать все, что не запрещено
      disallow: [
        '/admin/', // Запретить всю админку
        '/api/', // Запретить служебные API-роуты
      ],
    },
    sitemap: 'https://moms-helper.ru/sitemap.xml', // Указываем путь к нашей будущей карте сайта
  };
}