import { supabase } from '@/lib/supabase'
import { isAdmin, adminLogout } from '@/app/actions/admin-auth'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { AdminNav } from '@/components/admin-nav'
import { headers } from 'next/headers'
import { generateAuthorId } from '@/lib/auth-id'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login')
    }

    // Get current admin ID
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const adminAuthorId = await generateAuthorId(ip)

    // Fetch posts from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentPosts, error } = await supabase
        .from('posts')
        .select('author_id, created_at, name')
        .gt('created_at', yesterday)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    // Aggregate by author_id
    const userMap = new Map<string, any>()
    recentPosts?.forEach((post) => {
        if (!userMap.has(post.author_id)) {
            userMap.set(post.author_id, {
                id: post.author_id,
                postCount: 0,
                lastActive: post.created_at,
                lastNames: new Set<string>(),
                isSelf: post.author_id === adminAuthorId
            })
        }
        const user = userMap.get(post.author_id)
        user.postCount++
        if (post.name) user.lastNames.add(post.name)
        // lastActive is already newest due to initial sort order
    })

    const now = Date.now()
    const users = Array.from(userMap.values()).map(user => ({
        ...user,
        isActive: (now - new Date(user.lastActive).getTime()) < 30 * 60 * 1000 // Active within 30 mins
    }))

    // Sort: Admin first, then Active, then by last active
    users.sort((a, b) => {
        if (a.isSelf) return -1
        if (b.isSelf) return 1
        if (a.isActive && !b.isActive) return -1
        if (!a.isActive && b.isActive) return 1
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">ユーザー一覧</h1>
                <form action={adminLogout}>
                    <button className="text-sm text-zinc-500 hover:text-red-600 transition-colors">
                        ログアウト
                    </button>
                </form>
            </div>

            <AdminNav />

            <div className="overflow-hidden bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b dark:border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">ステータス</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">ID</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">使用された名前</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">投稿数 (24h)</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">最終アクティブ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user.id} className={user.isSelf ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.isSelf && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                                                管理者 (あなた)
                                            </span>
                                        )}
                                        {user.isActive ? (
                                            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold">
                                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                アクティブ
                                            </span>
                                        ) : (
                                            <span className="text-zinc-400">オフライン</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {user.id}
                                </td>
                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                    {Array.from(user.lastNames).slice(0, 3).join(', ') || 'Anonymous'}
                                    {user.lastNames.size > 3 && ' ...'}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    {user.postCount}
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    {formatDate(user.lastActive)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">
                        24時間以内にアクティブなユーザーはいませんでした。
                    </div>
                )}
            </div>

            <p className="text-xs text-zinc-400 mt-4">
                ※ ユーザーIDは毎日深夜にリセットされます。表示されているのは本日（UTC基準）の活動です。
            </p>
        </div>
    )
}
