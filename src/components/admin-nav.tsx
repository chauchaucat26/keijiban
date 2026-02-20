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
        <nav className="flex gap-1 mb-10 bg-muted/50 p-1.5 rounded-2xl w-fit border border-border/50 card-shadow">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                        pathname === item.href
                            ? "bg-card text-foreground shadow-md border border-border/20 scale-[1.02]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}
