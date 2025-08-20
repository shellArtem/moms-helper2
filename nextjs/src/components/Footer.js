// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Помощник Мамы. Все права защищены.</p>
    </footer>
  );
};

export default Footer;