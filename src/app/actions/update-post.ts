'use server'

import { supabase } from '@/lib/supabase'
import { isAdmin } from './admin-auth'
import { revalidatePath } from 'next/cache'
import { stripHtml } from '@/lib/utils'

export async function updatePost(postId: string, message: string) {
    if (!(await isAdmin())) {
        return { error: '権限がありません' }
    }

    if (!message) {
        return { error: '本文を入力してください' }
    }

    const cleanMessage = stripHtml(message)

    const { error: updateError } = await supabase
        .from('posts')
        .update({
            message: cleanMessage,
            updated_at: new Date().toISOString()
        })
        .eq('id', postId)

    if (updateError) {
        console.error(updateError)
        return { error: '更新に失敗しました' }
    }

    revalidatePath('/')
    return { success: true }
}
