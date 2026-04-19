// src/pages/provider/ProviderDashboard.jsx
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '@/store/authStore'

const EARNINGS_DATA = [
  { month: 'Jan', earnings: 12400 },
  { month: 'Feb', earnings: 18200 },
  { month: 'Mar', earnings: 15800 },
  { month: 'Apr', earnings: 21000 },
  { month: 'May', earnings: 19500 },
  { month: 'Jun', earnings: 25800 },
  { month: 'Jul', earnings: 23400 },
]

const RECENT_BOOKINGS = [
  { id: 'BK001', customer: 'Priya Sharma', service: 'Plumbing - Pipe Repair', date: 'Apr 19, 10:00 AM', amount: 850, status: 'confirmed' },
  { id: 'BK002', customer: 'Rahul Mehta', service: 'Electrical - Wiring Fix', date: 'Apr 20, 2:00 PM', amount: 1200, status: 'pending' },
  { id: 'BK003', customer: 'Aisha Khan', service: 'Plumbing - Water Heater', date: 'Apr 18, 11:00 AM', amount: 2200, status: 'completed' },
  { id: 'BK004', customer: 'Vikram Singh', service: 'Plumbing - Tap Repair', date: 'Apr 17, 9:00 AM', amount: 450, status: 'completed' },
]

const STATUS_STYLES = {
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  completed: 'bg-green-500/10 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const STATS = [
  { label: 'Total Earnings', value: '₹1,36,200', sub: '+12% this month', color: 'text-green-400' },
  { label: 'Total Bookings', value: '284', sub: '18 this month', color: 'text-blue-400' },
  { label: 'Avg. Rating', value: '4.8★', sub: 'Based on 120 reviews', color: 'text-amber-400' },
  { label: 'Completion Rate', value: '96%', sub: 'Above platform avg', color: 'text-primary-400' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
}

export default function ProviderDashboard() {
  const { user } = useAuthStore()

  return (
    <>
      <Helmet>
        <title>Provider Dashboard — Nexus</title>
      </Helmet>

      <div className="min-h-screen bg-surface-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">
                Good morning, {user?.name?.split(' ')[0] || 'Provider'} 👋
              </h1>
              <p className="text-surface-400 text-sm mt-1">Here's what's happening with your business today.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/provider/availability"
                className="px-4 py-2.5 rounded-xl border border-surface-700 text-surface-300 hover:bg-surface-800 text-sm transition-colors"
              >
                Set Availability
              </Link>
              <Link
                to="/provider/services/new"
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
              >
                + Add Service
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-colors"
              >
                <p className="text-xs text-surface-400 uppercase tracking-wide mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs text-surface-500">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart + Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Earnings Chart */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="lg:col-span-2 bg-surface-900 border border-surface-800 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Earnings Overview</h2>
                <select className="text-xs text-surface-400 bg-surface-800 border border-surface-700 rounded-lg px-2.5 py-1.5 outline-none">
                  <option>Last 7 months</option>
                  <option>Last 12 months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={EARNINGS_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1e2028', border: '1px solid #374151', borderRadius: 12, color: '#fff', fontSize: 13 }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Earnings']}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={2} fill="url(#earningsGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="bg-surface-900 border border-surface-800 rounded-2xl p-5"
            >
              <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { icon: '📅', label: 'View Bookings', sub: '2 new requests', to: '/provider/bookings' },
                  { icon: '💬', label: 'Messages', sub: '3 unread', to: '/provider/chat' },
                  { icon: '⭐', label: 'Reviews', sub: '120 total', to: '/provider/reviews' },
                  { icon: '💳', label: 'Earnings', sub: '₹1,36,200 total', to: '/provider/earnings' },
                  { icon: '👤', label: 'Edit Profile', sub: 'Keep it updated', to: '/provider/profile' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-colors group"
                  >
                    <span className="text-lg w-8">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors">{action.label}</p>
                      <p className="text-xs text-surface-500 truncate">{action.sub}</p>
                    </div>
                    <span className="text-surface-600 group-hover:text-surface-400 transition-colors text-xs">→</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Bookings */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
              <h2 className="text-base font-semibold text-white">Recent Bookings</h2>
              <Link to="/provider/bookings" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-surface-800">
              {RECENT_BOOKINGS.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-800/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-500/15 border border-primary-500/25 flex items-center justify-center text-primary-300 text-sm font-semibold flex-shrink-0">
                    {booking.customer.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{booking.customer}</p>
                    <p className="text-xs text-surface-400 truncate">{booking.service}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm text-surface-300">{booking.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-white">₹{booking.amount}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}