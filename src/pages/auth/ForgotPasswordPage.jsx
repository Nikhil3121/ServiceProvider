// src/pages/auth/ForgotPasswordPage.jsx
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { getErrorMessage } from '@/utils'
import { FormField, Input } from '@/components/ui/FormField'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({ email: z.string().email('Enter a valid email address') })

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const { mutate, isPending, isSuccess, variables } = useMutation({
    mutationFn: (data) => authApi.forgotPassword({ ...data, captchaToken: 'skip' }),
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-display font-semibold mb-3">Check your inbox</h2>
        <p className="text-surface-500 text-sm mb-2">We sent a password reset link to</p>
        <p className="font-medium text-surface-900 mb-8">{variables?.email}</p>
        <p className="text-xs text-surface-400 mb-6">The link expires in 10 minutes. Check your spam folder if you don't see it.</p>
        <Link to="/auth/login" className="btn-secondary inline-flex"><ArrowLeft size={16} /> Back to login</Link>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-surface-900">Reset password</h1>
        <p className="text-surface-500 mt-2 text-sm">Enter your email and we'll send a reset link</p>
      </div>
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Email address" error={errors.email?.message} required>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <Input {...register('email')} type="email" placeholder="you@company.com" error={errors.email?.message} className="pl-10" />
          </div>
        </FormField>
        <button type="submit" disabled={isPending} className="btn-primary btn-lg w-full mt-2">
          {isPending ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <><span>Send reset link</span><ArrowRight size={16} /></>}
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link to="/auth/login" className="text-sm text-surface-500 hover:text-surface-700 inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </motion.div>
  )
}
