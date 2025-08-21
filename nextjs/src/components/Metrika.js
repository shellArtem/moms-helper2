// src/components/Metrika.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const METRIKA_ID = 103783435; 

export const Metrika = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        // Формируем полный URL для отправки в 'hit'
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        if (window.ym) {
            window.ym(METRIKA_ID, 'hit', url);
        }
    }, [pathname, searchParams]); // Срабатывает при каждом изменении пути или query-параметров

    return (
        <>
            {/* Используем компонент <Script> от Next.js для оптимизированной загрузки */}
            <Script id="yandex-metrika" strategy="beforeInteractive">
                {`
                    (function(m,e,t,r,i,k,a){
                        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

                    ym(${METRIKA_ID}, 'init', {
                        ssr: true,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true,
                        ecommerce:"dataLayer"
                    });
                `}
            </Script>
            {/* Тег <noscript> можно вставить как обычный JSX */}
            <noscript>
                <div>
                    <img src={`https://mc.yandex.ru/watch/${METRIKA_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
                </div>
            </noscript>
        </>
    );
};