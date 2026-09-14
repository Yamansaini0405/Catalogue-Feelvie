import { apiRequest, getJson, patchForm, postJson } from './client'

export const getTokenFromResponse = (data) => {
  if (!data || typeof data !== 'object') return ''
  return data.token ?? data.access ?? data.access_token ?? ''
}

export const registerOwner = (payload) => postJson('/api/auth/register/', payload)

export const loginOwner = (payload) => postJson('/api/auth/login/', payload)

export const forgotPassword = (payload) => postJson('/api/auth/forgot-password/', payload)

export const deleteAccountRequest = (payload) => postJson('/api/auth/delete-account/', payload)

export const getMyProfile = (token) => getJson('/api/auth/me/', token)

export const getMyBanner = (token) => getJson('/api/auth/me/banner/', token)

export const getPublicCatalogueBySlug = (publicSlug) => getJson(`/api/auth/catalogue/${publicSlug}/`)

export const uploadMyBanner = (token, file) => {
  const formData = new FormData()
  formData.append('banner', file)
  return patchForm('/api/auth/me/banner/', formData, token)
}

export const deleteMyBanner = (token) => apiRequest('/api/auth/me/banner/', { method: 'DELETE', token })
