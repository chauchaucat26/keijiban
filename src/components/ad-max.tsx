'use client'

import Script from 'next/script'

export function AdMax() {
    const adUrl = process.env.NEXT_PUBLIC_ADMAX_SCRIPT_URL || 'https://adm.shinobi.jp/s/1ec655c6104cb6e4957a070be9665f3b';

    return (
        <div className="flex justify-center my-8 overflow-hidden">
            <div style={{ width: '728px', height: '90px', background: '#f4f4f5' }} className="flex items-center justify-center text-xs text-zinc-400">
                {/* admax */}
                <Script
                    src={adUrl}
                    strategy="afterInteractive"
                />
                {/* admax */}
            </div>
        </div>
    )
}

