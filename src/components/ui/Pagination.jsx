// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export default function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1 <= 5 ? i + 1 : i + 1 === 6 ? '…' : totalPages
    if (page >= totalPages - 3) return i === 0 ? 1 : i === 1 ? '…' : totalPages - 4 + i
    return i === 0 ? 1 : i === 1 ? '…' : i === 5 ? '…' : i === 6 ? totalPages : page - 2 + i
  })

  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-surface-200 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-surface-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-9 h-9 rounded-xl text-sm font-medium transition-all',
              p === page
                ? 'bg-primary-700 text-white shadow-sm'
                : 'border border-surface-200 hover:bg-surface-100 text-surface-700'
            )}
          >{p}</button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-surface-200 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// src/components/ui/EmptyState.jsx
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-5">
          <Icon size={28} className="text-surface-400" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-surface-800 mb-2">{title}</h3>
      {description && <p className="text-surface-500 text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
