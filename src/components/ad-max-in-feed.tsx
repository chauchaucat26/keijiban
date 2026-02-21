'use client'

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            const isMob = window.innerWidth < 768;
            setIsMobile(isMob);
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
        if (!containerRef.current) return;
        const container = containerRef.current;

        // コンテナをリセット
        container.innerHTML = '';

        // <!-- admax -->
        // <div class="admax-ads" data-admax-id="..." style="display:inline-block;"></div>
        const adDiv = document.createElement('div');
        adDiv.className = 'admax-ads';
        adDiv.setAttribute('data-admax-id', adId);
        adDiv.style.display = 'inline-block';
        adDiv.style.width = `${width}px`;
        adDiv.style.height = `${height}px`;
        container.appendChild(adDiv);

        // <script>(admaxads = window.admaxads || []).push({...});</script>
        const pushScript = document.createElement('script');
        pushScript.type = 'text/javascript';
        pushScript.text = `(admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});`;
        container.appendChild(pushScript);

        // <script src="https://adm.shinobi.jp/st/t.js" async></script>
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.charset = 'utf-8';
        loaderScript.src = 'https://adm.shinobi.jp/st/t.js';
        loaderScript.async = true;
        loaderScript.setAttribute('data-cfasync', 'false');
        container.appendChild(loaderScript);
        // <!-- /admax -->
    }, [pathname, adId, width, height]);

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div ref={containerRef} />
        </div>
    );
}
