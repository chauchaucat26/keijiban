'use client'

import Script from 'next/script'

export function AdMaxOverlay() {
    const adId = process.env.NEXT_PUBLIC_ADMAX_OVERLAY_ID || '94df3ac80b7623155174e23d8e0b01ba';

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
