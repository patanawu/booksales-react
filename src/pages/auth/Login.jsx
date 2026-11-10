
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage, USE_MOCK } from '../../api/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from '../../components/ui/icons'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../layouts/AuthLayout'
import { validateLogin } from '../../utils/validation'

const INITIAL_FORM = { email: '', password: '' }

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const registeredNotice = location.state?.registered

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    const validation = validateLogin(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)

    try {
      const data = await login(form)

      if (data.user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/profile', { replace: true })
      }
    } catch (error) {
      setServerError(
        getErrorMessage(error, 'Login gagal, silakan coba lagi.')
      )
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') {
      setForm({
        email: 'admin@booksales.test',
        password: 'admin123',
      })
    } else {
      setForm({
        email: 'customer@booksales.test',
        password: 'customer123',
      })
    }

    setErrors({})
    setServerError('')
  }

  return (
    <AuthLayout
      badge="Masuk ke akun"
      heading="Selamat datang kembali"
      subheading="Masuk ke BookSales untuk mengakses fitur sesuai hak akses akun Anda."
    >
      {registeredNotice && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Registrasi berhasil. Silakan masuk memakai akun yang baru Anda buat.
          </p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-relaxed">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email atau username"
          name="email"
          type="text"
          autoComplete="username"
          placeholder="Masukkan email atau username"
          icon={AtSign}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">
              Password <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="mb-1.5 text-xs font-semibold text-brand-600 transition hover:text-brand-700"
            >
              {showPassword ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Masukkan password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={loading}
          iconRight={ArrowRight}
        >
          {loading ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>

      {USE_MOCK && (
        <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Akun demo
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-600">Admin</p>
              <p className="font-mono text-[12px] text-slate-600">
                admin@booksales.test
              </p>
              <p className="font-mono text-[12px] text-slate-600">
                admin123
              </p>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => fillDemo('admin')}
              >
                Isi akun admin
              </Button>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold text-slate-600">User</p>
              <p className="font-mono text-[12px] text-slate-600">
                customer@booksales.test
              </p>
              <p className="font-mono text-[12px] text-slate-600">
                customer123
              </p>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => fillDemo('user')}
              >
                Isi akun user
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
