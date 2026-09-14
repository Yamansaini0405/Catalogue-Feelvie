function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-600 border-r-brand-600" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading…</p>
      </div>
    </div>
  )
}

export default Loader
