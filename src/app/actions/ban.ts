'use server'

import { supabase } from '@/lib/supabase'
import { isAdmin } from './admin-auth'
import { revalidatePath } from 'next/cache'

/**
 * Bans a user and deletes their messages within the specified scope.
 * @param authorId The ID of the user to ban.
 * @param threadId Optional thread ID for a thread-specific ban. If empty, it's a board-wide ban.
 */
export async function banUser(authorId: string, threadId?: string) {
    if (!(await isAdmin())) {
        return { error: '権限がありません' }
    }

    if (!authorId) {
        return { error: 'ユーザーIDが指定されていません' }
    }

    // 1. Insert BAN record
    const { error: banError } = await supabase
        .from('bans')
        .insert({
            author_id: authorId,
            thread_id: threadId || null,
            reason: threadId ? 'スレッド内BAN' : '掲示板全体BAN'
        })

    if (banError) {
        console.error(banError)
        return { error: 'BAN記録の作成に失敗しました' }
    }

    // 2. Delete posts
    let query = supabase
        .from('posts')
        .delete()
        .eq('author_id', authorId)

    if (threadId) {
        query = query.eq('thread_id', threadId)
    }

    const { error: postDeleteError } = await query

    if (postDeleteError) {
        console.error(postDeleteError)
    }

    // 3. If global BAN, delete their threads as well
    if (!threadId) {
        const { error: threadDeleteError } = await supabase
            .from('threads')
            .delete()
            .eq('author_id', authorId)

        if (threadDeleteError) {
            console.error(threadDeleteError)
        }
    }

    revalidatePath('/')
    if (threadId) {
        revalidatePath(`/threads/${threadId}`)
    }

    return { success: true }
}
