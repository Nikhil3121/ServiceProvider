// src/pages/user/ProfilePage.jsx
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Camera, Save, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi, authApi } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import { FormField, Input } from '@/components/ui/FormField'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
})

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const qc = useQueryClient()
  const fileRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const { data: profileData } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    select: (r) => r.data.data,
  })
  const profile = profileData || user

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
    values: { name: profile?.name || '' },
  })

  // Update name
  const { mutate: updateProfile, isPending: saving } = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: ({ data }) => {
      updateUser(data.data)
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated successfully')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  // Upload avatar
  const { mutate: uploadAvatar, isPending: uploading } = useMutation({
    mutationFn: (file) => {
      const form = new FormData()
      form.append('avatar', file)
      return userApi.uploadAvatar(form)
    },
    onSuccess: ({ data }) => {
      updateUser({ avatar: data.data.avatar })
      qc.invalidateQueries({ queryKey: ['me'] })
      setPreviewUrl(null)
      toast.success('Avatar updated!')
    },
    onError: (err) => { setPreviewUrl(null); toast.error(getErrorMessage(err)) },
  })

  // Delete avatar
  const { mutate: deleteAvatar, isPending: deleting } = useMutation({
    mutationFn: () => userApi.deleteAvatar(),
    onSuccess: () => {
      updateUser({ avatar: { url: '', publicId: '' } })
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Avatar removed')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  // Resend verification
  const { mutate: resendEmail, isPending: resending } = useMutation({
    mutationFn: () => authApi.resendVerification({ email: profile?.email }),
    onSuccess: () => toast.success('Verification email sent!'),
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    uploadAvatar(file)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-surface-900">Profile</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your personal information and account settings</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl space-y-6">
        {/* Avatar card */}
        <motion.div variants={fadeUp} className="card card-body">
          <h2 className="font-semibold text-surface-900 mb-5">Profile photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                name={profile?.name}
                src={previewUrl || profile?.avatar?.url}
                size="xl"
              />
              {(uploading || deleting) && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Spinner size="sm" className="border-white/30 border-t-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-secondary btn-sm"
              >
                <Camera size={14} />
                {uploading ? 'Uploading…' : 'Change photo'}
              </button>
              {profile?.avatar?.url && (
                <button
                  onClick={() => deleteAvatar()}
                  disabled={deleting}
                  className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                  {deleting ? 'Removing…' : 'Remove'}
                </button>
              )}
              <p className="text-xs text-surface-400">JPG, PNG or WebP · Max 5MB</p>
            </div>
          </div>
        </motion.div>

        {/* Personal info */}
        <motion.div variants={fadeUp} className="card card-body">
          <h2 className="font-semibold text-surface-900 mb-5">Personal information</h2>
          <form onSubmit={handleSubmit((d) => updateProfile(d))} className="space-y-4">
            <FormField label="Full name" error={errors.name?.message} required>
              <Input {...register('name')} placeholder="Your full name" error={errors.name?.message} />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Email address">
                <Input value={profile?.email || ''} disabled className="cursor-not-allowed" />
                <p className="form-hint">Email cannot be changed</p>
              </FormField>
              <FormField label="Phone number">
                <Input value={profile?.phone || ''} disabled className="cursor-not-allowed" />
                <p className="form-hint">Phone cannot be changed</p>
              </FormField>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving || !isDirty}
                className="btn-primary"
              >
                {saving
                  ? <><Spinner size="sm" className="border-white/30 border-t-white" /> Saving…</>
                  : <><Save size={15} /> Save changes</>
                }
              </button>
            </div>
          </form>
        </motion.div>

        {/* Verification status */}
        <motion.div variants={fadeUp} className="card card-body">
          <h2 className="font-semibold text-surface-900 mb-5">Verification status</h2>
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
              <div className="flex items-center gap-3">
                {profile?.isEmailVerified
                  ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                  : <XCircle size={16} className="text-red-400 shrink-0" />
                }
                <div>
                  <p className="text-sm font-medium text-surface-900">Email verification</p>
                  <p className="text-xs text-surface-500">{profile?.email}</p>
                </div>
              </div>
              {profile?.isEmailVerified ? (
                <span className="badge-success">Verified</span>
              ) : (
                <button
                  onClick={() => resendEmail()}
                  disabled={resending}
                  className="btn-secondary btn-sm"
                >
                  <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                  {resending ? 'Sending…' : 'Resend'}
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
              <div className="flex items-center gap-3">
                {profile?.isPhoneVerified
                  ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                  : <XCircle size={16} className="text-red-400 shrink-0" />
                }
                <div>
                  <p className="text-sm font-medium text-surface-900">Phone verification</p>
                  <p className="text-xs text-surface-500">{profile?.phone}</p>
                </div>
              </div>
              {profile?.isPhoneVerified ? (
                <span className="badge-success">Verified</span>
              ) : (
                <a
                  href={`/auth/verify-otp`}
                  className="btn-secondary btn-sm"
                >
                  Verify now
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={fadeUp} className="card card-body border-red-100">
          <h2 className="font-semibold text-red-700 mb-1">Danger zone</h2>
          <p className="text-surface-500 text-sm mb-4">Deactivating your account will immediately disable access. This action is irreversible.</p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to deactivate your account? This cannot be undone.')) {
                userApi.deactivate().then(() => {
                  useAuthStore.getState().clearAuth()
                  window.location.href = '/'
                })
              }
            }}
            className="btn-danger btn-sm"
          >
            <Trash2 size={14} /> Deactivate account
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
