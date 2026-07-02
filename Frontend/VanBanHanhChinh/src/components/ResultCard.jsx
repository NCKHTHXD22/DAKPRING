import { ExternalLink } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

export default function ResultCard({ item }) {
  return (
    <a
      href={item.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block rounded-lg border bg-card p-4 space-y-1.5 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-primary">{item.soHieu || '—'}</span>
        {item.loaiVanBan && (
          <span className="shrink-0 text-xs font-semibold text-white bg-primary/80 px-2 py-0.5 rounded whitespace-nowrap">
            {item.loaiVanBan}
          </span>
        )}
      </div>
      <p className="text-sm text-foreground leading-relaxed line-clamp-3">{item.trichYeu}</p>
      <p className="text-xs text-muted-foreground">
        {item.coQuanBanHanh}{item.linhVuc ? ` · ${item.linhVuc}` : ''}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Ban hành: {formatDate(item.ngayBanHanh)} · Hiệu lực: {formatDate(item.ngayHieuLuc)}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </div>
    </a>
  )
}
