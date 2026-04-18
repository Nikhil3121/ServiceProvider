// src/pages/user/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Shield, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import { authApi } from '@/services/api'
import { formatDate, timeAgo } from '@/utils'
import Avatar from '@/components/ui/Avatar'
import { StatSkeleton } from '@/components/ui/Skeleton'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    select: (r) => r.data.data,
  })

  const profile = data || user

  const stats = [
    { label: 'Member since',    value: formatDate(profile?.createdAt),        icon: Clock },
    { label: 'Last login',      value: timeAgo(profile?.lastLogin),            icon: Clock },
    { label: 'Email status',    value: profile?.isEmailVerified ? 'Verified' : 'Unverified', icon: profile?.isEmailVerified ? CheckCircle : XCircle, ok: profile?.isEmailVerified },
    { label: 'Phone status',    value: profile?.isPhoneVerified ? 'Verified' : 'Unverified', icon: profile?.isPhoneVerified ? CheckCircle : XCircle, ok: profile?.isPhoneVerified },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Welcome back, {profile?.name?.split(' ')[0]}</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Profile overview */}
        <motion.div variants={fadeUp} className="card card-body">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar name={profile?.name} src={profile?.avatar?.url} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-display font-semibold text-surface-900">{profile?.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-surface-500"><Mail size={13} />{profile?.email}</span>
                <span className="flex items-center gap-1.5 text-sm text-surface-500"><Phone size={13} />{profile?.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <span className={`badge ${profile?.role === 'admin' ? 'badge-primary' : 'badge-gray'}`}>
                  <Shield size={10} /> {profile?.role}
                </span>
                <span className={`badge ${profile?.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {profile?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <Link to="/dashboard/profile" className="btn-secondary btn-sm shrink-0">
              Edit profile <ExternalLink size={13} />
            </Link>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
            : stats.map(({ label, value, icon: Icon, ok }) => (
                <motion.div key={label} variants={fadeUp} className="card card-body">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${ok === undefined ? 'bg-primary-100 text-primary-700' : ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-xs text-surface-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-semibold text-surface-900 text-sm">{value}</p>
                </motion.div>
              ))
          }
        </div>

        {/* Verification notices */}
        {profile && (!profile.isEmailVerified || !profile.isPhoneVerified) && (
          <motion.div variants={fadeUp} className="card card-body border-amber-200 bg-amber-50">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <XCircle size={16} /> Complete your account verification
            </h3>
            <p className="text-amber-700 text-sm mb-4">Verify your contact details to unlock all features.</p>
            <div className="flex flex-wrap gap-3">
              {!profile.isEmailVerified && (
                <button className="btn-sm bg-amber-600 text-white hover:bg-amber-700 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                  Resend email verification
                </button>
              )}
              {!profile.isPhoneVerified && (
                <Link to="/auth/verify-otp" state={{ phone: profile.phone }} className="btn-sm bg-amber-600 text-white hover:bg-amber-700 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                  Verify phone number
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/services', label: 'Browse Services', desc: 'Explore our offerings', icon: '💼' },
            { to: '/dashboard/profile', label: 'Edit Profile', desc: 'Update your information', icon: '✏️' },
            { to: '/contact', label: 'Contact Support', desc: 'Get help from our team', icon: '💬' },
          ].map(({ to, label, desc, icon }) => (
            <Link key={to} to={to} className="card-hover card-body flex items-center gap-3 p-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-medium text-surface-900 text-sm">{label}</p>
                <p className="text-xs text-surface-500">{desc}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
