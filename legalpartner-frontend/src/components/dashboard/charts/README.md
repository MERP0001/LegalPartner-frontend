# Dashboard Charts - Gráficas de Análisis

Este directorio contiene los componentes de gráficas para el dashboard del sistema LegalPartner.

## Componentes Implementados

### 1. RiskFavorabilityScatter
**Archivo**: `RiskFavorabilityScatter.tsx`

Scatter plot que muestra la relación entre favorabilidad y riesgo de los contratos analizados.

**Props**:
- `analyses: ContractAnalysis[]` - Array de análisis completados
- `onPointClick?: (analysis: ContractAnalysis) => void` - Callback cuando se hace clic en un punto

**Características**:
- Colores por tipo de contrato
- Tamaño de puntos basado en número de cláusulas
- Tooltip informativo
- Navegación al hacer clic en puntos
- Leyenda con tipos de contratos

### 2. RiskDistributionChart
**Archivo**: `RiskDistributionChart.tsx`

Histograma que muestra la distribución de análisis por nivel de riesgo.

**Props**:
- `analyses: ContractAnalysis[]` - Array de análisis completados

**Características**:
- 4 categorías de riesgo (Bajo, Medio-Bajo, Medio-Alto, Alto)
- Estadísticas resumidas (promedio, bajo riesgo, alto riesgo)
- Colores diferenciados por nivel de riesgo
- Tooltips con detalles y porcentajes

### 3. DashboardCharts
**Archivo**: `../DashboardCharts.tsx`

Componente contenedor que integra ambas gráficas y maneja la carga de datos.

**Props**:
- `className?: string` - Clases CSS adicionales

**Características**:
- Carga automática de análisis desde API
- Estados de carga y error
- Layout responsivo
- Navegación integrada

## Uso

### Importación
```typescript
import { RiskFavorabilityScatter, RiskDistributionChart } from '@/components/dashboard/charts';
// O usar el componente contenedor
import DashboardCharts from '@/components/dashboard/DashboardCharts';
```

### Uso Individual
```typescript
<RiskFavorabilityScatter 
  analyses={completedAnalyses}
  onPointClick={(analysis) => router.push(`/analysis/${analysis.analysis_id}`)}
/>

<RiskDistributionChart 
  analyses={completedAnalyses}
/>
```

### Uso con Contenedor
```typescript
<DashboardCharts className="mt-8" />
```

## Dependencias

- **Recharts**: Librería de gráficas para React
- **Tailwind CSS**: Para estilos
- **Lucide React**: Para iconos

## Estructura de Datos

Las gráficas esperan datos del tipo `ContractAnalysis` con las siguientes propiedades clave:

```typescript
interface ContractAnalysis {
  analysis_id: string;
  analysis_state: AnalysisState; // debe ser 'completed' o 'processed'
  average_favorability?: number; // 0-10
  risk_score?: number; // 0-10
  total_clauses: number;
  contract_type?: ContractType;
  document_name?: string;
  // ... otros campos
}
```

## Personalización

### Colores
Los colores se definen en `charts.css` y pueden ser modificados:

```css
/* Tipos de contrato */
.contract-type-rent { background-color: #8884d8; }
.contract-type-mortgage { background-color: #82ca9d; }
/* ... */

/* Niveles de riesgo */
.risk-range-low { background-color: #10b981; }
.risk-range-medium-low { background-color: #84cc16; }
/* ... */
```

### Rangos de Riesgo
Los rangos se definen en `RiskDistributionChart.tsx`:

```typescript
const riskRanges = [
  { min: 0, max: 2.5, label: 'Bajo', color: '#10b981' },
  { min: 2.5, max: 5, label: 'Medio-Bajo', color: '#84cc16' },
  { min: 5, max: 7.5, label: 'Medio-Alto', color: '#f59e0b' },
  { min: 7.5, max: 10, label: 'Alto', color: '#ef4444' }
];
```

## Estados

### Loading
Ambas gráficas muestran estados de carga apropiados cuando no hay datos.

### Error
El componente `DashboardCharts` maneja errores de API y los muestra al usuario.

### Sin Datos
Cuando no hay análisis completados, se muestra un mensaje informativo.

## Responsividad

Las gráficas están diseñadas para ser completamente responsivas:
- En dispositivos móviles: layout de columna única
- En desktop: layout de dos columnas
- Gráficas que se adaptan al tamaño del contenedor

## Performance

- Las gráficas solo se renderizan con análisis completados
- Se usa `ResponsiveContainer` para optimizar el renderizado
- Los datos se filtran eficientemente antes del renderizado