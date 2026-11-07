import { cn } from '../../utils/cn'
import { Loader } from './icons'

const VARIANTS = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300 disabled:shadow-none',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white shadow-sm shadow-rose-600/25 hover:bg-rose-700 active:bg-rose-800',
  'danger-soft':
    'border border-rose-100 bg-rose-50 text-rose-600 hover:border-rose-200 hover:bg-rose-100',
  dark: 'bg-slate-900 text-white hover:bg-slate-800',
}

const SIZES = {
  sm: 'h-9 gap-1.5 px-3 text-[13px]',
  md: 'h-11 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-5 text-[15px]',
  icon: 'h-9 w-9 justify-center',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon = null,
  iconRight: IconRight = null,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <Component
      className={cn(
        'inline-flex select-none items-center justify-center rounded-xl font-semibold transition-all duration-150',
        'disabled:cursor-not-allowed disabled:opacity-70',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader className="h-4 w-4" />
      ) : (
        Icon && <Icon className={cn(size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]', 'shrink-0')} />
      )}
      {children}
      {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" />}
    </Component>
  )
}
