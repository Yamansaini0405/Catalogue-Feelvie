import { asArray, getJson, patchForm, postForm, postJson } from './client'

// ---- Products -------------------------------------------------------
export const getMyProducts = (token) => getJson('/api/catalog/products/my_products/', token).then(asArray)

export const getPublicProducts = () => getJson('/api/catalog/products/').then(asArray)

export const getProductById = (productId) => getJson(`/api/catalog/products/${productId}/`)

export const createProduct = (token, formData) => postForm('/api/catalog/products/', formData, token)

export const updateProductById = (token, productId, payload) => {
  const isForm = payload instanceof FormData
  return isForm
    ? patchForm(`/api/catalog/products/${productId}/`, payload, token)
    : postJson(`/api/catalog/products/${productId}/`, payload, token)
}

// ---- Categories -------------------------------------------------------
export const getCategories = (token) => getJson('/api/catalog/categories/', token).then(asArray)

export const createCategory = (token, payload) => postJson('/api/catalog/categories/', payload, token)

// ---- Colors -------------------------------------------------------
export const getColors = (token) => getJson('/api/catalog/colors/', token).then(asArray)

export const createColor = (token, payload) => postJson('/api/catalog/colors/', payload, token)

// ---- Sizes -------------------------------------------------------
export const getSizes = (token) => getJson('/api/catalog/sizes/', token).then(asArray)

export const createSize = (token, payload) => postJson('/api/catalog/sizes/', payload, token)
