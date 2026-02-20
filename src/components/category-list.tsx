import Link from 'next/link'

const CATEGORIES = [
    "雑談", "学校", "相談", "ゲーム", "趣味", "深夜"
]

export function CategoryList() {
    return (
        <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 ml-1">
                Categories
            </h2>
            <div className="flex flex-wrap gap-2.5">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        href={`/categories/${encodeURIComponent(cat)}`}
                        className="px-4 py-2 bg-secondary/50 text-secondary-foreground border border-transparent rounded-xl hover:bg-secondary hover:border-primary/20 transition-all text-xs font-bold uppercase tracking-wide active:scale-95 shadow-sm"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </div>
    )
}
