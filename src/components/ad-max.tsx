'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export function AdMax() {
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
        ? (process.env.NEXT_PUBLIC_ADMAX_TOP_SP_ID || '1ec655c6104cb6e4957a070be9665f3b')
        : (process.env.NEXT_PUBLIC_ADMAX_TOP_PC_ID || '1ec655c6104cb6e4957a070be9665f3b');

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
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

                <Script id={`admax-push-top-${adId}`} strategy="afterInteractive">
                    {`(window.admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});`}
                </Script>

                {/* admax */}
            </div>
        </div>
    )
}


