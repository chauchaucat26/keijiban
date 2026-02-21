'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type AdmaxAdType = {
    admax_id: string;
    type: string;
}

declare global {
    var admaxads: AdmaxAdType[];
}

export function AdMaxOverlay() {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            const isMob = window.innerWidth < 768;
            setIsMobile(isMob);
            console.log(`AdMaxOverlay: ${isMob ? 'SP' : 'PC'}`);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const adId = process.env.NEXT_PUBLIC_ADMAX_OVERLAY_ID || 'b27dce7e78be5f519391bc47c0a6b579';

    useEffect(() => {
        if (!isMobile) return;

        const tag = document.createElement('script');
        tag.src = 'https://adm.shinobi.jp/st/t.js';
        tag.async = true;
        tag.setAttribute('data-cfasync', 'false');
        document.body.appendChild(tag);

        try {
            ; (globalThis.admaxads = window.admaxads || []).push({
                admax_id: adId,
                type: 'overlay',
            });
        } catch (error) {
            console.error(error);
        }

        return () => {
            document.body.removeChild(tag);
        };
    }, [pathname, adId, isMobile]);

    return null;
}
