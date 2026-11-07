import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, USE_MOCK } from '../../api/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
} from '../../components/ui/icons'
import { useToast } from '../../context/ToastContext'
import AuthLayout from '../../layouts/AuthLayout'
import { register } from '../../services/authService'
import { cn } from '../../utils/cn'
import { passwordScore, validateRegister } from '../../utils/validation'

const INITIAL_FORM = {
  name: '',
  email: '',
  username: '',
  password: '',
  password_confirmation: '',
  agree: false,
}

const STRENGTH_LABEL = ['Sangat lemah', 'Lemah', 'Cukup kuat', 'Kuat', 'Sangat kuat']
const STRENGTH_COLOR = [
  'bg-slate-200',
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-emerald-600',
]

function PasswordMeter({ password }) {
  const score = passwordScore(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-200',
              password && index < score ? STRENGTH_COLOR[score] : 'bg-slate-200',
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Kekuatan password:{' '}
        <span className="font-semibold text-slate-700">
          {password ? STRENGTH_LABEL[score] : 'belum diisi'}
        </span>
      </p>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const requirements = useMemo(
    () => [
      { label: 'Minimal 8 karakter', met: form.password.length >= 8 },
      { label: 'Mengandung huruf', met: /[a-zA-Z]/.test(form.password) },
      { label: 'Mengandung angka', met: /\d/.test(form.password) },
    ],
    [form.password],
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError('')
  }

  const handleBlur = (event) => {
    const { name } = event.target
    const validation = validateRegister(form)
    setErrors((prev) => ({ ...prev, [name]: validation[name] }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    const validation = validateRegister(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      const firstField = Object.keys(validation)[0]
      document.getElementById(firstField)?.focus()
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      })

      toast.success('Akun berhasil dibuat. Silakan login untuk melanjutkan.')
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (error) {
      setServerError(getErrorMessage(error, 'Registrasi gagal, silakan coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      side="register"
      badge="Registrasi pengguna"
      heading="Buat akun baru"
      subheading="Lengkapi data di bawah ini untuk membuat akun BookSales. Butuh kurang dari satu menit."
    >
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
          label="Nama lengkap"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Contoh: Nadia Putri"
          icon={IdCard}
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          maxLength={60}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
        />

        <Input
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="nadiaputri"
          icon={AtSign}
          value={form.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.username}
          hint="3–20 karakter, tanpa spasi."
          required
        />

        <div>
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Buat password yang aman"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            }
          />

          <PasswordMeter password={form.password} />

          {form.password && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {requirements.map((item) => (
                <li
                  key={item.label}
                  className={cn(
                    'flex items-center gap-1 text-[11px] font-medium transition-colors',
                    item.met ? 'text-emerald-600' : 'text-slate-400',
                  )}
                >
                  <Check className="h-3 w-3" />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Input
          label="Konfirmasi password"
          name="password_confirmation"
          type={showConfirmation ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Ulangi password"
          icon={Lock}
          value={form.password_confirmation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password_confirmation}
          required
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmation((value) => !value)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label={showConfirmation ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showConfirmation ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          }
        />

        <div>
          <label htmlFor="agree" className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-brand-500',
                errors.agree && 'outline outline-2 outline-offset-2 outline-rose-300',
              )}
            />
            <span className="leading-relaxed">
              Saya menyetujui{' '}
              <span className="font-semibold text-slate-800">syarat & ketentuan</span> serta{' '}
              <span className="font-semibold text-slate-800">kebijakan privasi</span> BookSales.
            </span>
          </label>
          {errors.agree && <p className="error-text">{errors.agree}</p>}
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading} iconRight={ArrowRight}>
          {loading ? 'Membuat akun…' : 'Daftar sekarang'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
          Masuk di sini
        </Link>
      </p>

      {USE_MOCK && (
        <p className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-[11px] leading-relaxed text-slate-500 ring-1 ring-slate-100">
          Mode demo: akun baru tersimpan di localStorage browser dan hanya bisa mengakses halaman
          publik. Gunakan akun admin untuk masuk ke panel.
        </p>
      )}
    </AuthLayout>
  )
}
