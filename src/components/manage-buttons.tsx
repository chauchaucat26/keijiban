'use client'

import { deletePost } from '@/app/actions/delete-post'
import { banUser } from '@/app/actions/ban'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ManageButtonsProps = {
    postId: string
    threadId: string
    authorId: string
    isOwner: boolean
    isAdmin: boolean
}

export function ManageButtons({ postId, threadId, authorId, isOwner, isAdmin }: ManageButtonsProps) {
    const [deleting, setDeleting] = useState(false)
    const [banning, setBanning] = useState(false)
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

    async function handleBan(isGlobal: boolean) {
        const scope = isGlobal ? '掲示板全体' : 'このスレッド内'
        if (!confirm(`このユーザーを${scope}でBANし、全ての投稿を削除しますか？`)) return

        setBanning(true)
        const result = await banUser(authorId, isGlobal ? undefined : threadId)
        if (result.success) {
            alert(`${scope}でBANしました。`)
            router.refresh()
        } else {
            alert(result.error || 'BANに失敗しました')
            setBanning(false)
        }
    }

    return (
        <div className="flex items-center gap-4">
            {isAdmin && (
                <>
                    <Link
                        href={`/admin/posts/${postId}/edit`}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleBan(false)}
                        disabled={banning}
                        className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 hover:text-orange-500 transition-all disabled:opacity-50"
                        title="Ban from this thread"
                    >
                        Ban (Thread)
                    </button>
                    <button
                        onClick={() => handleBan(true)}
                        disabled={banning}
                        className="text-[10px] font-black uppercase tracking-widest text-destructive/60 hover:text-destructive transition-all disabled:opacity-50"
                        title="Ban from entire board"
                    >
                        Ban (Global)
                    </button>
                </>
            )}
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-destructive transition-all disabled:opacity-50"
            >
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    )
}
