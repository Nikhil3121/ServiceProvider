// src/pages/auth/VerifyEmailPage.jsx
import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { authApi } from '@/services/api'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const { isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authApi.verifyEmail(token),
    enabled: !!token,
    retry: false,
  })

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-display font-semibold mb-2">No token provided</h2>
        <p className="text-surface-500 text-sm mb-6">This verification link appears to be invalid.</p>
        <Link to="/" className="btn-primary">Go home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {isLoading && (
          <>
            <div className="w-16 h-16 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-5" />
            <h2 className="text-xl font-display font-semibold mb-2">Verifying your email…</h2>
            <p className="text-surface-500 text-sm">This will just take a moment.</p>
          </>
        )}
        {isSuccess && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-surface-900 mb-3">Email verified!</h2>
            <p className="text-surface-500 text-sm mb-8">Your email has been verified successfully. You can now log in to your account.</p>
            <Link to="/auth/login" className="btn-primary">Continue to login</Link>
          </>
        )}
        {isError && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-display font-semibold mb-3">Verification failed</h2>
            <p className="text-surface-500 text-sm mb-8">{error?.response?.data?.message || 'This link may have expired.'}</p>
            <Link to="/auth/login" className="btn-primary">Go to login</Link>
          </>
        )}
      </div>
    </div>
  )
}
