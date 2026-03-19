import { useParams } from 'react-router-dom'
import feelVieLogo from '../assets/feelVie.png'
import ProductDetailPage from './ProductDetailPage'

function PublicProductDetailPage() {
  const { id } = useParams()

  return (
    <div className='min-h-screen bg-zinc-100'>
      <div className='mx-auto max-w-full rounded-md bg-white px-4 py-2 md:px-8 md:py-4'>
        {/* Header */}
        <header className='flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5'>
          <img src={feelVieLogo} alt='FeelVie' className='h-9 w-auto object-contain md:h-11' />
          <div className='text-sm text-zinc-700'>
            <button
              type='button'
              className='h-11 shrink-0 rounded-full bg-[#803385] px-5 text-xs font-semibold uppercase tracking-wide text-white'
            >
              Download Our App
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className='py-8'>
          <ProductDetailPage />
        </div>

        {/* Footer */}
        <section
          className='relative mt-14 overflow-hidden rounded-2xl'
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(30,30,30,0.55) 0%, rgba(30,30,30,0.72) 100%), url(https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='p-8 text-center text-white md:p-12'>
            <h2 className='text-3xl font-bold uppercase md:text-5xl'>Explore Our Fashion Catalog</h2>
            <p className='mx-auto mt-4 max-w-2xl text-sm text-zinc-100 md:text-base'>
              Browse through our fashion catalog to find a wide range of stylish clothing options. From classic looks to the
              latest trends, there's something for everyone.
            </p>
            <button type='button' className='mt-7 rounded-full border border-white px-6 py-3 text-xs font-semibold tracking-wide'>
              SEE OUR INSTAGRAM
            </button>
          </div>

          <div className='mx-6 mb-6 rounded-3xl bg-white/95 p-8 md:mx-10 md:p-10'>
            <div className='grid grid-cols-2 gap-8 text-sm text-zinc-700 md:grid-cols-4'>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>GENERAL</h4>
                <ul className='space-y-2'>
                  <li>About Us</li>
                  <li>Blog</li>
                  <li>How it Works</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>PRODUCTS</h4>
                <ul className='space-y-2'>
                  <li>Man Fashion</li>
                  <li>Woman Fashion</li>
                  <li>Shoes & Bag</li>
                  <li>Accessories</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>CUSTOMER SERVICE</h4>
                <ul className='space-y-2'>
                  <li>FAQ</li>
                  <li>Help & Support</li>
                  <li>Billing Cycle</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>SOCIAL MEDIA</h4>
                <ul className='space-y-2'>
                  <li>Instagram</li>
                  <li>Tiktok</li>
                  <li>Facebook</li>
                  <li>Youtube</li>
                </ul>
              </div>
            </div>
            <p className='mt-8 text-5xl font-black tracking-wider text-zinc-200 md:text-8xl'>FEELVIE</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PublicProductDetailPage
