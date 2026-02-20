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
            <body className={cn(inter.className, "min-h-screen bg-background text-foreground transition-colors duration-300")}>
                <div className="flex flex-col min-h-screen">
                    <header className="sticky top-0 z-50 w-full glass border-b shadow-sm">
                        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                            <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2">
                                <span className="text-2xl drop-shadow-sm">🐱</span>
                                <span className="hidden sm:inline">chauchaucat26/keijiban</span>
                                <span className="sm:hidden">keijiban</span>
                            </Link>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <Link
                                    href="/threads/new"
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-all shadow-sm active:scale-95"
                                >
                                    ＋ スレッド作成
                                </Link>
                                <ThemeToggle />
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-6xl">
                        <AdMax />
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>

                    <footer className="mt-auto border-t py-12 bg-muted/30 dark:bg-zinc-950/50">
                        <div className="container mx-auto px-4 text-center">
                            <p className="text-muted-foreground text-sm font-medium">
                                © {new Date().getFullYear()} chauchaucat26/keijiban
                            </p>
                            <p className="text-muted-foreground/60 text-xs mt-2">
                                シンプルで使いやすい掲示板
                            </p>
                        </div>
                    </footer>
                </div>
                <AdMaxOverlay />
            </body>
        </html>
    );
}
