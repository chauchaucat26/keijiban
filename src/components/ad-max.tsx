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

    const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>body { margin: 0; padding: 0; overflow: hidden; }</style>
        </head>
        <body>
            <div class="admax-ads" data-admax-id="${adId}" style="display:inline-block;width:${width}px;height:${height}px;"></div>
            <script type="text/javascript">
                (window.admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});
            </script>
            <script type="text/javascript" src="https://adm.shinobi.jp/st/t.js" async charset="utf-8"></script>
        </body>
        </html>
    `;

    return (
        <div className="flex justify-center my-8 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                {/* admax script-in-iframe */}
                <iframe
                    key={`ad-top-${adId}-${isMobile}`}
                    srcDoc={srcDoc}
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


