import { ArrowLeft, Bot, CheckCircle2, MessageSquareText, Send, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { submitCommonQuery } from '../services/authApi'

const QUERY_TYPES = [
	{ label: 'Payment', subject: 'Payment' },
	{ label: 'Payment related', subject: 'Payment related' },
	{ label: 'Image generation', subject: 'Image generation' },
	{ label: 'Product issue', subject: 'Product issue' },
	{ label: 'Other', subject: 'Other' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ChatBot() {
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'bot',
			text: 'Hi there 👋 Welcome to FeelVie support. I can help you submit a query in a few quick steps.',
		},
		{
			id: 2,
			role: 'bot',
			text: 'First, please share your email address so we can track your request.',
		},
	])
	const [emailInput, setEmailInput] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [step, setStep] = useState('email')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const messagesEndRef = useRef(null)

	const canSubmit = useMemo(() => email && subject && message.trim() && !isSubmitting, [email, subject, message, isSubmitting])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages, step, isSubmitting])

	const addMessage = (role, text) => {
		setMessages((previous) => [
			...previous,
			{
				id: `${Date.now()}-${Math.random()}`,
				role,
				text,
			},
		])
	}

	const handleEmailSubmit = (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		const trimmedEmail = emailInput.trim()

		if (!EMAIL_REGEX.test(trimmedEmail)) {
			setError('Please enter a valid email address.')
			return
		}

		setEmail(trimmedEmail)
		addMessage('user', trimmedEmail)
		addMessage('bot', 'Thanks. What type of query would you like to submit?')
		setStep('subject')
	}

	const handleSubjectSelect = (selectedSubject) => {
		if (!email) return

		setError('')
		setSuccess('')
		setSubject(selectedSubject)
		addMessage('user', selectedSubject)
		addMessage('bot', 'Got it. Please write your query details below and send it when ready.')
		setStep('message')
	}

	const handleQuerySubmit = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!email) {
			setError('Please enter your email first.')
			setStep('email')
			return
		}

		if (!subject) {
			setError('Please choose a query type.')
			setStep('subject')
			return
		}

		const trimmedMessage = message.trim()

		if (!trimmedMessage) {
			setError('Please write your query message.')
			return
		}

		setIsSubmitting(true)

		try {
			addMessage('user', trimmedMessage)
			await submitCommonQuery({
				email,
				subject,
				message: trimmedMessage,
			})

			setMessage('')
			setSuccess('Your query has been submitted successfully. Our team will contact you soon.')
			addMessage('bot', 'Your query has been submitted successfully. Our team will contact you soon.')
			setStep('done')
		} catch (submitError) {
			setError(submitError?.message ?? 'Unable to submit your query right now.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
			<div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]'>
				<section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
					<div className='flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-5 py-4 text-white sm:px-6'>
						<div className='flex items-center gap-3'>
							<div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15'>
								<Bot size={22} />
							</div>
							<div>
								<p className='text-sm font-medium text-slate-200'>FeelVie Support Bot</p>
								<p className='text-xs text-slate-300'>Query submission assistant</p>
							</div>
						</div>

						<Link
							to='/register'
							className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15'
						>
							<ArrowLeft size={16} />
							Back
						</Link>
					</div>

					<div className='flex h-[72vh] flex-col bg-slate-50'>
						<div className='no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6'>
							{messages.map((item) => (
								<div key={item.id} className={`flex ${item.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
									<div
										className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] ${
											item.role === 'bot'
												? 'rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-200'
												: 'rounded-br-md bg-slate-900 text-white'
										}`}
									>
										{item.text}
									</div>
								</div>
							))}

							{step === 'subject' && (
								<div className='flex justify-start'>
									<div className='max-w-[90%] rounded-3xl rounded-bl-md bg-white p-4 shadow-sm ring-1 ring-slate-200'>
										<p className='mb-3 text-sm font-medium text-slate-700'>Choose your query type</p>
										<div className='flex flex-wrap gap-2'>
											{QUERY_TYPES.map((item) => (
												<button
													key={item.subject}
													type='button'
													onClick={() => handleSubjectSelect(item.subject)}
													className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100'
												>
													{item.label}
												</button>
											))}
										</div>
									</div>
								</div>
							)}

							{step === 'done' && (
								<div className='flex justify-start'>
									<div className='flex items-center gap-2 rounded-3xl rounded-bl-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200'>
										<CheckCircle2 size={18} />
										Query submitted
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						<form onSubmit={step === 'email' ? handleEmailSubmit : handleQuerySubmit} className='border-t border-slate-200 bg-white p-4 sm:p-5'>
							{error && (
								<div className='mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</div>
							)}

							{success && (
								<div className='mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
									{success}
								</div>
							)}

							{step === 'email' ? (
								<div className='flex flex-col gap-3 sm:flex-row'>
									<div className='flex-1'>
										<label className='mb-2 block text-sm font-medium text-slate-700'>Email address</label>
										<input
											type='email'
											value={emailInput}
											onChange={(event) => setEmailInput(event.target.value)}
											placeholder='Enter your email'
											className='w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white'
										/>
									</div>
									<button
										type='submit'
										className='inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
									>
										Continue
										<Send size={16} />
									</button>
								</div>
							) : (
								<div className='space-y-4'>
									<div className='grid gap-4 sm:grid-cols-2'>
										<div>
											<label className='mb-2 block text-sm font-medium text-slate-700'>Email</label>
											<input
												type='email'
												value={email}
												readOnly
												className='w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none'
											/>
										</div>
										<div>
											<label className='mb-2 block text-sm font-medium text-slate-700'>Query type</label>
											<input
												type='text'
												value={subject || 'Select from the options above'}
												readOnly
												className='w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none'
											/>
										</div>
									</div>

									<div>
										<label className='mb-2 flex items-center gap-2 text-sm font-medium text-slate-700'>
											<MessageSquareText size={16} />
											Your message
										</label>
										<textarea
											value={message}
											onChange={(event) => setMessage(event.target.value)}
											placeholder='Write your query here...'
											rows={4}
											className='w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white'
										/>
									</div>

									<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
										<p className='text-xs text-slate-500'>
											We will store this as a pending support request and contact you on your email.
										</p>
										<button
											type='submit'
											disabled={!canSubmit}
											className='inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400'
										>
											{isSubmitting ? 'Submitting...' : 'Submit query'}
											<Send size={16} />
										</button>
									</div>
								</div>
							)}
						</form>
					</div>
				</section>

				<aside className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
					<div className='flex h-full flex-col justify-between gap-6'>
						<div>
							<div className='mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700'>
								<Sparkles size={16} />
								Smart query intake
							</div>

							<h2 className='text-2xl font-bold tracking-tight text-slate-900'>
								A chatbot-style experience that captures support requests.
							</h2>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								Customers can first share their email, choose the query type, and then write their message before it is
								submitted to the backend.
							</p>
						</div>

						<div className='space-y-3 rounded-3xl bg-slate-50 p-4'>
							<div className='flex items-start gap-3'>
								<div className='mt-0.5 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200'>
									<CheckCircle2 size={16} className='text-emerald-600' />
								</div>
								<div>
									<p className='text-sm font-semibold text-slate-800'>Step 1</p>
									<p className='text-sm text-slate-600'>Customer enters email address.</p>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<div className='mt-0.5 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200'>
									<CheckCircle2 size={16} className='text-emerald-600' />
								</div>
								<div>
									<p className='text-sm font-semibold text-slate-800'>Step 2</p>
									<p className='text-sm text-slate-600'>Select query topic like payment or image generation.</p>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<div className='mt-0.5 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200'>
									<CheckCircle2 size={16} className='text-emerald-600' />
								</div>
								<div>
									<p className='text-sm font-semibold text-slate-800'>Step 3</p>
									<p className='text-sm text-slate-600'>Write the full query and submit it as pending.</p>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

export default ChatBot
