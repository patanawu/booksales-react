import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Halaman login/register tidak boleh dibuka kembali
 * apabila pengguna sudah memiliki sesi admin yang valid.
 */
export default function GuestRoute() {
  const { isValid, user } = useAuth()

  if (isValid && user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
