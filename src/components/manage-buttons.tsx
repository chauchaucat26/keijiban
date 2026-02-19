'use client'

import { deletePost } from '@/app/actions/delete-post'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ManageButtonsProps = {
    postId: string
    threadId: string
    isOwner: boolean
    isAdmin: boolean
}

export function ManageButtons({ postId, threadId, isOwner, isAdmin }: ManageButtonsProps) {
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    if (!isOwner && !isAdmin) return null

    async function handleDelete() {
        if (!confirm('この投稿を削除してもよろしいですか？')) return

        setDeleting(true)
        const result = await deletePost(postId, threadId)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || '削除に失敗しました')
            setDeleting(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            {isAdmin && (
                <Link
                    href={`/admin/posts/${postId}/edit`}
                    className="text-xs text-zinc-400 hover:text-blue-600 transition-colors"
                >
                    編集
                </Link>
            )}
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
                {deleting ? '削除中...' : '削除'}
            </button>
        </div>
    )
}
