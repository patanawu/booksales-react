
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import AdminLayout from './layouts/AdminLayout'
import AuthorList from './pages/admin/AuthorList'
import Dashboard from './pages/admin/Dashboard'
import GenreList from './pages/admin/GenreList'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'

import GuestRoute from './routes/GuestRoute'
import ProtectedRoute from './routes/ProtectedRoute'

// Mengarahkan pengguna sesuai role
function HomeRedirect() {
  const { isValid, user } = useAuth()

  if (!isValid) {
    return <Navigate to="/login" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/profile" replace />
}

// Halaman profil pengguna
function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.name || user?.username || 'Pengguna'

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <span className="text-xl">📚</span>
            </div>

            <span className="text-xl font-extrabold text-slate-900">
              BookSales
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Profile Content */}
      <main className="mx-auto max-w-6xl px-5 py-12">

        <div className="mb-8">
          <p className="font-semibold text-indigo-600">
            USER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Selamat datang, {displayName}!
          </h1>

          <p className="mt-2 text-slate-500">
            Kelola informasi akun BookSales kamu di sini.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {/* Profile Card */}
          <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-7 text-white shadow-lg md:col-span-1">

            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold ring-4 ring-white/20">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold">
              {displayName}
            </h2>

            <p className="mt-1 text-sm text-indigo-100">
              {user?.email || 'Email belum tersedia'}
            </p>

            <span className="mt-5 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase">
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </span>

          </section>

          {/* Account Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:col-span-2">

            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Informasi Akun
            </h2>

            <div className="space-y-5">

              <div className="border-b border-slate-100 pb-4">
                <p className="text-sm text-slate-500">
                  Nama Lengkap
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {user?.name || '-'}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {user?.email || '-'}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <p className="text-sm text-slate-500">
                  Username
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {user?.username || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Role Pengguna
                </p>

                <p className="mt-1 font-semibold text-indigo-600">
                  {user?.role || '-'}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* Information */}
        <section className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

          <h3 className="font-bold text-indigo-900">
            Selamat menggunakan BookSales!
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-indigo-700">
            Kamu berhasil masuk sebagai pengguna. Halaman ini
            merupakan area profil pribadi, sedangkan pengelolaan
            katalog buku tersedia khusus untuk administrator.
          </p>

        </section>

      </main>
    </div>
  )
}

// Komponen utama aplikasi
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>

          <Routes>

            {/* Halaman Login dan Register */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Halaman yang dapat diakses semua role */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['user', 'customer', 'admin']}
                />
              }
            >
              <Route
                path="/profile"
                element={<ProfilePage />}
              />
            </Route>

            {/* Halaman khusus Admin */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']} />
              }
            >
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="genres" element={<GenreList />} />
                <Route path="authors" element={<AuthorList />} />
              </Route>
            </Route>

            {/* Halaman utama */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Halaman tidak ditemukan */}
            <Route path="*" element={<NotFound />} />

          </Routes>

        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
