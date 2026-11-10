
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Membatasi akses halaman login dan register.
 *
 * - Admin yang sudah login -> dashboard admin
 * - User yang sudah login -> halaman profil
 * - Belum login -> boleh membuka login/register
 */
export default function GuestRoute() {
  const { isValid, user } = useAuth()

  if (isValid) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}
