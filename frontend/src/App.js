// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import './App.css'; // Общие стили

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Публичные роуты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />

          {/* Админ-панель */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/edit/:id" element={<ArticleEditor />} />
          <Route path="/admin/new" element={<ArticleEditor />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
