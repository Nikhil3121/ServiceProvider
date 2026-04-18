// src/App.jsx
import { ErrorBoundary } from 'react-error-boundary'
import AppRoutes from '@/routes'
import ErrorFallback from '@/components/ui/ErrorFallback'
// ErrorFallback is a standalone component in components/ui/ErrorFallback.jsx

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error boundary caught:', error, info)
      }}
    >
      <AppRoutes />
    </ErrorBoundary>
  )
}
