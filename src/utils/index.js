// src/utils/index.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

/** Merge Tailwind classes safely */
export const cn = (...inputs) => twMerge(clsx(inputs))

/** Format ISO date string */
export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—'
  try { return format(typeof date === 'string' ? parseISO(date) : date, fmt) }
  catch { return '—' }
}

/** Relative time (e.g. "3 days ago") */
export const timeAgo = (date) => {
  if (!date) return '—'
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }) }
  catch { return '—' }
}

/** Extract error message from axios error */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred'
  if (typeof error === 'string') return error
  const serverMsg = error?.response?.data?.message
  const validationErrors = error?.response?.data?.errors
  if (validationErrors?.length) {
    return validationErrors.map((e) => e.message).join(', ')
  }
  return serverMsg || error.message || 'An unexpected error occurred'
}

/** Debounce function */
export const debounce = (fn, delay = 400) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Format currency */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === 0) return 'Free'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Truncate text */
export const truncate = (str, len = 120) =>
  str?.length > len ? str.slice(0, len) + '…' : str

/** Get avatar initials */
export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

/** Sleep helper */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))


export const buildQuery = (params) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  })
  return q.toString()
}
