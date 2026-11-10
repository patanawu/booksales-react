import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { decodeToken } from 'react-jwt'
import {
  login as loginService,
  logoutUser,
} from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'access_token'
const USER_KEY = 'user_info'

// Membaca sesi pengguna dari localStorage
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

  // Memeriksa masa berlaku token
  const expired = decoded?.exp
    ? decoded.exp * 1000 <= Date.now()
    : !decoded

  // Memastikan token dan role tersedia
  const isValid = Boolean(
    token &&
    decoded &&
    !expired &&
    user?.role
  )

  return {
    token,
    user,
    decoded,
    isValid,
  }
}

// Auth Provider
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  // Sinkronisasi sesi antar tab
  useEffect(() => {
    const onStorage = () => {
      setSession(readSession())
    }

    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // Menyimpan data login
  const persist = useCallback(({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    setSession(readSession())
  }, [])

  // Proses login
  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginService({ email, password })

      if (!data?.token || !data?.user?.role) {
        throw new Error('Token atau role pengguna tidak ditemukan.')
      }

      persist({
        token: data.token,
        user: data.user,
      })

      return data
    },
    [persist]
  )

  // Proses logout
  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY)

    try {
      if (token) {
        await logoutUser(token)
      }
    } catch (error) {
      console.warn(
        '[auth] logout request gagal:',
        error?.message
      )
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      setSession(readSession())
    }
  }, [])

  // Menentukan hak akses berdasarkan role
  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      role: session.user?.role ?? null,
      decoded: session.decoded,

      // Status autentikasi
      isValid: session.isValid,
      isAuthenticated: session.isValid,

      // Hak akses admin
      isAdmin: Boolean(
        session.isValid &&
        session.user?.role === 'admin'
      ),

      // Hak akses user biasa
      isUser: Boolean(
        session.isValid &&
        ['user', 'customer'].includes(session.user?.role)
      ),

      login,
      logout,
    }),
    [session, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth harus dipakai di dalam <AuthProvider>.'
    )
  }

  return context
}
