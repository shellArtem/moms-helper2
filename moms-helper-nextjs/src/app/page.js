// src/app/page.tsx
import axios from 'axios';
import ArticleCard from '@/components/ArticleCard';

// Эта функция выполняется на сервере
async function getArticles() {
  try {
    const response = await axios.get(`${process.env.API_URL}/api/articles`);
    return response.data.sort((a, b) => b.id - a.id); // Сортируем сразу
  } catch (error) {
    console.error("Ошибка при загрузке статей:", error);
    return [];
  }
}

// Это серверный компонент
export default async function HomePage() {
  const articles = await getArticles();

  return (
    <div>
      <h1>Последние статьи</h1>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
