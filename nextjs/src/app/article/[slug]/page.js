import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'; // <--- Импортируем Link для внутренних ссылок
import '../../../styles/ArticlePage.css';
import BackButton from '../../../components/BackButton';
import styles from './ArticlePage.module.css'; // <-- ШАГ 1: Используем CSS Modules для лучшей изоляции стилей
import ShareButton from './ShareButton';
import { notFound } from 'next/navigation';

import CommentsBlock from '../../../components/CommentsBlock';

// Функция для загрузки одной статьи по slug
async function getArticle(slug) {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/articles/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при загрузке статьи ${slug}:`, error);
        return null;
    }
}

// Функция для загрузки ВСЕХ статей (для блока "Вам также интересно")
async function getAllArticles() {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/articles`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке всех статей:", error);
        return [];
    }
}

// Функция для генерации мета-тегов на сервере
export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    const article = await getArticle(awaitedParams.slug);
    if (!article) {
        return {
            title: 'Статья не найдена',
            description: 'Запрошенная статья не найдена на сайте.'
        };
    } else {
        const canonicalUrl = `https://moms-helper.ru/article/${article.slug}`;

        return {
            title: `${article.title}`,
            description: article.excerpt,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title: `${article.title} - Помощник Мамы`,
                description: article.excerpt,
                url: canonicalUrl,
                // images: [{ url: article.image }],
            },
            twitter: {
                card: "summary_large_image",
                title: `${article.title} - Помощник Мамы`,
                description: article.excerpt,
                // images: [article.image],
            },
        };
    }

}

// Компонент страницы
export default async function ArticlePage({ params }) {
    const awaitedParams = await params;
    const currentArticle = await getArticle(awaitedParams.slug);

    if (!currentArticle) {
        // return <div>Статья не найдена.</div>;
        notFound();
    }

    const allArticles = await getAllArticles(); // Загружаем все статьи

    // Фильтруем статьи для блока "Вам также интересно"
    // Исключаем текущую статью
    const otherArticles = allArticles.filter(
        (article) => article.id !== currentArticle.id
    );

    // Сначала ищем 5 статей из той же категории
    let relatedArticles = otherArticles.filter(
        (article) => article.category === currentArticle.category
    );

    // Если статей в категории меньше 5, дополняем рандомными из оставшихся
    if (relatedArticles.length < 5) {
        const remainingArticles = otherArticles.filter(
            (article) => article.category !== currentArticle.category
        );
        // Перемешиваем оставшиеся статьи
        const shuffledRemaining = remainingArticles.sort(() => 0.5 - Math.random());
        // Добавляем их, пока не наберется 5 или не закончатся статьи
        relatedArticles = [...relatedArticles, ...shuffledRemaining].slice(0, 5);
    } else {
        // Если статей в категории достаточно, перемешиваем их и берем первые 5
        relatedArticles = relatedArticles.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://moms-helper.ru/article/${currentArticle.slug}`
        },
        "headline": currentArticle.title,
        "description": currentArticle.excerpt,
        "image": `https://moms-helper.ru${currentArticle.image}`, // Убедитесь, что здесь полный URL
        "author": {
            "@type": "Person", // или Organization, если статьи пишет редакция
            "name": "Эксперт Помощника Мамы" // ВАЖНО: Добавьте это поле в ваш JSON
        },
        "publisher": {
            "@type": "Organization",
            "name": "Помощник Мамы",
            "logo": {
                "@type": "ImageObject",
                "url": "https://moms-helper.ru/logo.png" // Укажите полный путь к логотипу сайта
            }
        },
    };


    return (
        <div className={styles['article-page-container']}> {/* Используем CSS Modules */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            <BackButton />
            <ShareButton />

            <div className={styles['article-page']}>
                <div className={styles.imageContainer}>
                    {currentArticle.image && (
                        <Image
                            src={currentArticle.image}
                            alt={currentArticle.title}
                            fill
                            // sizes="100vw"
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                            className="article-header-image"
                            unoptimized={true}
                        />
                    )}
                </div>
                <h1>{currentArticle.title}</h1>
                <div
                    className={styles['article-content']}
                    dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                />

                <CommentsBlock
                    articleSlug={currentArticle.slug}
                    initialComments={currentArticle.comments || []}
                />

                {/* Блок "Вам также может быть интересно" */}
                {relatedArticles.length > 0 && (
                    <div className={styles.relatedArticlesBlock}>
                        <h2>Вам также может быть интересно:</h2>
                        <ul>
                            {relatedArticles.map((article) => (
                                <li key={article.id}>
                                    <Link href={`/article/${article.slug}`}>
                                        {article.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr className={styles.divider} />
            </div>
        </div>
    );
}