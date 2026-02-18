import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AdMax } from "@/components/ad-max";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "雑談掲示板",
    description: "シンプルな雑談掲示板サイト",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={cn(inter.className, "bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen")}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <header className="mb-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">雑談掲示板</h1>
                        <nav>
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
            </body>
        </html >
    );
}
