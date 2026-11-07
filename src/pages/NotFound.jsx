import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ArrowLeft, BookOpen } from '../components/ui/icons'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-600/25">
        <BookOpen className="h-8 w-8" />
      </span>

      <p className="mt-6 font-display text-6xl font-extrabold tracking-tight text-slate-900">404</p>
      <h1 className="mt-2 font-display text-xl font-bold text-slate-800">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Tautan yang Anda buka mungkin salah atau halaman sudah dipindahkan.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button as={Link} to="/admin" icon={ArrowLeft}>
          Ke dashboard
        </Button>
        <Button as={Link} to="/login" variant="secondary">
          Halaman login
        </Button>
      </div>
    </div>
  )
}
