'use client'

import { useEffect, useState } from "react";

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

    const src = isMobile ? '/ad-infeed-sp.html' : '/ad-infeed-pc.html';
    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
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
