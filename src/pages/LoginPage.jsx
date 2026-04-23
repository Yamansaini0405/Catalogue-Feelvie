import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { getTokenFromResponse, loginOwner } from '../services/authApi'

const initialLoginForm = {
  email: '',
  password: '',
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const registerCredentials = location.state?.credentials

  const [form, setForm] = useState(() => ({
    email: registerCredentials?.email ?? '',
    password: registerCredentials?.password ?? '',
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [token, setToken] = useState(localStorage.getItem('authToken') ?? '')
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)

  useEffect(() => {
    if (location.state?.fromRegister) {
      setSuccess('Registration successful. Please login to continue.')
    }
  }, [location.state])

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const saveToken = (value) => {
    localStorage.setItem('authToken', value)
    setToken(value)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    clearMessages()
    setLoading(true)

    try {
      const data = await loginOwner(form)
      const receivedToken = getTokenFromResponse(data)

      if (!receivedToken) {
        throw new Error('Token not found in login response')
      }

      saveToken(receivedToken)
      setSuccess('Login successful. Token saved to local storage.')
      setForm(initialLoginForm)
      navigate('/view-products')
    } catch (requestError) {
      setError(requestError?.message ?? 'Something went wrong during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title='Boutique Owner Login' error={error} success={success} token={token}>
      <form className='space-y-3' onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          value={form.email}
          onChange={handleChange}
          placeholder='Email'
          required
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
        <input
          type='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          placeholder='Password'
          required
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
        >
          {loading ? 'Submitting...' : 'Login'}
        </button>
        <div className='text-center'>
          <button
            type='button'
            onClick={() => setShowForgotPasswordModal(true)}
            className='text-sm text-slate-600 hover:text-slate-900 font-medium'
          >
            Forgot Password?
          </button>
        </div>
      </form>

      <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />
    </AuthCard>
  )
}

export default LoginPage
