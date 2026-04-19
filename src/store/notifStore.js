// src/store/notifStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNotifStore = create(
  persist(
    (set, get) => ({
      notifications: [
        // Sample data — replace with API calls
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your plumbing service is confirmed for tomorrow at 10:00 AM.',
          timeAgo: '2 min ago',
          read: false,
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Received',
          message: 'You received ₹850 for the electrical job.',
          timeAgo: '1 hr ago',
          read: false,
        },
        {
          id: '3',
          type: 'review',
          title: 'New Review',
          message: 'Rahul left you a 5-star review! "Excellent work, very professional."',
          timeAgo: '3 hr ago',
          read: true,
        },
      ],

      get unreadCount() {
        return get().notifications.filter((n) => !n.read).length
      },

      addNotification: (notif) =>
        set((s) => ({
          notifications: [
            { id: Date.now().toString(), read: false, timeAgo: 'Just now', ...notif },
            ...s.notifications,
          ],
        })),

      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    { name: 'nexus-notifications' }
  )
)