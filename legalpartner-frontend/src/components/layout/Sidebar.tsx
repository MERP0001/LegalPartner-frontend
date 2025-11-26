"use client"
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { LayoutDashboard, FileText, BarChart3, UploadCloud, LogOut } from 'lucide-react'

export default function Sidebar() {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return null
  return (
    <aside className='fixed top-0 left-0 flex-col hidden h-full text-white shadow-lg md:flex w-72 bg-gradient-to-b from-danger-600 via-danger-700 to-danger-800'>
      <div className='flex items-center gap-2 px-4 py-4 border-b border-white/20'>
        <div className='flex items-center justify-center rounded-lg w-9 h-9 bg-white/15 ring-1 ring-white/30'>
          <span className='font-bold text-white'>LP</span>
        </div>
        <span className='text-lg font-semibold'>LegalPartner</span>
      </div>
      <nav className='flex-1 px-2 py-4 space-y-1'>
        <Link href='/dashboard' className='flex items-center gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'>
          <LayoutDashboard className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Panel</span>
        </Link>
        <Link href='/contracts' className='flex items-center gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'>
          <FileText className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Contratos</span>
        </Link>
        <Link href='/analysis' className='flex items-center gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'>
          <BarChart3 className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Análisis</span>
        </Link>
        <Link href='/upload' className='flex items-center gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'>
          <UploadCloud className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Subir</span>
        </Link>
      </nav>
      <div className='px-3 py-4 border-t border-white/20'>
        {!auth.isAuthenticated ? (
          <></>
        ) : (
          <button
            onClick={() => {
              auth.logout()
              if (typeof window !== 'undefined') window.location.href = '/'
            }}
            className='flex items-center w-full gap-2 px-3 py-2 transition duration-200 rounded-lg group text-white/90 hover:bg-white/10 hover:text-white'
          >
            <LogOut className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  )
}