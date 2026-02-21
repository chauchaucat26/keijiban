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
    const currentAuthorId = await generateAuthorId(ip)
    const isUserAdmin = await isAdmin()
    const threadOwnerId = posts?.[0]?.author_id

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6 inline-flex items-center gap-2 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> トップに戻る
                </Link>
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-secondary text-secondary-foreground">
                        {thread.category}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground/60">
                        {formatDate(thread.created_at)}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight break-words leading-[1.1]">
                    {thread.title}
                </h1>
            </div>

            <div className="space-y-6 mb-12">
                {posts?.map((post, index) => (
                    <div key={post.id} className="space-y-6">
                        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-sm border card-shadow group/post">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground/40 text-xs font-mono font-bold tracking-tighter">#{index + 1}</span>
                                    <div className="flex flex-col">
                                        <span className="font-black text-sm text-foreground leading-none">
                                            {post.name || 'Anonymous'}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-bold uppercase tracking-tight bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                ID:{post.author_id || '????'}
                                            </span>
                                            {post.author_id === threadOwnerId && (
                                                <span className="text-[10px] bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-primary/10">スレ主</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                    {formatDate(post.created_at)}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed break-words mb-6 text-base sm:text-lg tracking-tight">
                                {post.message}
                            </div>
                            <div className="flex justify-between items-center bg-transparent">
                                <ManageButtons
                                    postId={post.id}
                                    threadId={id}
                                    authorId={post.author_id || ''}
                                    isOwner={currentAuthorId === threadOwnerId}
                                    isAdmin={isUserAdmin}
                                />
                                <Link
                                    href={`/report?post_id=${post.id}`}
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-destructive flex items-center gap-1.5 transition-all ml-auto group/report"
                                    title="この投稿を通報する"
                                >
                                    <span className="text-xs group-hover/report:rotate-12 transition-transform">⚠️</span> 報告する
                                </Link>
                            </div>
                        </div>
                        {(index + 1) % 3 === 0 && (
                            <AdMaxInFeed />
                        )}
                    </div>
                ))}


                {!posts?.length && (
                    <p className="text-zinc-500">まだ投稿がありません。</p>
                )}
            </div>

            <div className="mt-16 bg-muted/20 p-8 sm:p-12 rounded-[2rem] border border-border/50 card-shadow">
                <div className="mb-8">
                    <h3 className="text-2xl font-black tracking-tighter">スレッドに参加する</h3>
                    <p className="text-muted-foreground text-sm mt-1">ルールを守って楽しく書き込みましょう。</p>
                </div>
                <ReplyForm threadId={thread.id} />
            </div>
        </div>
    )
}
