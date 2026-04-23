import { useState } from 'react'
import { forgotPassword } from '../services/authApi'

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      await forgotPassword({ email: email.trim() })
      setSuccess('Password reset link has been sent to your email. Please check your inbox.')
      setEmail('')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to process forgot password request')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setSuccess('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg mx-4'>
        <h2 className='text-2xl font-bold text-slate-900'>Forgot Password?</h2>
        <p className='mt-1 text-sm text-slate-600'>Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          {error && <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
          {success && <p className='rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'>{success}</p>}

          <label className='space-y-1 block'>
            <span className='text-sm text-slate-700'>Email Address</span>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
              disabled={loading}
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100'
            />
          </label>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={handleClose}
              disabled={loading}
              className='flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-800'
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
