'use client'

import { useEffect, useState } from 'react';
import Script from 'next/script'

export function AdMaxOverlay() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Initial check
        checkMobile();
        // Add event listener for resize
        window.addEventListener('resize', checkMobile);
        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isMobile) return null;

    const adId = process.env.NEXT_PUBLIC_ADMAX_OVERLAY_ID || 'b27dce7e78be5f519391bc47c0a6b579';

    return (
        <>
            {/* admax mobile overlay */}
            <Script id={`admax-push-overlay-${adId}`} strategy="afterInteractive">
                {`(window.admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "overlay"});`}
            </Script>
            <Script
                src="https://adm.shinobi.jp/st/t.js"
                strategy="afterInteractive"
                async
                charSet="utf-8"
            />
            {/* admax */}
        </>
    )
}
