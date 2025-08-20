// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header"; // Next.js понимает @/ как src/
import Footer from "@/components/Footer";

export const metadata = {
  title: "Помощник Мамы - Главная",
  description: "Информационный ресурс для беременных...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <div className="App">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
