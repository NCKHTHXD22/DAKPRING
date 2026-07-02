import { useEffect, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import StationPicker from '@/components/StationPicker'
import Calendar from '@/components/Calendar'
import ResultsList from '@/components/ResultsList'
import { api } from '@/lib/api'

function pad(n) { return String(n).padStart(2, '0') }

export default function App() {
  const [stations, setStations] = useState([])
  const [stationsLoading, setStationsLoading] = useState(true)
  const [selected, setSelected] = useState(new Set())
  const [selectedDate, setSelectedDate] = useState(null)
  const [items, setItems] = useState([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/stations')
      .then((res) => setStations(res.data.stations || []))
      .catch(() => setStations([]))
      .finally(() => setStationsLoading(false))
  }, [])

  function toggleStation(name) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function selectAllStations() {
    setSelected((prev) => (prev.size === stations.length ? new Set() : new Set(stations)))
  }

  async function handleSearch() {
    setSearching(true)
    setError('')
    try {
      const params = {}
      if (selected.size > 0 && selected.size < stations.length) {
        params.station = [...selected].join(',')
      }
      if (selectedDate) {
        params.date = `${pad(selectedDate.getDate())}/${pad(selectedDate.getMonth() + 1)}/${selectedDate.getFullYear()}`
      }
      const res = await api.get('/search', { params })
      setItems(res.data.items || [])
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <img src="/LogoDakPring.jpg" alt="Đắc Pring" className="h-9 w-9 shrink-0 rounded-md object-contain" />
            <div>
              <CardTitle className="text-base font-bold">Tra cứu lịch cắt điện</CardTitle>
              <p className="text-xs text-muted-foreground">UBND Đắc Pring · Nguồn: EVNCPC (Nam Giang)</p>
            </div>
          </CardHeader>
        </Card>

        <StationPicker
          stations={stations}
          loading={stationsLoading}
          selected={selected}
          onToggle={toggleStation}
          onSelectAll={selectAllStations}
          allSelected={stations.length > 0 && selected.size === stations.length}
        />

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-bold uppercase mb-3">Chọn thời gian</p>
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
          <p className="text-xs text-muted-foreground mt-2">
            {selectedDate
              ? `Đã chọn ngày ${pad(selectedDate.getDate())}/${pad(selectedDate.getMonth() + 1)}/${selectedDate.getFullYear()}`
              : 'Chưa chọn ngày — mặc định xem lịch sắp tới'}
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full gap-2" size="lg" onClick={handleSearch} disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {searching ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
        </Button>

        <ResultsList items={items} searched={searched} />
      </div>
    </div>
  )
}
