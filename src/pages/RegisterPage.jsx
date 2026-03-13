import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { getTokenFromResponse, registerOwner } from '../services/authApi'

const roleOptions = [
  { value: 'boutique_owner', label: 'Boutique Owner' },
  { value: 'customer', label: 'Customer' },
  { value: 'manufacturer', label: 'Manufacturer' },
]

const initialRegisterForm = {
  email: '',
  password: '',
  phone: '',
  first_name: '',
  last_name: '',
  role: 'boutique_owner',
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialRegisterForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [token, setToken] = useState(localStorage.getItem('authToken') ?? '')

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
      const data = await registerOwner(form)
      const receivedToken = getTokenFromResponse(data)

      if (!receivedToken) {
        throw new Error('Token not found in register response')
      }

      saveToken(receivedToken)
      setSuccess('Registration successful. Token saved to local storage.')
      setForm(initialRegisterForm)
      navigate('/view-products')
    } catch (requestError) {
      setError(requestError?.message ?? 'Something went wrong during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title='Boutique Owner Register' error={error} success={success} token={token}>
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
        <input
          type='text'
          name='phone'
          value={form.phone}
          onChange={handleChange}
          placeholder='Phone'
          required
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
        <input
          type='text'
          name='first_name'
          value={form.first_name}
          onChange={handleChange}
          placeholder='First Name'
          required
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
        <input
          type='text'
          name='last_name'
          value={form.last_name}
          onChange={handleChange}
          placeholder='Last Name'
          required
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
        <select
          name='role'
          value={form.role}
          onChange={handleChange}
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
        >
          {roleOptions.map((roleOption) => (
            <option key={roleOption.value} value={roleOption.value}>
              {roleOption.label}
            </option>
          ))}
        </select>
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
        >
          {loading ? 'Submitting...' : 'Create Owner Account'}
        </button>
      </form>
    </AuthCard>
  )
}

export default RegisterPage
