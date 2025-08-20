// src/app/article/[slug]/page.js

import axios from 'axios';
import Image from 'next/image'; // Используем next/image для оптимизации
import '../../../styles/ArticlePage.css'; // <-- ШАГ 1: Импортируем CSS-модуль
import BackButton from '../../../components/BackButton'; // <-- ШАГ 3: Создадим отдельный компонент для кнопки

// Функция для загрузки данных на сервере
async function getArticle(slug) {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/articles/${slug}`);
        return response.data;
    } catch (error) {
        return null;
    }
}

// Функция для генерации мета-тегов на сервере
export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    const article = await getArticle(awaitedParams.slug);
    if (!article) {
        return { title: 'Статья не найдена' };
    }
    return {
        title: `${article.title} - Помощник Мамы`,
        description: article.excerpt,
    };
}

// Компонент страницы
export default async function ArticlePage({ params }) {
    const awaitedParams = await params;
    const article = await getArticle(awaitedParams.slug);

    if (!article) {
        return <div>Статья не найдена.</div>;
    }

    return (
        // --- ШАГ 2: Применяем классы как обычные строки ---
        <div className="article-page-container">
            <BackButton />

            <div className="article-page">
                <div className="imageContainer">
                    <Image
                        src={article.image} 
                        alt={article.title}
                        fill
                        // sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        className="article-header-image"
                        unoptimized={true}
                    />
                </div>
                <h1>{article.title}</h1>
                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </div>
    );
}