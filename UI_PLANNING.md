# Planificación de UI para LegalPartner

## Índice
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura de Vistas](#arquitectura-de-vistas)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Flujo de Navegación](#flujo-de-navegación)
- [Características UX](#características-ux)
- [Paleta de Colores](#paleta-de-colores)
- [Estructura de Archivos](#estructura-de-archivos)

---

## Stack Tecnológico

### Framework y Librerías Principales
- **Framework**: React 18+ con TypeScript
- **Estado Global**: Redux Toolkit o Zustand
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI) o Chakra UI
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios con interceptores
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts o Chart.js
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React o Hero Icons

---

## Arquitectura de Vistas

### 1. Layout Principal

```
┌─────────────────────────────────────────────────────┐
│ Header                                              │
│ [Logo] LegalPartner    [Docs] [Análisis] [Perfil]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│                   CONTENIDO                         │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Footer - © 2025 LegalPartner                       │
└─────────────────────────────────────────────────────┘
```

**Componentes del Layout:**
- **Navbar**: Con logo, navegación principal, avatar de usuario
- **Sidebar** (opcional): Para navegación secundaria en desktop
- **Breadcrumbs**: Para mostrar ubicación actual
- **Footer**: Links legales, contacto

---

### 2. Dashboard / Home
**Ruta**: `/dashboard`

Vista principal después del login con estadísticas rápidas y accesos directos.

```
┌─────────────────────────────────────────────────────┐
│  Bienvenido, [Nombre Usuario]                      │
│  Plan: [Premium] 💎                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 ESTADÍSTICAS RÁPIDAS                           │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │ 12       │ 8        │ 75%      │ 4.5/10   │    │
│  │Documentos│Análisis  │Confianza │Riesgo    │    │
│  └──────────┴──────────┴──────────┴──────────┘    │
│                                                     │
│  ⚡ ACCIONES RÁPIDAS                               │
│  [📤 Subir Documento]  [📝 Nuevo Análisis]         │
│                                                     │
│  📄 DOCUMENTOS RECIENTES                           │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Contrato_Alquiler.pdf                    │  │
│  │    Subido: Hace 2 horas • Procesado ✓       │  │
│  │    [Ver] [Analizar]                         │  │
│  ├─────────────────────────────────────────────┤  │
│  │ 📄 Contrato_Servicios.pdf                   │  │
│  │    Subido: Ayer • Procesado ✓               │  │
│  │    [Ver] [Analizar]                         │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  📊 ANÁLISIS RECIENTES                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ Contrato_Alquiler.pdf                       │  │
│  │ ⚠️ Riesgo: 6.5/10 | Favorabilidad: Media   │  │
│  │ 3 cláusulas requieren atención              │  │
│  │ [Ver Detalles]                              │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Elementos clave:**
- Resumen de métricas en cards visuales
- Botones de acciones rápidas
- Lista de documentos recientes (últimos 5)
- Lista de análisis recientes (últimos 3)
- Indicadores visuales de estado y riesgo

---

### 3. Vista de Documentos
**Ruta**: `/documents`

Lista completa de documentos con filtros y búsqueda.

```
┌─────────────────────────────────────────────────────┐
│  📚 MIS DOCUMENTOS                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [📤 Subir Documento]                              │
│                                                     │
│  Filtros: [Todos ▼] [Procesados ▼] [Fecha ▼]      │
│  Buscar: [________🔍]                              │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │                 TABLA DE DOCUMENTOS          │  │
│  ├────────┬─────────┬──────────┬────────┬─────┤  │
│  │Nombre  │Estado   │Fecha     │Tamaño  │     │  │
│  ├────────┼─────────┼──────────┼────────┼─────┤  │
│  │📄 Cont │✅ Proc  │03/11/2025│2.5 MB  │[⋮] │  │
│  │  rato_ │  esado  │10:30 AM  │        │     │  │
│  │  Alq...│         │          │        │     │  │
│  ├────────┼─────────┼──────────┼────────┼─────┤  │
│  │📄 Cont │⏳ Proc  │03/11/2025│1.8 MB  │[⋮] │  │
│  │  rato_ │  esando │09:15 AM  │        │     │  │
│  │  Serv..│         │          │        │     │  │
│  ├────────┼─────────┼──────────┼────────┼─────┤  │
│  │📄 Hipo │✅ Proc  │02/11/2025│3.2 MB  │[⋮] │  │
│  │  teca_ │  esado  │14:20 PM  │        │     │  │
│  │  Casa..│         │          │        │     │  │
│  └────────┴─────────┴──────────┴────────┴─────┘  │
│                                                     │
│  Página 1 de 3        [◀] [1] [2] [3] [▶]        │
└─────────────────────────────────────────────────────┘
```

**Menú contextual [⋮]:**
- Ver detalles
- Descargar
- Analizar contrato
- Reprocesar OCR
- Eliminar

**Funcionalidades:**
- Tabla ordenable por columna
- Filtros múltiples combinables
- Búsqueda en tiempo real
- Paginación
- Acciones por documento

---

### 4. Subida de Documento
**Ruta**: `/documents/upload` (Modal o página dedicada)

```
┌─────────────────────────────────────────────────────┐
│  📤 SUBIR DOCUMENTO                         [✕]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│      ┌───────────────────────────────────┐        │
│      │                                   │        │
│      │       📄                          │        │
│      │                                   │        │
│      │   Arrastra tu archivo aquí       │        │
│      │   o haz clic para seleccionar    │        │
│      │                                   │        │
│      │   Formatos: PDF                  │        │
│      │   Tamaño máximo: 10MB            │        │
│      │                                   │        │
│      └───────────────────────────────────┘        │
│                                                     │
│  Tipo de contrato (opcional):                      │
│  [Seleccionar tipo ▼]                              │
│   • Alquiler                                       │
│   • Hipoteca                                       │
│   • Servicios                                      │
│   • Empleo                                         │
│   • Transferencias                                 │
│                                                     │
│  ☑️ Procesar OCR automáticamente                   │
│                                                     │
│                    [Cancelar] [Subir]              │
└─────────────────────────────────────────────────────┘
```

**Estados durante la subida:**
1. **Seleccionado**: Muestra preview del archivo
2. **Subiendo**: Barra de progreso con porcentaje
3. **Procesando**: Spinner con "Extrayendo texto..."
4. **Completado**: Checkmark verde + botón "Analizar ahora"
5. **Error**: Mensaje de error con opción de reintentar

**Características:**
- Drag & Drop funcional
- Validación de tipo y tamaño en cliente
- Preview del archivo seleccionado
- Progreso visual de subida
- Manejo de errores amigable

---

### 5. Detalle de Documento
**Ruta**: `/documents/:id`

```
┌─────────────────────────────────────────────────────┐
│  ← Volver  |  📄 Contrato_Alquiler.pdf             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 INFORMACIÓN DEL DOCUMENTO                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ Nombre: Contrato_Alquiler.pdf               │  │
│  │ Estado: ✅ Procesado                        │  │
│  │ Subido: 03/11/2025 10:30 AM                │  │
│  │ Tamaño: 2.5 MB                              │  │
│  │ Páginas: 12                                 │  │
│  │ Confianza OCR: 87%                          │  │
│  │ Tipo: Alquiler                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [📥 Descargar] [📝 Analizar] [🔄 Reprocesar]     │
│                                                     │
│  📄 TEXTO EXTRAÍDO                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │                                             │  │
│  │ CONTRATO DE ARRENDAMIENTO                  │  │
│  │                                             │  │
│  │ Entre los suscritos...                     │  │
│  │ [Texto completo del documento]             │  │
│  │                                             │  │
│  │                                             │  │
│  │ (Scroll para ver más)                      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  📊 ANÁLISIS DISPONIBLES (2)                       │
│  ┌─────────────────────────────────────────────┐  │
│  │ Análisis #1 - 03/11/2025 11:00 AM          │  │
│  │ Riesgo: 6.5/10 | 15 cláusulas analizadas   │  │
│  │ [Ver Análisis]                              │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Elementos:**
- Card de información del documento
- Botones de acción principales
- Visor de texto extraído (scrollable)
- Lista de análisis realizados sobre este documento
- Logs de procesamiento (colapsable)

---

### 6. Crear Análisis
**Ruta**: `/analysis/new`

```
┌─────────────────────────────────────────────────────┐
│  📝 NUEVO ANÁLISIS DE CONTRATO                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1️⃣ SELECCIONAR DOCUMENTO                         │
│  ┌─────────────────────────────────────────────┐  │
│  │ Documento seleccionado:                     │  │
│  │ 📄 Contrato_Alquiler.pdf                    │  │
│  │ [Cambiar documento]                         │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  2️⃣ OPCIONES DE ANÁLISIS                          │
│  ┌─────────────────────────────────────────────┐  │
│  │ Tipo de contrato:                           │  │
│  │ [Alquiler ▼]                                │  │
│  │                                             │  │
│  │ ☑️ Incluir precedentes legales (RAG)       │  │
│  │ ☑️ Usar Together.ai para extracción        │  │
│  │ ☑️ Análisis profundo de cláusulas          │  │
│  │                                             │  │
│  │ ℹ️ Tu plan: Premium                        │  │
│  │ Análisis restantes este mes: 22/25         │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  3️⃣ INICIAR ANÁLISIS                              │
│                                                     │
│  ⚠️ Este proceso puede tardar 2-5 minutos         │
│                                                     │
│              [Cancelar] [Iniciar Análisis]         │
└─────────────────────────────────────────────────────┘
```

**Flujo:**
1. Selección de documento (si viene desde documento, pre-seleccionado)
2. Configuración de opciones de análisis
3. Validación de límites del plan
4. Confirmación e inicio

---

### 7. Análisis en Progreso
**Ruta**: `/analysis/:id/processing`

```
┌─────────────────────────────────────────────────────┐
│  ⏳ ANALIZANDO CONTRATO...                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│          ┌─────────────────────────┐              │
│          │         🔄              │              │
│          │   [Spinner animado]     │              │
│          └─────────────────────────┘              │
│                                                     │
│  📊 PROGRESO DEL ANÁLISIS                          │
│                                                     │
│  ✅ Extrayendo cláusulas...            Completado  │
│  ⏳ Generando embeddings...            En proceso  │
│  ⏸️ Analizando cláusulas...            Pendiente   │
│  ⏸️ Calculando métricas...             Pendiente   │
│  ⏸️ Generando resumen...               Pendiente   │
│                                                     │
│  Tiempo estimado: 3 minutos                        │
│  [██████████░░░░░░░░] 60%                          │
│                                                     │
│  ℹ️ Puedes salir de esta página. Te notificaremos │
│     cuando el análisis esté completo.              │
│                                                     │
│              [Ver Documentos]                       │
└─────────────────────────────────────────────────────┘
```

**Características:**
- Actualización en tiempo real vía WebSocket o Polling
- Progreso por etapas del pipeline
- Barra de progreso general
- Tiempo estimado
- Opción de salir sin perder el proceso

---

### 8. Lista de Análisis
**Ruta**: `/analysis`

```
┌─────────────────────────────────────────────────────┐
│  📊 MIS ANÁLISIS                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [📝 Nuevo Análisis]                               │
│                                                     │
│  Filtros: [Todos ▼] [Riesgo Alto ▼] [Mes ▼]       │
│  Buscar: [________🔍]                              │
│                                                     │
│  ANÁLISIS COMPLETADOS (8)                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Contrato_Alquiler.pdf                    │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │ Riesgo: ⚠️ 6.5/10 | Favorabilidad: Media   │  │
│  │ 15 cláusulas | 3 requieren atención        │  │
│  │ Analizado: Hace 2 horas                     │  │
│  │ [Ver Detalles] [Exportar PDF]              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Contrato_Servicios.pdf                   │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │ Riesgo: ✅ 3.2/10 | Favorabilidad: Alta    │  │
│  │ 12 cláusulas | 0 problemáticas             │  │
│  │ Analizado: Ayer                             │  │
│  │ [Ver Detalles] [Exportar PDF]              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ANÁLISIS EN PROCESO (1)                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Hipoteca_Casa.pdf                        │  │
│  │ ⏳ Procesando... [████████░░] 80%           │  │
│  │ Iniciado: Hace 5 minutos                    │  │
│  │ [Ver Estado]                                │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Características:**
- Separación entre completados y en proceso
- Filtros por riesgo, fecha, favorabilidad
- Búsqueda por nombre de documento
- Cards visuales con métricas clave
- Acciones rápidas por análisis

---

### 9. Detalle de Análisis ⭐ (VISTA PRINCIPAL)
**Ruta**: `/analysis/:id`

Esta es la vista más compleja e importante del sistema.

```
┌─────────────────────────────────────────────────────┐
│  ← Volver  |  📊 Análisis: Contrato_Alquiler.pdf   │
│                                          [⋮ Menú]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎯 RESUMEN EJECUTIVO                              │
│  ┌─────────────────────────────────────────────┐  │
│  │ ┌──────────┬──────────┬──────────┬────────┐ │  │
│  │ │ Riesgo   │ Favor.   │ Cláusulas│ Tiempo │ │  │
│  │ │ ⚠️ 6.5  │ 😐 Media │ 15       │ 3m 24s │ │  │
│  │ └──────────┴──────────┴──────────┴────────┘ │  │
│  │                                             │  │
│  │ Este contrato presenta un nivel de riesgo  │  │
│  │ moderado-alto. Se identificaron 3 cláusulas│  │
│  │ que requieren atención especial...         │  │
│  │                                             │  │
│  │ [Leer análisis completo ▼]                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  📈 ANÁLISIS GENERAL                               │
│  ┌─────────────────────────────────────────────┐  │
│  │ Problemas Estructurales (2):                │  │
│  │ • Falta claridad en términos de rescisión  │  │
│  │ • Responsabilidades no equitativas          │  │
│  │                                             │  │
│  │ Riesgos Globales (3):                       │  │
│  │ • Penalidades excesivas por incumplimiento │  │
│  │ • Falta de cláusula de fuerza mayor        │  │
│  │ [Ver más...]                                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  📑 CLÁUSULAS ANALIZADAS (15)                      │
│                                                     │
│  [⚠️ Riesgo Alto (3)] [⚡ Riesgo Medio (5)]        │
│  [✅ Favorable (7)] [Todas]                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Cláusula #1 - PAGO DE RENTA                │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │ Favorabilidad: ⚠️ 3.5/10 (Desfavorable)    │  │
│  │                                             │  │
│  │ 📄 Texto:                                   │  │
│  │ "El arrendatario deberá pagar la suma de   │  │
│  │ $1,500 mensuales más un 15% de penalidad..." │  │
│  │ [Ver completo ▼]                            │  │
│  │                                             │  │
│  │ 💡 Análisis:                                │  │
│  │ La cláusula establece una penalidad del 15%│  │
│  │ que es considerablemente alta según el Art.│  │
│  │ 595 del Código Civil...                    │  │
│  │ [Ver completo ▼]                            │  │
│  │                                             │  │
│  │ ⚠️ Factores de Riesgo (2):                 │  │
│  │ • Penalidad excesiva (15% vs 5% estándar) │  │
│  │ • No especifica días de gracia             │  │
│  │                                             │  │
│  │ 💡 Recomendaciones (2):                    │  │
│  │ • Negociar reducción de penalidad al 5%   │  │
│  │ • Solicitar período de gracia de 5 días   │  │
│  │                                             │  │
│  │ 📚 Artículos Legales Relacionados (3):     │  │
│  │ • Código Civil - Art. 595                  │  │
│  │ • Ley de Alquileres - Art. 23             │  │
│  │ [Ver más...]                                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Cláusula #2 - MANTENIMIENTO Y REPARACIONES │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │ Favorabilidad: ✅ 7.8/10 (Favorable)        │  │
│  │ [Expandir para ver detalles ▼]             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [Cargar más cláusulas...]                         │
│                                                     │
│  🔍 BÚSQUEDA EN CLÁUSULAS                          │
│  [Buscar términos específicos...🔍]                │
│                                                     │
│  [📥 Exportar PDF] [🔄 Re-analizar] [💾 Guardar]  │
└─────────────────────────────────────────────────────┘
```

**Secciones principales:**

1. **Resumen Ejecutivo**: Métricas clave en cards
2. **Análisis General**: Problemas estructurales y riesgos globales
3. **Filtros de Cláusulas**: Por nivel de riesgo
4. **Lista de Cláusulas Expandibles**: 
   - Texto de la cláusula
   - Análisis detallado
   - Factores de riesgo
   - Recomendaciones
   - Artículos legales relacionados
5. **Búsqueda**: En cláusulas específicas
6. **Acciones**: Exportar, re-analizar, guardar

---

### 10. Perfil de Usuario
**Ruta**: `/profile`

```
┌─────────────────────────────────────────────────────┐
│  👤 MI PERFIL                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  INFORMACIÓN PERSONAL                               │
│  ┌─────────────────────────────────────────────┐  │
│  │ [👤 Avatar]                                 │  │
│  │                                             │  │
│  │ Nombre: Juan Pérez                          │  │
│  │ Email: juan.perez@example.com               │  │
│  │ Organización: Bufete Legal ABC              │  │
│  │ [Editar información]                        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  💎 PLAN Y SUSCRIPCIÓN                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ Plan actual: Premium                        │  │
│  │                                             │  │
│  │ Análisis mensuales: 22/25 restantes        │  │
│  │ [██████████████████████░░░] 88%            │  │
│  │                                             │  │
│  │ Consultas diarias: 45/50 restantes         │  │
│  │ [████████████████████████░] 90%            │  │
│  │                                             │  │
│  │ Próxima renovación: 01/12/2025             │  │
│  │                                             │  │
│  │ [Actualizar Plan] [Ver Historial]          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  📊 ESTADÍSTICAS DE USO                            │
│  ┌─────────────────────────────────────────────┐  │
│  │ Total documentos subidos: 24                │  │
│  │ Total análisis realizados: 15               │  │
│  │ Confianza OCR promedio: 85%                 │  │
│  │ Riesgo promedio detectado: 5.2/10          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ⚙️ PREFERENCIAS                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ Idioma: [Español ▼]                         │  │
│  │ Zona horaria: [America/La_Paz ▼]           │  │
│  │ ☑️ Recibir notificaciones por email        │  │
│  │ ☑️ Procesar OCR automáticamente            │  │
│  │ [Guardar cambios]                           │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Secciones:**
- Información personal editable
- Estado del plan con barras de progreso de límites
- Estadísticas de uso global
- Preferencias de usuario

---

## Componentes Reutilizables

### 1. DocumentCard

```tsx
<DocumentCard
  name="Contrato_Alquiler.pdf"
  status="processed"
  uploadDate="03/11/2025"
  size="2.5 MB"
  pageCount={12}
  ocrConfidence={0.87}
  onView={handleView}
  onAnalyze={handleAnalyze}
  onDownload={handleDownload}
  onDelete={handleDelete}
/>
```

**Props:**
- `name`: string
- `status`: 'uploaded' | 'processing' | 'processed' | 'failed'
- `uploadDate`: Date
- `size`: string
- `pageCount`: number
- `ocrConfidence`: number (0-1)
- Event handlers

---

### 2. AnalysisCard

```tsx
<AnalysisCard
  documentName="Contrato_Alquiler.pdf"
  riskScore={6.5}
  favorability="media"
  clauseCount={15}
  flaggedCount={3}
  date="Hace 2 horas"
  onView={handleView}
  onExport={handleExport}
/>
```

**Props:**
- `documentName`: string
- `riskScore`: number (0-10)
- `favorability`: 'baja' | 'media' | 'alta'
- `clauseCount`: number
- `flaggedCount`: number
- `date`: string
- Event handlers

---

### 3. StatusBadge

```tsx
<StatusBadge status="processed" size="small" />
<StatusBadge status="processing" size="medium" />
<StatusBadge status="failed" size="large" />
```

**Variantes:**
- `uploaded`: 📤 Subido (azul)
- `processing`: ⏳ Procesando (amarillo animado)
- `processed`: ✅ Procesado (verde)
- `failed`: ❌ Fallido (rojo)

---

### 4. RiskIndicator

```tsx
<RiskIndicator 
  score={6.5} 
  size="large"
  showLabel={true}
  variant="badge" // o "meter"
/>
```

**Rangos de color:**
- 0-3: 🟢 Verde (Bajo)
- 4-6: 🟡 Amarillo (Medio)
- 7-8: 🟠 Naranja (Alto)
- 9-10: 🔴 Rojo (Crítico)

---

### 5. UsageLimitBar

```tsx
<UsageLimitBar
  used={22}
  total={25}
  label="Análisis mensuales"
  warningThreshold={0.8}
  variant="linear" // o "circular"
/>
```

**Características:**
- Barra de progreso visual
- Cambio de color al acercarse al límite
- Tooltip con detalles
- Variante circular para dashboard

---

### 6. ClauseCard

```tsx
<ClauseCard
  number={1}
  type="PAGO DE RENTA"
  text="El arrendatario deberá..."
  favorability={3.5}
  favorabilityLevel="desfavorable"
  riskFactors={[...]}
  recommendations={[...]}
  legalArticles={[...]}
  expandable={true}
  defaultExpanded={false}
/>
```

**Características:**
- Expandible/colapsable
- Código de color por favorabilidad
- Secciones organizadas
- Enlaces a artículos legales

---

### 7. ProgressStepper

```tsx
<ProgressStepper
  steps={[
    { label: 'Extrayendo cláusulas', status: 'completed' },
    { label: 'Generando embeddings', status: 'processing' },
    { label: 'Analizando cláusulas', status: 'pending' },
    { label: 'Generando resumen', status: 'pending' }
  ]}
  currentStep={1}
/>
```

Para mostrar el progreso del análisis en tiempo real.

---

### 8. FileUploadZone

```tsx
<FileUploadZone
  accept=".pdf"
  maxSize={10485760} // 10MB
  onFileSelect={handleFileSelect}
  onError={handleError}
  disabled={uploading}
  showPreview={true}
/>
```

**Características:**
- Drag & drop
- Click to select
- Validación de tipo y tamaño
- Preview del archivo
- Barra de progreso de upload

---

### 9. EmptyState

```tsx
<EmptyState
  icon={<FileIcon />}
  title="No hay documentos"
  message="Sube tu primer documento para comenzar"
  action={
    <Button onClick={handleUpload}>
      Subir Documento
    </Button>
  }
/>
```

Para estados vacíos en listas.

---

### 10. LoadingSkeleton

```tsx
<LoadingSkeleton 
  variant="document-list" 
  count={5} 
/>
<LoadingSkeleton 
  variant="analysis-detail" 
/>
```

Skeleton screens para mejor UX durante carga.

---

## Flujo de Navegación

```
Login / Register
    ↓
Dashboard (/dashboard)
    ↓
    ├─→ Documentos (/documents)
    │     ↓
    │     ├─→ Subir Documento (modal o /documents/upload)
    │     │     ↓
    │     │     └─→ [Procesamiento OCR automático]
    │     │           ↓
    │     │           └─→ Detalle Documento (/documents/:id)
    │     │                 ↓
    │     │                 └─→ Crear Análisis (/analysis/new?document=:id)
    │     │                       ↓
    │     │                       └─→ En Progreso (/analysis/:id/processing)
    │     │                             ↓
    │     │                             └─→ Detalle Análisis (/analysis/:id)
    │     │
    │     └─→ Detalle Documento (/documents/:id)
    │           ↓
    │           ├─→ Ver Análisis Existente (/analysis/:id)
    │           ├─→ Descargar Documento
    │           └─→ Reprocesar OCR
    │
    ├─→ Análisis (/analysis)
    │     ↓
    │     ├─→ Nuevo Análisis (/analysis/new)
    │     │     ↓
    │     │     └─→ Seleccionar Documento
    │     │           ↓
    │     │           └─→ Configurar Opciones
    │     │                 ↓
    │     │                 └─→ En Progreso (/analysis/:id/processing)
    │     │                       ↓
    │     │                       └─→ Detalle Análisis (/analysis/:id)
    │     │
    │     └─→ Detalle Análisis (/analysis/:id)
    │           ↓
    │           ├─→ Exportar PDF
    │           ├─→ Re-analizar
    │           ├─→ Ver Documento Original (/documents/:id)
    │           └─→ Buscar en Cláusulas
    │
    └─→ Perfil (/profile)
          ↓
          ├─→ Editar Información
          ├─→ Cambiar Plan
          ├─→ Ver Estadísticas
          └─→ Configurar Preferencias
```

---

## Características UX Avanzadas

### 1. Estados de Carga
- **Skeleton Screens**: Para listas de documentos y análisis
- **Shimmer Effect**: Durante carga de datos
- **Progress Indicators**: Para uploads y procesamiento
- **Optimistic Updates**: Actualización inmediata de UI

### 2. Notificaciones
- **Toast Notifications**: Para acciones exitosas/errores
  - Éxito: Verde con ✅
  - Error: Rojo con ❌
  - Info: Azul con ℹ️
  - Warning: Amarillo con ⚠️
- **Real-time Updates**: Para estado de procesamiento vía WebSocket
- **Email Notifications**: Cuando análisis completa (configurable)
- **Badge Notifications**: En navbar para análisis completados

### 3. Drag & Drop
- Arrastrar archivos en cualquier lugar de `/documents`
- Preview antes de confirmar subida
- Indicador visual de zona de drop
- Manejo de múltiples archivos

### 4. Search & Filters
- Búsqueda en tiempo real con debounce (300ms)
- Filtros combinables (estado + tipo + fecha + riesgo)
- Guardado de filtros favoritos en localStorage
- URL state para compartir filtros aplicados
- Búsqueda avanzada en cláusulas (texto completo)

### 5. Exportación
- **PDF**: Análisis completo formateado profesionalmente
- **CSV**: Resumen de cláusulas con métricas
- **JSON**: Datos raw para integración
- **Compartir Link**: (Si plan lo permite) con token temporal

### 6. Responsive Design
- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Adaptaciones móvil**:
  - Navbar colapsable con hamburger menu
  - Cards apiladas verticalmente
  - Tablas convertidas a cards
  - Touch-friendly tap targets (min 44x44px)
  - Swipe gestures para acciones

### 7. Accesibilidad (a11y)
- **ARIA labels** completos en todos los componentes
- **Navegación por teclado** funcional
- **Tab order** lógico
- **Focus indicators** visibles
- **Contraste WCAG AA**: Mínimo 4.5:1 para texto
- **Screen reader support**: Anuncios para acciones asíncronas
- **Alt text**: Para todas las imágenes e iconos
- **Skip links**: Para navegación rápida

### 8. Offline Support (PWA - Fase 2)
- Service Worker para cache de assets
- Indicador de conexión
- Queue de acciones offline
- Sincronización cuando vuelve online

### 9. Temas (Dark Mode - Fase 2)
- Toggle en navbar
- Persistencia en localStorage
- Respeto a preferencia del sistema

### 10. Animaciones y Transiciones
- **Framer Motion** para transiciones suaves
- **Animaciones de entrada**: Fade in, slide in
- **Loading animations**: Spinners, skeletons
- **Micro-interactions**: Hover effects, button ripples
- **Page transitions**: Fade between routes

---

## Paleta de Colores

### Colores Principales
```css
/* Primary - Azul profesional */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;
--primary-600: #2563eb; /* Principal */
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Secondary - Verde éxito */
--secondary-50: #f0fdf4;
--secondary-100: #dcfce7;
--secondary-200: #bbf7d0;
--secondary-300: #86efac;
--secondary-400: #4ade80;
--secondary-500: #22c55e;
--secondary-600: #10b981; /* Principal */
--secondary-700: #15803d;
--secondary-800: #166534;
--secondary-900: #14532d;

/* Warning - Amarillo advertencia */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-200: #fde68a;
--warning-300: #fcd34d;
--warning-400: #fbbf24;
--warning-500: #f59e0b; /* Principal */
--warning-600: #d97706;
--warning-700: #b45309;
--warning-800: #92400e;
--warning-900: #78350f;

/* Danger - Rojo peligro */
--danger-50: #fef2f2;
--danger-100: #fee2e2;
--danger-200: #fecaca;
--danger-300: #fca5a5;
--danger-400: #f87171;
--danger-500: #ef4444; /* Principal */
--danger-600: #dc2626;
--danger-700: #b91c1c;
--danger-800: #991b1b;
--danger-900: #7f1d1d;

/* Neutrales */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Fondos */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

/* Bordes */
--border-light: #e5e7eb;
--border-medium: #d1d5db;
--border-dark: #9ca3af;
```

### Indicadores Visuales de Riesgo

```css
/* Riesgo Bajo: 0-3 */
--risk-low-bg: #dcfce7;
--risk-low-text: #166534;
--risk-low-border: #86efac;

/* Riesgo Medio: 4-6 */
--risk-medium-bg: #fef3c7;
--risk-medium-text: #92400e;
--risk-medium-border: #fcd34d;

/* Riesgo Alto: 7-8 */
--risk-high-bg: #fed7aa;
--risk-high-text: #9a3412;
--risk-high-border: #fb923c;

/* Riesgo Crítico: 9-10 */
--risk-critical-bg: #fee2e2;
--risk-critical-text: #991b1b;
--risk-critical-border: #fca5a5;
```

### Estados de Documento

```css
/* Uploaded */
--status-uploaded-bg: #dbeafe;
--status-uploaded-text: #1e40af;
--status-uploaded-icon: #3b82f6;

/* Processing */
--status-processing-bg: #fef3c7;
--status-processing-text: #92400e;
--status-processing-icon: #f59e0b;

/* Processed */
--status-processed-bg: #dcfce7;
--status-processed-text: #166534;
--status-processed-icon: #22c55e;

/* Failed */
--status-failed-bg: #fee2e2;
--status-failed-text: #991b1b;
--status-failed-icon: #ef4444;
```

---

## Estructura de Archivos Frontend

```
src/
├── App.tsx
├── main.tsx
├── index.css
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── documents/
│   │   ├── DocumentCard.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentTable.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentDetail.tsx
│   │   ├── DocumentFilters.tsx
│   │   └── DocumentActions.tsx
│   │
│   ├── analysis/
│   │   ├── AnalysisCard.tsx
│   │   ├── AnalysisList.tsx
│   │   ├── AnalysisDetail.tsx
│   │   ├── AnalysisProgress.tsx
│   │   ├── AnalysisConfig.tsx
│   │   ├── ClauseCard.tsx
│   │   ├── ClauseList.tsx
│   │   ├── ExecutiveSummary.tsx
│   │   ├── GeneralAnalysis.tsx
│   │   ├── RiskMetrics.tsx
│   │   └── LegalArticles.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── RiskIndicator.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── UsageLimitBar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ProgressStepper.tsx
│   │   ├── FileUploadZone.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── Pagination.tsx
│   │
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── UsageStats.tsx
│   │   ├── PreferencesForm.tsx
│   │   └── PlanComparison.tsx
│   │
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── ForgotPassword.tsx
│       └── ProtectedRoute.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Documents/
│   │   ├── DocumentsPage.tsx
│   │   ├── DocumentDetailPage.tsx
│   │   └── DocumentUploadPage.tsx
│   ├── Analysis/
│   │   ├── AnalysisListPage.tsx
│   │   ├── AnalysisDetailPage.tsx
│   │   ├── AnalysisNewPage.tsx
│   │   └── AnalysisProgressPage.tsx
│   ├── Profile/
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   └── Auth/
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
│
├── hooks/
│   ├── useDocuments.ts
│   ├── useDocument.ts
│   ├── useAnalysis.ts
│   ├── useAnalysisList.ts
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useWebSocket.ts
│   ├── usePolling.ts
│   ├── useUpload.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useNotification.ts
│
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── interceptors.ts
│   │   └── endpoints.ts
│   ├── documentService.ts
│   ├── analysisService.ts
│   ├── authService.ts
│   ├── userService.ts
│   ├── uploadService.ts
│   └── websocketService.ts
│
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── documentsSlice.ts
│   │   ├── analysisSlice.ts
│   │   ├── userSlice.ts
│   │   └── uiSlice.ts
│   └── hooks.ts
│
├── types/
│   ├── index.ts
│   ├── document.types.ts
│   ├── analysis.types.ts
│   ├── user.types.ts
│   ├── clause.types.ts
│   ├── api.types.ts
│   └── common.types.ts
│
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   ├── helpers.ts
│   ├── dateUtils.ts
│   ├── fileUtils.ts
│   └── riskUtils.ts
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   ├── mixins.scss
│   └── themes/
│       ├── light.css
│       └── dark.css
│
└── config/
    ├── routes.ts
    ├── api.config.ts
    └── app.config.ts
```

---

## Tipos TypeScript Principales

### Document Types
```typescript
interface Document {
  document_id: string;
  user: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_hash: string;
  document_status: DocumentStatus;
  contract_type?: ContractType;
  extracted_text: string;
  ocr_confidence?: number;
  page_count?: number;
  upload_date: string;
  processed_date?: string;
  metadata: Record<string, any>;
}

type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';
type ContractType = 'rent' | 'mortgage' | 'services' | 'employment' | 'transfers';
```

### Analysis Types
```typescript
interface ContractAnalysis {
  analysis_id: string;
  user: string;
  document: string;
  analysis_state: AnalysisState;
  contract_type?: ContractType;
  analysis_summary: string;
  general_analysis: string;
  overall_favorability?: FavorabilityLevel;
  risk_score?: number;
  total_clauses: number;
  flagged_clauses: number;
  processing_time_seconds?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  analysis_options: Record<string, any>;
  ai_model_info: Record<string, any>;
  clauses?: ContractClause[];
}

type AnalysisState = 'queued' | 'processing' | 'processed' | 'failed';
type FavorabilityLevel = 'very_unfavorable' | 'unfavorable' | 'neutral' | 'favorable' | 'very_favorable';

interface ContractClause {
  clause_id: string;
  contract_analysis: string;
  clause_text: string;
  clause_order: number;
  clause_type: string;
  page_number?: number;
  position_start?: number;
  position_end?: number;
  embedding?: number[];
  created_at: string;
  analysis?: ClauseAnalysis;
}

interface ClauseAnalysis {
  clause_analysis_id: string;
  contract_clause: string;
  user: string;
  outcome: string;
  favorability_rate: number;
  favorability_level: FavorabilityLevel;
  risk_factors: string[];
  recommendations: string[];
  legal_precedents: string[];
  confidence_score: number;
  related_articles: LegalArticleReference[];
  created_at: string;
}

interface LegalArticleReference {
  law_name: string;
  article_reference: string;
  similarity_score: number;
  excerpt?: string;
}
```

### User Types
```typescript
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  profile: UserProfile;
  statistics: UserStatistics;
}

interface UserProfile {
  user_profile_id: string;
  role: UserRole;
  subscription_plan: SubscriptionPlan;
  phone_number: string;
  organization: string;
  job_title: string;
  language_preference: string;
  user_timezone: string;
  receive_notifications: boolean;
}

type UserRole = 'user' | 'admin' | 'moderator';
type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

interface UserStatistics {
  total_analyses: number;
  total_consultations: number;
  total_documents_uploaded: number;
  avg_risk_score?: number;
  monthly_analyses_count: number;
  monthly_consultations_count: number;
  current_month: string;
}
```

---

## Rutas de la Aplicación

```typescript
const routes = [
  // Auth
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/forgot-password', component: ForgotPasswordPage },
  
  // Protected routes
  { 
    path: '/', 
    component: MainLayout,
    protected: true,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: '/dashboard', component: DashboardPage },
      
      // Documents
      { path: '/documents', component: DocumentsPage },
      { path: '/documents/upload', component: DocumentUploadPage },
      { path: '/documents/:id', component: DocumentDetailPage },
      
      // Analysis
      { path: '/analysis', component: AnalysisListPage },
      { path: '/analysis/new', component: AnalysisNewPage },
      { path: '/analysis/:id', component: AnalysisDetailPage },
      { path: '/analysis/:id/processing', component: AnalysisProgressPage },
      
      // Profile
      { path: '/profile', component: ProfilePage },
      { path: '/settings', component: SettingsPage },
      
      // 404
      { path: '*', component: NotFoundPage }
    ]
  }
];
```

---

## API Integration

### Axios Client Setup
```typescript
import axios from 'axios';
import { getToken, refreshToken } from './authService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Examples

```typescript
// documentService.ts
export const documentService = {
  getDocuments: (params?: DocumentFilters) => 
    apiClient.get<PaginatedResponse<Document>>('/documents/', { params }),
  
  getDocument: (id: string) => 
    apiClient.get<ApiResponse<Document>>(`/documents/${id}/`),
  
  uploadDocument: (file: File, options?: UploadOptions) => {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.contract_type) {
      formData.append('contract_type', options.contract_type);
    }
    
    return apiClient.post<ApiResponse<Document>>(
      '/documents/upload/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: options?.onProgress,
      }
    );
  },
  
  downloadDocument: (id: string) => 
    apiClient.get(`/documents/${id}/download/`, { responseType: 'blob' }),
  
  deleteDocument: (id: string) => 
    apiClient.delete(`/documents/${id}/`),
  
  forceOCR: (id: string) => 
    apiClient.post<ApiResponse<any>>(`/documents/${id}/force_ocr/`),
};

// analysisService.ts
export const analysisService = {
  getAnalyses: (params?: AnalysisFilters) => 
    apiClient.get<PaginatedResponse<ContractAnalysis>>('/api/contract-analysis/', { params }),
  
  getAnalysis: (id: string) => 
    apiClient.get<ApiResponse<ContractAnalysis>>(`/api/contract-analysis/${id}/`),
  
  createAnalysis: (data: CreateAnalysisData) => 
    apiClient.post<ApiResponse<ContractAnalysis>>('/api/contract-analysis/analyze/', data),
  
  reanalyze: (id: string) => 
    apiClient.post<ApiResponse<any>>(`/api/contract-analysis/${id}/reanalyze/`),
  
  exportPDF: (id: string) => 
    apiClient.get(`/api/contract-analysis/${id}/export/`, { responseType: 'blob' }),
};
```

---

## WebSocket para Updates en Tiempo Real

```typescript
// websocketService.ts
class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  
  connect(userId: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/analysis/${userId}/`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      // Intentar reconectar después de 5 segundos
      setTimeout(() => this.connect(userId), 5000);
    };
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }
  
  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }
  
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
  
  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
```

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Lazy loading de páginas
const AnalysisDetailPage = lazy(() => import('./pages/Analysis/AnalysisDetailPage'));
const DocumentsPage = lazy(() => import('./pages/Documents/DocumentsPage'));

// En rutas
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
</Suspense>
```

### 2. Memoización
```typescript
// useMemo para cálculos costosos
const riskDistribution = useMemo(() => {
  return calculateRiskDistribution(clauses);
}, [clauses]);

// useCallback para event handlers
const handleClauseExpand = useCallback((clauseId: string) => {
  setExpandedClauses(prev => ({
    ...prev,
    [clauseId]: !prev[clauseId]
  }));
}, []);
```

### 3. Virtualization para Listas Largas
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={clauses.length}
  itemSize={150}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ClauseCard clause={clauses[index]} />
    </div>
  )}
</FixedSizeList>
```

### 4. Debounce para Búsqueda
```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

---

## Testing Strategy

### Unit Tests
- Componentes individuales con Jest + React Testing Library
- Hooks personalizados
- Funciones de utilidad

### Integration Tests
- Flujos de usuario completos
- Interacción con API (mocked)

### E2E Tests
- Cypress para flujos críticos:
  - Login → Upload → Análisis → Resultados
  - Navegación completa

---

## Deployment Checklist

### Build Optimizations
- [x] Minificación de JS/CSS
- [x] Code splitting
- [x] Tree shaking
- [x] Image optimization
- [x] Lazy loading
- [x] Bundle analysis

### Security
- [x] HTTPS
- [x] Content Security Policy
- [x] XSS protection
- [x] CSRF tokens
- [x] Secure cookies
- [x] Input sanitization

### Monitoring
- [x] Error tracking (Sentry)
- [x] Analytics (Google Analytics / Plausible)
- [x] Performance monitoring
- [x] User behavior tracking

---

## Roadmap

### Fase 1 - MVP (4-6 semanas)
- ✅ Layout principal y navegación
- ✅ Autenticación
- ✅ Dashboard básico
- ✅ Upload de documentos
- ✅ Vista de lista de documentos
- ✅ Crear y ver análisis
- ✅ Detalle de análisis con cláusulas

### Fase 2 - Features Avanzadas (3-4 semanas)
- [ ] Búsqueda avanzada y filtros
- [ ] Exportación PDF
- [ ] WebSocket para updates en tiempo real
- [ ] Dark mode
- [ ] Notificaciones push
- [ ] Comparación de análisis

### Fase 3 - Optimizaciones (2-3 semanas)
- [ ] Performance optimizations
- [ ] PWA support
- [ ] Offline mode
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Admin panel

---

## Conclusión

Esta planificación de UI para LegalPartner cubre:

1. **Flujo completo**: Desde upload hasta resultados de análisis
2. **Componentes reutilizables**: Para consistencia y mantenibilidad
3. **UX moderna**: Con estados de carga, animaciones y feedback visual
4. **Responsive**: Mobile-first con adaptaciones para todas las pantallas
5. **Accesible**: WCAG AA compliant
6. **Escalable**: Arquitectura modular y bien estructurada
7. **Performante**: Con optimizaciones y mejores prácticas

La UI propuesta refleja la complejidad del backend mientras mantiene una experiencia de usuario simple, intuitiva y profesional, ideal para abogados y profesionales legales.

