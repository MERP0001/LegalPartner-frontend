import { Button } from '@/components/common/Button';
import { FileText, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-md'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Shield className='h-8 w-8 text-primary-600' />
              <h1 className='text-2xl font-bold text-gray-900'>LegalPartner</h1>
            </div>
            <nav className='hidden md:flex items-center space-x-4'>
              <Button variant='ghost'>Iniciar Sesión</Button>
              <Button>Registrarse</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <h2 className='text-5xl font-bold text-gray-900 mb-6'>
            Análisis Inteligente de{' '}
            <span className='text-primary-600'>Contratos Legales</span>
          </h2>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            Utiliza inteligencia artificial avanzada para analizar contratos,
            identificar riesgos y obtener recomendaciones legales en minutos.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' className='text-lg px-8 py-3'>
              Comenzar Análisis
            </Button>
            <Button variant='outline' size='lg' className='text-lg px-8 py-3'>
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className='mt-24 grid md:grid-cols-3 gap-8'>
          <div className='text-center p-6 rounded-lg bg-white shadow-sm'>
            <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FileText className='h-8 w-8 text-primary-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Upload Rápido</h3>
            <p className='text-gray-600'>
              Sube documentos PDF y procésalos automáticamente con OCR avanzado
            </p>
          </div>
          
          <div className='text-center p-6 rounded-lg bg-white shadow-sm'>
            <div className='w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='h-8 w-8 text-secondary-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Análisis IA</h3>
            <p className='text-gray-600'>
              Análisis profundo de cláusulas con métricas de riesgo y favorabilidad
            </p>
          </div>
          
          <div className='text-center p-6 rounded-lg bg-white shadow-sm'>
            <div className='w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Shield className='h-8 w-8 text-warning-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Recomendaciones</h3>
            <p className='text-gray-600'>
              Recibe recomendaciones específicas y referencias legales precisas
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-16 bg-white rounded-lg shadow-sm p-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-3xl font-bold text-primary-600'>1,200+</div>
              <div className='text-gray-600'>Contratos Analizados</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-secondary-600'>95%</div>
              <div className='text-gray-600'>Precisión OCR</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-warning-600'>3 min</div>
              <div className='text-gray-600'>Tiempo Promedio</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-danger-600'>500+</div>
              <div className='text-gray-600'>Usuarios Activos</div>
            </div>
          </div>
        </div>
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