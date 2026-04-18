// src/hooks/index.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/authStore'
import { authApi } from '@/services/api'
import { getErrorMessage } from '@/utils'

// ── useDebounce ────────────────────────────────────────────────────────────
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ── useMediaQuery ──────────────────────────────────────────────────────────
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ── useOnClickOutside ─────────────────────────────────────────────────────
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler(e)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// ── useLocalStorage ───────────────────────────────────────────────────────
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })
  const setStoredValue = useCallback((val) => {
    try {
      setValue(val)
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch (e) { console.error(e) }
  }, [key])
  return [value, setStoredValue]
}

// ── useLogout ─────────────────────────────────────────────────────────────
export const useLogout = () => {
  const { clearAuth, refreshToken } = useAuthStore()
  const navigate = useNavigate()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authApi.logout({ refreshToken }),
    onSettled: () => {
      clearAuth()
      navigate('/auth/login', { replace: true })
      toast.success('Logged out successfully')
    },
  })

  return { logout, isPending }
}

// ── useScrollTop ──────────────────────────────────────────────────────────
export const useScrollTop = (threshold = 100) => {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return isScrolled
}

// ── usePrevious ───────────────────────────────────────────────────────────
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => { ref.current = value })
  return ref.current
}
