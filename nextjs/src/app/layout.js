// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header"; // Next.js понимает @/ как src/
import Footer from "@/components/Footer";
import { Metrika } from "@/components/Metrika";
import { SuspenseWrapper } from '@/components/SuspenseWrapper';

export const metadata = {
  title: "Помощник Мамы",
  description: "Информационный ресурс для беременных...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <SuspenseWrapper>
          <Metrika />
        </SuspenseWrapper>
        <div className="App">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
