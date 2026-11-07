import { cn } from '../../utils/cn'

export default function Textarea({
  label,
  name,
  id,
  error,
  hint,
  required,
  rows = 4,
  className,
  containerClassName,
  ...props
}) {
  const inputId = id ?? name

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn('input resize-none leading-relaxed', error && 'input-error', className)}
        required={required}
        {...props}
      />

      {error ? (
        <p className="error-text">{error}</p>
      ) : (
        hint && <p className="hint">{hint}</p>
      )}
    </div>
  )
}
