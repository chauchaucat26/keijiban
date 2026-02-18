'use client'

import { createReport } from '@/app/actions/create-report'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function ReportForm() {
    const searchParams = useSearchParams()
    const postId = searchParams.get('post_id') || ''
    const [done, setDone] = useState(false)

    async function handleSubmit(formData: FormData) {
        if (!formData.get('post_id')) {
            alert('対象の投稿IDが指定されていません')
            return
        }
        const result = await createReport(formData)
        if (result?.success) {
            setDone(true)
        } else {
            alert('送信に失敗しました')
        }
    }

    if (done) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h2 className="text-xl font-bold mb-4">通報を受付ました</h2>
                <p className="mb-8">ご協力ありがとうございます。</p>
                <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">
                    戻る
                </button>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">対象投稿ID</label>
                <input
                    type="text"
                    name="post_id"
                    defaultValue={postId}
                    required
                    readOnly={!!postId}
                    className="w-full rounded border p-2 bg-gray-100 text-gray-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">通報理由</label>
                <textarea
                    name="reason"
                    required
                    rows={4}
                    className="w-full rounded border p-2"
                    placeholder="不適切な点について詳しく記述してください"
                ></textarea>
            </div>
            <button className="bg-red-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-red-700">
                送信する
            </button>
        </form>
    )
}

export default function ReportPage() {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">通報フォーム</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ReportForm />
            </Suspense>
        </div>
    )
}
