import { useEffect, useState } from 'react'
import { getCategories, getColors, getSizes } from '../api'

/**
 * Loads categories, colors & sizes in parallel for the given token.
 * Shared by Add Product, Edit Product and Catalog Setup screens so the
 * fetch/error/loading logic isn't duplicated across pages.
 */
export function useCatalogMasterData(token) {
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [categoriesData, colorsData, sizesData] = await Promise.all([
          getCategories(token),
          getColors(token),
          getSizes(token),
        ])
        if (cancelled) return
        setCategories(categoriesData)
        setColors(colorsData)
        setSizes(sizesData)
      } catch (requestError) {
        if (!cancelled) setError(requestError?.message ?? 'Failed to load catalog master data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  return { categories, colors, sizes, setCategories, setColors, setSizes, loading, error }
}
