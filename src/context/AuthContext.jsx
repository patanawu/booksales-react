import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { decodeToken } from 'react-jwt'
import { login as loginService, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'access_token'
const USER_KEY = 'user_info'

/** Membaca sesi dari localStorage + memvalidasi masa berlaku token (react-jwt). */
const readSession = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)

  let user = null
  try {
    user = rawUser ? JSON.parse(rawUser) : null
  } catch {
    user = null
  }

  let decoded = null
  if (token) {
    try {
      decoded = decodeToken(token)
    } catch {
      decoded = null
    }
  }

  const expired = decoded?.exp ? decoded.exp * 1000 <= Date.now() : !decoded
  const isValid = Boolean(token && decoded && !expired)

  return { token, user, decoded, isValid }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  // Sinkronkan sesi antar tab / setelah storage dibersihkan manual.
  useEffect(() => {
    const onStorage = () => setSession(readSession())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persist = useCallback(({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setSession(readSession())
  }, [])

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginService({ email, password })
      persist({ token: data.token, user: data.user })
      return data
    },
    [persist],
  )

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    try {
      if (token) await logoutUser(token)
    } catch (error) {
      // Kegagalan logout di server tidak boleh menghalangi user keluar.
      console.warn('[auth] logout request gagal:', error?.message)
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setSession(readSession())
    }
  }, [])

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      decoded: session.decoded,
      isValid: session.isValid,
      isAuthenticated: Boolean(session.isValid && session.user?.role === 'admin'),
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.')
  return context
}
