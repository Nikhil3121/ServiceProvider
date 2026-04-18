// src/components/ui/Logo.jsx
import { Link } from 'react-router-dom'
import { cn } from '@/utils'

export default function Logo({ variant = 'dark', size = 'md', className }) {
  const isLight = variant === 'light'
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5 group', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-xl font-mono font-bold transition-transform group-hover:scale-105',
        size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm',
        isLight ? 'bg-white/15 text-white border border-white/25' : 'bg-primary-700 text-white'
      )}>
        SP
      </div>
      <span className={cn(
        'font-display font-semibold tracking-tight',
        size === 'sm' ? 'text-base' : 'text-xl',
        isLight ? 'text-white' : 'text-surface-900'
      )}>
        ServiceProvider
      </span>
    </Link>
  )
}
