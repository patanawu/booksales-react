/**
 * Kumpulan ikon SVG inline (tanpa library tambahan).
 * Semua ikon memakai currentColor agar mudah diwarnai lewat className.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
}

export const LayoutDashboard = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </svg>
)

export const Tag = (props) => (
  <svg {...base} {...props}>
    <path d="M20.6 13.3 13.3 20.6a2 2 0 0 1-2.8 0l-7.1-7.1a2 2 0 0 1-.6-1.4V4.8A1.8 1.8 0 0 1 4.6 3h7.3a2 2 0 0 1 1.4.6l7.3 7.3a1.7 1.7 0 0 1 0 2.4Z" />
    <circle cx="7.8" cy="7.8" r="1.4" />
  </svg>
)

export const UserPen = (props) => (
  <svg {...base} {...props}>
    <path d="M15 20.5v-1.7a3.8 3.8 0 0 0-3.8-3.8H6.6a3.8 3.8 0 0 0-3.8 3.8v1.7" />
    <circle cx="8.9" cy="7.3" r="3.8" />
    <path d="M19.5 8.5 21 7a1.8 1.8 0 0 0-2.6-2.6L17 5.9" />
    <path d="m17 5.9-5.1 5.1-.7 2.9 2.9-.7 5.1-5.1" />
  </svg>
)

export const BookOpen = (props) => (
  <svg {...base} {...props}>
    <path d="M12 6.5C10.6 5.1 8.7 4.4 6.3 4.4H3v13.2h3.3c2.4 0 4.3.7 5.7 2.1 1.4-1.4 3.3-2.1 5.7-2.1H21V4.4h-3.3c-2.4 0-4.3.7-5.7 2.1Z" />
    <path d="M12 6.5v13.2" />
  </svg>
)

export const Plus = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Search = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16.3 16.3 4.2 4.2" />
  </svg>
)

export const Pencil = (props) => (
  <svg {...base} {...props}>
    <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m13.8 6.2 3 3" />
  </svg>
)

export const Trash = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7" />
    <path d="M6 7l.9 12.1A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const X = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Menu = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const LogOut = (props) => (
  <svg {...base} {...props}>
    <path d="M15 4h2.5A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20H15" />
    <path d="M10 8l-4 4 4 4M6 12h9" />
  </svg>
)

export const Check = (props) => (
  <svg {...base} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)

export const CheckCircle = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
  </svg>
)

export const AlertCircle = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.6M12 16.2h.01" />
  </svg>
)

export const Info = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.8h.01" />
  </svg>
)

export const Eye = (props) => (
  <svg {...base} {...props}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOff = (props) => (
  <svg {...base} {...props}>
    <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17.4 17.4 0 0 1-2.7 3.4" />
    <path d="M6.3 7.9A17 17 0 0 0 2.5 12s3.5 6 9.5 6a9.6 9.6 0 0 0 3.6-.7" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M3 3l18 18" />
  </svg>
)

export const ChevronDown = (props) => (
  <svg {...base} {...props}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
)

export const ShieldCheck = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l7 2.6v5.2c0 4.4-3 8.1-7 9.7-4-1.6-7-5.3-7-9.7V5.6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </svg>
)

export const Sparkles = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5Z" />
    <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </svg>
)

export const ArrowRight = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (props) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 18 5 12l6-6" />
  </svg>
)

export const Loader = (props) => (
  <svg {...base} {...props} className={`animate-spin ${props?.className ?? ''}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
)

export const Users = (props) => (
  <svg {...base} {...props}>
    <path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
    <circle cx="9" cy="7" r="3.6" />
    <path d="M22 20v-1.6a4 4 0 0 0-3-3.87M16.5 4.1a3.6 3.6 0 0 1 0 6.98" />
  </svg>
)

export const Mail = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 7.3 5.2a1.2 1.2 0 0 0 1.4 0L20 7" />
  </svg>
)

export const Lock = (props) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
)

export const AtSign = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a2.5 2.5 0 0 0 4.4 1.6A9 9 0 1 0 17 19.4" />
  </svg>
)

export const IdCard = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="8.5" cy="11" r="2.2" />
    <path d="M5.5 16.2a3.2 3.2 0 0 1 6 0M14 10h4M14 13.5h4" />
  </svg>
)

export const Quote = (props) => (
  <svg {...base} {...props}>
    <path d="M9.5 6.5c-3 1.2-4.5 3.4-4.5 6.6 0 2.4 1.2 4.4 3.2 4.4 1.7 0 3-1.2 3-2.9 0-1.6-1.1-2.7-2.6-2.7-.3 0-.6 0-.9.1.2-1.4 1-2.4 2.4-3.2l-.6-2.3ZM19 6.5c-3 1.2-4.5 3.4-4.5 6.6 0 2.4 1.2 4.4 3.2 4.4 1.7 0 3-1.2 3-2.9 0-1.6-1.1-2.7-2.6-2.7-.3 0-.6 0-.9.1.2-1.4 1-2.4 2.4-3.2l-.6-2.3Z" />
  </svg>
)

export const Refresh = (props) => (
  <svg {...base} {...props}>
    <path d="M20 11a8 8 0 0 0-13.7-5.3L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 13.7 5.3L20 16" />
    <path d="M20 20v-4h-4" />
  </svg>
)
