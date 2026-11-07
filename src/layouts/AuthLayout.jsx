import { Link } from 'react-router-dom'
import { BookOpen, Check } from '../components/ui/icons'

const HIGHLIGHTS = [
  'Kelola data genre & author dalam satu panel',
  'Pencarian instan dan validasi form yang jelas',
  'Tampilan responsif untuk desktop maupun ponsel',
]

/**
 * Kerangka halaman autentikasi: panel branding di kiri,
 * area form di kanan. Otomatis menyesuaikan pada layar kecil.
 */
export default function AuthLayout({ children, badge, heading, subheading, side = 'login' }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel branding */}
      <aside className="relative hidden w-[46%] max-w-[620px] overflow-hidden bg-[#1e1b4b] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#312e81] via-[#1e1b4b] to-[#0f172a]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 p-10">
          <Link to="/login" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 backdrop-blur">
              <BookOpen className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-extrabold tracking-tight text-white">
                BookSales
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-200/70">
                Admin Panel
              </span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 px-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-brand-100 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sistem Manajemen Toko Buku
          </p>

          <h2 className="font-display text-[34px] font-extrabold leading-[1.15] tracking-tight text-white">
            Satu tempat untuk
            <br />
            merapikan <span className="text-brand-300">katalog</span> buku.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/70">
            Kelola genre dan author dengan antarmuka yang bersih, cepat, dan nyaman dipakai
            sehari-hari.
          </p>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-brand-100/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-brand-100/80">
              “Membaca adalah jendela dunia — dan katalog yang rapi membuat setiap jendela mudah
              ditemukan.”
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300/80">
              BookSales · {side === 'register' ? 'Registrasi Pengguna' : 'Admin Workspace'}
            </p>
          </div>
        </div>
      </aside>

      {/* Area form */}
      <main className="flex w-full flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
          <Link to="/login" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-extrabold text-slate-900">BookSales</span>
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Admin
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 pt-2 sm:px-8">
          <div className="w-full max-w-[430px] animate-fade-in">
            {badge && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
                {badge}
              </span>
            )}
            <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{subheading}</p>
            )}

            <div className="mt-7">{children}</div>
          </div>
        </div>

        <p className="px-5 pb-6 text-center text-[11px] text-slate-400 sm:px-8">
          © {new Date().getFullYear()} BookSales Admin · React JS Lanjutan
        </p>
      </main>
    </div>
  )
}
