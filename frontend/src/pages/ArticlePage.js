// src/pages/ArticlePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './ArticlePage.css';

const API_URL = 'http://localhost:3001';

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles/${slug}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке статьи:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const goBack = () => {
    navigate(-1); // Эта команда возвращает на предыдущую страницу в истории браузера
  };

  if (loading) {
    return <p>Загрузка статьи...</p>;
  }

  if (!article) {
    return <p>Статья не найдена.</p>;
  }

  return (
    <div className="article-page-container">
      {/* --- Наша новая кнопка "Назад" --- */}
      <button onClick={goBack} className="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* --- Ваш существующий контент страницы --- */}
      <div className="article-page">
        <Helmet>
          <title>{article.title} - Помощник Мамы</title>
          <meta name="description" content={article.excerpt} />
        </Helmet>
        <img src={`${API_URL}${article.image}`} alt={article.title} className="article-header-image" />
        <h1>{article.title}</h1>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

export default ArticlePage;