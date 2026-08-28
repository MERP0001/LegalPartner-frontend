'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useLogout';
import { NAV_ITEMS } from './navItems';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const auth = useAuthStore();
  const logout = useLogout();
  if (!auth.hasHydrated || !auth.isAuthenticated) return null;
  return (
    <aside className='fixed top-0 left-0 flex-col hidden h-full text-white shadow-lg md:flex w-72 bg-gradient-to-b from-danger-600 via-danger-700 to-danger-800'>
      <div className='flex items-center gap-2 px-4 py-4 border-b border-white/20'>
        <div className='flex items-center justify-center rounded-lg w-9 h-9 bg-white/15 ring-1 ring-white/30'>
          <span className='font-bold text-white'>LP</span>
        </div>
        <span className='text-lg font-semibold'>LegalPartner</span>
      </div>
      <nav
        className='flex-1 px-2 py-4 space-y-1'
        aria-label='Navegación principal'
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className='flex items-center gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'
          >
            <Icon
              className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1'
              aria-hidden='true'
            />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className='px-3 py-4 border-t border-white/20'>
        <button
          onClick={logout}
          className='flex items-center w-full gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'
        >
          <LogOut
            className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1'
            aria-hidden='true'
          />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
