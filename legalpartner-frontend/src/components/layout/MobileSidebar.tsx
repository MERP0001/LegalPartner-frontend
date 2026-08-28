"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, LayoutDashboard, FileText, BarChart3, UploadCloud, LogIn, LogOut } from 'lucide-react'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const auth = useAuthStore()
  const router = useRouter()
  if (!auth.isAuthenticated) return null

  return (
    <div className='md:hidden'>
      <button
        aria-label='Abrir menú'
        onClick={() => setOpen(true)}
        className='p-2 rounded-lg bg-white/15 ring-1 ring-white/30 text-white hover:bg-white/20 transition'
      >
        <Menu className='w-5 h-5 transition-transform duration-200 hover:scale-110' />
      </button>

      {open && (
        <div className='fixed inset-0 z-50'>
          <div className='absolute inset-0 bg-black/40' onClick={() => setOpen(false)} />
          <div className='absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-danger-600 via-danger-700 to-danger-800 text-white shadow-2xl flex flex-col'>
            <div className='px-4 py-4 border-b border-white/20 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-9 h-9 rounded-lg bg-white/15 ring-1 ring-white/30 flex items-center justify-center'>
                  <span className='text-white font-bold'>LP</span>
                </div>
                <span className='text-lg font-semibold'>LegalPartner</span>
              </div>
              <button aria-label='Cerrar menú' onClick={() => setOpen(false)} className='p-2 hover:bg-white/10 rounded'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <nav className='flex-1 px-2 py-4 space-y-1'>
              <Link href='/dashboard' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200' onClick={() => setOpen(false)}>
                <LayoutDashboard className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                <span>Dashboard</span>
              </Link>
              <Link href='/contracts' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200' onClick={() => setOpen(false)}>
                <FileText className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                <span>Contracts</span>
              </Link>
              <Link href='/analysis' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200' onClick={() => setOpen(false)}>
                <BarChart3 className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                <span>Analysis</span>
              </Link>
              <Link href='/upload' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200' onClick={() => setOpen(false)}>
                <UploadCloud className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                <span>Upload</span>
              </Link>
            </nav>
            <div className='px-3 py-4 border-t border-white/20'>
              {!auth.isAuthenticated ? (
                <Link href='/auth/login' className='group flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200' onClick={() => setOpen(false)}>
                  <LogIn className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                  <span>Iniciar sesión</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    auth.logout()
                    router.push('/')
                  }}
                  className='group flex w-full items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition duration-200'
                >
                  <LogOut className='w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-1' />
                  <span>Cerrar sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}