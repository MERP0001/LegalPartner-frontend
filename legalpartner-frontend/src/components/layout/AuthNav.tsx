"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AuthNav() {
  const auth = useAuthStore()
  const router = useRouter()
  if (!auth.isAuthenticated) {
    return (
      <div className='flex items-center gap-4'>
        <Link href='/auth/login' className='text-white/90 hover:text-white'>Login</Link>
        <Link href='/auth/register' className='text-white/90 hover:text-white'>Register</Link>
      </div>
    )
  }
  return (
    <div className='flex items-center gap-3'>
      <span className='inline-flex items-center rounded-full px-3 py-1 text-xs bg-white/20 text-white ring-1 ring-white/30'>
        {auth.user?.first_name || auth.user?.email || 'Usuario'}
      </span>
      <button
        onClick={() => {
          auth.logout();
          router.push('/');
        }}
        className='text-white/90 hover:text-white'
      >
        Cerrar sesión
      </button>
    </div>
  )
}