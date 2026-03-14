const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const request = async (path, payload) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Request failed')
  }

  return data
}

export const getTokenFromResponse = (data) => {
  if (!data || typeof data !== 'object') return ''
  return data.token ?? data.access ?? data.access_token ?? ''
}

export const registerOwner = (payload) => request('/api/auth/register/', payload)

export const loginOwner = (payload) => request('/api/auth/login/', payload)

export const getCatalogProducts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/products/my_products/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch products')
  }

  return Array.isArray(data) ? data : []
}

export const getCatalogPublicProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/products/`, {
    method: 'GET',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch products')
  }

  return Array.isArray(data) ? data : []
}

export const getCatalogProductById = async (token, productId) => {
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/catalog/products/${productId}/`, {
    method: 'GET',
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch product details')
  }

  return data
}

export const getCatalogCategories = async (token) => {
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/catalog/categories/`, {
    method: 'GET',
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch categories')
  }

  return Array.isArray(data) ? data : []
}

export const createCatalogCategory = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/categories/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to create category')
  }

  return data
}

export const getCatalogColors = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/colors/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch colors')
  }

  return Array.isArray(data) ? data : []
}

export const createCatalogColor = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/colors/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to create color')
  }

  return data
}

export const getCatalogSizes = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/sizes/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch sizes')
  }

  return Array.isArray(data) ? data : []
}

export const createCatalogSize = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/sizes/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to create size')
  }

  return data
}

export const createCatalogProduct = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/catalog/products/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const text = await response.text()
  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { detail: text }
  }

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? text ?? 'Unable to create product')
  }

  return data
}

export const getCommonCarousels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/common/carousels/`, {
    method: 'GET',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? 'Unable to fetch carousels')
  }

  return Array.isArray(data) ? data : []
}
