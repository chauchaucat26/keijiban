import { supabase } from '@/lib/supabase'
import { ThreadList } from '@/components/thread-list'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams
    const query = q ? decodeURIComponent(q) : ''

    let threads = []

    if (query) {
        const { data } = await supabase
            .from('threads')
            .select('*')
            .ilike('title', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20)

        threads = data || []
    }

    return (
        <div>
            <Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 mb-6 inline-block">&larr; トップに戻る</Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">検索結果: {query}</h1>
                <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm">
                    スレ作成
                </Link>
            </div>

            {threads.length > 0 ? (
                <ThreadList threads={threads} title="検索結果" />
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    <p>「{query}」に一致するスレッドは見つかりませんでした。</p>
                </div>
            )}
        </div>
    )
}
