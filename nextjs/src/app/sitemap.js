// src/app/sitemap.js

import axios from 'axios';

// URL вашего сайта. Лучше вынести в переменные окружения для гибкости.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moms-helper.ru';

// Эта функция будет вызвана Next.js на сервере для генерации sitemap.xml
export default async function sitemap() {
    // 1. Получаем все статьи с нашего API
    const articlesResponse = await axios.get(`${process.env.API_URL}/api/articles`);
    const articles = articlesResponse.data;

    // 2. Генерируем URL'ы для каждой статьи
    const articleUrls = articles.map((article) => ({
        url: `${SITE_URL}/article/${article.slug}`,
        lastModified: new Date(article.updatedAt || Date.now()), // Используем дату обновления или текущую
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 3. Добавляем основные статические страницы
    const staticPages = [
        {
            url: `${SITE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        // Можно добавить другие статичные страницы, если они есть, например /about
        // {
        //     url: `${SITE_URL}/about`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.5,
        // },
    ];

    // 4. Динамически генерируем URL'ы для всех страниц категорий
    const categories = [
        'pregnancy',
        'childbirth',
        'first-year',
        'child-health',
        'child-development',
    ];

    const categoryUrls = categories.map((category) => ({
        url: `${SITE_URL}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // 5. Объединяем все URL'ы в один массив и возвращаем
    return [...staticPages, ...categoryUrls, ...articleUrls];
}