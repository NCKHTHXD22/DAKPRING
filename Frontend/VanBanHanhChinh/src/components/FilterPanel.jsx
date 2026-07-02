import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL = '__all__'

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? '' : v)}>
        <SelectTrigger><SelectValue placeholder="-- Tất cả --" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>-- Tất cả --</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function FilterPanel({ open, onToggle, filters, setFilters, filterOptions, onSearch, searching }) {
  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <SlidersHorizontal className="h-5 w-5 text-primary shrink-0" />
        <span className="flex-1 text-sm font-bold uppercase">Bộ lọc tìm kiếm</span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>

      {open && (
        <div className="border-t px-4 py-3 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Số văn bản</Label>
            <Input value={filters.soHieu} onChange={(e) => set('soHieu', e.target.value)} placeholder="VD: 49/2026/NQ-HĐND" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Trích yếu (từ khoá)</Label>
            <Input value={filters.trichYeu} onChange={(e) => set('trichYeu', e.target.value)} placeholder="VD: bảo hiểm y tế" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ngày ban hành từ</Label>
              <Input type="date" value={filters.ngayBanHanhFrom} onChange={(e) => set('ngayBanHanhFrom', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">đến</Label>
              <Input type="date" value={filters.ngayBanHanhTo} onChange={(e) => set('ngayBanHanhTo', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ngày hiệu lực từ</Label>
              <Input type="date" value={filters.ngayHieuLucFrom} onChange={(e) => set('ngayHieuLucFrom', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">đến</Label>
              <Input type="date" value={filters.ngayHieuLucTo} onChange={(e) => set('ngayHieuLucTo', e.target.value)} />
            </div>
          </div>

          <FilterSelect label="Lĩnh vực" value={filters.linhVuc} onChange={(v) => set('linhVuc', v)} options={filterOptions.linhVuc} />
          <FilterSelect label="Loại văn bản" value={filters.loaiVanBan} onChange={(v) => set('loaiVanBan', v)} options={filterOptions.loaiVanBan} />
          <FilterSelect label="Cơ quan ban hành" value={filters.coQuanBanHanh} onChange={(v) => set('coQuanBanHanh', v)} options={filterOptions.coQuanBanHanh} />

          <Button className="w-full" size="lg" onClick={onSearch} disabled={searching}>
            {searching ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
          </Button>
        </div>
      )}
    </div>
  )
}
