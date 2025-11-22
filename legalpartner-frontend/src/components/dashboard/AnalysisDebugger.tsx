"use client";
import React from 'react';
import type { ContractAnalysis } from '@/types';

interface AnalysisDebuggerProps {
  analyses: ContractAnalysis[];
}

export default function AnalysisDebugger({ analyses }: AnalysisDebuggerProps) {
  const sampleAnalyses = analyses.slice(0, 5); // Solo mostrar 5 para no sobrecargar

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="mb-3">
        <h4 className="font-semibold text-yellow-800 mb-2">🐛 Debug - Estructura de Datos</h4>
        <p className="text-sm text-yellow-700">
          Este componente te ayuda a ver la estructura real de tus análisis. 
          <button 
            onClick={() => console.log('All analyses:', analyses)}
            className="ml-2 text-yellow-800 underline hover:no-underline"
          >
            Ver todos en consola
          </button>
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm">
          <strong>Total análisis:</strong> {analyses.length}
        </div>
        
        {sampleAnalyses.length > 0 && (
          <div>
            <h5 className="font-medium text-yellow-800 mb-2">Muestra de análisis:</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sampleAnalyses.map((analysis, index) => (
                <div key={analysis.analysis_id} className="bg-white p-3 rounded border text-xs">
                  <div><strong>ID:</strong> {analysis.analysis_id.slice(0, 8)}...</div>
                  <div><strong>Estado:</strong> {analysis.analysis_state}</div>
                  <div><strong>Favorabilidad:</strong> {analysis.average_favorability ?? 'null/undefined'}</div>
                  <div><strong>Riesgo:</strong> {analysis.risk_score ?? 'null/undefined'}</div>
                  <div><strong>Total Cláusulas:</strong> {analysis.total_clauses ?? 'null/undefined'}</div>
                  <div><strong>Cláusulas Marcadas:</strong> {analysis.flagged_clauses ?? 'null/undefined'}</div>
                  <div><strong>Tipo Contrato:</strong> {analysis.contract_type ?? 'null/undefined'}</div>
                  <div><strong>Documento:</strong> {analysis.document_name || analysis.document_filename || 'No name'}</div>
                  
                  {index === 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">Ver objeto completo</summary>
                      <pre className="mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(analysis, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}