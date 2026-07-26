import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'

const STORAGE_KEY = 'kredent_auth'

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  const login = (authResponse) => {
    // authResponse: { token, role, id, fullName, email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse))
    setAuth(authResponse)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      token: auth?.token ?? null,
      role: auth?.role ?? null,
      user: auth,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
