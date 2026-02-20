import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ReplyForm } from '@/components/reply-form'
import { headers } from 'next/headers'
import { generateAuthorId } from '@/lib/auth-id'
import { isAdmin } from '@/app/actions/admin-auth'
import { ManageButtons } from '@/components/manage-buttons'
import { AdMaxInFeed } from '@/components/ad-max-in-feed'
import { isMobileDevice } from '@/lib/utils'

export const revalidate = 60 // Refresh every minute for active threads

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: thread } = await supabase
        .from('threads')
        .select('*')
        .eq('id', id)
        .single()

    if (!thread) {
        return notFound()
    }

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('thread_id', id)
        .order('created_at', { ascending: true })

    // Auth Info
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const userAgent = headerList.get('user-agent') || ""
    const currentAuthorId = await generateAuthorId(ip)
    const isUserAdmin = await isAdmin()
    const threadOwnerId = posts?.[0]?.author_id

    return (
        <div>
            <div className="mb-6">
                <Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 mb-4 inline-block">&larr; トップに戻る</Link>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {thread.category}
                    </span>
                    <span className="text-xs text-zinc-400">
                        {formatDate(thread.created_at)}
                    </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 break-words">
                    {thread.title}
                </h1>
            </div>

            <div className="space-y-6 mb-12">
                {posts?.map((post, index) => (
                    <div key={post.id} className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border dark:border-zinc-800">
                            <div className="flex justify-between items-baseline mb-3 pb-3 border-b dark:border-zinc-800">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-zinc-400 text-sm font-mono">#{index + 1}</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                        {post.name || 'Anonymous'}
                                    </span>
                                    <span className="text-[10px] sm:text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                                        ID:{post.author_id || '????'}
                                    </span>
                                    {post.author_id === threadOwnerId && (
                                        <span className="text-[10px] sm:text-xs text-blue-500 font-bold ml-1">★</span>
                                    )}
                                </div>
                                <span className="text-xs text-zinc-400">
                                    {formatDate(post.created_at)}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed break-words mb-4">
                                {post.message}
                            </div>
                            <div className="flex justify-between items-center group">
                                <ManageButtons
                                    postId={post.id}
                                    threadId={id}
                                    authorId={post.author_id || ''}
                                    isOwner={currentAuthorId === threadOwnerId}
                                    isAdmin={isUserAdmin}
                                />
                                <Link
                                    href={`/report?post_id=${post.id}`}
                                    className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors ml-auto"
                                    title="この投稿を通報する"
                                >
                                    <span className="text-xs">⚠️</span> 通報
                                </Link>
                            </div>
                        </div>
                        {(index + 1) % 3 === 0 && (
                            <AdMaxInFeed
                                adId={inFeedAdId}
                                width={inFeedWidth}
                                height={inFeedHeight}
                            />
                        )}
                    </div>
                ))}


                {!posts?.length && (
                    <p className="text-zinc-500">まだ投稿がありません。</p>
                )}
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-lg border dark:border-zinc-800">
                <h3 className="text-lg font-bold mb-4">レスを投稿する</h3>
                <ReplyForm threadId={thread.id} />
            </div>
        </div>
    )
}
