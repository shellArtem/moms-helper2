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
  // return (
  //   <html lang="ru">
  //     <body>
  //       <SuspenseWrapper>
  //         <Metrika />
  //       </SuspenseWrapper>

  //       {/* --- ВСТАВЛЯЕМ ТОЧНЫЙ КОД ОТ ЯНДЕКСА --- */}
  //       <script
  //         type="text/javascript"
  //         dangerouslySetInnerHTML={{
  //           __html: `
  //                   (function(m,e,t,r,i,k,a){
  //                       m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  //                       m[i].l=1*new Date();
  //                       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  //                       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  //                   })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103783435','ym');

  //                   ym(103783435, 'init', {
  //                       ssr: true,
  //                       clickmap:true,
  //                       trackLinks:true,
  //                       accurateTrackBounce:true,
  //                       webvisor:true,
  //                       ecommerce:"dataLayer"
  //                   });
  //               `,
  //         }}
  //       />
  //       <noscript>
  //         <div>
  //           <img src={`https://mc.yandex.ru/watch/103783435`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
  //         </div>
  //       </noscript>
  //       {/* --- КОНЕЦ БЛОКА МЕТРИКИ --- */}

  //       <div className="App">
  //         <Header />
  //         <main className="main-content">{children}</main>
  //         <Footer />
  //       </div>
  //     </body>
  //   </html>
  // );
  return (
    <html lang="ru">
      <head>
        <SuspenseWrapper>
          <Metrika />
        </SuspenseWrapper>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
                    (function(m,e,t,r,i,k,a){
                        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103783435','ym');

                    ym(103783435, 'init', {
                        ssr: true,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true,
                        ecommerce:"dataLayer"
                    });
                `,
          }}
        />
      </head>

      <body>
        <noscript>
          <div>
            <img src={`https://mc.yandex.ru/watch/103783435`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>

        <div className="App">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}