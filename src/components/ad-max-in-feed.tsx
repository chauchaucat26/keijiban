'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const adId = isMobile
        ? (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_SP_ID || '9502b5a3bbcb7abcb6925906064353c5')
        : (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_PC_ID || '9502b5a3bbcb7abcb6925906064353c5');

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                {/* admax */}
                <div
                    key={adId} // Re-render when ID changes
                    className="admax-ads"
                    data-admax-id={adId}
                    style={{
                        display: 'inline-block',
                        width: isMobile ? '320px' : '728px',
                        height: isMobile ? '50px' : '90px'
                    }}
                ></div>

                <Script id={`admax-push-${adId}-${Math.random()}`} strategy="afterInteractive">
                    {`(window.admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});`}
                </Script>

                <Script
                    src="https://adm.shinobi.jp/st/t.js"
                    strategy="afterInteractive"
                    async
                    charSet="utf-8"
                />
                {/* admax */}
            </div>
        </div>
    )
}
