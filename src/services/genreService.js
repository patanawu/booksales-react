import { api } from '../api/client'

/**
 * Service genre.
 * Struktur fungsi mengikuti pola pada materi: try/catch + async/await,
 * sehingga mudah dipindahkan ke project lain.
 */

// Backend Laravel membungkus hasil dengan { data: [...] }, mock API juga.
// Helper ini membuat keduanya aman dipakai.
const toArray = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getGenres = async () => {
  try {
    const response = await api.get('/genres')
    return toArray(response.data)
  } catch (error) {
    console.error('[genreService] getGenres:', error)
    throw error
  }
}

export const getGenreById = async (id) => {
  try {
    const response = await api.get(`/genres/${id}`)
    return response.data?.data ?? response.data
  } catch (error) {
    console.error('[genreService] getGenreById:', error)
    throw error
  }
}

export const createGenre = async (data) => {
  try {
    const response = await api.post('/genres', data)
    return response.data
  } catch (error) {
    console.error('[genreService] createGenre:', error)
    throw error
  }
}

export const updateGenre = async (id, data) => {
  try {
    const response = await api.put(`/genres/${id}`, data)
    return response.data
  } catch (error) {
    console.error('[genreService] updateGenre:', error)
    throw error
  }
}

export const deleteGenre = async (id) => {
  try {
    const response = await api.delete(`/genres/${id}`)
    return response.data
  } catch (error) {
    console.error('[genreService] deleteGenre:', error)
    throw error
  }
}
