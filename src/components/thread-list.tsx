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
                <div className="p-8 text-center border-2 border-dashed rounded-lg text-zinc-500 dark:border-zinc-800">
                    スレッドがありません
                </div>
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {title}
            </h2>
            <div className="grid gap-4">
                {threads.map((thread) => (
                    <Link key={thread.id} href={`/threads/${thread.id}`} className="block group">
                        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-500/50">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mb-2">
                                        {thread.category}
                                    </span>
                                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {thread.title}
                                    </h3>
                                </div>
                                <span className="text-xs text-zinc-400 whitespace-nowrap ml-4">
                                    {formatDate(thread.updated_at)}
                                </span>
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 flex justify-between items-center mt-4">
                                <span>
                                    {/* Placeholder for post count if available */}
                                    {thread.post_count ? `${thread.post_count} レス` : '最新レスあり'}
                                </span>
                                <span className="text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    スレッドを開く &rarr;
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
