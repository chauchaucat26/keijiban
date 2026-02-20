'use client'

import { useEffect, useState } from "react";
import Script from "next/script";

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isMob = window.innerWidth < 768;
            setIsMobile(isMob);
            console.log(`AdMaxInFeed: ${isMob ? 'SP' : 'PC'}`);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const adId = isMobile
        ? (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_SP_ID || '6c1a970faf8f78347627fcf3bd9c8d36')
        : (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_PC_ID || '9502b5a3bbcb7abcb6925906064353c5');

    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    useEffect(() => {
        if (typeof window !== 'undefined' && adId) {
            // @ts-ignore
            window.admaxads = window.admaxads || [];
            // @ts-ignore
            window.admaxads.push({ admax_id: adId, type: "banner" });
        }
    }, [adId]);

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                <div
                    key={`ad-container-infeed-${adId}`}
                    className="admax-ads"
                    data-admax-id={adId}
                    style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
                ></div>
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
