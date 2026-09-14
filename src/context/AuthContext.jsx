import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/storage'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())

  const login = useCallback((nextToken) => {
    setStoredToken(nextToken)
    setToken(nextToken)
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setToken('')
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
