// Central HTTP client. Every API module builds on this so that auth headers,
// JSON/FormData handling and error normalization live in exactly one place.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

function extractErrorMessage(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload || fallback
  if (payload.detail) return payload.detail
  if (payload.message) return payload.message
  // DRF-style field errors: { field: ["msg"] }
  const firstKey = Object.keys(payload)[0]
  if (firstKey && Array.isArray(payload[firstKey])) {
    return `${firstKey}: ${payload[firstKey][0]}`
  }
  return fallback
}

async function parseResponseBody(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { detail: text }
  }
}

/**
 * Low-level request helper.
 * @param {string} path - API path, appended to API_BASE_URL
 * @param {object} options
 * @param {string} [options.method]
 * @param {object|FormData} [options.body]
 * @param {string} [options.token] - bearer token, if the endpoint needs auth
 * @param {boolean} [options.isFormData]
 */
export async function apiRequest(path, { method = 'GET', body, token, isFormData = false } = {}) {
  const headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.', { status: 0 })
  }

  const data = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data, 'Request failed'), { status: response.status, payload: data })
  }

  return data
}

export const getJson = (path, token) => apiRequest(path, { method: 'GET', token })
export const postJson = (path, body, token) => apiRequest(path, { method: 'POST', body, token })
export const patchJson = (path, body, token) => apiRequest(path, { method: 'PATCH', body, token })
export const postForm = (path, formData, token) => apiRequest(path, { method: 'POST', body: formData, token, isFormData: true })
export const patchForm = (path, formData, token) => apiRequest(path, { method: 'PATCH', body: formData, token, isFormData: true })

export const asArray = (value) => (Array.isArray(value) ? value : [])
