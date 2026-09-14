import { Boxes, Layers, PackageSearch, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, getMyProducts } from '../api'
import EditProductModal from '../components/products/EditProductModal'
import ProductCard from '../components/products/ProductCard'
import { EmptyState, LoadingBlock, PageHeader, SearchInput, Select, StatCard } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { ROUTES } from '../constants/routes'
import { formatMoney } from '../utils/format'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const toast = useToast()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingProductId, setEditingProductId] = useState(null)

  const fetchProducts = async () => {
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    try {
      const data = await getMyProducts(token)
      setProducts(data)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!token) return
    getCategories(token)
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [token])

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + (Number(product?.stock_quantity) || 0), 0)
    const published = products.filter((product) => product?.status === 'published').length
    const inventoryValue = products.reduce(
      (sum, product) => sum + (Number(product?.selling_price) || 0) * (Number(product?.stock_quantity) || 0),
      0,
    )
    return { total: products.length, totalStock, published, inventoryValue }
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = !query || (product?.name ?? '').toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || product?.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [products, search, statusFilter])

  const copyProductLink = async (productId) => {
    const shareUrl = `${window.location.origin}/product/${productId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard')
    } catch {
      toast.error('Unable to copy link')
    }
  }

  const handleSaved = async () => {
    setEditingProductId(null)
    toast.success('Product updated successfully')
    setLoading(true)
    await fetchProducts()
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Your products"
        description="Everything listed under your boutique account"
        actions={
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-40">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total products" value={stats.total} icon={PackageSearch} tone="brand" />
        <StatCard label="Published" value={stats.published} icon={Layers} tone="emerald" />
        <StatCard label="Units in stock" value={stats.totalStock} icon={Boxes} tone="gold" />
        <StatCard label="Inventory value" value={formatMoney(stats.inventoryValue)} icon={Wallet} tone="slate" />
      </div>

      <div className="card-surface p-4 sm:p-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search your products…" className="max-w-sm" />
      </div>

      {loading && <LoadingBlock label="Loading products…" />}

      {!loading && error && (
        <EmptyState
          icon={PackageSearch}
          title="Couldn't load products"
          description={error}
        />
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title={products.length === 0 ? 'No products yet' : 'No products match your filters'}
          description={
            products.length === 0
              ? 'Publish your first product to see it appear here.'
              : 'Try a different search term or status filter.'
          }
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={() => navigate(ROUTES.PRODUCT_DETAIL(product.id))}
              onEdit={() => setEditingProductId(product.id)}
              onShare={() => copyProductLink(product.id)}
            />
          ))}
        </div>
      )}

      {editingProductId && (
        <EditProductModal
          productId={editingProductId}
          token={token}
          categories={categories}
          onClose={() => setEditingProductId(null)}
          onSaved={handleSaved}
          onError={(message) => toast.error(message)}
        />
      )}
    </section>
  )
}
