import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import feelVieLogo from '../assets/feelVie.png'
import { deleteAccountRequest } from '../services/authApi'

const initialForm = {
  email: '',
  confirmEmail: '',
  password: '',
  confirmDelete: false,
}

function AccountDeletePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState(1) // Step 1: Info, Step 2: Confirmation, Step 3: Done

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleContinue = (event) => {
    event.preventDefault()
    setError('')
    
    if (step === 1) {
      if (!form.email || !form.confirmEmail) {
        setError('Please enter your email address')
        return
      }
      if (form.email !== form.confirmEmail) {
        setError('Email addresses do not match')
        return
      }
      setStep(2)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (step === 2) {
      if (!form.password) {
        setError('Password is required for security')
        return
      }
      if (!form.confirmDelete) {
        setError('You must confirm that you understand the consequences')
        return
      }

      setLoading(true)
      try {
        await deleteAccountRequest({
          email: form.email,
          password: form.password,
        })
        setSuccess('Your account has been successfully deleted.')
        setStep(3)
        setTimeout(() => {
          navigate('/register')
        }, 3000)
      } catch (err) {
        setError(err.message || 'Failed to delete account. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header */}
      <header className='border-b border-slate-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-lg px-6 py-4'>
          <img src={feelVieLogo} alt='FeelVie' className='h-8 w-auto' />
        </div>
      </header>

      <main className='mx-auto max-w-lg px-6 py-12'>
        <div className='rounded-2xl bg-white p-8 shadow-lg'>
          {step === 1 && (
            <>
              <h1 className='text-2xl font-bold text-slate-900'>Delete Your Account</h1>
              <p className='mt-2 text-sm text-slate-600'>
                We're sorry to see you go. Please review the information below before proceeding.
              </p>

              <div className='mt-8 space-y-4 rounded-lg bg-red-50 p-4 border border-red-200'>
                <h2 className='font-semibold text-red-900'>⚠️ Warning</h2>
                <ul className='space-y-2 text-sm text-red-800'>
                  <li>✓ Your account will be permanently deleted</li>
                  <li>✓ All your products and inventory will be removed</li>
                  <li>✓ Your profile information will be erased</li>
                  <li>✓ Historical data and records will be deleted</li>
                  <li>✓ This action cannot be undone</li>
                </ul>
              </div>

              <form onSubmit={handleContinue} className='mt-8'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='Enter your email'
                    className='w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    required
                  />
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Confirm Email Address
                  </label>
                  <input
                    type='email'
                    name='confirmEmail'
                    value={form.confirmEmail}
                    onChange={handleChange}
                    placeholder='Re-enter your email'
                    className='w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    required
                  />
                </div>

                {error && (
                  <div className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200'>
                    {error}
                  </div>
                )}

                <button
                  type='submit'
                  className='mt-6 w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700'
                >
                  Continue to Verification
                </button>

                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50'
                >
                  Cancel
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className='text-2xl font-bold text-slate-900'>Confirm Account Deletion</h1>
              <p className='mt-2 text-sm text-slate-600'>
                To confirm your identity, please enter your password and verify you understand the consequences.
              </p>

              <div className='mt-8 space-y-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200'>
                <h2 className='font-semibold text-yellow-900'>Final Confirmation</h2>
                <p className='text-sm text-yellow-800'>
                  Email: <span className='font-medium'>{form.email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className='mt-8'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder='Enter your password'
                    className='w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    required
                  />
                </div>

                <div className='mt-6 rounded-lg bg-red-50 p-4 border border-red-200'>
                  <label className='flex items-start gap-3'>
                    <input
                      type='checkbox'
                      name='confirmDelete'
                      checked={form.confirmDelete}
                      onChange={handleChange}
                      className='mt-1 h-5 w-5 rounded border-slate-300 text-red-600 outline-none transition'
                    />
                    <span className='text-sm text-red-900'>
                      I understand that deleting my account will permanently remove all my data and this action cannot be reversed.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200'>
                    {error}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={loading}
                  className='mt-6 w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Deleting Account...' : 'Delete My Account Permanently'}
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setStep(1)
                    setError('')
                  }}
                  className='mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50'
                >
                  Go Back
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className='text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                  <svg className='h-8 w-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h1 className='mt-6 text-2xl font-bold text-slate-900'>Account Deleted</h1>
                <p className='mt-2 text-sm text-slate-600'>
                  Your account has been successfully deleted. All your data has been permanently removed from our servers.
                </p>
                <p className='mt-4 text-xs text-slate-500'>
                  Redirecting to registration page in 3 seconds...
                </p>
              </div>
            </>
          )}
        </div>

        <p className='mt-8 text-center text-xs text-slate-500'>
          Need help? Contact us at support@feelvie.com
        </p>
      </main>
    </div>
  )
}

export default AccountDeletePage
