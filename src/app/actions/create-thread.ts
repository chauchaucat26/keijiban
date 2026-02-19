'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { stripHtml } from '@/lib/utils'
import { headers } from 'next/headers'
import { generateAuthorId } from '@/lib/auth-id'
import { checkRateLimit } from '@/lib/rate-limit'
import { getNgWords } from './ng-words'
import { NG_WORDS } from '@/lib/constants'

export async function createThread(formData: FormData) {
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const name = (formData.get('name') as string) || 'Anonymous' // Default to Anonymous
    const message = formData.get('message') as string

    if (!title || !category || !message) {
        return { error: 'タイトル、カテゴリ、本文は必須です' }
    }

    // Auth & Rate Limit
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const authorId = await generateAuthorId(ip)

    // BAN Check (Global only for thread creation)
    const { data: bans, error: banCheckError } = await supabase
        .from('bans')
        .select('*')
        .eq('author_id', authorId)
        .is('thread_id', null)

    if (banCheckError) {
        console.error(banCheckError)
    }

    if (bans && bans.length > 0) {
        return { error: '現在この掲示板への書き込みが制限されています' }
    }

    const isAllowed = await checkRateLimit('threads', authorId, 300)
    if (!isAllowed) {
        return { error: 'スレッド作成は5分に1回までです' }
    }

    // Sanitize
    const cleanTitle = stripHtml(title)
    const cleanName = stripHtml(name)
    const cleanMessage = stripHtml(message)

    // Validation after stripping HTML
    if (!cleanTitle.trim()) {
        return { error: 'タイトルを入力してください' }
    }
    if (!cleanMessage.trim()) {
        return { error: '本文を入力してください' }
    }
    if (cleanMessage.length > 200) {
        return { error: '本文は200文字以内で入力してください' }
    }

    // NG Word Check
    const dynamicNgWords = await getNgWords()
    const allNgWords = Array.from(new Set([...NG_WORDS, ...dynamicNgWords]))

    if (allNgWords.some(word => cleanTitle.includes(word) || cleanMessage.includes(word) || cleanName.includes(word))) {
        return { error: '不適切な言葉が含まれています' }
    }

    // 1. Create Thread
    const { data: thread, error: threadError } = await supabase
        .from('threads')
        .insert({
            title: cleanTitle,
            category,
            author_id: authorId,
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
            author_id: authorId,
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
