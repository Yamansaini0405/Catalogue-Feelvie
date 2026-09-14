import { Layers, Palette, Ruler } from 'lucide-react'
import { useState } from 'react'
import { createCategory, createColor, createSize } from '../api'
import ColorPicker from '../components/products/ColorPicker'
import { Alert, Badge, Button, Card, FormField, Input, PageHeader } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useCatalogMasterData } from '../hooks/useCatalogMasterData'
import { useToast } from '../hooks/useToast'

const initialCategoryForm = { name: '', slug: '', image: '', parent: '0' }
const initialColorForm = { name: '', hex_code: '' }
const initialSizeForm = { size: '' }

export default function AddVariantPage() {
  const { token } = useAuth()
  const toast = useToast()
  const { categories, colors, sizes, setCategories, setColors, setSizes, loading: loadingMaster } = useCatalogMasterData(token)

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [colorForm, setColorForm] = useState(initialColorForm)
  const [sizeForm, setSizeForm] = useState(initialSizeForm)
  const [saving, setSaving] = useState({ category: false, color: false, size: false })
  const [error, setError] = useState('')

  const updateSaving = (key, value) => setSaving((previous) => ({ ...previous, [key]: value }))

  const submitCategory = async (event) => {
    event.preventDefault()
    setError('')
    updateSaving('category', true)
    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim() || `cat-${Date.now()}`,
        image: categoryForm.image.trim(),
        parent: Number(categoryForm.parent || '0'),
      }
      const created = await createCategory(token, payload)
      setCategories((previous) => [...previous, created])
      toast.success(`Category "${created?.name ?? payload.name}" created`)
      setCategoryForm(initialCategoryForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create category')
    } finally {
      updateSaving('category', false)
    }
  }

  const submitColor = async (event) => {
    event.preventDefault()
    setError('')
    updateSaving('color', true)
    try {
      const payload = { name: colorForm.name.trim(), hex_code: colorForm.hex_code.trim() }
      const created = await createColor(token, payload)
      setColors((previous) => [...previous, created])
      toast.success(`Color "${created?.name ?? payload.name}" created`)
      setColorForm(initialColorForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create color')
    } finally {
      updateSaving('color', false)
    }
  }

  const submitSize = async (event) => {
    event.preventDefault()
    setError('')
    updateSaving('size', true)
    try {
      const payload = { size: sizeForm.size.trim().toLowerCase() }
      const created = await createSize(token, payload)
      setSizes((previous) => [...previous, created])
      toast.success(`Size "${created?.size ?? payload.size}" created`)
      setSizeForm(initialSizeForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to create size')
    } finally {
      updateSaving('size', false)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Catalog setup" description="Create the category, color and size master data used across your products" />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categories */}
        <Card className="flex flex-col">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Layers size={14} /> Categories
          </h3>

          <form onSubmit={submitCategory} className="space-y-2.5">
            <FormField label="Name" required>
              <Input name="name" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} required />
            </FormField>
            <FormField label="Slug" hint="Optional — auto-generated if left blank">
              <Input name="slug" value={categoryForm.slug} onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))} />
            </FormField>
            <FormField label="Image">
              <Input name="image" value={categoryForm.image} onChange={(e) => setCategoryForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL or key" />
            </FormField>
            <FormField label="Parent ID">
              <Input type="number" name="parent" value={categoryForm.parent} onChange={(e) => setCategoryForm((p) => ({ ...p, parent: e.target.value }))} />
            </FormField>
            <Button type="submit" loading={saving.category} className="w-full">
              Add category
            </Button>
          </form>

          <div className="mt-5 flex-1 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Existing ({loadingMaster ? '…' : categories.length})
            </p>
            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
              {categories.length === 0 && !loadingMaster && <p className="text-sm text-slate-400">No categories yet.</p>}
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{category.name}</span>
                  <span className="font-mono text-xs text-slate-400">{category.slug}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Colors */}
        <Card className="flex flex-col">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Palette size={14} /> Colors
          </h3>

          <form onSubmit={submitColor} className="space-y-2.5">
            <FormField label="Color name" required>
              <Input name="name" value={colorForm.name} onChange={(e) => setColorForm((p) => ({ ...p, name: e.target.value }))} required />
            </FormField>
            <FormField label="Hex code" required>
              <ColorPicker hexCode={colorForm.hex_code} onColorSelect={(color) => setColorForm((p) => ({ ...p, hex_code: color }))} />
            </FormField>
            <Button type="submit" loading={saving.color} className="w-full">
              Add color
            </Button>
          </form>

          <div className="mt-5 flex-1 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Existing ({loadingMaster ? '…' : colors.length})
            </p>
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
              {colors.length === 0 && !loadingMaster && <p className="text-sm text-slate-400">No colors yet.</p>}
              {colors.map((color) => (
                <span key={color.id} className="flex items-center gap-1.5 rounded-full bg-slate-50 py-1 pl-1.5 pr-2.5 text-xs font-medium text-slate-700">
                  <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: color.hex_code }} />
                  {color.name}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Sizes */}
        <Card className="flex flex-col">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Ruler size={14} /> Sizes
          </h3>

          <form onSubmit={submitSize} className="space-y-2.5">
            <FormField label="Size" required hint="e.g. xs, s, m, l, xl">
              <Input name="size" value={sizeForm.size} onChange={(e) => setSizeForm((p) => ({ ...p, size: e.target.value }))} required />
            </FormField>
            <Button type="submit" loading={saving.size} className="w-full">
              Add size
            </Button>
          </form>

          <div className="mt-5 flex-1 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Existing ({loadingMaster ? '…' : sizes.length})
            </p>
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
              {sizes.length === 0 && !loadingMaster && <p className="text-sm text-slate-400">No sizes yet.</p>}
              {sizes.map((size) => (
                <Badge key={size.id} tone="brand">
                  {size.size_display ?? size.size}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
