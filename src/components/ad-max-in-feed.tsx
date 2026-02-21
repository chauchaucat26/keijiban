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

    const adId = isMobile
        ? (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_SP_ID || '6c1a970faf8f78347627fcf3bd9c8d36')
        : (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_PC_ID || '9502b5a3bbcb7abcb6925906064353c5');

    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <iframe
                key={adId}
                src={`/ad-max-bridge.html?adId=${adId}`}
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
