// src/components/CategoryArticleList.js
'use client'; // <-- Помечаем, что это клиентский компонент

import React from 'react';
import ArticleCard from '@/components/ArticleCard';

// Этот компонент очень "глупый". Он просто принимает данные и рендерит их.
export default function CategoryArticleList({ articles, pageTitle }) {
    return (
        <div>
            <h1>{pageTitle}</h1>
            {articles && articles.length > 0 ? (
                articles.map(article => <ArticleCard key={article.id} article={article} />)
            ) : (
                <p>В этой категории пока нет статей.</p>
            )}
        </div>
    );
}