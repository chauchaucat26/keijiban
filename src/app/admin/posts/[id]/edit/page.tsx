'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { updatePost } from '@/app/actions/update-post'

export default function AdminEditPostPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from('posts')
                .select('message')
                .eq('id', id)
                .single()

            if (error) {
                console.error(error)
                setError('投稿の取得に失敗しました')
            } else if (data) {
                setMessage(data.message)
            }
            setLoading(false)
        }
        fetchPost()
    }, [id])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)

        const result = await updatePost(id, message)
        if (result.success) {
            router.back()
            router.refresh()
        } else {
            setError(result.error || '更新に失敗しました')
            setSaving(false)
        }
    }

    if (loading) return <div className="py-12 text-center">読み込み中...</div>

    return (
        <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">投稿の編集 (管理者)</h1>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border dark:border-zinc-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">本文</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={8}
                            className="w-full rounded border p-3 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold py-2 px-4 rounded hover:opacity-80 transition-opacity"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-2 bg-blue-600 text-white font-bold py-2 px-8 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? '保存中...' : '変更を保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
