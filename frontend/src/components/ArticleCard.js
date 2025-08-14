// src/components/ArticleCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

const API_URL = 'http://localhost:3001';

const ArticleCard = ({ article }) => {
  return (
    <article className="article-card">
      <Link to={`/article/${article.slug}`}>
        <img src={`${API_URL}${article.image}`} alt={article.title} className="article-card-image" />
      </Link>
      <div className="article-card-content">
        <h2 className="article-card-title">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="article-card-excerpt">{article.excerpt}</p>
        <Link to={`/article/${article.slug}`} className="read-more-btn">Читать далее</Link>
      </div>
    </article>
  );
};

export default ArticleCard;