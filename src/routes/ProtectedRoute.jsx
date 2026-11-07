import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Membatasi akses halaman admin.
 * - Belum login / token kedaluwarsa -> dialihkan ke /login
 * - Login tetapi role bukan admin -> dialihkan ke /login
 */
export default function ProtectedRoute() {
  const { isValid, user } = useAuth()
  const location = useLocation()

  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
