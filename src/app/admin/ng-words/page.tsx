import { supabase } from '@/lib/supabase'
import { isAdmin, adminLogout } from '@/app/actions/admin-auth'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { AdminNav } from '@/components/admin-nav'
import { addNgWord, deleteNgWord } from '@/app/actions/ng-words'

export const dynamic = 'force-dynamic'

export default async function AdminNgWordsPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login')
    }

    const { data: ngWords, error } = await supabase
        .from('ng_words')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">NGワード管理</h1>
                <form action={adminLogout}>
                    <button className="text-sm text-zinc-500 hover:text-red-600 transition-colors">
                        ログアウト
                    </button>
                </form>
            </div>

            <AdminNav />

            {/* Add Logic */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border dark:border-zinc-800 shadow-sm">
                <h2 className="text-lg font-bold mb-4">新規追加</h2>
                <form action={async (formData: FormData) => {
                    'use server'
                    const word = formData.get('word') as string
                    await addNgWord(word)
                }} className="flex gap-2">
                    <input
                        type="text"
                        name="word"
                        placeholder="禁止したいワード..."
                        required
                        className="flex-1 rounded-md border text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        追加
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b dark:border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">単語</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">登録日</th>
                            <th className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                        {ngWords?.map((ng) => (
                            <tr key={ng.id}>
                                <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200">
                                    {ng.word}
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    {formatDate(ng.created_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <form action={async () => {
                                        'use server'
                                        await deleteNgWord(ng.id)
                                    }}>
                                        <button className="text-red-600 hover:text-red-700 text-xs font-bold transition-colors">
                                            削除
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!ngWords || ngWords.length === 0) && (
                    <div className="p-12 text-center text-zinc-500">
                        登録されているNGワードはありません。
                    </div>
                )}
            </div>
        </div>
    )
}
