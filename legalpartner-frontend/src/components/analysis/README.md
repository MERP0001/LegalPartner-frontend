# Sistema de Monitoreo de Análisis en Tiempo Real

## 📋 Descripción General

Este sistema proporciona un monitoreo de progreso de análisis de contratos en tiempo real. Incluye:

- ✅ Barra de progreso visual con estados
- ✅ Monitoreo flotante global (widget)
- ✅ Integración con polling automático
- ✅ Gestión de estado con Zustand
- ✅ Manejo de errores y reintentos

## 🏗️ Arquitectura

### Componentes

#### 1. **AnalysisProgressBar.tsx**
Componente principal que muestra la barra de progreso detallada.

**Props:**
- `analysis: ContractAnalysis | null` - Datos del análisis
- `isPolling: boolean` - Si está en progreso
- `error?: string | null` - Mensaje de error
- `onRetry?: () => void` - Callback para reintentar

**Ejemplo:**
```tsx
<AnalysisProgressBar
  analysis={analysis}
  isPolling={isPolling}
  error={error}
  onRetry={() => handleRetry()}
/>
```

#### 2. **AnalysisMonitor.tsx**
Widget flotante para monitorear análisis desde cualquier página.

**Props:**
- `analysisId: string` - ID del análisis a monitorear
- `onClose?: () => void` - Callback al cerrar
- `onComplete?: (analysis: ContractAnalysis) => void` - Callback al completar
- `showCloseButton?: boolean` - Mostrar botón cerrar (default: true)

**Ejemplo:**
```tsx
<AnalysisMonitor
  analysisId="uuid-del-analisis"
  onClose={() => console.log('Cerrado')}
  showCloseButton={true}
/>
```

#### 3. **AnalysisMonitorProvider.tsx**
Proveedor global que renderiza el monitor automáticamente.

**Uso:**
Ya está integrado en el `layout.tsx` principal, no requiere importación adicional.

### Stores

#### `analysisMonitorStore.ts`
Store Zustand para gestionar el monitoreo global.

**Métodos:**
- `startMonitoring(analysisId: string)` - Inicia monitoreo
- `stopMonitoring()` - Detiene monitoreo
- `isMonitoring()` - Verifica si hay análisis en monitoreo
- `activeAnalysis` - Estado actual del análisis

**Ejemplo:**
```tsx
import { useAnalysisMonitorStore } from '@/store/analysisMonitorStore';

// Obtener estado
const activeAnalysis = useAnalysisMonitorStore((state) => state.activeAnalysis);

// Iniciar monitoreo
useAnalysisMonitorStore.getState().startMonitoring('uuid-del-analisis');

// Detener monitoreo
useAnalysisMonitorStore.getState().stopMonitoring();
```

### Hooks

#### `useAnalysisMonitor.ts`
Hook personalizado para facilitar el uso del store.

**Returns:**
- `startMonitoring(analysisId: string)` - Inicia monitoreo
- `stopMonitoring()` - Detiene monitoreo
- `isMonitoring()` - Verifica estado
- `activeAnalysisId` - ID del análisis activo

**Ejemplo:**
```tsx
import { useAnalysisMonitor } from '@/hooks/useAnalysisMonitor';

const { startMonitoring, stopMonitoring, activeAnalysisId } = useAnalysisMonitor();

// Iniciar monitoreo
startMonitoring('uuid-del-analisis');

// Detener monitoreo
stopMonitoring();

// Verificar si hay análisis en monitoreo
if (activeAnalysisId) {
  console.log('Analizando:', activeAnalysisId);
}
```

#### `useAnalysisPolling.ts`
Hook existente que maneja el polling automático (ya integrado).

## 🔄 Flujos de Uso

### Flujo 1: Análisis desde StartAnalysisForm

```
1. Usuario selecciona documento
2. Usuario envía formulario
3. Se inicia análisis en backend
4. Se obtiene analysis_id
5. startMonitoring(analysis_id) se llama automáticamente
6. useAnalysisPolling comienza a hacer polling
7. AnalysisMonitor aparece en pantalla (widget flotante)
8. Usuario ve progreso en tiempo real
9. Puede navegar a otras páginas (el monitor permanece)
10. Al completar, se cierra automáticamente en 5 segundos
```

### Flujo 2: Monitorear análisis existente

```tsx
import { useAnalysisMonitor } from '@/hooks/useAnalysisMonitor';
import AnalysisMonitor from '@/components/analysis/AnalysisMonitor';

export default function MyPage() {
  const analysisId = 'uuid-del-analisis-en-progreso';
  
  return (
    <div>
      {/* El monitor aparecerá automáticamente en pantalla */}
      <AnalysisMonitor
        analysisId={analysisId}
        onComplete={(analysis) => {
          console.log('Análisis completado:', analysis);
        }}
      />
    </div>
  );
}
```

### Flujo 3: Control manual desde componente

```tsx
import { useAnalysisMonitor } from '@/hooks/useAnalysisMonitor';

export default function Dashboard() {
  const { startMonitoring, stopMonitoring, activeAnalysisId } = useAnalysisMonitor();

  const handleStartAnalysis = async () => {
    // Iniciar análisis en backend
    const response = await startAnalysisAPI('document-id');
    
    // Activar monitoreo global
    startMonitoring(response.analysis_id);
  };

  return (
    <div>
      <button onClick={handleStartAnalysis}>
        Iniciar Análisis
      </button>
      
      {activeAnalysisId && (
        <p>Análisis en progreso: {activeAnalysisId}</p>
      )}
    </div>
  );
}
```

## 🎨 Estados del Análisis

El sistema define estos estados:

| Estado | Progreso | Descripción |
|--------|----------|-------------|
| `queued` | 10% | En cola esperando procesamiento |
| `processing` | 50% | Procesando cláusulas con IA |
| `processed` | 90% | Finalizando y generando resultados |
| `completed` | 100% | Análisis completado exitosamente |
| `failed` | 0% | Error en el análisis |

## 📊 Detalles Mostrados

Durante el análisis, se muestra:

- **Barra de progreso** con porcentaje
- **Estado actual** con descripción
- **Total de cláusulas** identificadas
- **Cláusulas problemáticas** (flagged)
- **Favorabilidad general** del contrato
- **Puntuación de riesgo**
- **Tiempo de procesamiento** (al completar)
- **Resumen ejecutivo** (al completar)

## ⚙️ Configuración

### Intervalo de Polling

El hook `useAnalysisPolling` realiza polling cada **5 segundos** por defecto.

Para cambiar:
```tsx
const { analysis } = useAnalysisPolling({
  analysisId,
  enabled: true,
  interval: 3000, // 3 segundos
  // ...
});
```

### Auto-cierre del Monitor

El `AnalysisMonitor` se cierra automáticamente **5 segundos** después de completar.

Para cambiar:
```tsx
// En AnalysisMonitor.tsx, modificar:
setTimeout(() => {
  handleClose();
}, 10000); // 10 segundos
```

## 🐛 Troubleshooting

### El monitor no aparece

1. Verificar que `AnalysisMonitorProvider` esté en `layout.tsx`
2. Verificar que se llamó a `startMonitoring(analysisId)`
3. Verificar en React DevTools → Zustand → `useAnalysisMonitorStore`

### El polling se detiene

1. Verificar que `enabled: true` en `useAnalysisPolling`
2. Verificar token de autenticación válido
3. Revisar console para errores de red

### El análisis no completa

1. Revisar logs del backend
2. Verificar que el estado cambio a `completed` o `processed`
3. Revisar en la página `/analysis/{id}` para detalles

## 📝 Ejemplo Completo

```tsx
"use client";
import { StartAnalysisForm } from '@/components/analysis/StartAnalysisForm';
import { useRouter } from 'next/navigation';

export default function AnalysisPage() {
  const router = useRouter();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Análisis de Contratos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario en la izquierda */}
        <div>
          <StartAnalysisForm
            onAnalysisComplete={(analysisId) => {
              console.log('Análisis iniciado:', analysisId);
              // El monitor aparecerá automáticamente
            }}
            onAnalysisFailed={(error) => {
              console.error('Error:', error);
            }}
          />
        </div>

        {/* Información en la derecha */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Cómo funciona:</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>✓ Selecciona un documento procesado</li>
            <li>✓ Indica el tipo de contrato</li>
            <li>✓ Haz clic en "Iniciar Análisis"</li>
            <li>✓ Verás el progreso en tiempo real</li>
            <li>✓ Puedes navegar mientras se procesa</li>
            <li>✓ Al completar, podrás ver los resultados</li>
          </ul>
        </div>
      </div>

      {/* El AnalysisMonitor aparecerá automáticamente en pantalla */}
    </div>
  );
}
```

## 🚀 Próximos Pasos Sugeridos

1. **Agregar notificaciones**: Toast cuando completa análisis
2. **Historial**: Widget mostrando últimos análisis
3. **Exportación**: Descargar resultados del análisis
4. **Comparación**: Comparar múltiples análisis
5. **Webhooks**: Notificaciones push cuando completa

---

## 📚 Referencias

- Hook `useAnalysisPolling`: Maneja el polling automático
- Store `useAnalysisMonitorStore`: Gestiona estado global
- API `startAnalysis()`: Inicia análisis en backend
- Tipos `ContractAnalysis`: Estructura de datos del análisis
