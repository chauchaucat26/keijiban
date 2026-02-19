'use client'

import Script from 'next/script'

export function AdMax() {
    const adId = process.env.NEXT_PUBLIC_ADMAX_TOP_ID || '1ec655c6104cb6e4957a070be9665f3b';

    return (
        <div className="flex justify-center my-8 overflow-hidden">
            <div className="flex flex-col items-center">
                {/* admax */}
                <div
                    className="admax-ads"
                    data-admax-id={adId}
                    style={{ display: 'inline-block', width: '728px', height: '90px' }}
                ></div>

                <Script id={`admax-push-top-${adId}`} strategy="afterInteractive">
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


