'use client'

export function AdMaxInFeed({ isMobile }: { isMobile?: boolean }) {
    const adId = isMobile
        ? (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_SP_ID || '9502b5a3bbcb7abcb6925906064353c5')
        : (process.env.NEXT_PUBLIC_ADMAX_IN_FEED_PC_ID || '9502b5a3bbcb7abcb6925906064353c5');

    const width = isMobile ? '320' : '728';
    const height = isMobile ? '100' : '90';

    const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
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
        <div className="flex justify-center my-6 overflow-hidden min-h-[90px]">
            <div className="flex flex-col items-center">
                {/* admax script-in-iframe */}
                <iframe
                    key={`ad-infeed-${adId}`}
                    srcDoc={srcDoc}
                    width={width}
                    height={height}
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                ></iframe>
            </div>
        </div>
    )
}
