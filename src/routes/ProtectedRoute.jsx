
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protected Route untuk membatasi akses berdasarkan role.
 *
 * - Belum login -> diarahkan ke /login
 * - Role tidak sesuai -> diarahkan ke halaman sesuai role
 * - Role sesuai -> halaman dapat diakses
 */
export default function ProtectedRoute({
  allowedRoles = ['user', 'customer', 'admin'],
}) {
  const { isValid, user } = useAuth()
  const location = useLocation()

  // Memeriksa status login
  if (!isValid) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // Memeriksa hak akses berdasarkan role
  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to={user?.role === 'admin' ? '/admin' : '/profile'}
        replace
      />
    )
  }

  return <Outlet />
}
