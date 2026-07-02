import { useEffect, useState } from 'react'
import { Search, Loader2, Wallet, MapPin, Clock, Phone, CalendarClock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const now = new Date()
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

function formatDate(iso) {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

export default function App() {
  const [thang, setThang] = useState(now.getMonth() + 1)
  const [nam, setNam] = useState(now.getFullYear())
  const [items, setItems] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/search', { params: { thang, nam } })
      setItems(res.data.items || [])
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { handleSearch() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <img src="/LogoDakPring.jpg" alt="Đắc Pring" className="h-9 w-9 shrink-0 rounded-md object-contain" />
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-1.5"><Wallet className="h-4 w-4 text-primary" /> Lịch chi trả trợ cấp</CardTitle>
              <p className="text-xs text-muted-foreground">UBND Đắc Pring · Trợ cấp xã hội, người có công</p>
            </div>
          </CardHeader>
        </Card>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-sm font-bold uppercase">Chọn tháng / năm</p>
          <div className="flex gap-2">
            <select
              value={thang}
              onChange={(e) => setThang(Number(e.target.value))}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {MONTHS.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
            <select
              value={nam}
              onChange={(e) => setNam(Number(e.target.value))}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {YEARS.map((y) => <option key={y} value={y}>Năm {y}</option>)}
            </select>
          </div>
          <Button className="w-full gap-2" size="lg" onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? 'Đang tìm kiếm...' : 'Tra cứu'}
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {searched && !loading && (
          <p className="text-sm text-muted-foreground">
            Có <span className="font-bold text-foreground">{items.length}</span> lịch chi trả trong tháng {thang}/{nam}
          </p>
        )}

        {!loading && searched && items.length === 0 && (
          <div className="rounded-lg border bg-card p-6 text-center space-y-2">
            <CalendarClock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Chưa có lịch chi trả nào được công bố cho tháng này.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it._id} className="card-hover rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-primary">{it.phuongMoi}</span>
                  {it.phuongCu && it.phuongCu !== it.phuongMoi && (
                    <span className="shrink-0 text-xs text-muted-foreground">(trước: {it.phuongCu})</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  {formatDate(it.ngayChiTra)}{it.khungGio ? ` — ${it.khungGio}` : ''}
                </div>
                <div className="flex items-start gap-1.5 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {it.diaDiem}
                </div>
                {(it.nhanVienTen || it.nhanVienSdt) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {it.nhanVienTen}{it.nhanVienSdt ? ` · ĐT: ${it.nhanVienSdt}` : ''}
                  </div>
                )}
                {it.ghiChu && <p className="text-xs text-muted-foreground italic">{it.ghiChu}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
