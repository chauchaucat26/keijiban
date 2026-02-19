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
        <div className="flex items-center gap-3">
            {isAdmin && (
                <>
                    <Link
                        href={`/admin/posts/${postId}/edit`}
                        className="text-xs text-zinc-400 hover:text-blue-600 transition-colors"
                    >
                        編集
                    </Link>
                    <button
                        onClick={() => handleBan(false)}
                        disabled={banning}
                        className="text-xs text-orange-600 hover:bg-orange-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        title="このスレッド内での投稿を禁止し、過去の投稿を削除します"
                    >
                        BAN(スレ)
                    </button>
                    <button
                        onClick={() => handleBan(true)}
                        disabled={banning}
                        className="text-xs text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50 font-bold"
                        title="掲示板全体での投稿を禁止し、過去の投稿をすべて削除します"
                    >
                        BAN(全体)
                    </button>
                </>
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
