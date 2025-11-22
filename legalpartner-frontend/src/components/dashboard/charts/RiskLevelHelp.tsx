"use client";
import React, { useState } from 'react';
import { Info, X, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface RiskLevelHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const riskLevels = [
  {
    level: 'Bajo (0.0 - 2.5)',
    color: 'bg-green-100 border-green-300 text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    description: 'Cláusulas mayoritariamente favorables; pocos factores de riesgo aislados; sin omisiones críticas; estructura completa; alta confianza.',
    recommendations: [
      'Excelente estado contractual',
      'Proceder con confianza',
      'Revisión rutinaria recomendada'
    ]
  },
  {
    level: 'Medio-Bajo (2.5 - 5.0)',
    color: 'bg-lime-100 border-lime-300 text-lime-800',
    icon: <CheckCircle className="w-5 h-5 text-lime-600" />,
    description: 'Algunas cláusulas neutras o ligeramente desfavorables; factores suaves (ambigüedad menor); 1 posible mejora estructural; confianza adecuada.',
    recommendations: [
      'Estado contractual aceptable',
      'Revisión de cláusulas neutras',
      'Mejoras menores recomendadas'
    ]
  },
  {
    level: 'Neutral (No aplicable en esta escala)',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-600" />,
    description: 'Balance entre favorables y desfavorables; varios factores moderados; pequeñas omisiones (definiciones, precisión en plazos); mejora recomendable.',
    recommendations: [
      'Equilibrio contractual',
      'Atención a definiciones',
      'Precisar plazos y condiciones'
    ]
  },
  {
    level: 'Medio-Alto (5.0 - 7.5)',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    description: 'Varias cláusulas desfavorables; factores repetidos (responsabilidades abiertas, falta de límites); omisiones relevantes (resolución de disputas, salida); concentración de riesgos; alerta preventiva.',
    recommendations: [
      'Requiere atención inmediata',
      'Revisar responsabilidades',
      'Incluir mecanismos de salida'
    ]
  },
  {
    level: 'Alto (7.5 - 10.0)',
    color: 'bg-red-100 border-red-300 text-red-800',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    description: 'Múltiples cláusulas críticas; factores severos (penalizaciones desproporcionadas, indemnización ilimitada, ambigüedad en obligaciones clave); omisiones estructurales (jurisdicción, fuerza mayor, confidencialidad); riesgo contractual inmediato.',
    recommendations: [
      'ACCIÓN INMEDIATA REQUERIDA',
      'Renegociar términos críticos',
      'Consultar asesoría legal especializada'
    ]
  }
];

export default function RiskLevelHelp({ isOpen, onClose }: RiskLevelHelpProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Guía de Niveles de Riesgo Contractual
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Cada análisis de contrato recibe una puntuación de riesgo del 0 al 10. 
            Aquí te explicamos qué significa cada nivel y qué acciones recomendamos.
          </p>
          
          <div className="space-y-6">
            {riskLevels.map((level, index) => (
              <div key={index} className={`border-2 rounded-lg p-4 ${level.color}`}>
                <div className="flex items-start gap-3 mb-3">
                  {level.icon}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{level.level}</h4>
                    <p className="text-sm leading-relaxed mb-3">
                      {level.description}
                    </p>
                    
                    <div>
                      <h5 className="font-medium mb-2">Recomendaciones:</h5>
                      <ul className="text-sm space-y-1">
                        {level.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Importante</h5>
                <p className="text-sm text-blue-800">
                  Esta puntuación es una guía basada en el análisis automatizado. 
                  Para contratos de alto valor o complejidad, siempre recomendamos 
                  la revisión por parte de un profesional legal especializado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}