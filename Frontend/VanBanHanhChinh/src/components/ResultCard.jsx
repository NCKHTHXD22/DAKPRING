function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

// Rút gọn "Loại văn bản" thành mã ngắn cho badge (VD: "Nghị quyết" -> "NQ")
function shortType(loaiVanBan) {
  if (!loaiVanBan) return '—'
  const words = loaiVanBan.trim().split(/\s+/)
  if (words.length === 1) return loaiVanBan.slice(0, 2).toUpperCase()
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 3)
}

export default function ResultCard({ item, delay = '0s' }) {
  return (
    <a
      href={item.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[18px] p-4 border backdrop-blur-[12px] transition-all hover:-translate-y-0.5 opacity-0 animate-reveal-up"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        borderColor: 'rgba(255,255,255,0.09)',
        boxShadow: '0 16px 40px -24px rgba(0,0,0,0.8)',
        animationDelay: delay,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(224,184,113,0.45)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="inline-grid place-items-center min-w-[40px] h-6 px-2 rounded-lg text-[#E9C77E] text-xs font-bold tracking-wide" style={{ background: 'rgba(224,184,113,0.16)', border: '1px solid rgba(224,184,113,0.4)' }}>
          {shortType(item.loaiVanBan)}
        </span>
        <span className="text-[12.5px] font-semibold text-[#F3E4C6] tracking-wide">{item.soHieu || '—'}</span>
      </div>
      <div className="text-sm leading-relaxed font-medium text-[#F6EFE2]">{item.trichYeu}</div>
      <div className="flex flex-wrap gap-x-3.5 gap-y-2 mt-3 text-[11.5px] text-[rgba(242,233,220,0.6)]">
        {item.linhVuc && <span className="inline-flex items-center gap-1.5"><span className="text-[#E0B871]">◆</span>{item.linhVuc}</span>}
        {item.coQuanBanHanh && <span className="inline-flex items-center gap-1.5"><span className="text-[#E0B871]">▣</span>{item.coQuanBanHanh}</span>}
        <span className="inline-flex items-center gap-1.5"><span className="text-[#E0B871]">◷</span>Ban hành {formatDate(item.ngayBanHanh)}</span>
        {item.ngayHieuLuc && <span className="inline-flex items-center gap-1.5"><span className="text-[#E0B871]">◷</span>Hiệu lực {formatDate(item.ngayHieuLuc)}</span>}
      </div>
    </a>
  )
}
