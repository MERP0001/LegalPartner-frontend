'use client';
import Protected from '@/components/layout/Protected';
import AnalysisList from '@/components/analysis/AnalysisList';

export default function AnalysisPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Protected />
      <div className='h-2 bg-primary-600' />
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Análisis de Contratos
          </h1>
          <p className='text-gray-600'>
            Gestiona y revisa todos tus análisis de contratos
          </p>
        </div>

        <AnalysisList />
      </div>
    </div>
  );
}
