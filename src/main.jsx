// src/main.jsx  ← REPLACE YOUR EXISTING main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          {/* Sonner Toast — place ONCE at root level */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e2028',
                border: '1px solid #374151',
                color: '#f3f4f6',
                borderRadius: '12px',
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)

// ─────────────────────────────────────────────
// HOW TO USE TOASTS ANYWHERE IN YOUR APP:
//
// import { toast } from 'sonner'
//
// toast.success('Booking confirmed!')
// toast.error('Payment failed. Try again.')
// toast.loading('Processing...')
// toast.info('You have a new message')
// toast.promise(apiCall(), {
//   loading: 'Saving...',
//   success: 'Saved!',
//   error: 'Save failed.'
// })