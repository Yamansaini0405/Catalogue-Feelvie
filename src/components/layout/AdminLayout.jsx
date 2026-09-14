import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

const PAGE_META = [
  { prefix: '/view-products', title: 'Products', subtitle: 'Everything listed under your boutique account' },
  { prefix: '/products/', title: 'Product Details', subtitle: 'Full listing information' },
  { prefix: '/add-product', title: 'Add Product', subtitle: 'Create and publish a new catalogue item' },
  { prefix: '/add-variant', title: 'Catalog Setup', subtitle: 'Categories, colors & sizes master data' },
  { prefix: '/profile', title: 'Profile', subtitle: 'Account details and shareable storefront link' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const meta = useMemo(
    () =>
      PAGE_META.find((item) => location.pathname.startsWith(item.prefix)) ?? {
        title: 'Dashboard',
        subtitle: '',
      },
    [location.pathname],
  )

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} onLogout={handleLogout} />

      <div className="min-h-screen lg:pl-64">
        <Topbar title={meta.title} subtitle={meta.subtitle} onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
