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

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

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
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div
                key={pathname}
                className="admax-ads"
                data-admax-id={adId}
                style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
            ></div>
        </div>
    );
}
