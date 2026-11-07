import axios from 'axios'
import { mockRequest } from './mockApi'

/**
 * Satu pintu untuk seluruh request HTTP.
 *
 * - VITE_USE_MOCK=true  -> request diarahkan ke mock API (localStorage)
 * - VITE_USE_MOCK=false -> request dikirim ke backend sungguhan via Axios
 *
 * Semua service memakai objek `api` ini, sehingga perpindahan dari mode demo
 * ke backend asli cukup mengubah file .env tanpa menyentuh komponen.
 */

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const http = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 20000,
})

// Token disisipkan otomatis pada setiap request yang butuh otorisasi.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    // Token kedaluwarsa / tidak valid -> bersihkan sesi.
    if (status === 401 && !String(error?.config?.url ?? '').includes('/login')) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
    }
    return Promise.reject(error)
  },
)

const request = (method, url, data, config) => {
  if (USE_MOCK) {
    return mockRequest({ method, url, data })
  }
  return http.request({ method, url, data, ...config })
}

export const api = {
  get: (url, config) => request('get', url, undefined, config),
  post: (url, data, config) => request('post', url, data, config),
  put: (url, data, config) => request('put', url, data, config),
  delete: (url, config) => request('delete', url, undefined, config),
}

/**
 * Mengambil pesan error yang ramah dari berbagai bentuk error
 * (Axios, mock API, maupun error JavaScript biasa).
 */
export const getErrorMessage = (error, fallback = 'Terjadi kesalahan, silakan coba lagi.') =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.name?.[0] ||
  error?.message ||
  fallback
