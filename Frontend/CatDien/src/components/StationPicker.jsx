import { useState } from 'react'
import { ChevronUp, ChevronDown, MapPin, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StationPicker({ stations, loading, selected, onToggle, onSelectAll, allSelected }) {
  const [open, setOpen] = useState(true)

  const summary =
    selected.size === 0
      ? 'Chưa chọn trạm nào (mặc định: tất cả trạm)'
      : allSelected
        ? 'Đã chọn tất cả trạm'
        : `Đã chọn ${selected.size} trạm`

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <MapPin className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold uppercase">Danh sách trạm</div>
          <div className="text-xs text-muted-foreground truncate">{summary}</div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>

      {open && (
        <div className="border-t px-4 py-3 space-y-1">
          {loading && <p className="text-sm text-muted-foreground py-2">Đang tải danh sách trạm...</p>}

          {!loading && stations.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              Chưa có dữ liệu trạm cụ thể cho khu vực Nam Giang. Bạn vẫn có thể tra cứu — kết quả sẽ hiển thị tất cả khu vực.
            </p>
          )}

          {!loading && stations.length > 0 && (
            <>
              <button
                type="button"
                onClick={onSelectAll}
                className="w-full flex items-center justify-between rounded-full bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                CHỌN TẤT CẢ TRẠM
                <Plus className="h-4 w-4" />
              </button>

              <div className="pt-1">
                {stations.map((name) => {
                  const checked = selected.has(name)
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => onToggle(name)}
                      className="w-full flex items-center justify-between py-2.5 text-sm text-left border-b last:border-b-0"
                    >
                      <span className={cn(checked ? 'font-semibold text-foreground' : 'text-foreground')}>{name}</span>
                      {checked && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
