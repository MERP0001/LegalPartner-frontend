import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ChatbotWidget from '@/components/chat/ChatbotWidget';
import AuthNav from '@/components/layout/AuthNav';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import MainContent from '@/components/layout/MainContent';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LegalPartner - Análisis Inteligente de Contratos',
  description: 'Plataforma de análisis inteligente de contratos legales con IA',
  keywords: ['legal', 'contratos', 'análisis', 'inteligencia artificial', 'derecho'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className={inter.variable}>
      <body className='font-sans antialiased'>
        <div className='relative min-h-screen flex flex-col'>
          <header className='md:hidden sticky top-0 z-40 bg-danger-600 text-white border-b border-danger-700/30 shadow-sm'>
            <div className='container py-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-lg bg-white/15 ring-1 ring-white/30 flex items-center justify-center'>
                  <span className='text-white font-bold'>LP</span>
                </div>
                <span className='text-lg font-semibold text-white'>LegalPartner</span>
              </div>
              <div className='flex items-center gap-3'>
                <AuthNav />
                <MobileSidebar />
              </div>
            </div>
          </header>
          <Sidebar />
          <MainContent>{children}</MainContent>
          <ChatbotWidget />
          <footer className='border-t bg-white'>
            <div className='container py-6 text-center text-gray-600'>
              <p>&copy; 2025 LegalPartner. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
