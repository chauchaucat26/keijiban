'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function AdminNav() {
    const pathname = usePathname()

    const navItems = [
        { label: '通報一覧', href: '/admin/reports' },
        { label: 'ユーザー一覧', href: '/admin/users' },
        { label: 'NGワード', href: '/admin/ng-words' },
    ]

    return (
        <nav className="flex gap-1 mb-8 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg w-fit">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                        pathname === item.href
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}
