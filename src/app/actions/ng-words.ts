'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { isAdmin } from './admin-auth'

export async function getNgWords(): Promise<string[]> {
    const { data, error } = await supabase
        .from('ng_words')
        .select('word')

    if (error) {
        console.error(error)
        return []
    }

    return data.map(row => row.word)
}

export async function addNgWord(word: string) {
    if (!(await isAdmin())) return { error: '権限がありません' }
    if (!word.trim()) return { error: '単語を入力してください' }

    const { error } = await supabase
        .from('ng_words')
        .insert({ word: word.trim() })

    if (error) {
        if (error.code === '23505') {
            return { error: '既に登録されています' }
        }
        console.error(error)
        return { error: '登録に失敗しました' }
    }

    revalidatePath('/admin/ng-words')
    return { success: true }
}

export async function deleteNgWord(id: string) {
    if (!(await isAdmin())) return { error: '権限がありません' }

    const { error } = await supabase
        .from('ng_words')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error)
        return { error: '削除に失敗しました' }
    }

    revalidatePath('/admin/ng-words')
    return { success: true }
}
