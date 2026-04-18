// src/components/ui/Spinner.jsx
import { cn } from '@/utils'
export default function Spinner({ size = 'md', className }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-3' }[size]
  return (
    <div className={cn('rounded-full border-surface-200 border-t-primary-600 animate-spin', s, className)} />
  )
}