'use client'

import { useEffect, useState } from "react";

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
        ? (process.env.NEXT_PUBLIC_ADMAX_TOP_SP_ID || '1ec655c6104cb6e4957a070be9665f3b')
        : (process.env.NEXT_PUBLIC_ADMAX_TOP_PC_ID || '1ec655c6104cb6e4957a070be9665f3b');

    const width = isMobile ? '300' : '728';
    const height = isMobile ? '250' : '90';

    const bridgeUrl = `/ad-max-bridge.html?id=${adId}&w=${width}&h=${height}`;

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                <iframe
                    key={`ad-top-${adId}-${width}`}
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


