'use client';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Info } from 'lucide-react';
import type { ContractAnalysis } from '@/types';
import { isAnalysisCompleted } from '@/lib/labels';
import './charts.css';
import RiskLevelHelp from './RiskLevelHelp';

interface RiskDistributionData {
  range: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
  detailedDescription: string;
}

interface RiskDistributionChartProps {
  analyses: ContractAnalysis[];
}

// Configuración de rangos de riesgo
const riskRanges = [
  {
    min: 0,
    max: 2.5,
    label: 'Bajo',
    color: '#10b981',
    description: 'Riesgo mínimo',
    detailedDescription:
      'Cláusulas mayoritariamente favorables; pocos factores de riesgo aislados; sin omisiones críticas; estructura completa; alta confianza.',
  },
  {
    min: 2.5,
    max: 5,
    label: 'Medio-Bajo',
    color: '#84cc16',
    description: 'Riesgo controlable',
    detailedDescription:
      'Algunas cláusulas neutras o ligeramente desfavorables; factores suaves (ambigüedad menor); 1 posible mejora estructural; confianza adecuada.',
  },
  {
    min: 5,
    max: 7.5,
    label: 'Medio-Alto',
    color: '#f59e0b',
    description: 'Requiere atención',
    detailedDescription:
      'Varias cláusulas desfavorables; factores repetidos (responsabilidades abiertas, falta de límites); omisiones relevantes (resolución de disputas, salida); concentración de riesgos; alerta preventiva.',
  },
  {
    min: 7.5,
    max: 10,
    label: 'Alto',
    color: '#ef4444',
    description: 'Riesgo crítico',
    detailedDescription:
      'Múltiples cláusulas críticas; factores severos (penalizaciones desproporcionadas, indemnización ilimitada, ambigüedad en obligaciones clave); omisiones estructurales (jurisdicción, fuerza mayor, confidencialidad); riesgo contractual inmediato.',
  },
];

// Tooltip personalizado
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RiskDistributionData;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as RiskDistributionData;
    return (
      <div className='bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-sm'>
        <p className='font-semibold text-gray-900 mb-2'>Riesgo {label}</p>
        <p className='text-sm text-gray-600 mb-2'>
          Análisis: <span className='font-medium'>{data.count}</span>
        </p>
        <p className='text-sm text-gray-600 mb-3'>
          Porcentaje:{' '}
          <span className='font-medium'>{data.percentage.toFixed(1)}%</span>
        </p>
        <div className='border-t border-gray-200 pt-2'>
          <p className='text-xs text-gray-700 leading-relaxed'>
            {data.detailedDescription}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function RiskDistributionChart({
  analyses,
}: RiskDistributionChartProps) {
  const [showHelp, setShowHelp] = useState(false);

  // Filtrar análisis completados con puntuación de riesgo
  const completedAnalyses = analyses.filter(
    analysis =>
      isAnalysisCompleted(analysis.analysis_state) &&
      analysis.risk_score !== undefined &&
      analysis.risk_score !== null
  );

  // Calcular distribución de riesgos
  const distribution: RiskDistributionData[] = riskRanges.map(range => {
    const count = completedAnalyses.filter(analysis => {
      const riskScore = analysis.risk_score || 0;
      return riskScore >= range.min && riskScore < range.max;
    }).length;

    const percentage =
      completedAnalyses.length > 0
        ? (count / completedAnalyses.length) * 100
        : 0;

    return {
      range: range.label,
      count,
      percentage,
      color: range.color,
      description: range.description,
      detailedDescription: range.detailedDescription,
    };
  });

  // Calcular estadísticas adicionales
  const totalAnalyses = completedAnalyses.length;
  const averageRisk =
    totalAnalyses > 0
      ? completedAnalyses.reduce(
          (sum, analysis) => sum + (analysis.risk_score || 0),
          0
        ) / totalAnalyses
      : 0;

  const highRiskCount = distribution
    .slice(-2)
    .reduce((sum, item) => sum + item.count, 0);
  const lowRiskCount = distribution
    .slice(0, 2)
    .reduce((sum, item) => sum + item.count, 0);

  if (totalAnalyses === 0) {
    return (
      <div className='bg-white p-6 border border-gray-200 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Distribución de Riesgo
        </h3>
        <div className='flex items-center justify-center h-64 text-gray-500'>
          No hay datos de riesgo para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 border border-gray-200 rounded-lg shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Distribución de Riesgo
          </h3>
          <button
            onClick={() => setShowHelp(true)}
            className='flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
            title='Ver guía de niveles de riesgo'
          >
            <Info className='w-4 h-4' />
            Guía
          </button>
        </div>
        <div className='text-sm text-gray-500'>{totalAnalyses} análisis</div>
      </div>

      {/* Estadísticas resumidas */}
      <div className='grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3'>
        <div className='text-center p-3 bg-gray-50 rounded-lg'>
          <div className='text-2xl font-bold text-gray-900'>
            {averageRisk.toFixed(1)}
          </div>
          <div className='text-xs text-gray-600'>Riesgo Promedio</div>
        </div>
        <div className='text-center p-3 bg-green-50 rounded-lg'>
          <div className='text-2xl font-bold text-green-600'>
            {lowRiskCount}
          </div>
          <div className='text-xs text-gray-600'>Bajo Riesgo</div>
        </div>
        <div className='text-center p-3 bg-red-50 rounded-lg'>
          <div className='text-2xl font-bold text-red-600'>{highRiskCount}</div>
          <div className='text-xs text-gray-600'>Alto Riesgo</div>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className='h-64 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={distribution}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='range' tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: 'Número de Análisis',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='count' radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda con porcentajes */}
      <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
        {distribution.map((item, index) => {
          const getRiskRangeClass = (range: string) => {
            const rangeMap: { [key: string]: string } = {
              Bajo: 'risk-range-low',
              'Medio-Bajo': 'risk-range-medium-low',
              'Medio-Alto': 'risk-range-medium-high',
              Alto: 'risk-range-high',
            };
            return rangeMap[range] || 'risk-range-low';
          };

          return (
            <div
              key={index}
              className='flex items-center justify-between p-2 bg-gray-50 rounded'
            >
              <div className='flex items-center gap-2'>
                <div
                  className={`chart-legend-square ${getRiskRangeClass(item.range)}`}
                />
                <span className='text-gray-700'>{item.range}</span>
              </div>
              <span className='font-medium text-gray-900'>
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal de ayuda */}
      <RiskLevelHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
