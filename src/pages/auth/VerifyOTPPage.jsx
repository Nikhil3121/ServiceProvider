// src/pages/auth/VerifyOTPPage.jsx
import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, RefreshCw, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/PageLoader'

export default function VerifyOTPPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = location.state?.phone || ''
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [cooldown, setCooldown] = useState(0)
  const inputs = useRef([])

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [cooldown])

  const focusNext = (i) => { if (i < 5) inputs.current[i + 1]?.focus() }
  const focusPrev = (i) => { if (i > 0) inputs.current[i - 1]?.focus() }

  const handleChange = (i, val) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]; next[i] = digit; setOtp(next)
    if (digit) focusNext(i)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i]) focusPrev(i)
    if (e.key === 'ArrowLeft') focusPrev(i)
    if (e.key === 'ArrowRight') focusNext(i)
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = Array(6).fill(''); text.split('').forEach((d, i) => { next[i] = d })
    setOtp(next); inputs.current[Math.min(text.length, 5)]?.focus()
    e.preventDefault()
  }

  const { mutate: verify, isPending, isSuccess } = useMutation({
    mutationFn: () => authApi.verifyOTP({ phone, otp: otp.join('') }),
    onSuccess: () => { toast.success('Phone verified!'); setTimeout(() => navigate('/auth/login'), 2000) },
    onError: (err) => { toast.error(getErrorMessage(err)); setOtp(Array(6).fill('')); inputs.current[0]?.focus() },
  })

  const { mutate: resend, isPending: resending } = useMutation({
    mutationFn: () => authApi.resendOTP({ phone }),
    onSuccess: () => { toast.success('New OTP sent!'); setCooldown(60) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  if (isSuccess) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-display font-semibold mb-3">Phone verified!</h2>
        <p className="text-surface-500 text-sm">Redirecting to login…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="card card-body text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-display font-semibold text-surface-900 mb-2">Verify your phone</h2>
          <p className="text-surface-500 text-sm mb-2">Enter the 6-digit code sent to</p>
          <p className="font-medium text-surface-900 mb-8">{phone || 'your phone'}</p>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all outline-none
                  ${digit ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 bg-white text-surface-900'}
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`}
              />
            ))}
          </div>

          <button
            onClick={() => verify()}
            disabled={isPending || otp.join('').length < 6}
            className="btn-primary btn-lg w-full"
          >
            {isPending ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <><span>Verify OTP</span><ArrowRight size={16} /></>}
          </button>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-sm">
            <span className="text-surface-500">Didn't receive the code?</span>
            {cooldown > 0 ? (
              <span className="text-surface-400">Resend in {cooldown}s</span>
            ) : (
              <button onClick={() => resend()} disabled={resending} className="text-primary-600 font-medium hover:text-primary-800 flex items-center gap-1 transition-colors">
                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} /> Resend
              </button>
            )}
          </div>

          <Link to="/auth/login" className="block mt-4 text-xs text-surface-400 hover:text-surface-600 transition-colors">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
