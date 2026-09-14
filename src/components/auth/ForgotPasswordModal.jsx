import { useState } from 'react'
import { forgotPassword } from '../../api'
import { Modal, Button, FormField, Input, Alert } from '../ui'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClose = () => {
    setEmail('')
    setError('')
    setSuccess('')
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!email.trim()) throw new Error('Please enter your email address')
      if (!EMAIL_REGEX.test(email)) throw new Error('Please enter a valid email address')

      await forgotPassword({ email: email.trim() })
      setSuccess('Password reset link has been sent to your email. Please check your inbox.')
      setEmail('')
      setTimeout(handleClose, 2000)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to process forgot password request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Forgot password?"
      description="Enter your email to receive a password reset link"
      size="sm"
      dismissible={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <FormField label="Email address">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            disabled={loading}
          />
        </FormField>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Send reset link
          </Button>
        </div>
      </form>
    </Modal>
  )
}
