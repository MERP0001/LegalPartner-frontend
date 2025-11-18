"use client"
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function Protected() {
  const auth = useAuthStore()
  useEffect(() => {
    if (typeof window === 'undefined') return
    let hasToken = false
    try {
      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw)
        hasToken = !!parsed?.state?.token
      }
    } catch {}
    const isAuth = auth.isAuthenticated || hasToken
    if (!isAuth) {
      window.location.href = '/auth/login'
    }
  }, [auth.isAuthenticated])
  return null
}