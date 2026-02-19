'use client'

export const dynamic = 'force-dynamic'

import { adminLogin } from '@/app/actions/admin-auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await adminLogin(formData)
        if (result.success) {
            router.push('/admin/reports')
            router.refresh()
        } else {
            setError(result.error || '不明なエラー')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6 text-center">管理者ログイン</h1>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border dark:border-zinc-800">
                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">パスワード</label>
                        <input
                            type="password"
                            name="password"
                            required
                            autoFocus
                            className="w-full rounded border p-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-2 px-4 rounded w-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    )
}
