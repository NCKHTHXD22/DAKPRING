import { ChevronDown, Search, Loader2, X } from 'lucide-react'

const ALL = '__all__'
const FIELD_LABELS = {
  soHieu: 'Số VB', trichYeu: 'Từ khoá',
  ngayBanHanhFrom: 'BH từ', ngayBanHanhTo: 'BH đến',
  ngayHieuLucFrom: 'HL từ', ngayHieuLucTo: 'HL đến',
  linhVuc: 'Lĩnh vực', loaiVanBan: 'Loại', coQuanBanHanh: 'Cơ quan',
}

const inputStyle = {
  background: 'rgba(255,255,255,0.045)',
  borderColor: 'rgba(242,233,220,0.13)',
}

function FieldLabel({ children, accent }) {
  return (
    <label
      className={accent ? 'text-xs font-bold tracking-wide text-[#E0B871]' : 'text-xs font-semibold tracking-wide text-[rgba(242,233,220,0.78)]'}
    >
      {children}
    </label>
  )
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        className="w-full px-3.5 py-3 rounded-[13px] border text-[#F6EFE2] text-sm outline-none transition-colors focus:border-[#E0B871] focus:shadow-[0_0_0_4px_rgba(224,184,113,0.15)] hover:border-[rgba(224,184,113,0.4)]"
      />
    </div>
  )
}

function DateRangeField({ title, fromValue, toValue, onFrom, onTo }) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel accent>{title}</FieldLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[rgba(242,233,220,0.55)]">Từ ngày</span>
          <input type="date" value={fromValue} onChange={(e) => onFrom(e.target.value)} style={inputStyle}
            className="w-full px-3 py-2.5 rounded-xl border text-[#F6EFE2] text-[13px] outline-none transition-colors focus:border-[#E0B871] focus:shadow-[0_0_0_4px_rgba(224,184,113,0.15)] hover:border-[rgba(224,184,113,0.4)]" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[rgba(242,233,220,0.55)]">Đến ngày</span>
          <input type="date" value={toValue} onChange={(e) => onTo(e.target.value)} style={inputStyle}
            className="w-full px-3 py-2.5 rounded-xl border text-[#F6EFE2] text-[13px] outline-none transition-colors focus:border-[#E0B871] focus:shadow-[0_0_0_4px_rgba(224,184,113,0.15)] hover:border-[rgba(224,184,113,0.4)]" />
        </div>
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value || ALL}
        onChange={(e) => onChange(e.target.value === ALL ? '' : e.target.value)}
        style={inputStyle}
        className="w-full px-3.5 py-3 rounded-[13px] border text-[#F6EFE2] text-sm outline-none cursor-pointer appearance-none transition-colors focus:border-[#E0B871] focus:shadow-[0_0_0_4px_rgba(224,184,113,0.15)] hover:border-[rgba(224,184,113,0.4)] bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2012%2012%22%3E%3Cpath%20d=%22M2%204l4%204%204-4%22%20stroke=%22%23E0B871%22%20stroke-width=%221.5%22%20fill=%22none%22%20stroke-linecap=%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
      >
        <option value={ALL}>-- Tất cả --</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function FilterPanel({ open, onToggle, filters, setFilters, filterOptions, onSearch, searching }) {
  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const activeChips = Object.keys(FIELD_LABELS)
    .filter((f) => filters[f])
    .map((f) => ({ key: f, label: `${FIELD_LABELS[f]}: ${filters[f]}` }))

  return (
    <div
      className="rounded-[22px] border overflow-hidden backdrop-blur-[16px]"
      style={{
        background: 'linear-gradient(165deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))',
        borderColor: 'rgba(255,255,255,0.10)',
        boxShadow: '0 26px 70px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-[18px] py-[18px] bg-transparent text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="grid place-items-center w-[34px] h-[34px] rounded-[11px] shrink-0 text-[#E0B871]" style={{ background: 'rgba(224,184,113,0.14)', border: '1px solid rgba(224,184,113,0.30)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </span>
        <span className="flex-1 font-semibold text-[13.5px] tracking-[1.4px] uppercase text-[#FBF4E6]">Bộ lọc tìm kiếm</span>
        {activeChips.length > 0 && (
          <span className="min-w-[22px] h-[22px] px-1.5 grid place-items-center rounded-full text-[#201603] text-xs font-bold animate-badge-pulse" style={{ background: 'linear-gradient(150deg,#E0B871,#c79a54)' }}>
            {activeChips.length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-[rgba(242,233,220,0.7)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-[18px] pb-[18px] pt-1 flex flex-col gap-4">
          <TextField label="Số văn bản" value={filters.soHieu} onChange={(v) => set('soHieu', v)} placeholder="VD: 49/2026/NQ-HĐND" />
          <TextField label="Trích yếu (từ khoá)" value={filters.trichYeu} onChange={(v) => set('trichYeu', v)} placeholder="VD: bảo hiểm y tế" />

          <DateRangeField title="Ngày ban hành" fromValue={filters.ngayBanHanhFrom} toValue={filters.ngayBanHanhTo}
            onFrom={(v) => set('ngayBanHanhFrom', v)} onTo={(v) => set('ngayBanHanhTo', v)} />
          <DateRangeField title="Ngày hiệu lực" fromValue={filters.ngayHieuLucFrom} toValue={filters.ngayHieuLucTo}
            onFrom={(v) => set('ngayHieuLucFrom', v)} onTo={(v) => set('ngayHieuLucTo', v)} />

          <SelectField label="Lĩnh vực" value={filters.linhVuc} onChange={(v) => set('linhVuc', v)} options={filterOptions.linhVuc} />
          <SelectField label="Loại văn bản" value={filters.loaiVanBan} onChange={(v) => set('loaiVanBan', v)} options={filterOptions.loaiVanBan} />
          <SelectField label="Cơ quan ban hành" value={filters.coQuanBanHanh} onChange={(v) => set('coQuanBanHanh', v)} options={filterOptions.coQuanBanHanh} />

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => set(chip.key, '')}
                  className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-[#F3E4C6] text-xs font-medium transition-colors hover:bg-[rgba(224,184,113,0.22)] active:scale-95"
                  style={{ background: 'rgba(224,184,113,0.12)', border: '1px solid rgba(224,184,113,0.35)' }}
                >
                  {chip.label}
                  <span className="grid place-items-center w-4 h-4 rounded-full text-[#FBF4E6]" style={{ background: 'rgba(224,184,113,0.3)' }}>
                    <X className="h-2.5 w-2.5" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onSearch}
            disabled={searching}
            className="relative overflow-hidden mt-1 w-full py-4 rounded-[15px] border-none text-[#241803] text-[15px] font-bold tracking-wide cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #EBC079 0%, #D9A94F 55%, #c1913b 100%)',
              boxShadow: '0 16px 34px -14px rgba(224,184,113,0.75), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            {!searching && (
              <span aria-hidden="true" className="absolute top-0 left-0 w-3/5 h-full animate-sheen pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }} />
            )}
            <span className="relative inline-flex items-center justify-center gap-2">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {searching ? 'Đang tìm kiếm…' : 'Tìm kiếm'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
