/** Format tanggal panjang, contoh: 12 Januari 2025 */
export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Format tanggal ringkas, contoh: 12 Jan 2025 */
export const formatShortDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Inisial dari nama, maksimal 2 huruf. */
export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || 'U'

/** Memotong teks panjang dengan elipsis. */
export const truncate = (value = '', length = 80) =>
  value.length > length ? `${value.slice(0, length).trim()}…` : value
