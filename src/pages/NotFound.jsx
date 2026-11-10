
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ArrowLeft, BookOpen } from '../components/ui/icons'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { isValid, user } = useAuth()

  const homePath = !isValid
    ? '/login'
    : user?.role === 'admin'
      ? '/admin'
      : '/profile'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-600/25">
        <BookOpen className="h-8 w-8" />
      </span>

      <p className="mt-6 font-display text-6xl font-extrabold tracking-tight text-slate-900">
        404
      </p>

      <h1 className="mt-2 font-display text-xl font-bold text-slate-800">
        Halaman tidak ditemukan
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Tautan yang Anda buka mungkin salah atau halaman sudah dipindahkan.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button as={Link} to={homePath} icon={ArrowLeft}>
          Kembali ke halaman utama
        </Button>

        {!isValid && (
          <Button as={Link} to="/register" variant="secondary">
            Daftar akun
          </Button>
        )}
      </div>
    </div>
  )
}
