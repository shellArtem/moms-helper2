// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './admin.css';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  // Простая проверка авторизации
  useEffect(() => {
    if (localStorage.getItem('isAdminAuth') !== 'true') {
      navigate('/admin');
    }
    fetchArticles();
  }, [navigate]);

  const fetchArticles = async () => {
    const response = await axios.get('http://localhost:3001/api/articles');
    setArticles(response.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      await axios.delete(`http://localhost:3001/api/admin/articles/${id}`);
      fetchArticles(); // Обновить список
    }
  };

  return (
    <div className="admin-container">
      <h2>Панель управления статьями</h2>
      <Link to="/admin/new" className="admin-button">Добавить новую статью</Link>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.category}</td>
              <td>
                <Link to={`/admin/edit/${article.id}`} className="admin-button">Редактировать</Link>
                <button onClick={() => handleDelete(article.id)} className="admin-button delete">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;