import { useState } from 'react'
import {
  createCatalogCategory,
  createCatalogColor,
  createCatalogSize,
} from '../services/authApi'

const initialCategoryForm = {
  name: '',
  slug: '',
  image: '',
  parent: '0',
}

const initialColorForm = {
  name: '',
  hex_code: '',
}

const initialSizeForm = {
  size: '',
}

function AddVariantPage() {
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [colorForm, setColorForm] = useState(initialColorForm)
  const [sizeForm, setSizeForm] = useState(initialSizeForm)
  const [loading, setLoading] = useState({ category: false, color: false, size: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const getToken = () => {
    const token = localStorage.getItem('authToken') ?? ''
    if (!token) throw new Error('Please login first')
    return token
  }

  const updateLoading = (key, value) => {
    setLoading((previous) => ({ ...previous, [key]: value }))
  }

  const onCategoryChange = (event) => {
    const { name, value } = event.target
    setCategoryForm((previous) => ({ ...previous, [name]: value }))
  }

  const onColorChange = (event) => {
    const { name, value } = event.target
    setColorForm((previous) => ({ ...previous, [name]: value }))
  }

  const onSizeChange = (event) => {
    const { name, value } = event.target
    setSizeForm((previous) => ({ ...previous, [name]: value }))
  }

  const submitCategory = async (event) => {
    event.preventDefault()
    clearMessages()
    updateLoading('category', true)

    try {
      const token = getToken()
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim() || `cat-${Date.now()}`,
        image: categoryForm.image.trim(),
        parent: Number(categoryForm.parent || '0'),
      }

      const created = await createCatalogCategory(token, payload)
      setSuccess(`Category created: ${created?.name ?? payload.name}`)
      setCategoryForm(initialCategoryForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create category')
    } finally {
      updateLoading('category', false)
    }
  }

  const submitColor = async (event) => {
    event.preventDefault()
    clearMessages()
    updateLoading('color', true)

    try {
      const token = getToken()
      const payload = {
        name: colorForm.name.trim(),
        hex_code: colorForm.hex_code.trim(),
      }

      const created = await createCatalogColor(token, payload)
      setSuccess(`Color created: ${created?.name ?? payload.name}`)
      setColorForm(initialColorForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create color')
    } finally {
      updateLoading('color', false)
    }
  }

  const submitSize = async (event) => {
    event.preventDefault()
    clearMessages()
    updateLoading('size', true)

    try {
      const token = getToken()
      const payload = {
        size: sizeForm.size.trim().toLowerCase(),
      }

      const created = await createCatalogSize(token, payload)
      setSuccess(`Size created: ${created?.size ?? payload.size}`)
      setSizeForm(initialSizeForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create size')
    } finally {
      updateLoading('size', false)
    }
  }

  return (
    <section className='space-y-4'>
      <div className='rounded-2xl bg-white p-6 shadow-lg'>
        <h2 className='text-2xl font-bold text-slate-900'>Add Variant Master Data</h2>
        <p className='mt-1 text-sm text-slate-600'>Create category, color, and size records</p>
        {error && <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
        {success && <p className='mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'>{success}</p>}
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <form onSubmit={submitCategory} className='rounded-2xl bg-white p-4 shadow-lg'>
          <p className='mb-3 text-lg font-semibold text-slate-900'>Add Category</p>
          <div className='space-y-2'>
            <input
              type='text'
              name='name'
              value={categoryForm.name}
              onChange={onCategoryChange}
              placeholder='Name'
              required
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <input
              type='text'
              name='slug'
              value={categoryForm.slug}
              onChange={onCategoryChange}
              placeholder='Slug (optional)'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <input
              type='text'
              name='image'
              value={categoryForm.image}
              onChange={onCategoryChange}
              placeholder='Image string'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <input
              type='number'
              name='parent'
              value={categoryForm.parent}
              onChange={onCategoryChange}
              placeholder='Parent ID (default 0)'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <button
              type='submit'
              disabled={loading.category}
              className='w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading.category ? 'Saving...' : 'Add Category'}
            </button>
          </div>
        </form>

        <form onSubmit={submitColor} className='rounded-2xl bg-white p-4 shadow-lg'>
          <p className='mb-3 text-lg font-semibold text-slate-900'>Add Color</p>
          <div className='space-y-2'>
            <input
              type='text'
              name='name'
              value={colorForm.name}
              onChange={onColorChange}
              placeholder='Color name'
              required
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <input
              type='text'
              name='hex_code'
              value={colorForm.hex_code}
              onChange={onColorChange}
              placeholder='Hex code (e.g. #333333)'
              required
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <button
              type='submit'
              disabled={loading.color}
              className='w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading.color ? 'Saving...' : 'Add Color'}
            </button>
          </div>
        </form>

        <form onSubmit={submitSize} className='rounded-2xl bg-white p-4 shadow-lg'>
          <p className='mb-3 text-lg font-semibold text-slate-900'>Add Size</p>
          <div className='space-y-2'>
            <input
              type='text'
              name='size'
              value={sizeForm.size}
              onChange={onSizeChange}
              placeholder='Size (e.g. xs)'
              required
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
            />
            <button
              type='submit'
              disabled={loading.size}
              className='w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading.size ? 'Saving...' : 'Add Size'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddVariantPage
