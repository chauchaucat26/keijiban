import { auth0 } from './auth0'

/**
 * Generates an 8-character ID for a user using Web Crypto API (Edge compatible).
 * @param ip The visitor's IP address (fallback for anonymous users).
 * @param userId Optional Auth0 user ID (sub) for persistent identities.
 * @returns A truncated hash (8 characters).
 */
export async function generateAuthorId(ip: string, userId?: string): Promise<string> {
    const salt = process.env.ID_SALT || 'default-salt-123'

    // Check for Auth0 session if userId is not provided
    let finalUserId = userId
    if (!finalUserId) {
        const session = await auth0.getSession()
        if (session) {
            finalUserId = session.user.sub
        }
    }

    const encoder = new TextEncoder()
    let data: string

    if (finalUserId) {
        // Persistent ID for logged-in users
        data = `${finalUserId}-${salt}`
    } else {
        // Daily rotating ID for anonymous users
        const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
        data = `${ip}-${date}-${salt}`
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Alphanumeric truncated hash
    return hashHex.substring(0, 8)
}
