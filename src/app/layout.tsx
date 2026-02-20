import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { auth0 } from "@/lib/auth0";
import { AdMax } from "@/components/ad-max";
import { AdMaxOverlay } from "@/components/ad-max-overlay";
import { ThemeToggle } from "@/components/theme-toggle";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "雑談掲示板",
    description: "シンプルな雑談掲示板サイト",
};


export default async function RootLayout({

    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth0.getSession();

    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme');
                                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                    if (theme === 'dark' || (!theme && systemTheme === 'dark')) {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
                <Script
                    src="https://adm.shinobi.jp/st/t.js"
                    strategy="afterInteractive"
                    async
                    charSet="utf-8"
                />
            </head>
            <body className={cn(inter.className, "bg-background text-foreground min-h-screen")}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <header className="mb-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">雑談掲示板</h1>
                        <nav className="flex items-center gap-4">
                            <ThemeToggle />
                            {session ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-zinc-500 hidden sm:inline">
                                        {session.user.name}さん
                                    </span>
                                    <a href="/auth/logout" className="text-sm text-zinc-500 hover:text-red-500 transition-colors">
                                        ログアウト
                                    </a>
                                </div>
                            ) : (
                                <a href="/auth/login" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    ログイン
                                </a>
                            )}
                            <a href="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                スレ作成
                            </a>
                        </nav>
                    </header>
                    <main>
                        <AdMax />
                        {children}
                    </main>
                    <footer className="mt-16 text-center text-zinc-500 text-sm py-8 border-t dark:border-zinc-800">
                        <p>&copy; 2026 雑談掲示板. All rights reserved.</p>
                        <div className="mt-2 space-x-4">
                            <a href="/terms" className="hover:underline">利用規約</a>
                            <a href="/privacy" className="hover:underline">プライバシーポリシー</a>
                        </div>
                    </footer>
                </div>
                <AdMaxOverlay />
            </body>
        </html >
    );
}
