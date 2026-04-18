// // src/components/ui/Spinner.jsx
// import { cn } from '@/utils'
// export default function Spinner({ size = 'md', className }) {
//   const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-3' }[size]
//   return (
//     <div className={cn('rounded-full border-surface-200 border-t-primary-600 animate-spin', s, className)} />
//   )
// }

// src/components/ui/PageLoader.jsx
export { default as Spinner } from './Spinner'
export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-50 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-3 border-surface-200 border-t-primary-600 animate-spin" />
        <p className="text-sm text-surface-500 font-medium animate-pulse">Loading…</p>
      </div>
    </div>
  )
}

// // src/components/ui/ErrorFallback.jsx
// import { AlertTriangle } from 'lucide-react'
// export default function ErrorFallback({ error, resetErrorBoundary }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
//       <div className="text-center max-w-md">
//         <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//           <AlertTriangle className="text-red-500" size={28} />
//         </div>
//         <h1 className="text-2xl font-display font-semibold text-surface-900 mb-3">Something went wrong</h1>
//         <p className="text-surface-500 mb-6 text-sm">{error?.message || 'An unexpected error occurred.'}</p>
//         <button onClick={resetErrorBoundary} className="btn-primary">Try again</button>
//       </div>
//     </div>
//   )
// }

