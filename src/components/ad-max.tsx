'use client'

import { useEffect, useState } from "react";
import Script from "next/script";

export function AdMax() {
    const [isMobile, setIsMobile] = useState(false);

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

    if (!adId) return null;

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                <div
                    key={`ad-container-top-${adId}`}
                    className="admax-ads"
                    data-admax-id={adId}
                    style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
                    data-cfasync="false"
                ></div>
                <Script id={`admax-push-top-${adId}`} strategy="afterInteractive">
                    {`(window.admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});`}
                </Script>
                <Script
                    src="https://adm.shinobi.jp/st/t.js"
                    strategy="afterInteractive"
                    async
                    charSet="utf-8"
                />
            </div>
        </div>
    )
}


