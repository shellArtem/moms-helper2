// src/app/(admin)/layout.tsx
'use client'; // Этот layout будет клиентским для использования хуков

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginPage from './admin/page'

// Простой компонент-загрузчик
const AdminLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Проверка доступа...</p>
    </div>
);

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const isAdminAuth = localStorage.getItem('isAdminAuth') === 'true';
            if (!isAdminAuth) {
                router.push('/admin'); // Если не админ, редирект на страницу входа
            } else {
                setIsAuth(true);
            }
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return <AdminLoader />;
    }

    if (isAuth) {
        // Если авторизован, показываем запрошенную страницу
        return <>{children}</>;
    }

    // Этот return нужен для случая, когда редирект еще не сработал
    return <AdminLoginPage />;
}