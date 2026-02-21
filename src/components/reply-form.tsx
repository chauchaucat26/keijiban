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
        <form action={handleSubmit} ref={formRef} className="space-y-6 bg-card border rounded-2xl p-6 sm:p-8 card-shadow animate-in fade-in slide-in-from-bottom-2 duration-300">
            <input type="hidden" name="thread_id" value={threadId} />

            {error && (
                <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        お名前 (任意)
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="名無しさん"
                        className="w-full sm:w-2/3 rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        メッセージ
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={200}
                        placeholder="内容を入力してください..."
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50 resize-none"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <p className="text-[10px] text-muted-foreground/60 max-w-[200px]">
                    200文字まで入力可能です。マナーを守って投稿しましょう。
                </p>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground font-bold py-2.5 px-8 rounded-full hover:opacity-90 transition-all disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95 text-sm"
                >
                    {isSubmitting ? '投稿中...' : '書き込む'}
                </button>
            </div>
        </form>
    )
}
