// src/layouts/AuthLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '@/components/ui/Logo'

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-noise opacity-50" />

        <div className="relative">
          <Logo variant="light" />
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <blockquote className="text-2xl font-display text-white/90 leading-relaxed mb-6">
              "Transforming businesses through expert professional services — crafted with precision."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-400/20 border border-accent-400/40 flex items-center justify-center text-accent-300 text-sm font-medium">
                N
              </div>
              <div>
                <p className="text-white font-medium text-sm">Nexus Team</p>
                <p className="text-white/50 text-xs">Professional Services</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative flex gap-8">
          {[['2,000+', 'Happy Clients'], ['150+', 'Projects Done'], ['5★', 'Average Rating']].map(([stat, label]) => (
            <div key={label}>
              <p className="text-2xl font-display font-semibold text-white">{stat}</p>
              <p className="text-white/50 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
