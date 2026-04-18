// src/pages/auth/ResetPasswordPage.jsx
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { getErrorMessage } from '@/utils'
import { FormField, PasswordInput } from '@/components/ui/FormField'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => authApi.resetPassword({ token, ...data }),
    onSuccess: () => { toast.success('Password reset! Please log in.'); setTimeout(() => navigate('/auth/login'), 2000) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  if (!token) return (
    <div className="text-center py-8">
      <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-display font-semibold mb-2">Invalid Link</h2>
      <p className="text-surface-500 text-sm mb-6">This reset link is invalid or has expired.</p>
      <Link to="/auth/forgot-password" className="btn-primary">Request new link</Link>
    </div>
  )

  if (isSuccess) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={28} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-display font-semibold mb-3">Password reset!</h2>
      <p className="text-surface-500 text-sm">Redirecting you to login…</p>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold">New password</h1>
        <p className="text-surface-500 mt-2 text-sm">Create a strong new password for your account</p>
      </div>
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="New password" error={errors.password?.message} required>
          <PasswordInput {...register('password')} placeholder="Create a strong password" error={errors.password?.message} />
        </FormField>
        <FormField label="Confirm password" error={errors.confirmPassword?.message} required>
          <PasswordInput {...register('confirmPassword')} placeholder="Repeat your password" error={errors.confirmPassword?.message} />
        </FormField>
        <button type="submit" disabled={isPending} className="btn-primary btn-lg w-full mt-2">
          {isPending ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <><span>Reset password</span><ArrowRight size={16} /></>}
        </button>
      </form>
    </motion.div>
  )
}
