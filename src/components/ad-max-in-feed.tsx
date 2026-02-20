'use client'

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

    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    return (
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                {/* admax iframe */}
                <iframe
                    key={`ad-infeed-${adId}-${isMobile}`}
                    src={`https://adm.shinobi.jp/st/s.html?id=${adId}`}
                    width={width}
                    height={height}
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                ></iframe>
            </div>
        </div>
    )
}
