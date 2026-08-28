"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

/** Redirige a /auth/login si no hay sesión, una vez leído el estado persistido. */
export default function Protected() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [hasHydrated, isAuthenticated, router])
  return null
}