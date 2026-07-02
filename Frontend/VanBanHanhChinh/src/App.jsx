import { useEffect, useState } from 'react'
import { Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import FilterPanel from '@/components/FilterPanel'
import ResultCard from '@/components/ResultCard'
import { api } from '@/lib/api'

const EMPTY_FILTERS = {
  soHieu: '', trichYeu: '', coQuanBanHanh: '', loaiVanBan: '', linhVuc: '',
  ngayBanHanhFrom: '', ngayBanHanhTo: '', ngayHieuLucFrom: '', ngayHieuLucTo: '',
}

const BG = 'linear-gradient(180deg, #1c4f9c 0%, #2f74c4 38%, #5f9edb 72%, #9ac6ef 100%)'
const AURORA_A = 'radial-gradient(circle at 30% 30%, rgba(191,219,254,0.42), transparent 62%)'
const AURORA_B = 'radial-gradient(circle at 50% 50%, rgba(147,197,253,0.34), transparent 60%)'
const AURORA_C = 'radial-gradient(circle at 50% 50%, rgba(96,165,250,0.30), transparent 62%)'

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
    <div
      className="relative min-h-screen w-full overflow-hidden flex justify-center px-[18px] py-10 font-sans text-[#F2E9DC]"
      style={{ background: BG }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-[18%] -left-[22%] w-[62vw] h-[62vw] max-w-[640px] max-h-[640px] rounded-full blur-[60px] animate-aurora-a" style={{ background: AURORA_A }} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[20%] -right-[18%] w-[58vw] h-[58vw] max-w-[600px] max-h-[600px] rounded-full blur-[70px] animate-aurora-b" style={{ background: AURORA_B }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-[34%] left-[40%] w-[40vw] h-[40vw] max-w-[420px] max-h-[420px] rounded-full blur-[60px] animate-aurora-c" style={{ background: AURORA_C }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-overlay" />

      <div className="relative z-[1] w-full max-w-[408px] flex flex-col gap-4">

        {/* HEADER */}
        <div
          className="flex items-center gap-3.5 px-[18px] py-[18px] rounded-[20px] border animate-fade-in backdrop-blur-[14px]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
            borderColor: 'rgba(224,184,113,0.20)',
            boxShadow: '0 18px 50px -22px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="relative w-[54px] h-[54px] shrink-0 rounded-full p-0.5"
            style={{ background: 'linear-gradient(150deg, #E0B871, #8a662f)', boxShadow: '0 6px 18px -6px rgba(224,184,113,0.6)' }}
          >
            <img src="/LogoDakPring.jpg" alt="UBND Đắc Pring" className="w-[50px] h-[50px] block rounded-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-xl leading-tight tracking-tight text-[#FBF4E6]">Tra cứu văn bản hành chính</div>
            <div className="mt-1 text-[11.5px] tracking-wide text-[rgba(242,233,220,0.62)] flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#E0B871] shrink-0" />
              UBND xã Đắc Pring · Nguồn: Cổng TTĐT Đà Nẵng
            </div>
          </div>
        </div>

        <FilterPanel
          open={filterOpen}
          onToggle={() => setFilterOpen((v) => !v)}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onSearch={handleSearch}
          searching={searching}
        />

        {error && <p className="text-sm text-red-200 px-1">{error}</p>}

        {searched && !searching && (
          <div className="flex items-baseline justify-between px-1">
            <span className="font-serif text-[17px] font-bold text-[#FBF4E6]">Kết quả tra cứu</span>
            <span className="text-xs text-[rgba(242,233,220,0.6)]">{result.count} văn bản</span>
          </div>
        )}

        {searching && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[#E0B871]" />
          </div>
        )}

        {!searching && searched && result.items.length === 0 && (
          <div
            className="rounded-[18px] p-6 text-center space-y-2 border backdrop-blur-[12px]"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', borderColor: 'rgba(255,255,255,0.09)' }}
          >
            <FileText className="h-8 w-8 mx-auto text-[rgba(242,233,220,0.5)]" />
            <p className="text-sm text-[rgba(242,233,220,0.7)]">Không tìm thấy văn bản phù hợp. Thử đổi bộ lọc.</p>
          </div>
        )}

        {!searching && result.items.length > 0 && (
          <div className="flex flex-col gap-3">
            {result.items.map((item, i) => <ResultCard key={item._id} item={item} delay={`${(i * 0.09).toFixed(2)}s`} />)}
          </div>
        )}

        {!searching && searched && result.totalPages > 1 && (
          <div className="flex items-center justify-between pt-1 px-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => runSearch(page - 1)}
              className="flex items-center gap-1 text-sm font-medium text-[#F3E4C6] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#E0B871] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Trước
            </button>
            <span className="text-xs text-[rgba(242,233,220,0.6)]">Trang {page}/{result.totalPages}</span>
            <button
              type="button"
              disabled={page >= result.totalPages}
              onClick={() => runSearch(page + 1)}
              className="flex items-center gap-1 text-sm font-medium text-[#F3E4C6] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#E0B871] transition-colors"
            >
              Sau <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
