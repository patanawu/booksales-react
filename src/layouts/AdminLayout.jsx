import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Tag,
  UserPen,
  X,
} from '../components/ui/icons'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/genres', label: 'Genre', icon: Tag },
  { to: '/admin/authors', label: 'Author', icon: UserPen },
]

function Brand() {
  return (
    <Link to="/admin" className="group flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-violet-600 text-white shadow-lg shadow-brand-900/30 transition group-hover:scale-[1.03]">
        <BookOpen className="h-[22px] w-[22px]" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-extrabold tracking-tight text-white">
          BookSales
        </span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-200/70">
          Admin Panel
        </span>
      </span>
    </Link>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-6">
        <Brand />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
          Menu utama
        </p>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10'
                  : 'text-brand-100/70 hover:bg-white/5 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'h-[18px] w-[18px] transition',
                    isActive ? 'text-brand-200' : 'text-brand-200/60 group-hover:text-brand-100',
                  )}
                />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-300" />}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-200/70">
            Tips singkat
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-brand-100/60">
            Data genre dan author yang rapi memudahkan pengelolaan katalog buku.
          </p>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <Avatar name={user?.name} size="sm" className="ring-white/20" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white" title={user?.name}>
              {user?.name ?? 'Admin'}
            </p>
            <p className="truncate text-[11px] capitalize text-brand-200/70">
              {user?.role ?? 'admin'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 text-brand-200/70 transition hover:bg-rose-500/15 hover:text-rose-300"
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const menuRef = useRef(null)

  useEffect(() => {
    setSidebarOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const activeItem =
    NAV_ITEMS.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    ) ?? NAV_ITEMS[0]

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gradient-to-b from-[#1e1b4b] via-[#221d5c] to-[#171436] lg:block">
        <SidebarContent />
      </aside>

      {/* Drawer mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-[280px] max-w-[82vw] flex-col bg-gradient-to-b from-[#1e1b4b] via-[#221d5c] to-[#171436] shadow-2xl animate-slide-in-right">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <Link to="/admin" className="transition hover:text-slate-600">
                  Admin
                </Link>
                <span>/</span>
                <span className="truncate text-slate-600">{activeItem.label}</span>
              </div>
              <p className="truncate font-display text-[15px] font-bold text-slate-900">
                {activeItem.label}
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">Sesi aktif</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-slate-300 hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Avatar name={user?.name} size="sm" />
                <span
                  className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-700 sm:block"
                  title={user?.name}
                >
                  {user?.name ?? 'Admin'}
                </span>
                <ChevronDown
                  className={cn('h-4 w-4 text-slate-400 transition', menuOpen && 'rotate-180')}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-pop animate-scale-in"
                >
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <div className="px-1 py-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      icon={LogOut}
                      onClick={handleLogout}
                      className="justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      Keluar dari akun
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>

        <footer className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} BookSales Admin · Dibuat dengan React JS, Vite, dan
            Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  )
}
