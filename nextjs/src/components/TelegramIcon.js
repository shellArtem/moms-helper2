// src/components/TelegramIcon.js
const TelegramIcon = ({ size = 20, color = '#e56b6f' }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color} 
      xmlns="http://www.w3.org/2000/svg"
      // Здесь будет код вашего SVG-файла
    >
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.59c-.27 1.16-1.02 1.45-1.74 1.02l-4.93-3.62-2.38 2.31c-.26.26-.48.48-.92.48z"/>
    </svg>
  );
  
  export default TelegramIcon;