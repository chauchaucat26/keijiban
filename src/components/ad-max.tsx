'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type AdmaxAdType = {
    admax_id: string;
    type: string;
}

declare global {
    var admaxads: AdmaxAdType[];
}

export function AdMax() {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            const isMob = window.innerWidth < 768;
            setIsMobile(isMob);
            console.log(`AdMax: ${isMob ? 'SP' : 'PC'}`);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const adId = isMobile
        ? (process.env.NEXT_PUBLIC_ADMAX_TOP_SP_ID || 'bc915051a7c139bc652e3885e61c0813')
        : (process.env.NEXT_PUBLIC_ADMAX_TOP_PC_ID || '1ec655c6104cb6e4957a070be9665f3b');

    const width = isMobile ? '300' : '728';
    const height = isMobile ? '250' : '90';

    useEffect(() => {
        // 広告配信用のタグを挿入する
        const tag = document.createElement('script');
        tag.src = 'https://adm.shinobi.jp/st/t.js';
        tag.async = true;
        tag.setAttribute('data-cfasync', 'false');
        document.body.appendChild(tag);

        try {
            ; (globalThis.admaxads = window.admaxads || []).push({
                admax_id: adId,
                type: 'banner',
            });
        } catch (error) {
            console.error(error);
        }

        return () => {
            document.body.removeChild(tag);
        };
    }, [pathname, adId]);

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <div
                key={pathname}
                className="admax-ads"
                data-admax-id={adId}
                style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
            ></div>
        </div>
    );
}
