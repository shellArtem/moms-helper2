// src/components/Metrika.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const METRIKA_ID = 103783435;

export const Metrika = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        // @ts-ignore
        if (typeof window.ym === 'function') {
            // @ts-ignore
            window.ym(METRIKA_ID, 'hit', url, {
                params: {
                    // Здесь можно передавать дополнительные параметры визита, если нужно
                }
            });
        }
    }, [pathname, searchParams]);

    return null;
};







