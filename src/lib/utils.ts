import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

export function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, "")
}

export function isMobileDevice(userAgent: string) {
    return /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(userAgent)
}
