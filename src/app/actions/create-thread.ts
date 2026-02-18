'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { stripHtml } from '@/lib/utils'

export async function createThread(formData: FormData) {
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const name = (formData.get('name') as string) || 'Anonymous' // Default to Anonymous
    const message = formData.get('message') as string

    if (!title || !category || !message) {
        return { error: 'タイトル、カテゴリ、本文は必須です' }
    }

    // Sanitize
    const cleanTitle = stripHtml(title)
    const cleanName = stripHtml(name)
    const cleanMessage = stripHtml(message)

    // 1. Create Thread
    const { data: thread, error: threadError } = await supabase
        .from('threads')
        .insert({
            title: cleanTitle,
            category,
        })
        .select()
        .single()

    if (threadError) {
        console.error(threadError)
        return { error: 'スレッド作成に失敗しました' }
    }

    // 2. Create First Post
    const { error: postError } = await supabase
        .from('posts')
        .insert({
            thread_id: thread.id,
            name: cleanName,
            message: cleanMessage,
        })

    if (postError) {
        console.error(postError)
        // Basic rollback attempt (optional but good)
        await supabase.from('threads').delete().eq('id', thread.id)
        return { error: '投稿の保存に失敗しました' }
    }

    revalidatePath('/')
    redirect(`/threads/${thread.id}`)
}
