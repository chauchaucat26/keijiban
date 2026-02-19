import { supabase } from '@/lib/supabase'
import { ThreadList } from '@/components/thread-list'
import { CategoryList } from '@/components/category-list'
import Link from 'next/link'



export const revalidate = 300

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params
    const categoryName = decodeURIComponent(name)

    const { data: threads } = await supabase
        .from('threads')
        .select('*')
        .eq('category', categoryName)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div>
            <Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 mb-6 inline-block">&larr; トップに戻る</Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">カテゴリ: {categoryName}</h1>
                <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm">
                    スレ作成
                </Link>
            </div>

            <CategoryList />

            <ThreadList threads={threads || []} title={`${categoryName}のスレッド`} />
        </div>
    )
}
