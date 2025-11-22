"use client";
import React, { useState } from 'react';
import { getFavorabilityDefinition } from '@/lib/favorabilityDefinitions';

interface FavorabilityBadgeProps {
  label: string;
  className?: string;
  showTooltip?: boolean;
}

export default function FavorabilityBadge({ 
  label, 
  className = "", 
  showTooltip = true 
}: FavorabilityBadgeProps) {
  const [showDefinition, setShowDefinition] = useState(false);
  
  const getColorClasses = (label: string) => {
    switch (label) {
      case 'Seguro':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Atención':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Crítico':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const definition = getFavorabilityDefinition(label);

  return (
    <div className="relative inline-block">
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getColorClasses(label)} ${className} ${
          showTooltip && definition ? 'cursor-help' : ''
        }`}
        onMouseEnter={() => showTooltip && setShowDefinition(true)}
        onMouseLeave={() => setShowDefinition(false)}
        title={showTooltip ? definition : undefined}
      >
        {label}
      </span>
      
      {showTooltip && definition && showDefinition && (
        <div className="absolute z-10 w-64 p-3 mt-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
          <div className="font-medium text-gray-900 mb-1">{label}</div>
          <div className="text-gray-700">{definition}</div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
}