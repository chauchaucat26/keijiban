'use client'

import { createThread } from '@/app/actions/create-thread'
import { CATEGORIES } from '@/lib/constants'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function CreateThreadPage() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])
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

        // Client side basic validation
        const submittedName = formData.get('name') as string
        const submittedTitle = formData.get('title') as string
        const submittedMessage = formData.get('message') as string

        if (!submittedTitle.trim() || !submittedMessage.trim()) {
            setError('タイトルと本文を入力してください')
            setIsSubmitting(false)
            return
        }

        const result = await createThread(formData)
        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            // Success
            localStorage.setItem('saved_name', submittedName)
            // Redirect happens automatically in createThread
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 inline-flex items-center gap-2 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> トップに戻る
            </Link>

            <div className="bg-card text-card-foreground shadow-2xl border rounded-[2rem] p-8 sm:p-12 card-shadow animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">新規スレッド作成</h1>
                    <p className="text-muted-foreground text-sm font-medium">コミュニティに新しい話題を投稿しましょう。</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-8 text-sm font-medium animate-in shake duration-500">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                カテゴリ <span className="text-primary">*</span>
                            </label>
                            <select
                                name="category"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                スレッドタイトル <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength={100}
                                placeholder="わかりやすいタイトルを入力"
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm placeholder:text-muted-foreground/40"
                            />
                        </div>

                        <div className="space-y-2">
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
                                maxLength={30}
                                className="w-full sm:w-2/3 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm placeholder:text-muted-foreground/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                本文 <span className="text-primary">*</span>
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={8}
                                maxLength={200}
                                placeholder="HTMLやMarkdownは使えません。改行は反映されます。"
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm resize-none placeholder:text-muted-foreground/40"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-black py-4 px-6 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50 text-base flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin text-xl">⏳</span>
                                    <span>作成中...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">🚀</span>
                                    <span>スレッドを作成する</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
