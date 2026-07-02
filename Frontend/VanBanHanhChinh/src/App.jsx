import { useEffect, useState } from 'react'
import { Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FilterPanel from '@/components/FilterPanel'
import ResultCard from '@/components/ResultCard'
import { api } from '@/lib/api'

const EMPTY_FILTERS = {
  soHieu: '', trichYeu: '', coQuanBanHanh: '', loaiVanBan: '', linhVuc: '',
  ngayBanHanhFrom: '', ngayBanHanhTo: '', ngayHieuLucFrom: '', ngayHieuLucTo: '',
}

export default function App() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filterOptions, setFilterOptions] = useState({ coQuanBanHanh: [], loaiVanBan: [], linhVuc: [] })
  const [filterOpen, setFilterOpen] = useState(true)

  const [result, setResult] = useState({ items: [], count: 0, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/filters').then((res) => setFilterOptions(res.data)).catch(() => {})
  }, [])

  async function runSearch(targetPage) {
    setSearching(true)
    setError('')
    try {
      const res = await api.get('/search', { params: { ...filters, page: targetPage } })
      setResult(res.data)
      setPage(targetPage)
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSearching(false)
    }
  }

  function handleSearch() {
    runSearch(1)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <img src="/LogoDakPring.jpg" alt="Đắc Pring" className="h-9 w-9 shrink-0 rounded-md object-contain" />
            <div>
              <CardTitle className="text-base font-bold">Tra cứu văn bản hành chính</CardTitle>
              <p className="text-xs text-muted-foreground">UBND Đắc Pring · Nguồn: Cổng TTĐT Đà Nẵng</p>
            </div>
          </CardHeader>
        </Card>

        <FilterPanel
          open={filterOpen}
          onToggle={() => setFilterOpen((v) => !v)}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onSearch={handleSearch}
          searching={searching}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        {searched && !searching && (
          <p className="text-sm text-muted-foreground">
            Có <span className="font-bold text-foreground">{result.count}</span> kết quả được tìm thấy.
          </p>
        )}

        {searching && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {!searching && searched && result.items.length === 0 && (
          <div className="rounded-lg border bg-card p-6 text-center space-y-2">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Không tìm thấy văn bản phù hợp. Thử đổi bộ lọc.</p>
          </div>
        )}

        {!searching && result.items.length > 0 && (
          <div className="space-y-2">
            {result.items.map((item) => <ResultCard key={item._id} item={item} />)}
          </div>
        )}

        {!searching && searched && result.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => runSearch(page - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Trước
            </Button>
            <span className="text-xs text-muted-foreground">Trang {page}/{result.totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= result.totalPages} onClick={() => runSearch(page + 1)} className="gap-1">
              Sau <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
