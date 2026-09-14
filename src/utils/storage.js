const TOKEN_KEY = 'authToken'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) ?? ''

export const setStoredToken = (value) => localStorage.setItem(TOKEN_KEY, value)

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY)
