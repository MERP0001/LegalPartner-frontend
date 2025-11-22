"use client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ContractAnalysis } from '@/types';
import './charts.css';

interface ScatterDataPoint {
  x: number; // favorability
  y: number; // risk_score
  size: number; // total_clauses
  contractType: string;
  documentName: string;
  analysis_id: string;
}

interface RiskFavorabilityScatterProps {
  analyses: ContractAnalysis[];
  onPointClick?: (analysis: ContractAnalysis) => void;
}

// Colores por tipo de contrato
const contractTypeColors = {
  rent: '#8884d8',
  mortgage: '#82ca9d',
  services: '#ffc658',
  employment: '#ff7300',
  transfers: '#8dd1e1',
  default: '#d084d0'
};

// Función para obtener color por tipo de contrato
const getColorByContractType = (contractType?: string): string => {
  if (!contractType) return contractTypeColors.default;
  return contractTypeColors[contractType as keyof typeof contractTypeColors] || contractTypeColors.default;
};

// Tooltip personalizado
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ScatterDataPoint;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ScatterDataPoint;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-1">
          {data.documentName}
        </p>
        <p className="text-sm text-gray-600">
          Tipo: <span className="capitalize">{data.contractType}</span>
        </p>
        <p className="text-sm text-gray-600">
          Favorabilidad: <span className="font-medium">{data.x.toFixed(1)}/10</span>
        </p>
        <p className="text-sm text-gray-600">
          Riesgo: <span className="font-medium">{data.y.toFixed(1)}/10</span>
        </p>
        <p className="text-sm text-gray-600">
          Cláusulas: <span className="font-medium">{data.size}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function RiskFavorabilityScatter({ 
  analyses, 
  onPointClick 
}: RiskFavorabilityScatterProps) {
  // Transformar datos para el scatter plot
  const scatterData: ScatterDataPoint[] = analyses
    .filter(analysis => {
      const hasValidData = (
        (analysis.average_favorability !== undefined && analysis.average_favorability !== null) && 
        (analysis.risk_score !== undefined && analysis.risk_score !== null) &&
        (analysis.analysis_state === 'completed' || analysis.analysis_state === 'processed')
      );
      
      // Debug log para entender qué datos tenemos
      if (!hasValidData) {
        console.log('Analysis filtered out:', {
          id: analysis.analysis_id,
          state: analysis.analysis_state,
          favorability: analysis.average_favorability,
          risk: analysis.risk_score
        });
      }
      
      return hasValidData;
    })
    .map(analysis => ({
      x: analysis.average_favorability || 0,
      y: analysis.risk_score || 0,
      size: Math.max(analysis.total_clauses || 1, 1), // Mínimo 1 para visibilidad
      contractType: analysis.contract_type || 'default',
      documentName: analysis.document_name || 
                   analysis.document_filename || 
                   `Análisis ${analysis.analysis_id.slice(0, 8)}`,
      analysis_id: analysis.analysis_id
    }));

  console.log('Scatter data processed:', {
    totalAnalyses: analyses.length,
    validScatterData: scatterData.length,
    sampleData: scatterData.slice(0, 3)
  });

  const handlePointClick = (data: ScatterDataPoint) => {
    if (onPointClick) {
      const analysis = analyses.find(a => a.analysis_id === data.analysis_id);
      if (analysis) {
        onPointClick(analysis);
      }
    }
  };

  if (scatterData.length === 0) {
    return (
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Favorabilidad vs Riesgo
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos suficientes para mostrar la gráfica
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Favorabilidad vs Riesgo
        </h3>
        <div className="text-sm text-gray-500">
          {scatterData.length} análisis completados
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Favorabilidad"
              domain={[0, 10]}
              tickFormatter={(value) => `${value.toFixed(1)}`}
              label={{ 
                value: 'Favorabilidad (0-10)', 
                position: 'insideBottom', 
                offset: -10,
                style: { textAnchor: 'middle' }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Riesgo"
              domain={[0, 10]}
              tickFormatter={(value) => `${value.toFixed(1)}`}
              label={{ 
                value: 'Riesgo (0-10)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              data={scatterData} 
              fill="#8884d8"
              onClick={handlePointClick}
              style={{ cursor: onPointClick ? 'pointer' : 'default' }}
            >
              {scatterData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColorByContractType(entry.contractType)}
                  r={Math.min(Math.max(entry.size / 2, 4), 12)} // Radio entre 4 y 12
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda de tipos de contrato */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {Object.keys(contractTypeColors).map((type) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`chart-legend-dot contract-type-${type}`} />
            <span className="capitalize text-gray-600">
              {type === 'default' ? 'Otros' : type}
            </span>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-3 text-xs text-gray-500">
        El tamaño de cada punto representa el número de cláusulas del contrato.
      </div>
    </div>
  );
}