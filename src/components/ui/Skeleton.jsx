import { cn } from '../../utils/cn'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/70', className)} />
}

/** Placeholder baris tabel saat data sedang dimuat. */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="px-5 py-4">
              <Skeleton
                className={cn(
                  'h-3.5',
                  colIndex === 0 ? 'w-8' : colIndex === 1 ? 'w-32' : 'w-full max-w-[220px]',
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
