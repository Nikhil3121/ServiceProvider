// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User, Shield } from 'lucide-react'
import { cn } from '@/utils'
import useAuthStore from '@/store/authStore'
import { useLogout, useScrollTop, useOnClickOutside } from '@/hooks'
import { useRef } from 'react'
import Logo from '@/components/ui/Logo'
import Avatar from '@/components/ui/Avatar'


const navLinks = [
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, isAdmin } = useAuthStore()
  const { logout } = useLogout()
  const isScrolled = useScrollTop(20)
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  useOnClickOutside(menuRef, () => setUserMenuOpen(false))

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-40 transition-all duration-300',
      isScrolled
        ? 'glass border-b border-surface-200/80 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <Avatar name={user?.name} src={user?.avatar?.url} size="xs" />
                  <span className="text-sm font-medium text-surface-800 max-w-[120px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={cn('text-surface-400 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-surface-200 shadow-card-hover overflow-hidden"
                    >
                      <div className="p-3 border-b border-surface-100">
                        <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
                        <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin() && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                            <Shield size={15} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-700 hover:bg-surface-100 transition-colors">
                          <LayoutDashboard size={15} /> Dashboard
                        </Link>
                        <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-700 hover:bg-surface-100 transition-colors">
                          <User size={15} /> Profile
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth/login" className="btn-ghost btn-sm">Log in</Link>
                <Link to="/auth/signup" className="btn-primary btn-sm">Get started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 text-surface-600 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-surface-200 overflow-hidden"
          >
            <div className="container-page py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => cn(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-700 hover:bg-surface-100'
                )}>{label}</NavLink>
              ))}
              <div className="pt-3 mt-3 border-t border-surface-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="btn-secondary w-full justify-center">Dashboard</Link>
                    <button onClick={() => logout()} className="btn-ghost w-full justify-center text-red-600">Log out</button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="btn-secondary w-full justify-center">Log in</Link>
                    <Link to="/auth/signup" className="btn-primary w-full justify-center">Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
