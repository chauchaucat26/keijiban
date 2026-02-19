'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { stripHtml } from '@/lib/utils'
import { NG_WORDS } from '@/lib/constants'
import { headers } from 'next/headers'
import { generateAuthorId } from '@/lib/auth-id'
import { checkRateLimit } from '@/lib/rate-limit'
import { getNgWords } from './ng-words'

export async function createPost(formData: FormData) {
    const threadId = formData.get('thread_id') as string
    const name = (formData.get('name') as string) || 'Anonymous'
    const message = formData.get('message') as string

    if (!threadId || !message) {
        return { error: '本文は必須です' }
    }

    // Get visitor IP
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const authorId = await generateAuthorId(ip)

    // Rate Limit
    const isAllowed = await checkRateLimit('posts', authorId, 10)
    if (!isAllowed) {
        return { error: '連投制限中です（10秒待ってください）' }
    }

    // Sanitize
    const cleanName = stripHtml(name)
    const cleanMessage = stripHtml(message)

    // Validation after stripping HTML
    if (!cleanMessage.trim()) {
        return { error: '本文を入力してください（HTMLタグのみは不可です）' }
    }
    if (cleanMessage.length > 200) {
        return { error: '本文は200文字以内で入力してください' }
    }

    // NG Word Check
    const dynamicNgWords = await getNgWords()
    const allNgWords = Array.from(new Set([...NG_WORDS, ...dynamicNgWords]))

    if (allNgWords.some(word => cleanMessage.includes(word) || cleanName.includes(word))) {
        return { error: '不適切な言葉が含まれています' }
    }

    // 1. Create Post
    const { error: postError } = await supabase
        .from('posts')
        .insert({
            thread_id: threadId,
            name: cleanName,
            message: cleanMessage,
            author_id: authorId,
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
