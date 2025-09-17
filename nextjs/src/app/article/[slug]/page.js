import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'; // <--- Импортируем Link для внутренних ссылок
import '../../../styles/ArticlePage.css';
import BackButton from '../../../components/BackButton';
import styles from './ArticlePage.module.css'; // <-- ШАГ 1: Используем CSS Modules для лучшей изоляции стилей
import ShareButton from './ShareButton';

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
    const currentArticle = await getArticle(awaitedParams.slug);

    if (!currentArticle) {
        return <div>Статья не найдена.</div>;
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

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentArticle.title,
                    text: "Посмотри эту статью!",
                    url,
                });
            } catch (err) {
                console.error("Ошибка при использовании Web Share API:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("Ссылка скопирована!");
            } catch (err) {
                console.error("Не удалось скопировать ссылку:", err);
            }
        }
    };


    return (
        <div className={styles['article-page-container']}> {/* Используем CSS Modules */}
            <BackButton />
            <ShareButton />

            <div className={styles['article-page']}>
                <div className={styles.imageContainer}>
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
                </div>
                <h1>{currentArticle.title}</h1>
                <div
                    className={styles['article-content']}
                    dangerouslySetInnerHTML={{ __html: currentArticle.content }}
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
            </div>
        </div>
    );
}