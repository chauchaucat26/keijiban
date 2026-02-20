'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="mb-10 relative group">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 h-5 w-5 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="キーワードでスレッドを検索..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm placeholder:text-muted-foreground/40"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>
    )
}
