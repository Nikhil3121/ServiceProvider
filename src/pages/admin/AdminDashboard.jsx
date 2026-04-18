// src/pages/admin/AdminDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, Briefcase, MessageSquare, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle, Clock, Star, Activity
} from 'lucide-react'
import { adminApi } from '@/services/api'
import { formatDate, timeAgo } from '@/utils'
import { StatSkeleton, ListSkeleton } from '@/components/ui/Skeleton'
import Avatar from '@/components/ui/Avatar'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

function StatCard({ label, value, sub, icon: Icon, trend, color = 'primary', loading }) {
  if (loading) return <StatSkeleton />
  const colorMap = {
    primary: 'bg-primary-100 text-primary-700',
    green:   'bg-green-100 text-green-700',
    amber:   'bg-amber-100 text-amber-700',
    purple:  'bg-purple-100 text-purple-700',
  }
  return (
    <motion.div variants={fadeUp} className="card card-body">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-surface-900">{value ?? '—'}</p>
      <p className="text-sm text-surface-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
    </motion.div>
  )
}

// Mini bar chart from array of { date, count }
function MiniChart({ data = [] }) {
  if (!data.length) return <div className="h-20 flex items-center justify-center text-sm text-surface-400">No data yet</div>
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="flex items-end gap-0.5 h-20">
      {data.slice(-30).map((d, i) => (
        <div
          key={i}
          title={`${d.date}: ${d.count}`}
          style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
          className="flex-1 bg-primary-500/70 rounded-t-sm hover:bg-primary-600 transition-colors cursor-default"
        />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
    select: (r) => r.data.data,
    refetchInterval: 60_000,
  })

  const overview  = data?.overview  || {}
  const charts    = data?.charts    || {}
  const recent    = data?.recentUsers || []

  const stats = [
    { label: 'Total users',     value: overview.totalUsers,         sub: `${overview.newUsersThisMonth || 0} this month`,         icon: Users,        color: 'primary', trend: overview.userGrowthRate },
    { label: 'Active services', value: overview.activeProjects,     sub: `${overview.totalProjects || 0} total`,                  icon: Briefcase,    color: 'green' },
    { label: 'Unread messages', value: overview.unreadContacts,     sub: `${overview.newContactsThisMonth || 0} this month`,      icon: MessageSquare,color: 'amber' },
    { label: 'Verified users',  value: `${overview.verificationRate || 0}%`, sub: `${overview.verifiedUsers || 0} fully verified`, icon: CheckCircle,  color: 'purple' },
  ]

  const contactStatus = charts.contactsByStatus || {}

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-surface-900">Admin Dashboard</h1>
          <p className="text-surface-500 text-sm mt-1">Overview of your platform</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-surface-400 bg-white border border-surface-200 px-3 py-1.5 rounded-full">
          <Activity size={12} className="text-green-500" />
          Live · updates every minute
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Stats row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} loading={isLoading} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* User growth chart */}
          <motion.div variants={fadeUp} className="lg:col-span-2 card card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-surface-900">User growth (last 30 days)</h2>
              <span className="badge-primary">{overview.newUsersThisMonth || 0} new</span>
            </div>
            {isLoading
              ? <div className="h-20 skeleton rounded-xl" />
              : <MiniChart data={charts.userGrowth || []} />
            }
            <div className="flex gap-4 mt-4 pt-4 border-t border-surface-100">
              <div>
                <p className="text-xs text-surface-400">This month</p>
                <p className="font-semibold text-surface-900">{overview.newUsersThisMonth || 0}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Growth rate</p>
                <p className={`font-semibold ${(overview.userGrowthRate || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {overview.userGrowthRate >= 0 ? '+' : ''}{overview.userGrowthRate || 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Total</p>
                <p className="font-semibold text-surface-900">{overview.totalUsers || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Contacts by status */}
          <motion.div variants={fadeUp} className="card card-body">
            <h2 className="font-semibold text-surface-900 mb-4">Contact messages</h2>
            <div className="space-y-3">
              {[
                { key: 'new',     label: 'New',     color: 'bg-amber-400' },
                { key: 'read',    label: 'Read',    color: 'bg-blue-400' },
                { key: 'replied', label: 'Replied', color: 'bg-green-400' },
                { key: 'closed',  label: 'Closed',  color: 'bg-surface-300' },
              ].map(({ key, label, color }) => {
                const count = contactStatus[key] || 0
                const total = overview.totalContacts || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600">{label}</span>
                      <span className="font-medium text-surface-900">{count}</span>
                    </div>
                    <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <Link to="/admin/contacts" className="btn-secondary btn-sm w-full justify-center mt-5">
              View all messages <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* Recent users */}
        <motion.div variants={fadeUp} className="card card-body">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-surface-900">Recent registrations</h2>
            <Link to="/admin/users" className="btn-ghost btn-sm">View all <ArrowRight size={13} /></Link>
          </div>

          {isLoading ? (
            <ListSkeleton rows={4} />
          ) : recent.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-8">No users yet</p>
          ) : (
            <div className="divide-y divide-surface-100">
              {recent.map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={u.name} src={u.avatar?.url} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">{u.name}</p>
                    <p className="text-xs text-surface-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {u.role === 'admin' && <span className="badge-primary text-[10px]">Admin</span>}
                    {u.isEmailVerified && u.isPhoneVerified
                      ? <CheckCircle size={14} className="text-green-500" />
                      : <Clock size={14} className="text-amber-400" />
                    }
                    <span className="text-xs text-surface-400 hidden sm:block">{timeAgo(u.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/services/new', label: 'Add new service',   icon: '➕', desc: 'Create a service listing' },
            { to: '/admin/contacts',     label: `${overview.unreadContacts || 0} unread messages`, icon: '📬', desc: 'View contact submissions' },
            { to: '/admin/users',        label: 'Manage users',      icon: '👥', desc: 'View and edit user accounts' },
          ].map(({ to, label, icon, desc }) => (
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
