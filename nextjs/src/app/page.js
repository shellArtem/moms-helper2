// src/app/page.js

// 'use client' БОЛЬШЕ НЕ НУЖЕН!
import axios from 'axios';
import ArticleList from '@/components/ArticleList'; // Импортируем наш новый клиентский компонент

// Эта функция, как и раньше, выполняется на сервере
async function getArticles() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
    return response.data.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Ошибка при загрузке статей:", error);
    return [];
  }
}

// Это снова СЕРВЕРНЫЙ компонент
export default async function HomePage() {
  // 1. Получаем данные на сервере
  const articles = await getArticles();

  // 2. Передаем их как проп в клиентский компонент
  return (
    <ArticleList initialArticles={articles} />
  );
}
