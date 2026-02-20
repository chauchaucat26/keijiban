import Link from 'next/link'

import { formatDate } from '@/lib/utils'
import type { Thread } from '@/types'

// Mock card components for now since we don't have shadcn/ui fully setup yet, 
// or I can just use raw tailwind in this file if I want to avoid creating many files.
// Let's use raw tailwind for simplicity and speed as requested "Simple".

export function ThreadList({ threads, title }: { threads: any[], title: string }) { // any[] for now until I fix the join type
    if (!threads?.length) {
        return (
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {title}
                </h2>
                <div className="p-12 text-center border-2 border-dashed rounded-2xl text-muted-foreground border-border/50 bg-muted/20">
                    <span className="text-4xl block mb-4 opacity-50">📭</span>
                    <p className="text-lg font-medium">スレッドがありません</p>
                    <p className="text-sm opacity-60">最初のスレッドを作成してみませんか？</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {threads.map((thread) => (
                    <Link key={thread.id} href={`/threads/${thread.id}`} className="block group h-full">
                        <div className="bg-card text-card-foreground border rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] card-shadow flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4 gap-2">
                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-secondary text-secondary-foreground">
                                    {thread.category}
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                                    {formatDate(thread.updated_at)}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-4">
                                {thread.title}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center bg-transparent">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <span className="text-sm">💬</span>
                                    {thread.post_count ? `${thread.post_count} responses` : 'No replies yet'}
                                </div>
                                <span className="text-primary text-xs font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    View <span className="text-base">→</span>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
