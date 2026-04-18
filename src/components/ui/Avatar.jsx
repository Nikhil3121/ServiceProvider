// src/components/ui/Avatar.jsx
import { cn, getInitials } from '@/utils'

const sizes = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

export default function Avatar({ name = '', src, size = 'md', className }) {
  return src ? (
    <img
      src={src}
      alt={name}
      className={cn('rounded-full object-cover ring-2 ring-white shrink-0', sizes[size], className)}
    />
  ) : (
    <div className={cn(
      'rounded-full shrink-0 flex items-center justify-center font-semibold text-white',
      'bg-gradient-to-br from-primary-600 to-primary-800 ring-2 ring-white',
      sizes[size], className
    )}>
      {getInitials(name)}
    </div>
  )
}
