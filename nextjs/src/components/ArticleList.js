// src/components/ArticleList.js
'use client';

import React, { useState, useMemo } from 'react';
import ArticleCard from '@/components/ArticleCard';

// Компонент для поиска (можно оставить здесь или вынести)
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

// Принимает готовый список статей как проп
export default function ArticleList({ initialArticles }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        if (!searchTerm) {
            return initialArticles.slice(0, 30);
        }
        
        const lowercasedFilter = searchTerm.toLowerCase();

        return initialArticles.filter(article => {
            const contentAsText = article.content.replace(/<[^>]*>?/gm, '');
            return (
                article.title.toLowerCase().includes(lowercasedFilter) ||
                article.excerpt.toLowerCase().includes(lowercasedFilter) ||
                contentAsText.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [searchTerm, initialArticles]);

    return (
        <div>
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