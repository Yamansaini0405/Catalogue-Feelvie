import { Bell, LayoutDashboard, Menu, PackagePlus, Shapes, Search, UserCircle, X, House } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
//   { to: '/home', label: 'Home', icon: House },
  { to: '/view-products', label: 'View Products', icon: LayoutDashboard },
  { to: '/add-product', label: 'Add Product', icon: PackagePlus },
  { to: '/add-variant', label: 'Add Variant', icon: Shapes },
]

function SidebarLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/view-products')) return 'View Products'
    if (location.pathname.startsWith('/products/')) return 'Product Details'
    if (location.pathname.startsWith('/add-product')) return 'Add Product'
    if (location.pathname.startsWith('/add-variant')) return 'Add Variant'
    return 'Home'
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  return (
    <main className='min-h-screen bg-slate-100'>
      {isMobileSidebarOpen && (
        <button
          type='button'
          onClick={() => setIsMobileSidebarOpen(false)}
          className='fixed inset-0 z-40 bg-black/40 lg:hidden'
          aria-label='Close sidebar backdrop'
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 border-r border-slate-800 bg-slate-900 text-slate-100 transition-all duration-200 ${
          isDesktopCollapsed ? 'w-18' : 'w-60'
        } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className='flex h-full flex-col overflow-y-auto'>
          <div className='flex h-16 items-center justify-between border-b border-slate-800 px-4'>
            <div className='overflow-hidden'>
              <p className='text-lg font-bold'>FeelVie</p>
              {!isDesktopCollapsed && <p className='text-xs text-slate-400'>Admin Portal</p>}
            </div>
            <button
              type='button'
              onClick={() => setIsMobileSidebarOpen(false)}
              className='rounded-md p-1 text-slate-300 hover:bg-slate-800 lg:hidden'
              aria-label='Close sidebar'
            >
              <X size={18} />
            </button>
          </div>

          <nav className='mt-4 space-y-1 px-3'>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800'
                    } ${isDesktopCollapsed ? 'justify-center' : ''}`
                  }
                  title={isDesktopCollapsed ? item.label : ''}
                >
                  <Icon size={18} />
                  {!isDesktopCollapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>

          <div className='mt-4 border-t border-slate-800' />

          <div className='mt-auto p-3'>
            <button
              type='button'
              onClick={logout}
              className='w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800'
            >
              {isDesktopCollapsed ? '↩' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      <div className={`min-h-screen transition-all duration-200 ${isDesktopCollapsed ? 'lg:pl-18' : 'lg:pl-60'}`}>
        <header className='sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6'>
          <button
            type='button'
            onClick={() => setIsMobileSidebarOpen(true)}
            className='rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden'
            aria-label='Open sidebar'
          >
            <Menu size={20} />
          </button>

          {/* <button
            type='button'
            onClick={() => setIsDesktopCollapsed((previous) => !previous)}
            className='hidden rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:inline-flex'
            aria-label='Toggle sidebar collapse'
          >
            <Menu size={20} />
          </button> */}

          <div className='min-w-0'>
            <h1 className='truncate text-xl font-bold text-slate-900'>{pageTitle}</h1>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <label className='hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 md:flex'>
              <Search size={16} className='text-slate-500' />
              <input
                type='text'
                placeholder='Search...'
                className='w-40 bg-transparent text-sm text-slate-700 outline-none lg:w-52'
              />
            </label>

            <button
              type='button'
              className='rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              aria-label='Notifications'
            >
              <Bell size={18} />
            </button>

            <button
              type='button'
              className='rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              aria-label='Profile'
            >
              <UserCircle size={18} />
            </button>
          </div>
        </header>

        <section className='p-4 sm:p-6'>
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default SidebarLayout
