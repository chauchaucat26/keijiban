'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light'
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        return savedTheme || systemTheme
    })

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground active:scale-95 shadow-sm border border-transparent hover:border-border/50"
            aria-label="テーマを切り替え"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 fill-current" />
            ) : (
                <Sun className="h-5 w-5 fill-current" />
            )}
        </button>
    )
}
