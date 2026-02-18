'use client'

import { createThread } from '@/app/actions/create-thread'
import { CATEGORIES } from '@/lib/constants'
import { useRef, useState } from 'react'
import Link from 'next/link'

export default function CreateThreadPage() {
    const formRef = useRef<HTMLFormElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        // Client side basic validation
        const title = formData.get('title') as string
        const message = formData.get('message') as string

        if (!title.trim() || !message.trim()) {
            setError('タイトルと本文を入力してください')
            setIsSubmitting(false)
            return
        }

        const result = await createThread(formData)
        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        }
        // Success will redirect, so no need to set isSubmitting(false)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 mb-6 inline-block">&larr; トップに戻る</Link>

            <div className="bg-white dark:bg-zinc-900 shadow-md border dark:border-zinc-800 rounded-lg p-6 sm:p-8">
                <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">新規スレッド作成</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} ref={formRef} className="space-y-6">

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            カテゴリ <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            id="category"
                            required
                            className="w-full rounded-md border text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            defaultValue={CATEGORIES[0]}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            スレッドタイトル <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            maxLength={100}
                            placeholder="わかりやすいタイトルを入力"
                            className="w-full rounded-md border text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            お名前 (任意)
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="名無しさん"
                            maxLength={30}
                            className="w-full rounded-md border text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            本文 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            required
                            rows={8}
                            placeholder="HTMLやMarkdownは使えません。改行は反映されます。"
                            className="w-full rounded-md border text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-y"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-md"
                        >
                            {isSubmitting ? '作成中...' : 'スレッドを作成する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
