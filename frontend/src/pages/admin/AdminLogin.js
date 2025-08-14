// src/pages/admin/AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/admin/login`, { password });
      localStorage.setItem('isAdminAuth', 'true'); // Простое решение для MVP
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Неверный пароль!');
      localStorage.removeItem('isAdminAuth');
    }
  };

  return (
    <div className="admin-container">
      <h2>Вход в админ-панель</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="admin-button">Войти</button>
      </form>
    </div>
  );
};

export default AdminLogin;