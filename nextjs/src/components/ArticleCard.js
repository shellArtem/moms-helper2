// src/components/ArticleCard.js
import React from 'react';
import Link from 'next/link';
import './ArticleCard.css';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ArticleCard = ({ article }) => {
  if (!article) return null; // Защита от случая, если article не передан

  const imageUrl = `${API_URL}${article.image}`
  return (
    <Link href={`/article/${article.slug}`}>
      <article className="article-card">
        <div className="imageContainer">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            // sizes="100vw"
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="article-card-image"
            unoptimized={true}
          />
        </div>
        <div className="article-card-content">
          <h2 className="article-card-title">
            {article.title}
          </h2>
          <p className="article-card-excerpt">{article.excerpt}</p>
          <div className="read-more-btn">Читать далее</div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;