"use client";
import { useAnalysisStats } from '@/hooks/useAnalysisStats';
import type { ContractAnalysis } from '@/types';
import { isAnalysisCompleted } from '@/lib/labels';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import './charts.css';

interface RiskFavorabilityScatterProps {
  analyses: ContractAnalysis[];
  onPointClick?: (analysis: ContractAnalysis) => void;
}

export default function RiskFavorabilityScatter({
  analyses,
}: RiskFavorabilityScatterProps) {
  // Filtrar análisis completados
  const completedAnalyses = analyses.filter((analysis) => isAnalysisCompleted(analysis.analysis_state));

  const stats = useAnalysisStats(completedAnalyses);

  if (completedAnalyses.length === 0) {
    return (
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Análisis
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay análisis completados para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen General - Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Riesgo Promedio */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Riesgo Promedio</p>
          </div>
          <p className="text-3xl font-bold text-blue-700">{stats.averageRisk}/10</p>
          <p className="text-xs text-blue-600 mt-2">
            {stats.totalAnalyses} contratos analizados
          </p>
        </div>

        {/* Favorabilidad Promedio */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">Favorabilidad</p>
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.averageFavorability}/10</p>
          <p className="text-xs text-green-600 mt-2">
            Promedio de todos los análisis
          </p>
        </div>

        {/* Rango de Riesgo */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-orange-900">Rango de Riesgo</p>
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {stats.lowestRisk} - {stats.highestRisk}
          </div>
          <p className="text-xs text-orange-600 mt-2">
            Mínimo y máximo riesgo
          </p>
        </div>

        {/* Cláusulas Problemáticas */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">Problemas</p>
          </div>
          <p className="text-3xl font-bold text-red-700">{stats.totalFlaggedClauses}</p>
          <p className="text-xs text-red-600 mt-2">
            De {stats.totalClauses} cláusulas totales
          </p>
        </div>
      </div>

      {/* Distribución de Riesgos */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por Nivel de Riesgo
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Riesgo Bajo */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">{stats.lowRiskCount}</p>
              <p className="text-sm text-green-600 mt-1">Riesgo Bajo (≤3)</p>
              <p className="text-xs text-green-500 mt-2">
                {Math.round((stats.lowRiskCount / stats.totalAnalyses) * 100)}%
              </p>
            </div>
          </div>

          {/* Riesgo Medio */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-700">{stats.mediumRiskCount}</p>
              <p className="text-sm text-yellow-600 mt-1">Riesgo Medio (3-6)</p>
              <p className="text-xs text-yellow-500 mt-2">
                {Math.round((stats.mediumRiskCount / stats.totalAnalyses) * 100)}%
              </p>
            </div>
          </div>

          {/* Riesgo Alto */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">{stats.highRiskCount}</p>
              <p className="text-sm text-red-600 mt-1">Riesgo Alto (&gt;6)</p>
              <p className="text-xs text-red-500 mt-2">
                {Math.round((stats.highRiskCount / stats.totalAnalyses) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis por Favorabilidad */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Favorabilidad
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Favorables */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">
                {stats.favorableCount}
              </p>
              <p className="text-sm text-green-600 mt-1">Contratos Favorables</p>
              <p className="text-xs text-green-500 mt-2">
                {Math.round((stats.favorableCount / stats.totalAnalyses) * 100)}%
              </p>
            </div>
          </div>

          {/* Desfavorables */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">
                {stats.unfavorableCount}
              </p>
              <p className="text-sm text-red-600 mt-1">Contratos Desfavorables</p>
              <p className="text-xs text-red-500 mt-2">
                {Math.round((stats.unfavorableCount / stats.totalAnalyses) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
