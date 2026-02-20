import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AdMax } from "@/components/ad-max";
import { AdMaxOverlay } from "@/components/ad-max-overlay";
import { ThemeToggle } from "@/components/theme-toggle";

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
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    if (!theme && supportDarkMode) theme = 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`,
                    }}
                />
            </head>
            <body className={cn(inter.className, "antialiased min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300")}>
                <div className="flex flex-col min-h-screen">
                    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md dark:border-zinc-800">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                            <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2">
                                <span className="text-2xl">🐱</span>
                                <span>chauchaucat26/keijiban</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <Link
                                    href="/threads/new"
                                    className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
                                >
                                    ＋ スレッド作成
                                </Link>
                                <ThemeToggle />
                            </div>
                        </div>
                    </header>

                    <main>
                        <AdMax />
                        {children}
                    </main>

                    <footer className="mt-auto border-t py-8 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800">
                        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                            <p>© {new Date().getFullYear()} chauchaucat26/keijiban - シンプルな掲示板</p>
                        </div>
                    </footer>
                </div>
                <AdMaxOverlay />
            </body>
        </html>
    );
}
