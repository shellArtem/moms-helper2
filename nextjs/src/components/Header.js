// src/components/Header.js

'use client'; // <-- ШАГ 1: ОБЯЗАТЕЛЬНАЯ ДИРЕКТИВА

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- ШАГ 2: Новый хук для отслеживания URL
import './Header.css';

const Header = () => {
    // Состояние для отслеживания, открыто ли мобильное меню
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Хук usePathname() - это аналог useLocation() из react-router в Next.js
    const pathname = usePathname();

    // Эффект, который будет закрывать меню при переходе на другую страницу
    useEffect(() => {
        setIsMenuOpen(false); // Закрываем меню при смене URL
    }, [pathname]); // Зависимость от pathname

    // Функция для переключения состояния меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Функция для закрытия меню по клику на ссылку (для мобильной версии)
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    }

    return (
        <header className="site-header">
            <div className="header-container">
                {/* ШАГ 3: Адаптация Link */}
                <Link href="/" className="logo">Помощник Мамы</Link>

                {/* --- Обычная навигация для десктопов --- */}
                <nav className="main-nav desktop-nav">
                    <Link href="/">Главная</Link>
                    <Link href="/category/pregnancy">Беременность</Link>
                    <Link href="/category/childbirth">Роды</Link>
                    <Link href="/category/first-year">Первый год</Link>
                    <Link href="/category/child-health">Здоровье</Link>
                    <Link href="/category/child-development">Развитие</Link>
                </nav>

                {/* --- Иконка бургера для мобильных --- */}
                <button
                    className={`burger-icon ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* --- Выезжающее мобильное меню --- */}
                <div className={`mobile-nav-container ${isMenuOpen ? 'open' : ''}`}>
                    <nav className="mobile-nav">
                        <Link href="/" onClick={handleLinkClick}>Главная</Link>
                        <Link href="/category/pregnancy" onClick={handleLinkClick}>Беременность</Link>
                        <Link href="/category/childbirth" onClick={handleLinkClick}>Роды</Link>
                        <Link href="/category/first-year" onClick={handleLinkClick}>Первый год</Link>
                        <Link href="/category/child-health" onClick={handleLinkClick}>Здоровье</Link>
                        <Link href="/category/child-development" onClick={handleLinkClick}>Развитие</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;