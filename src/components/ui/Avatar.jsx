import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export default function Avatar({ name = '', size = 'md', className }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 font-bold text-white ring-2 ring-white',
        SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
