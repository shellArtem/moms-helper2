// src/components/ArticleCard.js
import React from 'react';
import Link from 'next/link';
import './ArticleCard.css';

// URL вашего API, доступный на клиенте
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ArticleCard = ({ article }) => {
  if (!article) return null; // Защита от случая, если article не передан

  return (
    <article className="article-card">
      {/* --- ИЗМЕНЕНИЕ: to -> href --- */}
      <Link href={`/article/${article.slug}`}>
        {/* --- ИЗМЕНЕНИЕ: Правильное формирование URL изображения --- */}
        <img 
          src={`${API_URL}${article.image}`} 
          alt={article.title} 
          className="article-card-image" 
        />
      </Link>
      <div className="article-card-content">
        <h2 className="article-card-title">
          {/* --- ИЗМЕНЕНИЕ: to -> href --- */}
          <Link href={`/article/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="article-card-excerpt">{article.excerpt}</p>
        {/* --- ИЗМЕНЕНИЕ: to -> href --- */}
        <Link href={`/article/${article.slug}`} className="read-more-btn">Читать далее</Link>
      </div>
    </article>
  );
};

export default ArticleCard;