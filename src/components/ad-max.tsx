'use client'

import { useEffect, useState } from "react";

export function AdMax() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

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

    if (isMobile === null) {
        return <div className="flex justify-center my-8 min-h-[90px]" />;
    }

    const src = isMobile ? '/ad-top-sp.html' : '/ad-top-pc.html';
    const width = isMobile ? '300' : '728';
    const height = isMobile ? '250' : '90';

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <iframe
                key={src}
                src={src}
                width={width}
                height={height}
                scrolling="no"
                frameBorder="0"
                style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
                title="Advertisement"
            />
        </div>
    );
}
