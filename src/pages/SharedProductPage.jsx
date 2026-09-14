import ProductDetailPage from './ProductDetailPage'
import feelVieLogo from '../assets/feelVie.png'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SharedProductPage() {
  const _navigate = useNavigate()

  return (
    <main className='min-h-screen bg-slate-100'>
      <header className='sticky top-0 z-30 border-b border-slate-200 bg-white'>
        <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            
            <img src={feelVieLogo} alt='FeelVie' className='h-9 w-auto object-contain' />
          </div>

          <button
            type='button'
            className='rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800'
          >
            Download Our App
          </button>
        </div>
      </header>

      <section className='mx-auto w-full max-w-6xl p-4 sm:p-6'>
        <ProductDetailPage />
      </section>
    </main>
  )
}

export default SharedProductPage
