
const KEYS = {
  genres: 'booksales.mock.genres',
  authors: 'booksales.mock.authors',
  users: 'booksales.mock.users',
  seq: 'booksales.mock.seq',
}

const LATENCY = 280

class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.response = { status, data: { success: false, message } }
  }
}

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

const delay = (ms = LATENCY) => new Promise((resolve) => setTimeout(resolve, ms))

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const nextId = (collection) => {
  const seq = read(KEYS.seq, {})
  const current = seq[collection] ?? 0
  seq[collection] = current + 1
  write(KEYS.seq, seq)
  return seq[collection]
}

const today = () => new Date().toISOString()

const base64Url = (value) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(value))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const createToken = (user) => {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    iat: now,
    exp: now + 60 * 60 * 2, // berlaku 2 jam
  }
  // Tanda tangan hanya formalitas untuk mode demo.
  const signature = base64Url({ demo: true, user: user.id, iat: now })
  return `${base64Url(header)}.${base64Url(payload)}.${signature}`
}

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  role: user.role,
})

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

export const seedMockData = () => {
  if (!read(KEYS.genres, null)) {
    write(KEYS.genres, [
      {
        id: 1,
        name: 'Fiksi',
        description: 'Cerita rekaan yang dibangun dari imajinasi penulis.',
        created_at: '2025-01-12T08:00:00.000Z',
      },
      {
        id: 2,
        name: 'Non-Fiksi',
        description: 'Buku berbasis fakta, data, dan pengalaman nyata.',
        created_at: '2025-01-12T08:05:00.000Z',
      },
      {
        id: 3,
        name: 'Fantasi',
        description: 'Dunia imajinatif dengan sihir, makhluk mitos, dan petualangan.',
        created_at: '2025-02-02T09:30:00.000Z',
      },
      {
        id: 4,
        name: 'Romansa',
        description: 'Kisah cinta, hubungan, dan konflik emosional antar tokoh.',
        created_at: '2025-02-18T10:15:00.000Z',
      },
      {
        id: 5,
        name: 'Horor',
        description: 'Cerita menegangkan yang memancing rasa takut pembaca.',
        created_at: '2025-03-04T13:40:00.000Z',
      },
      {
        id: 6,
        name: 'Teknologi',
        description: 'Pemrograman, sains data, dan perkembangan dunia digital.',
        created_at: '2025-03-21T07:20:00.000Z',
      },
    ])
  }

  if (!read(KEYS.authors, null)) {
    write(KEYS.authors, [
      {
        id: 1,
        name: 'Andrea Hirata',
        nationality: 'Indonesia',
        bio: 'Penulis novel Laskar Pelangi yang mengangkat kisah pendidikan di Belitung.',
        created_at: '2025-01-12T08:10:00.000Z',
      },
      {
        id: 2,
        name: 'J.K. Rowling',
        nationality: 'Inggris',
        bio: 'Penulis seri Harry Potter yang mendunia.',
        created_at: '2025-01-15T09:00:00.000Z',
      },
      {
        id: 3,
        name: 'Tere Liye',
        nationality: 'Indonesia',
        bio: 'Penulis produktif dengan karya seperti Hujan, Pulang, dan serial Bumi.',
        created_at: '2025-02-07T11:25:00.000Z',
      },
      {
        id: 4,
        name: 'Dee Lestari',
        nationality: 'Indonesia',
        bio: 'Penulis trilogi Supernova yang memadukan sains dan sastra.',
        created_at: '2025-02-27T14:10:00.000Z',
      },
      {
        id: 5,
        name: 'Stephen King',
        nationality: 'Amerika Serikat',
        bio: 'Maestro cerita horor dengan lebih dari 60 novel.',
        created_at: '2025-03-11T15:45:00.000Z',
      },
    ])
  }

  if (!read(KEYS.users, null)) {
    write(KEYS.users, [
      {
        id: 1,
        name: 'Admin Book Sales',
        email: 'admin@booksales.test',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      },
      {
        id: 2,
        name: 'Customer Demo',
        email: 'customer@booksales.test',
        username: 'customer',
        password: 'customer123',
        role: 'customer',
      },
    ])
    write(KEYS.seq, { genres: 6, authors: 5, users: 2 })
  }
}

/* ------------------------------------------------------------------ */
/* Router sederhana                                                    */
/* ------------------------------------------------------------------ */

const listCollection = (key) => read(key, [])

export async function mockRequest({ method = 'get', url = '/', data = null }) {
  seedMockData()
  await delay()

  const [rawPath, rawQuery = ''] = url.split('?')
  const path = rawPath.replace(/^\/+/, '').replace(/\/+$/, '')
  const segments = path.split('/').filter(Boolean)
  const query = new URLSearchParams(rawQuery)
  const verb = method.toLowerCase()

  /* ----------------------------- AUTH ----------------------------- */

  if (segments[0] === 'login' && verb === 'post') {
    const identifier = (data?.email ?? '').trim().toLowerCase()
    const password = data?.password ?? ''
    const users = read(KEYS.users, [])
    const user = users.find(
      (item) =>
        item.email.toLowerCase() === identifier || item.username.toLowerCase() === identifier,
    )

    if (!user || user.password !== password) {
      throw new ApiError(401, 'Email atau password Anda salah.')
    }
   

    return {
      status: 200,
      data: {
        success: true,
        message: 'Login successfully',
        token: createToken(user),
        user: publicUser(user),
      },
    }
  }

  if (segments[0] === 'register' && verb === 'post') {
    const users = read(KEYS.users, [])
    const name = (data?.name ?? '').trim()
    const email = (data?.email ?? '').trim().toLowerCase()
    const username = (data?.username ?? '').trim().toLowerCase()
    const password = data?.password ?? ''
    const passwordConfirmation = data?.password_confirmation ?? ''

    if (!name || !email || !username || !password) {
      throw new ApiError(422, 'Semua kolom wajib diisi.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      throw new ApiError(422, 'Format email tidak valid.')
    }
    if (users.some((item) => item.email.toLowerCase() === email)) {
      throw new ApiError(422, 'Email sudah terdaftar, silakan gunakan email lain.')
    }
    if (users.some((item) => item.username.toLowerCase() === username)) {
      throw new ApiError(422, 'Username sudah dipakai, silakan pilih yang lain.')
    }
    if (password.length < 8) {
      throw new ApiError(422, 'Password minimal 8 karakter.')
    }
    if (password !== passwordConfirmation) {
      throw new ApiError(422, 'Konfirmasi password tidak sama.')
    }

    const user = {
      id: nextId('users'),
      name,
      email,
      username,
      password,
      role: 'customer',
    }
    write(KEYS.users, [...users, user])

    return {
      status: 201,
      data: {
        success: true,
        message: 'Registrasi berhasil. Silakan login dengan akun baru Anda.',
        user: publicUser(user),
      },
    }
  }

  if (segments[0] === 'logout' && verb === 'post') {
    return { status: 200, data: { success: true, message: 'Logout successfully' } }
  }

  /* ---------------------------- GENRES ---------------------------- */

  const isGenres = segments[0] === 'genres'
  const isAuthors = segments[0] === 'authors'
  const collectionKey = isGenres ? KEYS.genres : isAuthors ? KEYS.authors : null

  if (collectionKey) {
    const items = listCollection(collectionKey)
    const id = segments[1] ? Number(segments[1]) : null

    if (verb === 'get' && !id) {
      const search = (query.get('search') ?? '').trim().toLowerCase()
      const filtered = search
        ? items.filter((item) =>
            [item.name, item.description, item.bio, item.nationality]
              .filter(Boolean)
              .some((field) => field.toLowerCase().includes(search)),
          )
        : items

      return { status: 200, data: { success: true, data: filtered, total: filtered.length } }
    }

    if (verb === 'post') {
      const name = (data?.name ?? '').trim()
      if (name.length < 3) throw new ApiError(422, 'Nama minimal 3 karakter.')
      if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        throw new ApiError(422, `Nama "${name}" sudah terdaftar.`)
      }

      const item = lead({ id: nextId(isGenres ? 'genres' : 'authors'), ...data, name }, isGenres)
      write(collectionKey, [...items, item])
      return { status: 201, data: { success: true, message: 'Data berhasil ditambahkan.', data: item } }
    }

    const existing = items.find((item) => item.id === id)
    if (!existing) throw new ApiError(404, 'Data tidak ditemukan.')

    if (verb === 'put' || verb === 'patch') {
      const name = (data?.name ?? '').trim()
      if (name.length < 3) throw new ApiError(422, 'Nama minimal 3 karakter.')
      if (
        items.some(
          (item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        throw new ApiError(422, `Nama "${name}" sudah terdaftar.`)
      }

      const updated = { ...existing, ...data, name }
      write(
        collectionKey,
        items.map((item) => (item.id === id ? updated : item)),
      )
      return { status: 200, data: { success: true, message: 'Data berhasil diperbarui.', data: updated } }
    }

    if (verb === 'delete') {
      write(
        collectionKey,
        items.filter((item) => item.id !== id),
      )
      return { status: 200, data: { success: true, message: 'Data berhasil dihapus.' } }
    }
  }

  throw new ApiError(404, `Endpoint ${method.toUpperCase()} /${path} tidak ditemukan.`)
}

/** Melengkapi field default sesuai jenis koleksi. */
function lead(payload, isGenres) {
  const base = {
    id: payload.id,
    name: payload.name,
    created_at: today(),
  }
  if (isGenres) {
    return { ...base, description: (payload.description ?? '').trim() }
  }
  return {
    ...base,
    nationality: (payload.nationality ?? '').trim(),
    bio: (payload.bio ?? '').trim(),
  }
}
