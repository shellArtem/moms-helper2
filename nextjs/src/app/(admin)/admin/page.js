// src/app/(admin)/admin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@/styles/admin.css'; // Импортируем стили

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Используем NEXT_PUBLIC_API_URL
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, { password });
            localStorage.setItem('isAdminAuth', 'true');
            router.push('/admin/dashboard'); // Переход на дашборд после успеха
        } catch (err) {
            setError('Неверный пароль!');
            localStorage.removeItem('isAdminAuth');
        }
    };

    return (
        <div className="admin-container" style={{maxWidth: '500px', margin: '10vh auto'}}>
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

export default AdminLoginPage;