import Link from 'next/link'

const CATEGORIES = [
    "雑談", "学校", "相談", "ゲーム", "趣味", "深夜"
]

export function CategoryList() {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">カテゴリ</h2>
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        href={`/categories/${encodeURIComponent(cat)}`}
                        className="px-4 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors text-sm font-medium"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </div>
    )
}
