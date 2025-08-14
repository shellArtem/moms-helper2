// src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import { Helmet } from 'react-helmet-async';

// Функция для получения "красивого" названия категории
const getCategoryTitle = (categorySlug) => {
  switch (categorySlug) {
    case 'pregnancy':
      return 'Все о беременности';
    case 'childbirth':
      return 'Подготовка к родам и роды';
    case 'first-year':
      return 'Первый год жизни малыша';
    case 'child-health':
      return 'Здоровье ребенка';
    case 'child-development':
      return 'Развитие ребенка';
    default:
      return 'Статьи';
  }
};

const CategoryPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams(); // Получаем 'pregnancy' или 'first-year' из URL

  const pageTitle = getCategoryTitle(categoryName);

  const SCROLL_POSITION_KEY = `categoryScrollPosition_${categoryName}`;

  useEffect(() => {

    const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);

    if (savedPosition) {
      ;
      setTimeout(() => {
        window.scrollTo({ top: savedPosition });
      }, 100);
      setTimeout(() => {
        localStorage.removeItem(SCROLL_POSITION_KEY);
      }, 1000);
    }

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/articles');
        // Фильтруем статьи по категории на стороне клиента
        const filteredArticles = response.data.filter(article => article.category === categoryName).sort((a, b) => b.id - a.id);;
        setArticles(filteredArticles);
      } catch (error) {
        console.error("Ошибка при загрузке статей для категории:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    // --- Логика сохранения скролла ---
    const handleScroll = () => {
      localStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [categoryName, SCROLL_POSITION_KEY]);

  if (loading) {
    return <p>Загрузка статей...</p>;
  }

  return (
    <div>
      <Helmet>
        <title>{`${pageTitle} - Помощник Мамы`}</title>
        <meta name="description" content={`Полезные статьи и советы в категории "${pageTitle}". Все, что нужно знать молодым родителям.`} />
      </Helmet>
      <h1>{pageTitle}</h1>
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <p>В этой категории пока нет статей.</p>
      )}
    </div>
  );
};

export default CategoryPage;