'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { stripHtml } from '@/lib/utils'
import { NG_WORDS } from '@/lib/constants'

export async function createPost(formData: FormData) {
    const threadId = formData.get('thread_id') as string
    const name = (formData.get('name') as string) || 'Anonymous'
    const message = formData.get('message') as string

    if (!threadId || !message) {
        return { error: '本文は必須です' }
    }

    // Sanitize
    const cleanName = stripHtml(name)
    const cleanMessage = stripHtml(message)

    // NG Word Check
    if (NG_WORDS.some(word => cleanMessage.includes(word) || cleanName.includes(word))) {
        return { error: '不適切な言葉が含まれています' }
    }

    // 1. Create Post
    const { error: postError } = await supabase
        .from('posts')
        .insert({
            thread_id: threadId,
            name: cleanName,
            message: cleanMessage,
        })

    if (postError) {
        console.error(postError)
        return { error: '投稿の保存に失敗しました' }
    }

    // 2. Update Thread updated_at
    await supabase
        .from('threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', threadId)

    revalidatePath(`/threads/${threadId}`)
    revalidatePath('/') // Update top page ordering
}
