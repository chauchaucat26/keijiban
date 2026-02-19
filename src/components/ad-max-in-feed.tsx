'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function AdMaxInFeed() {
    const adId = process.env.NEXT_PUBLIC_ADMAX_IN_FEED_ID || '9502b5a3bbcb7abcb6925906064353c5';

    return (
        <div className="flex justify-center my-6 overflow-hidden">
            <div className="flex flex-col items-center">
                {/* admax */}
                <div
                    className="admax-ads"
                    data-admax-id={adId}
                    style={{ display: 'inline-block', width: '728px', height: '90px' }}
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
