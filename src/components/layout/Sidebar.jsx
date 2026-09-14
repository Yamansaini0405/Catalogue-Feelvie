import { LayoutGrid, LogOut, PackagePlus, Shapes, Sparkles, User, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import feelVieIcon from '../../assets/feelVie_ icon.png'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Products', icon: LayoutGrid, description: 'Catalogue overview' },
  { to: ROUTES.ADD_PRODUCT, label: 'Add Product', icon: PackagePlus, description: 'Publish a new listing' },
  { to: ROUTES.ADD_VARIANT, label: 'Catalog Setup', icon: Shapes, description: 'Categories, colors & sizes' },
  { to: ROUTES.PROFILE, label: 'Profile', icon: User, description: 'Update your account details' }, 
]

export default function Sidebar({ mobileOpen, onCloseMobile, onLogout }) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[1px] lg:hidden"
          aria-label="Close sidebar backdrop"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950 text-slate-100 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <img src={feelVieIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-display text-base font-semibold leading-tight text-white">FeelVie</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-brand-300">Boutique CRM</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Catalogue</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive ? 'bg-brand-100 text-brand-700' : 'bg-white/10 text-slate-200 group-hover:bg-white/15'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{item.label}</span>
                      <span className={`block truncate text-[11px] font-normal ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.description}
                      </span>
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex items-center gap-2 text-gold-300">
            <Sparkles size={15} />
            <p className="text-xs font-semibold">Tip</p>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-300">
            Keep categories, colors and sizes updated first — Add Product pulls choices from Catalog Setup.
          </p>
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
