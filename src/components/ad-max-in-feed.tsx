'use client'

import { useEffect, useRef, useState } from "react";

const PC_AD_SCRIPT_URL = 'https://adm.shinobi.jp/s/9502b5a3bbcb7abcb6925906064353c5';

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const adRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);

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

    useEffect(() => {
        if (isMobile === false && adRef.current && !scriptLoaded.current) {
            scriptLoaded.current = true;
            const script = document.createElement('script');
            script.src = PC_AD_SCRIPT_URL;
            script.charset = 'utf-8';
            script.setAttribute('data-cfasync', 'false');
            adRef.current.appendChild(script);
        }
    }, [isMobile]);

    if (isMobile === null) {
        return <div className="flex justify-center my-6 min-h-[90px]" />;
    }

    if (isMobile) {
        return (
            <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
                <iframe
                    key="/ad-infeed-sp.html"
                    src="/ad-infeed-sp.html"
                    width="320"
                    height="100"
                    scrolling="no"
                    frameBorder="0"
                    style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
                    title="Advertisement"
                />
            </div>
        );
    }

    return (
        <div className="flex justify-center my-6 min-h-[90px]">
            <div ref={adRef} />
        </div>
    );
}
