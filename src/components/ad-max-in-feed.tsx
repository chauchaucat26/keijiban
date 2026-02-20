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
        ? (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_SP_ID || '9502b5a3bbcb7abcb6925906064353c5')
        : (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_PC_ID || '9502b5a3bbcb7abcb6925906064353c5');

    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    const bridgeUrl = `/ad-max-bridge.html?id=${adId}&w=${width}&h=${height}`;

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                <iframe
                    key={`ad-infeed-${adId}-${width}`}
                    src={bridgeUrl}
                    width={width}
                    height={height}
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    )
}
