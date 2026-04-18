// src/pages/user/ChangePasswordPage.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { KeyRound, Save, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import { FormField, PasswordInput } from '@/components/ui/FormField'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((d) => d.currentPassword !== d.newPassword, {
  message: 'New password must differ from current password',
  path: ['newPassword'],
})

const TIPS = [
  'Use at least 8 characters',
  'Include uppercase and lowercase letters',
  'Add numbers and special characters',
  'Avoid using personal information',
]

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed. Please log in again.')
      clearAuth()
      navigate('/auth/login', { replace: true })
    },
    onError: (err) => {
      const msg = getErrorMessage(err)
      toast.error(msg)
      if (msg.toLowerCase().includes('current')) reset({ currentPassword: '' })
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-surface-900">Security</h1>
        <p className="text-surface-500 text-sm mt-1">Update your password to keep your account secure</p>
      </div>

      <div className="max-w-xl grid gap-6">
        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="card card-body"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <KeyRound size={18} className="text-primary-700" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-900">Change password</h2>
              <p className="text-xs text-surface-500">You'll be signed out after changing your password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
            <FormField label="Current password" error={errors.currentPassword?.message} required>
              <PasswordInput
                {...register('currentPassword')}
                autoComplete="current-password"
                placeholder="Enter your current password"
                error={errors.currentPassword?.message}
              />
            </FormField>

            <div className="h-px bg-surface-100 my-1" />

            <FormField label="New password" error={errors.newPassword?.message} required>
              <PasswordInput
                {...register('newPassword')}
                autoComplete="new-password"
                placeholder="Create a strong new password"
                error={errors.newPassword?.message}
              />
            </FormField>

            <FormField label="Confirm new password" error={errors.confirmPassword?.message} required>
              <PasswordInput
                {...register('confirmPassword')}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                error={errors.confirmPassword?.message}
              />
            </FormField>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending
                  ? <><Spinner size="sm" className="border-white/30 border-t-white" /> Updating…</>
                  : <><Save size={15} /> Update password</>
                }
              </button>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card card-body bg-primary-50 border-primary-100"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck size={18} className="text-primary-700" />
            <h3 className="font-semibold text-primary-900 text-sm">Password tips</h3>
          </div>
          <ul className="space-y-2">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-sm text-primary-800">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
