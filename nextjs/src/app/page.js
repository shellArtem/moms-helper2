// // src/app/page.tsx
// import axios from 'axios';
// import ArticleCard from '@/components/ArticleCard';

// // Эта функция выполняется на сервере
// async function getArticles() {
//   try {
//     const response = await axios.get(`${process.env.API_URL}/api/articles`);
//     return response.data.sort((a, b) => b.id - a.id); // Сортируем сразу
//   } catch (error) {
//     console.error("Ошибка при загрузке статей:", error);
//     return [];
//   }
// }

// // Это серверный компонент
// export default async function HomePage() {
//   const articles = await getArticles();

//   return (
//     <div>
//       <h1>Последние статьи</h1>
//       {articles.map(article => (
//         <ArticleCard key={article.id} article={article} />
//       ))}
//     </div>
//   );
// }
// src/app/page.tsx
'use client'; // <-- ШАГ 1: Превращаем в клиентский компонент

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ArticleCard from '@/components/ArticleCard';

// Создаем отдельный компонент для "липкого" поиска
const StickySearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="sticky-search-container">
            <input
                type="text"
                placeholder="Поиск по статьям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        </div>
    );
};


export default function HomePage() {
    // --- ШАГ 2: Добавляем состояния ---
    const [allArticles, setAllArticles] = useState([]); // Хранилище для всех статей
    const [searchTerm, setSearchTerm] = useState('');    // Поисковый запрос
    const [loading, setLoading] = useState(true);

    // --- Логика загрузки данных переезжает в useEffect ---
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
                const sortedArticles = response.data.sort((a, b) => b.id - a.id);
                setAllArticles(sortedArticles);
            } catch (error) {
                console.error("Ошибка при загрузке статей:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []); // Пустой массив зависимостей = запустить 1 раз при монтировании

    
    // --- ШАГ 4: Логика фильтрации ---
    // useMemo кэширует результат фильтрации, чтобы она не запускалась при каждом ре-рендере
    const filteredArticles = useMemo(() => {
        if (!searchTerm) {
            // Если в поиске пусто, показываем первые 30 статей
            return allArticles.slice(0, 30);
        }
        
        const lowercasedFilter = searchTerm.toLowerCase();

        return allArticles.filter(article => {
            // Убираем HTML-теги из content для более чистого поиска
            const contentAsText = article.content.replace(/<[^>]*>?/gm, '');

            return (
                article.title.toLowerCase().includes(lowercasedFilter) ||
                article.excerpt.toLowerCase().includes(lowercasedFilter) ||
                contentAsText.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [searchTerm, allArticles]); // Пересчитывать только при изменении этих зависимостей


    if (loading) {
        return <p>Загрузка...</p>;
    }
    
    return (
        <div>
            {/* --- ШАГ 3: Добавляем компонент поиска --- */}
            <StickySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <h1>Последние статьи</h1>

            {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))
            ) : (
                <p>По вашему запросу ничего не найдено.</p>
            )}
        </div>
    );
}
