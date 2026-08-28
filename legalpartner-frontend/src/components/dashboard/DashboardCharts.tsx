'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listAnalyses, getApiErrorMessage, getErrorMessage } from '@/lib/api';
import type { ContractAnalysis } from '@/types';
import { isAnalysisCompleted } from '@/lib/labels';
import {
  RiskFavorabilityScatter,
  RiskDistributionChart,
} from '@/components/dashboard/charts';

interface DashboardChartsProps {
  className?: string;
}

export default function DashboardCharts({ className }: DashboardChartsProps) {
  const [analyses, setAnalyses] = useState<ContractAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const response = await listAnalyses({
          page: 1,
          page_size: 100, // Obtener más datos para mejores gráficas
        });

        if (response.success && response.data) {
          setAnalyses(response.data);
        } else {
          setError(getErrorMessage(response, 'Error al cargar análisis'));
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Error de conexión'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const handleAnalysisClick = (analysis: ContractAnalysis) => {
    router.push(`/analysis/${analysis.analysis_id}`);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        {/* Loading skeleton */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='p-6 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse'>
            <div className='w-48 h-6 mb-4 bg-gray-200 rounded'></div>
            <div className='h-64 bg-gray-100 rounded'></div>
          </div>
          <div className='p-6 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse'>
            <div className='w-48 h-6 mb-4 bg-gray-200 rounded'></div>
            <div className='h-64 bg-gray-100 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className || ''}`}>
        <div className='p-4 border border-red-200 rounded-lg bg-red-50'>
          <div className='flex'>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                Error al cargar las gráficas
              </h3>
              <div className='mt-2 text-sm text-red-700'>{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedAnalyses = analyses.filter(analysis =>
    isAnalysisCompleted(analysis.analysis_state)
  );

  if (completedAnalyses.length === 0) {
    return (
      <div className={`${className || ''}`}>
        <div className='p-6 border border-blue-200 rounded-lg bg-blue-50'>
          <div className='text-center'>
            <h3 className='mb-2 text-lg font-medium text-blue-900'>
              No hay análisis completados
            </h3>
            <p className='text-sm text-blue-700'>
              Las gráficas se mostrarán una vez que tengas análisis completados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Scatter Plot: Favorabilidad vs Riesgo */}
        <RiskFavorabilityScatter
          analyses={completedAnalyses}
          onPointClick={handleAnalysisClick}
        />

        {/* Histograma: Distribución de Riesgo */}
        <RiskDistributionChart analyses={completedAnalyses} />
      </div>

      {/* Información adicional */}
      <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center justify-between'>
            <span>Total de análisis cargados:</span>
            <span className='font-medium'>{analyses.length}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Análisis completados:</span>
            <span className='font-medium'>{completedAnalyses.length}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Análisis en proceso:</span>
            <span className='font-medium'>
              {analyses.length - completedAnalyses.length}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Con datos de favorabilidad:</span>
            <span className='font-medium'>
              {
                completedAnalyses.filter(
                  a =>
                    a.overall_favorability !== undefined &&
                    a.overall_favorability !== null
                ).length
              }
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Con puntuación de riesgo:</span>
            <span className='font-medium'>
              {
                completedAnalyses.filter(
                  a => a.risk_score !== undefined && a.risk_score !== null
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
