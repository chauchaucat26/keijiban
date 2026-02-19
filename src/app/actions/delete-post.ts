'use server'

import { supabase } from '@/lib/supabase'
import { isAdmin } from './admin-auth'
import { revalidatePath } from 'next/cache'

import { headers } from 'next/headers'
import { generateAuthorId } from '@/lib/auth-id'

export async function deletePost(postId: string, threadId?: string) {
    const isUserAdmin = await isAdmin()

    // Check if thread owner
    let isThreadOwner = false
    if (threadId) {
        const headerList = await headers()
        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
        const currentAuthorId = await generateAuthorId(ip)

        const { data: firstPost } = await supabase
            .from('posts')
            .select('author_id')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true })
            .limit(1)
            .single()

        if (firstPost && firstPost.author_id === currentAuthorId) {
            isThreadOwner = true
        }
    }

    if (!isUserAdmin && !isThreadOwner) {
        return { error: '権限がありません' }
    }

    // Reports are deleted via cascade in DB, but let's be explicit if needed or just rely on cascade
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

    if (deleteError) {
        console.error(deleteError)
        return { error: '削除に失敗しました' }
    }

    revalidatePath('/admin/reports')
    revalidatePath('/')
    // Note: Revalidating the specific thread would require its ID, 
    // but the cascade delete means it's gone from any query.
    return { success: true }
}
