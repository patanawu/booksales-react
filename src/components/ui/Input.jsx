import { cn } from '../../utils/cn'

/**
 * Input teks dengan label, ikon opsional, pesan bantuan, dan pesan error.
 * Semua props native <input> tetap bisa dipakai (value, onChange, dsb).
 */
export default function Input({
  label,
  name,
  id,
  error,
  hint,
  icon: Icon,
  rightSlot,
  required,
  className,
  containerClassName,
  ...props
}) {
  const inputId = id ?? name
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-slate-400">
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}

        <input
          id={inputId}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'input',
            Icon && 'pl-10',
            rightSlot && 'pr-11',
            error && 'input-error',
            className,
          )}
          required={required}
          {...props}
        />

        {rightSlot && <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">{rightSlot}</div>}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="error-text">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 2.9a.8.8 0 0 1 .8.8v3.6a.8.8 0 0 1-1.6 0V5.2a.8.8 0 0 1 .8-.8Zm0 7.9a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Z" />
          </svg>
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="hint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
