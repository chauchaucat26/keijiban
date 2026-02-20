'use client'

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

    const width = isMobile ? '300' : '728';
    const height = isMobile ? '250' : '90';

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                {/* admax iframe */}
                <iframe
                    key={`ad-top-${adId}-${isMobile}`}
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


