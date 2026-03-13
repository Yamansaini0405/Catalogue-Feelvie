import { Link } from 'react-router-dom'

function HomePage() {
  const token = localStorage.getItem('authToken') ?? ''

  return (
    <section className='rounded-2xl bg-white p-6 shadow-lg'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Boutique Owner Home</h1>
        <p className='mt-1 text-sm text-slate-600'>Manage your boutique catalogue panel</p>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Link
          to='/dashboard'
          className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 transition hover:bg-slate-100'
        >
          <p className='text-base font-semibold'>Go to Dashboard</p>
          <p className='mt-1 text-sm text-slate-600'>View products listed by your account</p>
        </Link>
        <Link
          to='/add-product'
          className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 transition hover:bg-slate-100'
        >
          <p className='text-base font-semibold'>Add Product</p>
          <p className='mt-1 text-sm text-slate-600'>Create a new product listing</p>
        </Link>
        <Link
          to='/add-variant'
          className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 transition hover:bg-slate-100'
        >
          <p className='text-base font-semibold'>Add Variant Data</p>
          <p className='mt-1 text-sm text-slate-600'>Create category, color, and size master data</p>
        </Link>
        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2 xl:col-span-1'>
          <p className='text-base font-semibold text-slate-800'>Authentication</p>
          <p className='mt-1 break-all text-xs text-slate-600'>
            {token ? 'Token available in local storage' : 'No token found'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HomePage
