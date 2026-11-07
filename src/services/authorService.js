import { api } from '../api/client'

/**
 * Service author.
 * Pola kode sama dengan genreService agar konsisten dan mudah dibaca.
 */

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getAuthors = async () => {
  try {
    const response = await api.get('/authors')
    return toArray(response.data)
  } catch (error) {
    console.error('[authorService] getAuthors:', error)
    throw error
  }
}

export const getAuthorById = async (id) => {
  try {
    const response = await api.get(`/authors/${id}`)
    return response.data?.data ?? response.data
  } catch (error) {
    console.error('[authorService] getAuthorById:', error)
    throw error
  }
}

export const createAuthor = async (data) => {
  try {
    const response = await api.post('/authors', data)
    return response.data
  } catch (error) {
    console.error('[authorService] createAuthor:', error)
    throw error
  }
}

export const updateAuthor = async (id, data) => {
  try {
    const response = await api.put(`/authors/${id}`, data)
    return response.data
  } catch (error) {
    console.error('[authorService] updateAuthor:', error)
    throw error
  }
}

export const deleteAuthor = async (id) => {
  try {
    const response = await api.delete(`/authors/${id}`)
    return response.data
  } catch (error) {
    console.error('[authorService] deleteAuthor:', error)
    throw error
  }
}
