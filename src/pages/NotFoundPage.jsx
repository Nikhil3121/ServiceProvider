// src/pages/NotFoundPage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[10rem] font-display font-bold text-surface-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center">
              <Search size={36} className="text-primary-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-display font-semibold text-surface-900 mb-3">
          Page not found
        </h1>
        <p className="text-surface-500 leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary btn-lg"
          >
            <ArrowLeft size={18} /> Go back
          </button>
          <Link to="/" className="btn-primary btn-lg">
            <Home size={18} /> Back to home
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-surface-200">
          <p className="text-sm text-surface-500 mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[['Services', '/services'], ['Contact', '/contact'], ['Dashboard', '/dashboard']].map(([label, to]) => (
              <Link key={to} to={to} className="px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 hover:border-primary-300 hover:text-primary-700 transition-all">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
