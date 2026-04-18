// src/components/ui/ErrorFallback.jsx
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h1 className="text-2xl font-display font-semibold text-surface-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-surface-500 mb-2 text-sm leading-relaxed">
          An unexpected error occurred. The error has been logged and our team has been notified.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <pre className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 text-left overflow-auto max-h-32 mb-4">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={resetErrorBoundary}
            className="btn-primary"
          >
            <RefreshCw size={15} /> Try again
          </button>
          <Link to="/" className="btn-secondary">
            <Home size={15} /> Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
