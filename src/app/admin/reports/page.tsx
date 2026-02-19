import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/app/actions/admin-auth'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { deletePost } from '@/app/actions/delete-post'
import { adminLogout } from '@/app/actions/admin-auth'
import { AdminNav } from '@/components/admin-nav'



export default async function AdminReportsPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login')
    }

    // Fetch reports with post details
    const { data: rawReports, error } = await supabase
        .from('reports')
        .select(`
            *,
            posts (
                message,
                name,
                thread_id,
                author_id
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    // Grouping logic
    const groupedMap = new Map<string, any>()
    rawReports?.forEach((report: any) => {
        if (!groupedMap.has(report.post_id)) {
            groupedMap.set(report.post_id, {
                post: report.posts,
                postId: report.post_id,
                reports: []
            })
        }
        groupedMap.get(report.post_id).reports.push({
            id: report.id,
            reason: report.reason,
            created_at: report.created_at
        })
    })

    const groupedReports = Array.from(groupedMap.values())

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">通報一覧</h1>
                <form action={adminLogout}>
                    <button className="text-sm text-zinc-500 hover:text-red-600 transition-colors">
                        ログアウト
                    </button>
                </form>
            </div>

            <AdminNav />

            <div className="space-y-6">
                {groupedReports?.map((group: any) => (
                    <div key={group.postId} className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border dark:border-zinc-800">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    通報: {group.reports.length}件
                                </span>
                                <span className="text-xs text-zinc-400">
                                    最終通報: {formatDate(group.reports[0].created_at)}
                                </span>
                            </div>
                            <form action={async () => {
                                'use server'
                                await deletePost(group.postId)
                            }}>
                                <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors shadow-sm">
                                    投稿を削除
                                </button>
                            </form>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 mb-4 rounded-r">
                            <h4 className="text-sm font-bold text-red-800 dark:text-red-400 mb-2">通報理由リスト:</h4>
                            <ul className="space-y-2">
                                {group.reports.map((r: any) => (
                                    <li key={r.id} className="text-sm text-red-700 dark:text-red-300 flex justify-between gap-4">
                                        <span>• {r.reason}</span>
                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">{formatDate(r.created_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t dark:border-zinc-800 pt-4">
                            <span className="text-xs text-zinc-400 block mb-1 font-bold">対象の投稿内容:</span>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 italic mb-2">
                                {group.post?.name || 'Anonymous'} (ID:{group.post?.author_id || '????'})
                            </div>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {group.post?.message}
                            </div>
                            {group.post?.thread_id && (
                                <div className="mt-4">
                                    <a
                                        href={`/threads/${group.post.thread_id}`}
                                        target="_blank"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        スレッドを確認する <span>&rarr;</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {groupedReports?.length === 0 && (
                    <div className="bg-zinc-100 dark:bg-zinc-900 p-12 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                        <p className="text-zinc-500">現在通報はありません。</p>
                    </div>
                )}
            </div>
        </div>
    )
}
