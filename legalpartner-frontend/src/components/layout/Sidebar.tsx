"use client"
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { LayoutDashboard, FileText, BarChart3, UploadCloud, LogOut } from 'lucide-react'

export default function Sidebar() {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return null
  return (
    <aside className='hidden md:flex fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-danger-600 via-danger-700 to-danger-800 text-white flex-col shadow-lg'>
      <div className='px-4 py-4 border-b border-white/20 flex items-center gap-2'>
        <div className='w-9 h-9 rounded-lg bg-white/15 ring-1 ring-white/30 flex items-center justify-center'>
          <span className='text-white font-bold'>LP</span>
        </div>
        <span className='text-lg font-semibold'>LegalPartner</span>
      </div>
      <nav className='flex-1 px-2 py-4 space-y-1'>
        <Link href='/dashboard' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'>
          <LayoutDashboard className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Panel</span>
        </Link>
        <Link href='/contracts' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'>
          <FileText className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Contratos</span>
        </Link>
        <Link href='/analysis' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'>
          <BarChart3 className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
          <span>Análisis</span>
        </Link>
        <Link href='/upload' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'>
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
            className='group flex w-full items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'
          >
            <LogOut className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  )
}