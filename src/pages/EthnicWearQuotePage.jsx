import { useEffect, useState } from 'react'
import feelVieLogo from '../assets/feelVie.png'

const FORMINIT_FORM_ID = 'g2amwaxiojr'

const dressTypes = ['Saree', 'Lehenga', 'Gown', 'Suit / Salwar', 'Kids Wear', 'Custom Design']
const occasions = ['Wedding', 'Party', 'Casual', 'Festival', 'Other']
const fabricOptions = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Velvet', 'Not Sure']
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurements']
const budgetOptions = ['₹5000 - ₹10000', '₹10000 - ₹20000', '₹20000 - ₹30000', '₹30000 - ₹40000', '₹40000 - ₹50000', '₹50000 - ₹60000', '₹60000 - ₹70000', '₹70000 - ₹80000', '₹80000 - ₹90000', '₹90000 - ₹100000', 'Above ₹100000']

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  dressType: '',
  occasion: '',
  fabric: '',
  preferredColor: '',
  clothSize: '',
  budgetRange: '',
  customizationRequirements: '',
  requiredDeliveryDate: '',
  additionalNotes: '',
}

const fieldClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'

function EthnicWearQuotePage() {
  const [form, setForm] = useState(initialForm)
  const [referenceImage, setReferenceImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (window.Forminit) {
      return undefined
    }

    const script = document.createElement('script')
    script.src = 'https://forminit.com/sdk/v1/forminit.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const onFieldChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const onImageChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null
    setReferenceImage(selectedFile)
  }

  const submitQuoteRequest = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!window.Forminit) {
      setError('Form service is still loading. Please wait a moment and try again.')
      return
    }

    if (!referenceImage) {
      setError('Reference image is required.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('fi-sender-fullName', form.fullName.trim())
      formData.append('fi-sender-email', form.email.trim())
      formData.append('fi-text-phoneOrWhatsapp', form.phone.trim())
      formData.append('fi-text-cityLocation', form.city.trim())
      formData.append('fi-select-dressType', form.dressType)
      formData.append('fi-select-occasion', form.occasion)
      formData.append('fi-select-preferredFabric', form.fabric)
      formData.append('fi-text-preferredColor', form.preferredColor.trim())
      formData.append('fi-select-size', form.clothSize)
      formData.append('fi-select-budgetRange', form.budgetRange)
      formData.append('fi-text-customizationRequirements', form.customizationRequirements.trim())
      formData.append('fi-date-requiredDeliveryDate', form.requiredDeliveryDate)
      formData.append('fi-text-additionalNotes', form.additionalNotes.trim())
      formData.append('fi-file-referenceImage', referenceImage, referenceImage.name)

      const forminit = new window.Forminit()
      const { error: submitError } = await forminit.submit(FORMINIT_FORM_ID, formData)

      if (submitError) {
        throw new Error(submitError?.message || 'Unable to submit quote request')
      }

      setSuccess('Request submitted successfully. Our boutique team will contact you soon.')
      setForm(initialForm)
      setReferenceImage(null)
    } catch (requestError) {
      setError(requestError?.message || 'Unable to submit quote request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className='min-h-screen bg-linear-to-b from-rose-50 via-fuchsia-50 to-violet-100'
            >
      <header className='sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6'>
          <img src={feelVieLogo} alt='FeelVie' className='h-9 w-auto object-contain' />
          <div className='md:flex items-center gap-2 hidden '>
            <a  className='rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'>
              View Products
            </a>
            <a className='rounded-lg bg-[#D6448B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D6448B]/90' >
              Download App
            </a>
          </div>
        </div>
      </header>

      <section className='mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6'
      >
        <div className='overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl'>
         

          <div className='p-6 md:p-10'>
            <h1 className='text-3xl font-bold leading-tight md:text-5xl text-[#D6448B]'>Customize your Dream Dress</h1>
            <p className='mt-1 text-sm text-slate-600'>Fill details below and submit your requirement.</p>

            <form onSubmit={submitQuoteRequest} className='mt-6 space-y-5'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50/60 p-5'>
                <h3 className='text-base font-semibold text-slate-900'>Basic Information</h3>
                <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <label>
                    <span className={labelClass}>1. Full Name</span>
                    <input name='fullName' value={form.fullName} onChange={onFieldChange} className={fieldClass} required />
                  </label>

                  <label>
                    <span className={labelClass}>2. Email Address</span>
                    <input type='email' name='email' value={form.email} onChange={onFieldChange} className={fieldClass} required />
                  </label>

                  <label>
                    <span className={labelClass}>3. Phone / WhatsApp Number</span>
                    <input name='phone' value={form.phone} onChange={onFieldChange} className={fieldClass} required />
                  </label>

                  <label>
                    <span className={labelClass}>4. City / Location</span>
                    <input name='city' value={form.city} onChange={onFieldChange} className={fieldClass} required />
                  </label>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-slate-50/60 p-5'>
                <h3 className='text-base font-semibold text-slate-900'>Dress Details</h3>
                <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <label>
                    <span className={labelClass}>5. Type of Dress</span>
                    <select name='dressType' value={form.dressType} onChange={onFieldChange} className={fieldClass} required>
                      <option value=''>Select dress type</option>
                      {dressTypes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>6. Occasion</span>
                    <select name='occasion' value={form.occasion} onChange={onFieldChange} className={fieldClass} required>
                      <option value=''>Select occasion</option>
                      {occasions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>Preferred Fabric</span>
                    <select name='fabric' value={form.fabric} onChange={onFieldChange} className={fieldClass} required>
                      <option value=''>Select fabric</option>
                      {fabricOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>7. Preferred Color</span>
                    <input name='preferredColor' value={form.preferredColor} onChange={onFieldChange} className={fieldClass} required />
                  </label>

                  <label>
                    <span className={labelClass}>8. Size</span>
                    <select name='clothSize' value={form.clothSize} onChange={onFieldChange} className={fieldClass} required>
                      <option value=''>Select size</option>
                      {sizeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>9. Budget Range</span>
                    <select name='budgetRange' value={form.budgetRange} onChange={onFieldChange} className={fieldClass} required>
                      <option value=''>Select budget range</option>
                      {budgetOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-slate-50/60 p-5'>
                <h3 className='text-base font-semibold text-slate-900'>Customization Details</h3>
                <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <label className='md:col-span-2'>
                    <span className={labelClass}>11. Upload Reference Image</span>
                    <input type='file' accept='image/*' onChange={onImageChange} className={fieldClass} required />
                  </label>

                  <label className='md:col-span-2'>
                    <span className={labelClass}>12. Customization Requirements</span>
                    <textarea
                      name='customizationRequirements'
                      value={form.customizationRequirements}
                      onChange={onFieldChange}
                      rows={4}
                      className={fieldClass}
                      required
                    />
                  </label>

                  <label>
                    <span className={labelClass}>13. Required Delivery Date</span>
                    <input
                      type='date'
                      name='requiredDeliveryDate'
                      value={form.requiredDeliveryDate}
                      onChange={onFieldChange}
                      className={fieldClass}
                      required
                    />
                  </label>

                  <label>
                    <span className={labelClass}>14. Additional Notes / Special Instructions</span>
                    <textarea
                      name='additionalNotes'
                      value={form.additionalNotes}
                      onChange={onFieldChange}
                      rows={3}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>

              {error && <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
              {success && <p className='rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>{success}</p>}

              <button
                type='submit'
                disabled={submitting}
                className='w-full rounded-xl bg-linear-to-r from-[#de1f89] to-[#803385] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60'
              >
                {submitting ? 'Submitting...' : '15. Request Quote'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        className='relative mt-14 overflow-hidden'
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
            latest trends, there’s something for everyone.
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
    </main>
  )
}

export default EthnicWearQuotePage