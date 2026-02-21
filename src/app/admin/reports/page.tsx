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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">通報管理</h1>
                    <p className="text-muted-foreground text-sm font-medium">コミュニティからの通報を処理します。</p>
                </div>
                <form action={adminLogout}>
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:bg-muted transition-all shadow-sm border border-border/50">
                        ログアウト
                    </button>
                </form>
            </div>

            <AdminNav />

            <div className="grid gap-8">
                {groupedReports?.map((group: any) => (
                    <div key={group.postId} className="bg-card text-card-foreground p-8 rounded-[2rem] shadow-sm border border-border/50 card-shadow transition-all hover:shadow-md animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-border/50">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-destructive text-destructive-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    通報: {group.reports.length}件
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    最終通報: {formatDate(group.reports[0].created_at)}
                                </span>
                            </div>
                            <form action={async () => {
                                'use server'
                                await deletePost(group.postId)
                            }}>
                                <button className="bg-destructive text-destructive-foreground text-[11px] font-black uppercase tracking-widest py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-destructive/20 active:scale-95">
                                    投稿を削除
                                </button>
                            </form>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-destructive/5 border border-destructive/10 p-6 rounded-2xl">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive mb-4">通報内容明細</h4>
                                <ul className="space-y-3">
                                    {group.reports.map((r: any) => (
                                        <li key={r.id} className="text-sm text-foreground/80 flex justify-between gap-4 bg-background/50 p-3 rounded-lg border border-border/20">
                                            <span className="font-medium">{r.reason}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground font-mono mt-0.5">{formatDate(r.created_at)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">対象の投稿</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                        <span className="text-foreground">{group.post?.name || '名無しさん'}</span>
                                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground/60">ID:{group.post?.author_id || '????'}</span>
                                    </div>
                                    <div className="text-sm bg-muted/30 p-4 rounded-xl border border-border/50 whitespace-pre-wrap leading-relaxed italic text-foreground/70">
                                        {group.post?.message}
                                    </div>
                                    {group.post?.thread_id && (
                                        <div className="flex justify-end pt-2">
                                            <a
                                                href={`/threads/${group.post.thread_id}`}
                                                target="_blank"
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform flex items-center gap-1.5"
                                            >
                                                スレッドを確認 <span className="text-xs">→</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {groupedReports?.length === 0 && (
                    <div className="bg-muted/20 p-20 rounded-[2rem] border-2 border-dashed border-border/50 text-center animate-in zoom-in-95 duration-500">
                        <span className="text-4xl block mb-4 opacity-30">✨</span>
                        <p className="text-lg font-bold text-muted-foreground">現在通報はありません。</p>
                        <p className="text-sm text-muted-foreground/50 mt-1">平和なコミュニティですね。</p>
                    </div>
                )}
            </div>
        </div>
    )
}
