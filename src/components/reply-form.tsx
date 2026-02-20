'use client'

import { createPost } from '@/app/actions/create-post'
import { useEffect, useRef, useState } from 'react'

export function ReplyForm({ threadId }: { threadId: string }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Load name from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem('saved_name')
        if (savedName) {
            setName(savedName)
        }
    }, [])

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        const submittedName = formData.get('name') as string
        const submittedMessage = formData.get('message') as string

        if (!submittedMessage.trim()) {
            setError('本文を入力してください')
            setIsSubmitting(false)
            return
        }

        const result = await createPost(formData)
        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            // Success
            localStorage.setItem('saved_name', submittedName)
            setMessage('') // Clear message on success
            setError(null)
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} ref={formRef} className="space-y-4">
            <input type="hidden" name="thread_id" value={threadId} />

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <div>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="名前 (省略可)"
                    className="w-full sm:w-1/2 rounded-md border bg-white dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <textarea
                    name="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                    placeholder="コメントを入力..."
                    className="w-full rounded-md border bg-white dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? '送信中...' : '書き込む'}
            </button>
        </form>
    )
}
