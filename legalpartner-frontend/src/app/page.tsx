"use client";
import { Button } from '@/components/common/Button';
import { FileText, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const auth = useAuthStore();
  const router = useRouter();
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-danger-50'>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto card-premium'>
          <div className='card-premium-inner'>
          <h2 className='text-5xl font-bold text-gray-900 mb-6'>
            Análisis Inteligente de{' '}
            <span className='text-primary-600'>Contratos Legales</span>
          </h2>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            Utiliza inteligencia artificial avanzada para analizar contratos,
            identificar riesgos y obtener recomendaciones legales en minutos.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='text-lg px-8 py-3 shadow-sm'
              onClick={() => router.push(auth.isAuthenticated ? '/upload' : '/auth/login')}
            >
              {auth.hasHydrated && auth.isAuthenticated ? 'Comenzar Análisis' : 'Inicia sesión para comenzar análisis'}
            </Button>
          </div>
          </div>
        </div>

        {/* Features */}
        <div className='mt-24 grid md:grid-cols-3 gap-8'>
          <div className='card-premium'>
            <div className='card-premium-inner text-center p-6'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='h-8 w-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Upload Rápido</h3>
              <p className='text-gray-600'>
                Sube documentos PDF y procésalos automáticamente con OCR avanzado
              </p>
            </div>
          </div>
          
          <div className='card-premium'>
            <div className='card-premium-inner text-center p-6'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Zap className='h-8 w-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Análisis IA</h3>
              <p className='text-gray-600'>
                Análisis profundo de cláusulas con métricas de riesgo y favorabilidad
              </p>
            </div>
          </div>
          
          <div className='card-premium'>
            <div className='card-premium-inner text-center p-6'>
              <div className='w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield className='h-8 w-8 text-warning-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Recomendaciones</h3>
              <p className='text-gray-600'>
                Recibe recomendaciones específicas y referencias legales precisas
              </p>
            </div>
          </div>
        </div>

        {/* Stats eliminadas por ahora para evitar datos no reales */}
      </main>

      {/* Footer */}
      <footer className='border-t bg-white mt-16'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-gray-600'>
            <p>&copy; 2025 LegalPartner. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}