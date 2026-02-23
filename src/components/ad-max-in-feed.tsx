'use client'

import { useEffect, useState } from "react";

const PC_AD_SCRIPT_URL = 'https://adm.shinobi.jp/s/9502b5a3bbcb7abcb6925906064353c5';

export function AdMaxInFeed() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            const isMob = window.innerWidth < 768;
            setIsMobile(isMob);
            console.log(`AdMaxInFeed: ${isMob ? 'SP' : 'PC'}`);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 初期化待ち
    if (isMobile === null) {
        return <div className="flex justify-center my-6 min-h-[90px]" />;
    }

    // --- SP版：既存の仕組みを維持 ---
    if (isMobile) {
        return (
            <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
                <iframe
                    key="/ad-infeed-sp.html"
                    src="/ad-infeed-sp.html"
                    width="320"
                    height="100"
                    scrolling="no"
                    frameBorder="0"
                    style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
                    title="Advertisement"
                />
            </div>
        );
    }

    // --- PC版：srcDocを使ってdocument.writeエラーを回避 ---
    const pcAdHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; display: flex; justify-content: center; overflow: hidden; background: transparent; }
          </style>
        </head>
        <body>
          <script data-cfasync="false" charset="utf-8" src="${PC_AD_SCRIPT_URL}"></script>
        </body>
      </html>
    `;

    return (
        <div className="flex justify-center my-6 min-h-[90px]">
            <iframe
                srcDoc={pcAdHtml}
                width="728"
                height="90"
                scrolling="no"
                frameBorder="0"
                style={{ border: 'none', overflow: 'hidden' }}
                title="Advertisement PC"
            />
        </div>
    );
}