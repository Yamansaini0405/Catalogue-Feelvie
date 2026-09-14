import { Menu } from 'lucide-react'
import { initialsFromEmail } from '../../utils/format'

export default function Topbar({ title, subtitle, onOpenMobileSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
        {subtitle && <p className="hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white sm:flex">
          {initialsFromEmail('boutique@feelvie.com')}
        </div>
      </div>
    </header>
  )
}
