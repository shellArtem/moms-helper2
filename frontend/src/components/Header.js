// // src/components/Header.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Header.css';

// const Header = () => {
//   return (
//     <header className="site-header">
//       <div className="header-container">
//         <Link to="/" className="logo">Помощник Мамы</Link>
//         <nav className="main-nav">
//           <Link to="/">Главная</Link>
//           <Link to="/category/pregnancy">Беременность</Link>
//           <Link to="/category/childbirth">Роды</Link>
//           <Link to="/category/first-year">Первый год</Link>
//           <Link to="/category/child-health">Здоровье</Link>
//           <Link to="/category/child-development">Развитие</Link>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;
// src/components/Header.js
import React, { useState, useEffect } from 'react'; // Импортируем useState и useEffect
import { Link, useLocation } from 'react-router-dom'; // Импортируем useLocation
import './Header.css';

const Header = () => {
  // Состояние для отслеживания, открыто ли мобильное меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Хук для отслеживания смены URL

  // Эффект, который будет закрывать меню при переходе на другую страницу
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Функция для переключения состояния меню
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo">Помощник Мамы</Link>

        {/* --- Обычная навигация для десктопов --- */}
        <nav className="main-nav desktop-nav">
          <Link to="/">Главная</Link>
          <Link to="/category/pregnancy">Беременность</Link>
          <Link to="/category/childbirth">Роды</Link>
          <Link to="/category/first-year">Первый год</Link>
          <Link to="/category/child-health">Здоровье</Link>
          <Link to="/category/child-development">Развитие</Link>
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
        {/* Класс 'open' будет добавляться/убираться в зависимости от состояния isMenuOpen */}
        <div className={`mobile-nav-container ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <Link to="/">Главная</Link>
            <Link to="/category/pregnancy">Беременность</Link>
            <Link to="/category/childbirth">Роды</Link>
            <Link to="/category/first-year">Первый год</Link>
            <Link to="/category/child-health">Здоровье</Link>
            <Link to="/category/child-development">Развитие</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;