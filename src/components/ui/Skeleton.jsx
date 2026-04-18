// src/components/ui/Skeleton.jsx
import { cn } from '@/utils'

export function Skeleton({ className }) {
  return <div className={cn('skeleton animate-shimmer', className)} />
}

export function CardSkeleton() {
  return (
    <div className="card card-body space-y-4">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-3 w-5/6 rounded-lg" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  )
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-100">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40 rounded-lg" />
            <Skeleton className="h-3 w-60 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="card card-body">
      <Skeleton className="h-3 w-24 rounded-lg mb-3" />
      <Skeleton className="h-8 w-16 rounded-lg mb-2" />
      <Skeleton className="h-3 w-32 rounded-lg" />
    </div>
  )
}


