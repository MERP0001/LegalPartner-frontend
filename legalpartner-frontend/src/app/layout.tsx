import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
        <div className='relative flex min-h-screen flex-col'>
          <div className='flex-1'>{children}</div>
        </div>
      </body>
    </html>
  );
}
