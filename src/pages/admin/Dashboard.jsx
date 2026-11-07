import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  ArrowRight,
  BookOpen,
  Plus,
  Sparkles,
  Tag,
  UserPen,
} from '../../components/ui/icons'
import { useAuth } from '../../context/AuthContext'
import { getAuthors } from '../../services/authorService'
import { getGenres } from '../../services/genreService'
import { formatShortDate } from '../../utils/format'

function StatCard({ label, value, icon: Icon, hint, loading, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  }

  return (
    <div className="card p-5 transition hover:shadow-lg hover:shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ring-inset ${tones[tone]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>

      {loading ? (
        <Skeleton className="mt-4 h-8 w-16" />
      ) : (
        <p className="mt-3 font-display text-[32px] font-extrabold leading-none tracking-tight text-slate-900">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function QuickCard({ to, title, description, icon: Icon, count }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-50 transition group-hover:bg-brand-100/80" />
      <div className="relative">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-600/20">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <Badge tone="brand">{count} data</Badge>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          Kelola
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState([])
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [genreData, authorData] = await Promise.all([getGenres(), getAuthors()])
        if (!active) return
        setGenres(genreData)
        setAuthors(authorData)
      } catch (error) {
        console.error('[dashboard] gagal memuat ringkasan:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const firstName = (user?.name ?? 'Admin').split(' ')[0]

  const recent = [...genres.map((item) => ({ ...item, type: 'Genre' })), ...authors.map((item) => ({ ...item, type: 'Author' }))]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ringkasan"
        title={`Halo, ${firstName}`}
        description="Pantau data katalog dan kelola genre maupun author dari satu tempat."
        actions={
          <Button as={Link} to="/admin/genres" icon={Plus} className="hidden sm:inline-flex">
            Tambah data
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Genre"
          value={genres.length}
          icon={Tag}
          hint="Kategori buku yang tersedia"
          loading={loading}
        />
        <StatCard
          label="Total Author"
          value={authors.length}
          icon={UserPen}
          tone="violet"
          hint="Penulis terdaftar di katalog"
          loading={loading}
        />
        <StatCard
          label="Status akun"
          value={user?.role === 'admin' ? 'Admin' : 'User'}
          icon={BookOpen}
          tone="emerald"
          hint={`Masuk sebagai ${user?.username ?? 'admin'}`}
          loading={false}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickCard
          to="/admin/genres"
          title="Kelola Genre"
          description="Tambah, ubah, dan hapus kategori buku agar katalog tetap rapi."
          icon={Tag}
          count={genres.length}
        />
        <QuickCard
          to="/admin/authors"
          title="Kelola Author"
          description="Perbarui data penulis beserta bio singkatnya."
          icon={UserPen}
          count={authors.length}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-[15px] font-bold text-slate-900">Data terbaru</h2>
              <p className="text-xs text-slate-500">Lima entri terakhir yang ditambahkan.</p>
            </div>
            <Badge tone="slate">{recent.length} entri</Badge>
          </div>

          <ul className="divide-y divide-slate-100">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <li key={index} className="flex items-center gap-3 px-5 py-3.5">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </li>
                ))
              : recent.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 px-5 py-3.5">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        item.type === 'Genre'
                          ? 'bg-brand-50 text-brand-600'
                          : 'bg-violet-50 text-violet-600'
                      }`}
                    >
                      {item.type === 'Genre' ? (
                        <Tag className="h-4 w-4" />
                      ) : (
                        <UserPen className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.type} · {formatShortDate(item.created_at)}
                      </p>
                    </div>
                    <Badge tone={item.type === 'Genre' ? 'brand' : 'slate'}>{item.type}</Badge>
                  </li>
                ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#312e81] via-[#1e1b4b] to-[#0f172a] p-5 text-white shadow-card">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/25 blur-2xl" />
          <Sparkles className="relative h-6 w-6 text-brand-300" />
          <h2 className="relative mt-4 font-display text-lg font-bold leading-snug">
            Jaga konsistensi data
          </h2>
          <p className="relative mt-2 text-sm leading-relaxed text-brand-100/70">
            Sebelum menambahkan genre baru, pastikan nama belum pernah dipakai. Nama yang serupa
            membuat katalog sulit difilter.
          </p>
          <div className="relative mt-5 space-y-2.5 border-t border-white/10 pt-4 text-[13px] text-brand-100/80">
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Gunakan nama genre yang
              singkat
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Lengkapi bio author
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
