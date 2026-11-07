import { api } from '../api/client'

/**
 * Service autentikasi.
 * Menangani login, registrasi pengguna, logout, dan validasi token JWT.
 */

export const login = async (payload) => {
  try {
    const response = await api.post('/login', payload)
    return response.data
  } catch (error) {
    console.error('[authService] login:', error)
    throw error
  }
}

export const register = async (payload) => {
  try {
    const response = await api.post('/register', payload)
    return response.data
  } catch (error) {
    console.error('[authService] register:', error)
    throw error
  }
}

export const logoutUser = async (token) => {
  try {
    const response = await api.post('/logout', null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('[authService] logout:', error)
    throw error
  }
}
