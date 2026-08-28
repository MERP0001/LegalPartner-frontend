'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useLogout';

export default function AuthNav() {
  const auth = useAuthStore();
  const logout = useLogout();
  if (!auth.hasHydrated || !auth.isAuthenticated) {
    return (
      <div className='flex items-center gap-4'>
        <Link href='/auth/login' className='text-white/90 hover:text-white'>
          Iniciar sesión
        </Link>
        <Link href='/auth/register' className='text-white/90 hover:text-white'>
          Registrarse
        </Link>
      </div>
    );
  }
  return (
    <div className='flex items-center gap-3'>
      <span className='inline-flex items-center rounded-full px-3 py-1 text-xs bg-white/20 text-white ring-1 ring-white/30'>
        {auth.user?.first_name || auth.user?.email || 'Usuario'}
      </span>
      <button onClick={logout} className='text-white/90 hover:text-white'>
        Cerrar sesión
      </button>
    </div>
  );
}
