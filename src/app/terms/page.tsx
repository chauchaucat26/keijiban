import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="max-w-2xl mx-auto prose dark:prose-invert">
            <Link href="/" className="no-underline text-sm text-zinc-500 hover:text-blue-600 mb-6 inline-block">&larr; トップに戻る</Link>

            <h1>利用規約</h1>

            <p>この掲示板（以下、「当サイト」）を利用するにあたり、以下の規約に同意したものとみなします。</p>

            <h2>1. 禁止事項</h2>
            <ul>
                <li>法令に違反する投稿</li>
                <li>他人を誹謗中傷する投稿</li>
                <li>個人情報を晒す行為</li>
                <li>荒らし行為、スパム投稿</li>
                <li>その他、管理人が不適切と判断する行為</li>
            </ul>

            <h2>2. 免責事項</h2>
            <p>当サイトの利用により生じた損害について、管理人は一切の責任を負いません。投稿内容は投稿者の責任において公開されるものとします。</p>

            <h2>3. 投稿の削除</h2>
            <p>禁止事項に該当する投稿や、管理人が不適切と判断した投稿は、予告なく削除することがあります。</p>

            <h2>4. 規約の変更</h2>
            <p>本規約は予告なく変更されることがあります。</p>

            <hr className="my-8" />

            <p className="text-sm text-zinc-500">
                最終更新日: 2026年2月17日
            </p>
        </div>
    )
}
