import { supabase } from '@/lib/supabase'
import { ThreadList } from '@/components/thread-list'
import { CategoryList } from '@/components/category-list'
import { SearchBar } from '@/components/search-bar'
import Link from 'next/link'

export const revalidate = 300 // 5 minutes ISR

export default async function Home() {
    // Fetch latest threads
    const { data: latestThreads } = await supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    // Fetch popular threads (most responded)
    const { data: popularThreads } = await supabase
        .from('threads')
        .select('*')
        .order('post_count', { ascending: false })
        .limit(5)

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="flex-1">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-4 leading-[0.9]">
                        つながる。<br />
                        <span className="text-primary/10 dark:text-primary/5 select-none">広がる。</span><br className="hidden sm:block" />
                        掲示板。
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-lg leading-relaxed">
                        コミュニティの旬な話題に参加しよう。シンプル、高速、そして自由。
                    </p>
                </div>

                <Link
                    href="/create"
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-black flex items-center justify-center gap-3 fixed bottom-8 right-8 z-[100] md:static md:z-auto md:w-auto text-lg md:text-base border border-primary/20"
                >
                    <span className="text-xl">✏️</span>
                    <span>スレッドを作成</span>
                </Link>
            </div>

            <div className="space-y-16">
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
                    <SearchBar />
                </section>

                <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                    <CategoryList />
                </section>

                {popularThreads && popularThreads.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-450">
                        <ThreadList threads={popularThreads} title="🔥 人気の議論" />
                    </section>
                )}

                <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-600">
                    <ThreadList threads={latestThreads || []} title="🆕 最新のスレッド" />
                </section>
            </div>
        </div>
    )
}
