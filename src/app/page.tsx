import { supabase } from '@/lib/supabase'
import { ThreadList } from '@/components/thread-list'
import { CategoryList } from '@/components/category-list'
import { SearchBar } from '@/components/search-bar'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
    // Fetch latest threads
    const { data: latestThreads } = await supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    // Fetch popular threads (using updated_at as proxy for now, effectively "Active Threads")
    const { data: popularThreads } = await supabase
        .from('threads')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5)

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Link href="/create" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all font-bold flex items-center gap-2 fixed bottom-8 right-8 z-50 md:static md:z-auto md:w-auto md:shadow-none md:rounded-md md:px-4 md:py-2">
                    <span>✏️</span> スレッド作成
                </Link>
            </div>

            <SearchBar />

            <CategoryList />

            {popularThreads && popularThreads.length > 0 && (
                <ThreadList threads={popularThreads} title="🔥 人気・急上昇スレッド" />
            )}

            <ThreadList threads={latestThreads || []} title="🆕 最新スレッド" />
        </div>
    )
}
