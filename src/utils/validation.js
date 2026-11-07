/**
 * Kumpulan aturan validasi form.
 * Setiap fungsi mengembalikan pesan error (string) atau null jika valid.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/

export const required = (value, label = 'Kolom ini') => {
  if (!String(value ?? '').trim()) return `${label} wajib diisi.`
  return null
}

export const minLength = (value, length, label = 'Kolom ini') => {
  if (String(value ?? '').trim().length < length) {
    return `${label} minimal ${length} karakter.`
  }
  return null
}

export const maxLength = (value, length, label = 'Kolom ini') => {
  if (String(value ?? '').trim().length > length) {
    return `${label} maksimal ${length} karakter.`
  }
  return null
}

export const emailFormat = (value) => {
  if (!String(value ?? '').trim()) return null
  if (!EMAIL_REGEX.test(String(value).trim())) return 'Format email tidak valid (contoh: nama@email.com).'
  return null
}

export const usernameFormat = (value) => {
  if (!String(value ?? '').trim()) return null
  if (!USERNAME_REGEX.test(String(value).trim())) {
    return 'Username 3–20 karakter, hanya huruf, angka, titik, dan garis bawah.'
  }
  return null
}

/** Minimal 8 karakter, mengandung huruf dan angka. */
export const passwordStrength = (value) => {
  if (!value) return null
  if (value.length < 8) return 'Password minimal 8 karakter.'
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return 'Password harus mengandung huruf dan angka.'
  }
  return null
}

/** Skor 0–4 untuk indikator kekuatan password. */
export const passwordScore = (value = '') => {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  return Math.min(score, 4)
}

/** Validasi form registrasi pengguna. */
export const validateRegister = (values) => {
  const errors = {}

  const nameError =
    required(values.name, 'Nama lengkap') ||
    minLength(values.name, 3, 'Nama lengkap') ||
    maxLength(values.name, 60, 'Nama lengkap')
  if (nameError) errors.name = nameError

  const emailError = required(values.email, 'Email') || emailFormat(values.email)
  if (emailError) errors.email = emailError

  const usernameError = required(values.username, 'Username') || usernameFormat(values.username)
  if (usernameError) errors.username = usernameError

  const passwordError = required(values.password, 'Password') || passwordStrength(values.password)
  if (passwordError) errors.password = passwordError

  if (!values.password_confirmation) {
    errors.password_confirmation = 'Konfirmasi password wajib diisi.'
  } else if (values.password !== values.password_confirmation) {
    errors.password_confirmation = 'Konfirmasi password tidak sama.'
  }

  if (!values.agree) {
    errors.agree = 'Anda harus menyetujui syarat & ketentuan.'
  }

  return errors
}

/** Validasi form login. */
export const validateLogin = (values) => {
  const errors = {}
  if (!values.email?.trim()) errors.email = 'Email atau username wajib diisi.'
  if (!values.password) errors.password = 'Password wajib diisi.'
  else if (values.password.length < 6) errors.password = 'Password minimal 6 karakter.'
  return errors
}

/** Validasi form genre. */
export const validateGenre = (values) => {
  const errors = {}
  const nameError =
    required(values.name, 'Nama genre') ||
    minLength(values.name, 3, 'Nama genre') ||
    maxLength(values.name, 40, 'Nama genre')
  if (nameError) errors.name = nameError
  if (values.description && values.description.length > 255) {
    errors.description = 'Deskripsi maksimal 255 karakter.'
  }
  return errors
}

/** Validasi form author. */
export const validateAuthor = (values) => {
  const errors = {}
  const nameError =
    required(values.name, 'Nama author') ||
    minLength(values.name, 3, 'Nama author') ||
    maxLength(values.name, 60, 'Nama author')
  if (nameError) errors.name = nameError
  if (values.bio && values.bio.length > 255) {
    errors.bio = 'Bio maksimal 255 karakter.'
  }
  if (values.nationality.length > 40) {
    errors.nationality = 'Kebangsaan maksimal 40 karakter.'
  }
  return errors
}
