export type Thread = {
    id: string
    title: string
    category: string
    created_at: string
    updated_at: string
}

export type Post = {
    id: string
    thread_id: string
    name: string
    message: string
    author_id: string
    created_at: string
    updated_at: string
}

export type Report = {
    id: string
    post_id: string
    reason: string
    created_at: string
}
