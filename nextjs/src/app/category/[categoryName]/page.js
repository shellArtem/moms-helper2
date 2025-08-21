// // src/app/category/[categoryName]/page.tsx
// import axios from 'axios';
// import ArticleCard from '@/components/ArticleCard';


// const getCategoryTitle = (categorySlug) => {
//     switch (categorySlug) {
//       case 'pregnancy':
//         return 'Все о беременности';
//       case 'childbirth':
//         return 'Подготовка к родам и роды';
//       case 'first-year':
//         return 'Первый год жизни малыша';
//       case 'child-health':
//         return 'Здоровье ребенка';
//       case 'child-development':
//         return 'Развитие ребенка';
//       default:
//         return 'Статьи';
//     }
//   };

// async function getCategoryArticles(categoryName) {
//     try {
//         const response = await axios.get(`${process.env.API_URL}/api/articles`);
//         return response.data
//             .filter(article => article.category === categoryName)
//             .sort((a, b) => b.id - a.id);
//     } catch (error) {
//         return [];
//     }
// }

// export async function generateMetadata({ params }) {
//     const pageTitle = getCategoryTitle(params.categoryName);
//     return {
//         title: `${pageTitle} - Помощник Мамы`,
//         description: `Полезные статьи в категории ${pageTitle}`,
//     };
// }

// export default async function CategoryPage({ params }) {
//     const articles = await getCategoryArticles(params.categoryName);
//     const pageTitle = getCategoryTitle(params.categoryName);

//     return (
//         <div>
//             <h1>{pageTitle}</h1>
//             {articles.length > 0 ? (
//                 articles.map(article => <ArticleCard key={article.id} article={article} />)
//             ) : (
//                 <p>В этой категории пока нет статей.</p>
//             )}
//         </div>
//     );
// }
// src/app/category/[categoryName]/page.js

// 'use client' здесь НЕ НУЖНО
import axios from 'axios';
import CategoryArticleList from '@/components/CategoryArticleList'; // <-- Импортируем новый компонент

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

async function getCategoryArticles(categoryName) {
  try {
    // --- ВАЖНО: Используйте NEXT_PUBLIC_API_URL для консистентности ---
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
    return response.data
      .filter(article => article.category === categoryName)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Ошибка при загрузке статей категории:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const pageTitle = getCategoryTitle(params.categoryName);
  return {
    title: `${pageTitle} - Помощник Мамы`,
    description: `Полезные статьи в категории ${pageTitle}`,
  };
}

// Это снова СЕРВЕРНЫЙ компонент
export default async function CategoryPage({ params }) {
  // 1. Получаем данные на сервере
  const articles = await getCategoryArticles(params.categoryName);
  const pageTitle = getCategoryTitle(params.categoryName);

  // 2. Передаем их как проп в клиентский компонент
  return (
    <CategoryArticleList articles={articles} pageTitle={pageTitle} />
  );
}