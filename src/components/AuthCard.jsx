import { Link, useLocation } from 'react-router-dom'

function AuthCard({ title, error, success, token, children }) {
  const location = useLocation()

  const isRegister = location.pathname === '/register'
  const isLogin = location.pathname === '/login'

  return (
    <main className='min-h-screen bg-slate-100 px-4 py-10'>
      <section className='mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg'>
        <h1 className='text-2xl font-bold text-slate-900'>Boutique Catalogue Panel</h1>
        <p className='mt-2 text-sm text-slate-600'>{title}</p>

        <div className='mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1'>
          <Link
            to='/register'
            className={`rounded-md px-3 py-2 text-center text-sm font-medium transition ${
              isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Register
          </Link>
          <Link
            to='/login'
            className={`rounded-md px-3 py-2 text-center text-sm font-medium transition ${
              isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Login
          </Link>
        </div>

        <div className='mt-6'>{children}</div>

        {error && <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
        {success && <p className='mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'>{success}</p>}
      </section>
    </main>
  )
}

export default AuthCard


