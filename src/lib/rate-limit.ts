import { supabase } from './supabase'

/**
 * Checks if the user is within the rate limit.
 * @param table Table to check ('threads' or 'posts')
 * @param authorId The user's author_id
 * @param minutes The required interval in minutes
 * @returns Promise<boolean> True if allowed, false if limited
 */
export async function checkRateLimit(
    table: 'threads' | 'posts',
    authorId: string,
    seconds: number
): Promise<boolean> {
    const { data, error } = await supabase
        .from(table)
        .select('created_at')
        .eq('author_id', authorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        return true // No previous posts, allowed
    }

    const lastCreatedAt = new Date(data.created_at).getTime()
    const now = new Date().getTime()
    const diffSeconds = (now - lastCreatedAt) / 1000

    return diffSeconds >= seconds
}
