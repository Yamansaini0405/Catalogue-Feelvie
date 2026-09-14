import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTokenFromResponse, loginOwner } from '../api'
import AuthLayout from '../components/auth/AuthLayout'
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal'
import { Alert, Button, FormField, Input } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { ROUTES } from '../constants/routes'

const initialLoginForm = { email: '', password: '' }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const toast = useToast()
  const registerCredentials = location.state?.credentials

  const [form, setForm] = useState(() => ({
    email: registerCredentials?.email ?? '',
    password: registerCredentials?.password ?? '',
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)

  useEffect(() => {
    if (location.state?.fromRegister) {
      setSuccess('Registration successful. Please login to continue.')
    }
  }, [location.state])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const data = await loginOwner(form)
      const receivedToken = getTokenFromResponse(data)
      if (!receivedToken) throw new Error('Token not found in login response')

      login(receivedToken)
      toast.success('Logged in successfully')
      setForm(initialLoginForm)
      navigate(ROUTES.DASHBOARD)
    } catch (requestError) {
      setError(requestError?.message ?? 'Something went wrong during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your boutique catalogue">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <FormField label="Email">
          <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@boutique.com" required />
        </FormField>

        <FormField label="Password">
          <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
        </FormField>

        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Signing in…' : 'Log in'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            Forgot password?
          </button>
        </div>
      </form>

      <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />
    </AuthLayout>
  )
}
