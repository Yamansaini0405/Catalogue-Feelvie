import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerOwner } from '../api'
import AuthLayout from '../components/auth/AuthLayout'
import { Alert, Button, FormField, Input, Select } from '../components/ui'
import { ROLE_OPTIONS } from '../constants/productOptions'
import { ROUTES } from '../constants/routes'

const initialRegisterForm = {
  email: '',
  password: '',
  phone: '',
  first_name: '',
  last_name: '',
  role: 'boutique_owner',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialRegisterForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const credentials = { email: form.email, password: form.password }
      const data = await registerOwner(form)
      if (!data) throw new Error('Registration failed')

      setForm(initialRegisterForm)
      navigate(ROUTES.LOGIN, { replace: true, state: { fromRegister: true, credentials } })
    } catch (requestError) {
      setError(requestError?.message ?? 'Something went wrong during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up your boutique owner profile in a minute">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <Alert variant="error">{error}</Alert>}

        <FormField label="Email">
          <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@boutique.com" required />
        </FormField>

        <FormField label="Password">
          <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
        </FormField>

        <FormField label="Phone">
          <Input type="text" name="phone" value={form.phone} onChange={handleChange} required />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name">
            <Input type="text" name="first_name" value={form.first_name} onChange={handleChange} required />
          </FormField>
          <FormField label="Last name">
            <Input type="text" name="last_name" value={form.last_name} onChange={handleChange} required />
          </FormField>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create owner account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
