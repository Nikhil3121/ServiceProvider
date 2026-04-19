// src/components/notifications/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useNotifStore } from '@/store/notifStore'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const { notifications, markAllRead, markRead, unreadCount } = useNotifStore()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-surface-800 hover:bg-surface-700 border border-surface-700 transition-all"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-300">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-800">
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-surface-400 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <NotifItem key={n.id} notif={n} onRead={markRead} onClose={() => setOpen(false)} />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-surface-800 px-4 py-3">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotifItem({ notif, onRead, onClose }) {
  const ICONS = {
    booking: '📅',
    payment: '💳',
    review: '⭐',
    message: '💬',
    system: '🔔',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex gap-3 px-4 py-3 hover:bg-surface-800 cursor-pointer transition-colors border-b border-surface-800/50 last:border-0 ${
        !notif.read ? 'bg-primary-500/5' : ''
      }`}
      onClick={() => {
        onRead(notif.id)
        onClose()
      }}
    >
      <div className="text-xl flex-shrink-0 mt-0.5">
        {ICONS[notif.type] || ICONS.system}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-white leading-snug">{notif.title}</p>
          {!notif.read && (
            <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{notif.message}</p>
        <p className="text-xs text-surface-500 mt-1">{notif.timeAgo}</p>
      </div>
    </motion.div>
  )
}