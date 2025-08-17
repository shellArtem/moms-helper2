// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import { Helmet } from 'react-helmet-async';
// --- Импортируем useLocation для отслеживания навигации ---
// import { useLocation } from 'react-router-dom';

// --- Ключ для хранения в localStorage ---
const SCROLL_POSITION_KEY = 'homePageScrollPosition';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Логика восстановления скролла ---
    const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);

    if (savedPosition) {;
      setTimeout(() => {
        window.scrollTo({ top: savedPosition });
      }, 100);
      setTimeout(() => {
        localStorage.removeItem(SCROLL_POSITION_KEY);
      }, 1000);
    }

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/articles`);
        // const sortedArticles = response.data.sort((a, b) => b.id - a.id);
        setArticles(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке статей:", error);
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

  }, []); // Пустой массив зависимостей гарантирует, что эффект сработает только один раз


  // --- Дополнительный эффект для очистки localStorage, если уходим куда-то, кроме статьи ---
  // Это предотвратит "прыжок" скролла, если мы ушли, например, в футер и вернулись назад
  // useEffect(() => {
  //   return () => {
  //     // Эта функция очистки сработает при уходе со страницы
  //     if (!location.pathname.startsWith('/article/')) {
  //       localStorage.removeItem(SCROLL_POSITION_KEY);
  //     }
  //   };
  // }, [location.pathname]);


  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <Helmet>
        <title>Помощник Мамы - Главная</title>
        <meta name="description" content="Информационный ресурс для беременных женщин и родителей маленьких детей. Статьи о беременности, родах, уходе за ребенком." />
      </Helmet>
      <h1>Последние статьи</h1>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default HomePage;