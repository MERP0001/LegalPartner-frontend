// Definiciones de favorabilidad
export const favorabilityDefinitions = {
  Seguro: 'Sin señales de exposición relevante.',
  Atención: 'Revisión recomendada de puntos sensibles.',
  Crítico: 'Riesgo operativo o legal significativo.',
} as const;

// Función helper para obtener la definición
export function getFavorabilityDefinition(label: string): string {
  return (
    favorabilityDefinitions[label as keyof typeof favorabilityDefinitions] || ''
  );
}
