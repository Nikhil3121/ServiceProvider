// src/layouts/DashboardLayout.jsx
import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, KeyRound, Briefcase, Users, MessageSquare,
  Settings, LogOut, Menu, X, ChevronRight, Bell, Shield
} from 'lucide-react'
import { cn } from '@/utils'
import useAuthStore from '@/store/authStore'
import { useLogout } from '@/hooks'
import Logo from '@/components/ui/Logo'
import Avatar from '@/components/ui/Avatar'

const userNav = [
  { to: '/dashboard',                  icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/profile',          icon: User,            label: 'Profile' },
  { to: '/dashboard/change-password',  icon: KeyRound,        label: 'Security' },
]

const adminNav = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/services', icon: Briefcase,       label: 'Services' },
  { to: '/admin/users',    icon: Users,           label: 'Users' },
  { to: '/admin/contacts', icon: MessageSquare,   label: 'Messages' },
]

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    end
    onClick={onClick}
    className={({ isActive }) => cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
      isActive
        ? 'bg-primary-700 text-white shadow-sm'
        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
    )}
  >
    {({ isActive }) => (
      <>
        <Icon size={16} className={cn('shrink-0', !isActive && 'group-hover:scale-105 transition-transform')} />
        <span className="flex-1">{label}</span>
        {isActive && <ChevronRight size={14} className="opacity-60" />}
      </>
    )}
  </NavLink>
)

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAdmin } = useAuthStore()
  const { logout, isPending } = useLogout()

  const navItems = isAdmin() ? adminNav : userNav

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-100">
        <Logo size="sm" />
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
          <Avatar name={user?.name} src={user?.avatar?.url} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {isAdmin() ? (
                <span className="badge-primary text-[10px] px-1.5 py-0.5"><Shield size={8} className="inline" /> Admin</span>
              ) : (
                <span className="text-xs text-surface-500 truncate">{user?.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-surface-400">
          {isAdmin() ? 'Admin Panel' : 'My Account'}
        </p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}

        {isAdmin() && (
          <>
            <div className="my-3 border-t border-surface-100" />
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-surface-400">Account</p>
            {userNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-surface-100">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={16} className="shrink-0" />
          {isPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-surface-200 fixed inset-y-0 left-0 z-30">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"
              >
                <X size={18} />
              </button>
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>
            <div className="w-px h-5 bg-surface-200 mx-1" />
            <NavLink to="/dashboard/profile">
              <Avatar name={user?.name} src={user?.avatar?.url} size="xs" className="cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" />
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
